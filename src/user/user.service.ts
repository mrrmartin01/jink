import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: EditUserDto) {
    const { password, ...rest } = dto;

    const data: any = { ...rest };

    // If password is being updated, hash it first
    if (password) {
      //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      data.hash = await argon.hash(password);
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
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
}
