import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @ApiProperty({ example: 'post-id-123' })
  postId: string;

  @IsString()
  @MaxLength(280)
  @ApiProperty({ example: 'This is a quote content' })
  content: string;
}
