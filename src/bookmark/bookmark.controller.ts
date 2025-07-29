import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post(':id')
  addBookmark(@Param('id') postId: string, @GetUser('id') userId: string) {
    return this.bookmarkService.addBookmark(postId, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  removeBookmark(@Param('id') postId: string, @GetUser('id') userId: string) {
    return this.bookmarkService.removeBookmark(postId, userId);
  }

  @Get()
  getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarkService.getUserBookmarks(userId);
  }
}
