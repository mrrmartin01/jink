/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestPasswordResetDto, SigninDto, SignupDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as Crypto from 'crypto';
import { hashPassword, verifyPassword } from './utils/password.util';
import { TokenService } from './tokens/token.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
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
        },
      });
      const tokens = await this.tokenService.generateTokens(
        user.id,
        user.email,
      );
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

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      return { message: 'If that email exists, a reset link has been sent.' };
    }
    // Generate a secure random token
    const token = Crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes from now
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetTokenExpiry: expiry },
    });

    // TODO: Send email with token (placeholder)
    // e.g., sendEmail(user.email, `Reset link: <frontend_url>?token=${token}`)
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.tokenService.refreshTokens(payload.sub, refreshToken);
  }
}
