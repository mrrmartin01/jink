import { IsString } from 'class-validator';

export class CreateRepostDto {
  @IsString()
  postId: string;
}
