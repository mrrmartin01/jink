import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditBookmarkDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Hello world' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Introduction to the astroverse of the dev world' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://astroverse.dev' })
  link?: string;
}
