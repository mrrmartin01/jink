import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async addBookmark(postId: string, userId: string) {
    return this.prisma.bookmark.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async removeBookmark(postId: string, userId: string) {
    const bookmark = await this.prisma.bookmark.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (!bookmark) throw new NotFoundException('Bookmark not found');
    return bookmark;
  }

  async getUserBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          include: {
            user: true,
            _count: {
              select: {
                likes: true,
                reposts: true,
                quotes: true,
              },
            },
          },
        },
      },
    });
  }
}
