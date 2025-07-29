import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RepostService } from './repost.service';
import { CreateRepostDto } from './dto/create-repost.dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('reposts')
export class RepostController {
  constructor(private repostService: RepostService) {}

  @Post()
  repost(@GetUser('id') userId: string, @Body() dto: CreateRepostDto) {
    return this.repostService.repostPost(userId, dto.postId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  unrepost(@GetUser('id') userId: string, @Body() dto: CreateRepostDto) {
    return this.repostService.unrepost(userId, dto.postId);
  }

  @Get(':postId')
  hasReposted(@Param('postId') postId: string, @GetUser('id') userId: string) {
    return this.repostService.hasReposted(userId, postId);
  }

  @Get()
  getReposts(@Query('postId') postId: string) {
    return this.repostService.getRepostsForPost(postId);
  }
}
