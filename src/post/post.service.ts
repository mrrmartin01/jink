import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { EditPostDto } from './dto';

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

  getPostById(userId: number, postId: number) {
    return this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
    });
  }

  async editPostById(postId: number, userId: number, dto: EditPostDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || post.userId !== userId)
      throw new ForbiddenException('Access denied');
    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletePostById(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || post.userId !== userId)
      throw new ForbiddenException('Access denied');

    return this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}
