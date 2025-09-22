/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/auth/strategy/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JwtStrategy ==> JWT_SECRET is not defined');

    // Extractor to read token from cookie `access_token`
    const cookieExtractor = (req: any) => {
      let token: string | null = null;
      if (req && req.cookies) token = req.cookies['access_token'];
      // fallback to header if needed:
      if (!token) {
        token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      }
      return token;
    };

    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        userName: true,
        profileImageUrl: true,
        displayName: true,
        bio: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        pinnedPostId: true,
      },
    });

    return user ?? null;
  }
}
