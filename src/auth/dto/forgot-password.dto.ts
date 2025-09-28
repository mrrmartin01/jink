import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@mail.com' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ersatdyfgujh', required: true })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'newPassword123', required: true })
  newPassword: string;
}
