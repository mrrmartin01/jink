import { IsEmail, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsEmail()
  email: string;
  @IsString()
  code: string;
}
