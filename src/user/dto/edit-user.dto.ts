import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'user32@mail.com' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Astro' })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Verse' })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'strongPassword@@99' })
  password?: string;
}
