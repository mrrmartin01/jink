import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@mail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'strongPassword123' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe' })
  userName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'JohnD_1' })
  displayName: string;

  @IsString()
  @ApiProperty({ example: 'John', required: false })
  firstName?: string;

  @IsString()
  @ApiProperty({ example: 'Doe', required: false })
  lastName?: string;
}
