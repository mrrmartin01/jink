import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ReVerifyUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@mail.com' })
  email: string;
}
