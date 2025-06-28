import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@mail.com or johndoe' })
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}
