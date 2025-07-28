import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LikePostDto {
  @IsString()
  @ApiProperty({ example: 'post-id-123' })
  postId: string;
}
