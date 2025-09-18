import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SigninDto,
  SignupDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  VerifyUserDto,
} from './dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  async verify(@Body() dto: VerifyUserDto) {
    return await this.authService.verifyAccount(dto);
  }

  @Throttle({ auth: {} })
  @Post('re-verify')
  @HttpCode(HttpStatus.OK)
  async re_verify(@Body() body: VerifyUserDto) {
    return await this.authService.re_verifyAccount(body);
  }

  @Throttle({ auth: {} })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signout(@Body() body: RefreshTokenDto) {
    return this.authService.signout(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshTokenDto) {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refreshTokens(refreshToken);
  }
}
