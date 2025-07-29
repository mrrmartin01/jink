import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { RepostModule } from './repost/repost.module';
import { QuoteModule } from './quote/quote.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
    FollowModule,
    LikeModule,
    RepostModule,
    QuoteModule,
  ],
})
export class AppModule {}
