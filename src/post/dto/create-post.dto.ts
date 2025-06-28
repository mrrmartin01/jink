import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'This is my first post!' })
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://link-to-context.dev', required: false })
  link?: string;

  @IsOptional()
  @ApiProperty({ example: 12, required: false })
  replyToId?: number;
}
