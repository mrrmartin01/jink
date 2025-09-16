import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto, ResetPasswordDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (user?.email) throw new ForbiddenException('Email is taken');
    if (user?.userName) {
      const newName =
        user.userName + '-' + Math.random().toString(36).slice(2, 5);
      throw new ForbiddenException({
        message: 'Username is taken',
        suggestion: newName,
      });
    }
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: dto,
      });
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('Email or username already taken');
      }
      throw error;
    }
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
