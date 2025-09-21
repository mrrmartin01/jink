import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from 'src/user/dto';
import { CreatePostDto, EditPostDto } from 'src/post/dto';
import { CreateQuoteDto } from 'src/quote/dto/create-quote.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    console.log('Compiling module....');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    console.log('Creating app...');
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3333);

    console.log('Getting Prisma service...');
    prisma = app.get(PrismaService);

    console.log('Cleaning DB...');
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const signupDto = [
      {
        email: 'testing@mail.com',
        userName: 'testing_user',
        firstName: 'Test',
        lastName: 'User',
        password: 'test123',
      },
      {
        email: 'user2@mail.com',
        userName: 'user_2',
        firstName: 'User',
        lastName: 'Two',
        password: 'test123',
      },
    ];

    const SigninDto = [
      {
        identifier: signupDto[0].email || signupDto[0].userName,
        password: signupDto[0].password,
      },
      {
        identifier: signupDto[1].email || signupDto[1].userName,
        password: signupDto[1].password,
      },
    ];

    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: signupDto[0].password,
            userName: signupDto[0].userName,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: signupDto[0].email,
            userName: signupDto[0].userName,
          })
          .expectStatus(400);
      });

      it('should throw if username is missing', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: signupDto[0].email,
            password: signupDto[0].password,
          })
          .expectStatus(400);
      });

      it('should throw if payload is empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should sign up user 1', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto[0])
          .expectStatus(201);
      });

      it('should sign up user 2', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto[1])
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if identifier is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: SigninDto[0].password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            identifier: SigninDto[0].identifier,
          })
          .expectStatus(400);
      });

      it('should throw if payload is empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should sign in user 1 with email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(SigninDto[0])
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });

      it('should sign in user 2 with email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(SigninDto[1])
          .expectStatus(200)
          .stores('userAccessToken2', 'access_token');
      });

      it('should sign in user 1 with username', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            identifier: signupDto[0].userName,
            password: signupDto[0].password,
          })
          .expectStatus(200);
      });

      it('should sign in user 2 with username', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            identifier: signupDto[1].userName,
            password: signupDto[1].password,
          })
          .expectStatus(200);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user 1', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .stores('userId1', 'id');
      });

      it('Should get current user 2', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
          .expectStatus(200)
          .stores('userId2', 'id');
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        userName: 'bbk_user',
        displayName: 'bbk',
        bio: 'Just a happy dark themed user here',
        firstName: 'Bigs',
        lastName: 'Smalls',
      };
      it('Should edit user info', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('Posts', () => {
    describe('Create post', () => {
      const dto: CreatePostDto = {
        content: 'Hello World',
        link: 'htts://hello.world',
      };
      it('Should create a post', () => {
        return pactum
          .spec()
          .post('/posts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('postId', 'id');
      });
    });
    describe('Return posts', () => {
      it('Should return all posts', () => {
        return pactum
          .spec()
          .get('/posts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });
    describe('Return :id post', () => {
      it('Should return unique post', () => {
        return pactum
          .spec()
          .get('/posts/$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });
    describe('cRUD for posts', () => {
      it('Should edit the post', () => {
        const dto: EditPostDto = {
          content: 'Holla worldo',
          link: 'htts://hello.worldQx',
        };
        return pactum
          .spec()
          .patch('/posts/$S{postId}')
          .withBody(dto)
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
      it('Should delete post with unique id', () => {
        return pactum
          .spec()
          .delete('/posts/$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(204);
      });
      it('Should return delated post array', () => {
        return pactum
          .spec()
          .get('/posts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' });
      });
    });
    describe('Replies', () => {
      it('Should return all post replies', () => {
        return pactum
          .spec()
          .get('/posts/$S{postId}/replies')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });

    describe('Follow', () => {
      it('Should follow a user (id: 2)', async () => {
        return pactum
          .spec()
          .post('/follows/$S{userId2}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(201);
      });

      it('Should get list of followers for user 2', () => {
        return pactum
          .spec()
          .get('/follows/$S{userId2}/followers')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });

      it('Should get list of following for user 1', () => {
        return pactum
          .spec()
          .get('/follows/$S{userId1}/following')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });

      it('Should unfollow user 2', () => {
        return pactum
          .spec()
          .delete('/follows/$S{userId2}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(204);
      });

      it('Should return empty followers list for user 2 after unfollow', () => {
        return pactum
          .spec()
          .get('/follows/$S{userId2}/followers')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Likes', () => {
      it('should like a post', () => {
        return pactum
          .spec()
          .post('/like')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ postId: '$S{postId}' })
          .expectStatus(201);
      });

      it('should confirm that the user has liked the post', () => {
        return pactum
          .spec()
          .get('/like/$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLike({ hasLiked: true });
      });

      it('should get likes for the post', () => {
        return pactum
          .spec()
          .get('/like?postId=$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });

      it('should unlike the post', () => {
        return pactum
          .spec()
          .delete('/like')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ postId: '$S{postId}' })
          .expectStatus(204);
      });

      it('should confirm that the user has not liked the post', () => {
        return pactum
          .spec()
          .get('/like/$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLike({ hasLiked: false });
      });
    });

    describe('Reposts', () => {
      beforeAll(async () => {
        // Create a new post to repost
        const dto: CreatePostDto = {
          content: 'Repost me!',
        };

        await pactum
          .spec()
          .post('/posts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('repostedPostId', 'id');
      });

      it('should repost a post', () => {
        return pactum
          .spec()
          .post('/reposts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ postId: '$S{repostedPostId}' })
          .expectStatus(201)
          .stores('repostId', 'id');
      });

      it('should prevent reposting the same post twice', () => {
        return pactum
          .spec()
          .post('/reposts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ postId: '$S{repostedPostId}' })
          .expectStatus(409);
      });

      it('should confirm the post was reposted', () => {
        return pactum
          .spec()
          .get('/reposts/$S{repostedPostId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLike({ hasReposted: true });
      });

      it('should get all reposts for the post', () => {
        return pactum
          .spec()
          .get('/reposts?postId=$S{repostedPostId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken2}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });

      it('should delete a repost', () => {
        return pactum
          .spec()
          .delete('/reposts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ postId: '$S{repostedPostId}' })
          .expectStatus(204);
      });

      it('should confirm the post is no longer reposted', () => {
        return pactum
          .spec()
          .get('/reposts/$S{repostedPostId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLike({ hasReposted: false });
      });

      it('should handle reposting a non-existent post', () => {
        return pactum
          .spec()
          .post('/reposts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ postId: 'non-existent-id' })
          .expectStatus(404);
      });

      it('should handle deleting a non-existent repost', () => {
        return pactum
          .spec()
          .delete('/reposts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ postId: 'non-existent-id' })
          .expectStatus(404);
      });

      it('should return 400 for missing postId on create', () => {
        return pactum
          .spec()
          .post('/reposts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({})
          .expectStatus(400);
      });

      it('should return 400 for missing postId on delete', () => {
        return pactum
          .spec()
          .delete('/reposts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({})
          .expectStatus(400);
      });
    });
    describe('Quotes', () => {
      const dto: CreateQuoteDto = {
        postId: '$S{postId}',
        content: 'This is a quote content',
      };
      it('should create a quote', () => {
        return pactum
          .spec()
          .post('/quote')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('quoteId', 'id');
      });
      it('should return quote count', () => {
        return pactum
          .spec()
          .get('/quote/$S{postId}/count')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
      it('should fail to create a quote for non-existent post', () => {
        return pactum
          .spec()
          .post('/quote')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ ...dto, postId: 'non-existent-post-id' })
          .expectStatus(404);
      });
      it('should get all quotes for a post', () => {
        return pactum
          .spec()
          .get('/quote/$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
      it('should edit a quote', () => {
        return pactum
          .spec()
          .patch('/quote/$S{quoteId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ ...dto, content: 'edited content' })
          .expectStatus(200);
      });
      it('should delete a quote', () => {
        return pactum
          .spec()
          .delete('/quote/$S{quoteId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(204);
      });
      it('should return 404 on delete of non-existent quote', () => {
        return pactum
          .spec()
          .get('/quote/$S{quoteId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(404);
      });
    });

    describe('Bookmarks', () => {
      it('should add a bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks/$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(201);
      });
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
      it('should add a bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(204);
      });
    });
  });
});
