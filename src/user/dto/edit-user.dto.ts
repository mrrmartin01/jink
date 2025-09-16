import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'test_userxx', required: false })
  userName?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'newEmail@mail.com', required: false })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'test_userxx', required: false })
  displayName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'test_userxx', required: false })
  bio?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Astro', required: false })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Verse', required: false })
  lastName?: string;
}
