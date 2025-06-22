import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarksById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  async editBookmarksById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    //get bookmark by Id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    //check for ownership of bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access denied');

    //modify bookmark
    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarksById(userId: number, bookmarkId: number) {
    //get bookmark id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    //check for ownership of bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to this action is forbiden');

    //delete bookmark
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
