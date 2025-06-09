import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    //generate password
    const hash = await argon.hash(dto.password);

    try {
      //save user info in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      //return user details
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User with this email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    //find user email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //no email? throw error
    if (!user) throw new ForbiddenException('Credentials incorrect');

    //compare password
    if (!user.hash) throw new ForbiddenException('Credentials incorrect');
    const pwMatches = await argon.verify(user.hash, dto.password);

    //wrong password? throw err
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    //return user object
    return user;
    return { msg: 'I have signed in' };
  }
}
