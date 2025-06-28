import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PostService } from './post.service';
import { GetUser } from '../auth/decorator';
import { CreatePostDto } from './dto';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  @Get()
  getPosts(@GetUser('id') userId: number) {
    return this.postService.getPosts(userId);
  }
}
