/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SigninDto,
  SignupDto,
  ForgotPasswordDto,
  VerifyUserDto,
  ReVerifyUserDto,
} from './dto';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
} from './cookie.constants';
import { Response, Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Throttle({ auth: {} })
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Throttle({ auth: {} })
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body() dto: VerifyUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyAccount(dto);
    const secure = this.configService.get<string>('NODE_ENV') === 'production';

    const { access_token, refresh_token, user } = result as any;

    res.cookie(
      ACCESS_TOKEN_COOKIE,
      access_token,
      ACCESS_COOKIE_OPTIONS(secure),
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refresh_token,
      REFRESH_COOKIE_OPTIONS(secure),
    );
    return { user };
  }

  @Throttle({ auth: {} })
  @Post('re-verify')
  @HttpCode(HttpStatus.OK)
  async re_verify(@Body() body: ReVerifyUserDto) {
    return await this.authService.re_verifyAccount(body);
  }

  @Throttle({ auth: {} })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signin(dto);
    const secure = this.configService.get<string>('NODE_ENV') === 'production';
    const { access_token, refresh_token, user } = result as any;

    res.cookie(
      ACCESS_TOKEN_COOKIE,
      access_token,
      ACCESS_COOKIE_OPTIONS(secure),
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refresh_token,
      REFRESH_COOKIE_OPTIONS(secure),
    );

    return { user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (refreshToken) {
      await this.authService.signout(refreshToken);
    }
    res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
    return { message: 'Signout successful' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const result = await this.authService.refreshTokens(refreshToken);
    const secure = this.configService.get<string>('NODE_ENV') === 'production';
    const { access_token, refresh_token, user } = result as any;

    // rotate cookies
    res.cookie(
      ACCESS_TOKEN_COOKIE,
      access_token,
      ACCESS_COOKIE_OPTIONS(secure),
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refresh_token,
      REFRESH_COOKIE_OPTIONS(secure),
    );

    return { user };
  }
}
