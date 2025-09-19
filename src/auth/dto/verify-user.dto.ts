import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@mail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123' })
  code: string;
}
