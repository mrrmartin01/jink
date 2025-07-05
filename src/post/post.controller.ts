import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  @Get()
  getPosts(@GetUser('id') userId: number) {
    return this.postService.getPosts(userId);
  }

  @Get(':id')
  getPostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.getPostById(userId, postId);
  }

  @Patch(':id')
  editPostById(
    @GetUser('id') userId: number,
    @Body() dto: EditPostDto,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.editPostById(userId, postId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePostById(userId, postId);
  }
}
