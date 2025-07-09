import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { EditPostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, dto: CreatePostDto): Promise<Post> {
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

  async getPosts(userId: string): Promise<Post[]> {
    const posts: Post[] = await this.prisma.post.findMany({
      where: {
        userId,
      },
    });
    return posts;
  }

  getPostById(postId: string): Promise<Post | null> {
    return this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });
  }

  async editPostById(postId: string, userId: string, dto: EditPostDto) {
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

  async deletePostById(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId)
      throw new ForbiddenException('Access denied');

    return this.prisma.post.update({
      where: { id: postId },
      data: { isDeleted: true },
    });
  }

  async getReplies(postId: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        replyToId: postId,
      },
    });
  }
}
