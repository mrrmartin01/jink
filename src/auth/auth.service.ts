/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestPasswordResetDto, SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as Crypto from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async refreshTokensWithToken(refreshToken: string) {
    try {
      const payload = this.jwt.decode(refreshToken) as {
        sub?: string;
        email?: string;
      } | null;
      const userId = payload?.sub;
      if (!userId) {
        return { message: 'Invalid refresh token payload' };
      }
      return this.refreshTokens(userId, refreshToken);
    } catch {
      return { message: 'Invalid refresh token' };
    }
  }

  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);
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
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
      return tokens;
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
    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) throw new Error('Auth.service ==> JWT_SECRET is not defined');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
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

  async getTokens(
    userId: string,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { sub: userId, email };
    const accessSecret = this.config.get<string>('JWT_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
    if (!accessSecret || !refreshSecret)
      throw new Error('JWT secrets are not defined');
    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, { expiresIn: '15m', secret: accessSecret }),
      this.jwt.signAsync(payload, { expiresIn: '7d', secret: refreshSecret }),
    ]);
    return { access_token, refresh_token };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const refreshTokenHash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon.verify(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      user.refreshTokenHash,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
