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
import { BookmarkModule } from './bookmark/bookmark.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 60,
        limit: 5,
      },
    ]),
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
    FollowModule,
    LikeModule,
    RepostModule,
    QuoteModule,
    BookmarkModule,
    CloudinaryModule,
  ],
  providers: [],
})
export class AppModule {}
