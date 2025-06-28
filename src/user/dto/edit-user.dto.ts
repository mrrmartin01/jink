import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'strongPassword@@99', required: false })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'test_userxx', required: false })
  userName?: string;

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
