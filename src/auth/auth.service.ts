/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ForgotPasswordDto,
  RefreshTokenDto,
  SigninDto,
  SignupDto,
  VerifyUserDto,
} from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as Crypto from 'crypto';
import { hashPassword, verifyPassword } from './utils/password.util';
import { TokenService } from './tokens/token.service';
import { MailService } from './mailer/mailer.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private mailerService: MailService,
  ) {}

  async signup(dto: SignupDto) {
    const hash = await hashPassword(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email?.trim().toLowerCase(),
          userName: dto.userName?.trim().toLowerCase(),
          firstName: dto.firstName?.trim().replace(/\s+/g, ''),
          lastName: dto.lastName?.trim().replace(/\s+/g, ''),
          hash,
          isActive: false,
        },
      });
      await this.mailerService.sendActivationEmail(user.email);

      return {
        message:
          'Signup successful. Please check your email to activate your account.',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'User with this email or username already exists',
          );
        }
      }
      throw error;
    }
  }

  async verifyAccount(dto: VerifyUserDto) {
    const record = await this.prisma.verifications.findFirst({
      where: {
        email: dto.email,
        code: dto.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new ForbiddenException('Invalid or expired verification code.');
    }

    const user = await this.prisma.user.update({
      where: { email: dto.email },
      data: { isActive: true },
    });

    await this.prisma.verifications.update({
      where: { id: record.id },
      data: { used: true },
    });

    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    await this.mailerService.welcomeUser(user.email, user.userName);
    return {
      ...tokens,
      user: {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImageUrl,
      },
    };
  }

  async re_verifyAccount(dto: VerifyUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('No account found with this email.');
    }

    if (user.isActive) {
      throw new BadRequestException('Account is already verified.');
    }

    await this.prisma.verifications.deleteMany({
      where: { email: dto.email },
    });

    return await this.mailerService.sendActivationEmail(dto.email);
  }

  async signin(dto: SigninDto) {
    const identifier = dto.identifier;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { userName: identifier }],
      },
    });
    if (!user || !user.hash) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const pwMatches = await verifyPassword(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    await this.tokenService.updateRefreshTokenHash(
      user.id,
      tokens.refresh_token,
    );
    return {
      ...tokens,
      user: {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async signout(refreshToken: RefreshTokenDto) {
    await this.tokenService.removeRefreshToken(refreshToken.refreshToken);
    return { message: 'Signout successful' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new ForbiddenException('Sorry, we could not find your email.');
    }
    const token = Crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetTokenExpiry: expiry },
    });

    await this.mailerService.sendPasswordReset(user.email, token);
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.tokenService.refreshTokens(payload.sub, refreshToken);
  }
}
