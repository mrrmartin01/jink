import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { PostService } from './post.service';
import { GetUser } from '../auth/decorator';
import { CreatePostDto, EditPostDto } from './dto';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@GetUser('id') userId: string, @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  @Get()
  getPosts(@GetUser('id') userId: string) {
    return this.postService.getPosts(userId);
  }

  @Get(':id')
  getPostById(@GetUser('id') userId: string, @Param('id') postId: string) {
    return this.postService.getPostById(postId);
  }

  @Patch(':id')
  editPostById(
    @GetUser('id') userId: string,
    @Body() dto: EditPostDto,
    @Param('id') postId: string,
  ) {
    return this.postService.editPostById(postId, userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePostById(@GetUser('id') userId: string, @Param('id') postId: string) {
    return this.postService.deletePostById(postId, userId);
  }

  @Get(':id/replies')
  getReplies(@Param('id') postId: string) {
    return this.postService.getReplies(postId);
  }
}
