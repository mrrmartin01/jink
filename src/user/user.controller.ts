import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto, ResetPasswordDto } from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @Patch()
  async editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return await this.userService.editUser(userId, dto);
  }

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadProfilePicture(userId, file);
  }

  @Delete('profile-picture')
  async deleteProfilePicture(@GetUser('id') userId: string) {
    return await this.userService.deleteProfilePicture(userId);
  }

  @Post('cover-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverPicture(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.userService.uploadCoverPicture(userId, file);
  }

  @Delete('cover-picture')
  async deleteCoverPicture(@GetUser('id') userId: string) {
    return await this.userService.deleteCoverPicture(userId);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @GetUser('id') userId: string,
    @Body() dto: ResetPasswordDto,
  ) {
    return await this.userService.changePassword(userId, dto);
  }
}
