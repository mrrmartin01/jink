import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from 'src/user/dto';
import { CreatePostDto } from 'src/post/dto';

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
    const signupDto = {
      email: 'testing@mail.com',
      userName: 'testing_user',
      firstName: 'Test',
      lastName: 'User',
      password: 'test123',
    };

    const SigninDto = {
      identifier: signupDto.email || signupDto.userName,
      password: signupDto.password,
    };

    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: signupDto.password,
            userName: signupDto.userName,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: signupDto.email,
            userName: signupDto.userName,
          })
          .expectStatus(400);
      });

      it('should throw if username is missing', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: signupDto.email,
            password: signupDto.password,
          })
          .expectStatus(400);
      });

      it('should throw if payload is empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if identifier is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: SigninDto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            identifier: SigninDto.identifier,
          })
          .expectStatus(400);
      });

      it('should throw if payload is empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should sign in with email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(SigninDto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });

      it('should sign in with username', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            identifier: signupDto.userName,
            password: signupDto.password,
          })
          .expectStatus(200);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        password: 'testabc',
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
      it('Should return all posts', () => {
        return pactum
          .spec()
          .get('/posts')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .inspect();
      });
    });
  });
});
