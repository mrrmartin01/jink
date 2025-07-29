import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RepostService {
  constructor(private prisma: PrismaService) {}

  async repostPost(userId: string, postId: string) {
    const existing = await this.prisma.repost.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existing) {
      throw new ConflictException('Already reposted');
    }

    const postExists = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!postExists) throw new NotFoundException('Post not found');

    return this.prisma.repost.create({
      data: {
        userId,
        postId,
      },
    });
  }

  async unrepost(userId: string, postId: string) {
    const repost = await this.prisma.repost.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    if (!repost) throw new NotFoundException('Repost not found');
    await this.prisma.repost.delete({
      where: { userId_postId: { userId, postId } },
    });
    return null;
  }

  async hasReposted(userId: string, postId: string) {
    const repost = await this.prisma.repost.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return { hasReposted: !!repost };
  }

  async getRepostsForPost(postId: string) {
    return this.prisma.repost.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            displayName: true,
          },
        },
      },
    });
  }
}
