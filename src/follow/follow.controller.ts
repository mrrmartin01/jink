import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiTags('follows')
@ApiBearerAuth()
@Controller('follows')
export class FollowController {
  constructor(private followService: FollowService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post(':userId')
  followUser(
    @GetUser('id') followerId: string,
    @Param('userId') followingId: string,
  ) {
    return this.followService.followUser(followerId, followingId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':userId')
  unfollowUser(
    @GetUser('id') followerId: string,
    @Param('userId') followingId: string,
  ) {
    return this.followService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }
}
