import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async likePost(userId: string, postId: string) {
    if (!userId || !postId) {
      throw new BadRequestException('User ID and Post ID are required');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ForbiddenException(`User with ID ${userId} not found`);

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);

    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (existingLike) throw new BadRequestException('Post already liked');

    const like = await this.prisma.like.create({ data: { userId, postId } });
    return { success: true, data: like };
  }

  async unlikePost(userId: string, postId: string) {
    if (!userId || !postId) {
      throw new BadRequestException('User ID and Post ID are required');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (!existingLike) throw new NotFoundException('Like not found');

    if (existingLike.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.like.delete({
      where: { userId_postId: { userId, postId } },
    });
    return null; // For 204 No Content
  }

  async hasLikedPost(userId: string, postId: string) {
    const like = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return { hasLiked: !!like };
  }

  async getLikesForPost(postId: string) {
    return this.prisma.like.findMany({
      where: { postId },
      include: { user: true },
    });
  }
}
