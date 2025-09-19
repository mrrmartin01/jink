/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto, ResetPasswordDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async editUser(userId: string, dto: EditUserDto) {
    console.log(dto);
    if (!userId) throw new ForbiddenException('No user id');
    if (!dto) throw new BadRequestException('No data was provided');
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    if (dto.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (existingEmail) throw new BadRequestException('Email is taken');
    }
    if (dto.userName) {
      const existingUsername = await this.prisma.user.findFirst({
        where: {
          userName: dto.userName,
        },
      });
      if (existingUsername) {
        const newName =
          user.userName + '_' + Math.random().toString(36).slice(2, 5);
        throw new ForbiddenException({
          message: 'Username is taken',
          suggestion: newName,
        });
      }
    }

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Email or username already taken');
      }
      throw error;
    }
    return { message: 'Profile editted succesfully' };
  }

  async deleteProfilePicture(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.profileImageUrl)
      throw new NotFoundException("You don't have a profile picture");

    if (user.profileImageId) {
      await this.cloudinaryService.deleteImage(user.profileImageId);
    }

    return { masssage: 'Profile picture deleted' };
  }

  async uploadProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // delete old image if it exists
    if (user.profileImageId) {
      await this.cloudinaryService.deleteImage(user.profileImageId);
    }

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      'profile_pictures',
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        profileImageUrl: uploadResult.secure_url,
        profileImageId: uploadResult.public_id,
      },
    });

    return {
      message: 'Profile picture updated successfully',
      profileImage: uploadResult.secure_url,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetTokenExpiry: { gt: new Date() },
      },
    });
    if (!user) return { message: 'Invalid or expired reset token.' };
    const hash = await argon.hash(dto.newPassword);
    const verifyPassword = await argon.verify(hash, dto.newPassword);
    if (verifyPassword) {
      throw new ForbiddenException(
        'New password must be different from the old password.',
      );
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        hash,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });
    return { message: 'Password has been reset successfully.' };
  }
}
