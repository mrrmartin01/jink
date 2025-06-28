import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditPostDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Updated post content', required: false })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://new-link.dev', required: false })
  link?: string;
}
