import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: number, dto: CreatePostDto): Promise<Post> {
    const post: Post = await this.prisma.post.create({
      data: {
        content: dto.content,
        link: dto.link,
        replyToId: dto.replyToId,
        userId,
      },
    });
    return post;
  }

  async getPosts(userId: number): Promise<Post[]> {
    const posts: Post[] = await this.prisma.post.findMany({
      where: {
        userId,
      },
    });
    return posts;
  }
}
