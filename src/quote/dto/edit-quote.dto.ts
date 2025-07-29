import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class EditQuoteDto {
  @IsString()
  @MaxLength(280)
  @ApiProperty({ example: 'This is a quote content' })
  content: string;
}
