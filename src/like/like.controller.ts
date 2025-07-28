import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { LikeService } from './like.service';
import { LikePostDto } from './dto/like.dto';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post()
  likePost(@GetUser('id') userId: string, @Body() likePostDto: LikePostDto) {
    return this.likeService.likePost(userId, likePostDto.postId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  unlikePost(@GetUser('id') userId: string, @Body() likePostDto: LikePostDto) {
    return this.likeService.unlikePost(userId, likePostDto.postId);
  }

  @Get(':postId')
  hasLikedPost(@Param('postId') postId: string, @GetUser('id') userId: string) {
    return this.likeService.hasLikedPost(userId, postId);
  }

  @Get()
  getLikes(@Query('postId') postId: string) {
    return this.likeService.getLikesForPost(postId);
  }
}
