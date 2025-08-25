import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    jest.useFakeTimers();
  });

  afterEach(() => jest.getRealSystemTime());

  it('/profile (POST)', () => {
    jest.setSystemTime(new Date(1_000_000));
    let newUserId = 1_000_000;
    const newUser = {
      email: 'test@example.com',
      displayName: 'John Doe',
      age: 20,
    };
    return request(app.getHttpServer())
      .post('/profiles')
      .send(newUser)
      .auth('test', { type: 'bearer' })
      .expect(({ body }) => expect(body).toHaveProperty('id'))
      .expect(201,{ id: newUserId, ...newUser });
  });

  it('/profile (POST) no auth', () => {
    const newUser = {
      email: 'test@example.com',
      displayName: 'John Doe',
      age: 20,
    };
    return request(app.getHttpServer())
      .post('/profiles')
      .send(newUser)
      .expect(403, {
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('/profile (POST) duplicate email', async () => {
    const newUser = {
      email: 'test@example.com',
      displayName: 'John Doe',
      age: 20,
    };
    await request(app.getHttpServer())
      .post('/profiles')
      .send(newUser)
      .auth('test', { type: 'bearer' });
    return request(app.getHttpServer())
      .post('/profiles')
      .send(newUser)
      .auth('test', { type: 'bearer' })
      .expect(400, {
        error: 'Bad Request',
        message: 'Email is already registered',
        statusCode: 400,
      });
  });

  it('/profile (POST) invalid email', () => {
    const newUser = {
      email: 'testexample.com',
      displayName: 'John Doe',
      age: 20,
    };
    return request(app.getHttpServer())
      .post('/profiles')
      .send(newUser)
      .auth('test', { type: 'bearer' })
      .expect(400, {
        error: 'Bad Request',
        message: ['email must be an email'],
        statusCode: 400,
      });
  });

  it('/profile (POST) short display name', () => {
    const newUser = {
      email: 'test@example.com',
      displayName: 'J',
      age: 20,
    };
    return request(app.getHttpServer())
      .post('/profiles')
      .send(newUser)
      .auth('test', { type: 'bearer' })
      .expect(400, {
        error: 'Bad Request',
        message: ['displayName must be longer than or equal to 2 characters'],
        statusCode: 400,
      });
  });

  it('/profile (GET)', () => {
    const usersToCreate = [
      {
        email: 'test@example.com',
        displayName: 'John Doe',
        age: 20,
      },
      {
        email: 'test1@example.com',
        displayName: 'Alex P.',
        age: 32,
      },
      {
        email: 'test2@example.com',
        displayName: 'Jane Doe',
      },
    ];
    const usersList = [];
    jest.setSystemTime(new Date(1_000_000));
    let newUserId = 1_000_000;
    usersToCreate.forEach(async (user) => {
      await request(app.getHttpServer())
        .post('/profiles')
        .send(user)
        .auth('test', { type: 'bearer' });
      usersList.push({ id: newUserId, ...user });
      newUserId += 1000;
    });

    return request(app.getHttpServer())
      .get('/profiles')
      .expect(200)
      .expect(usersList);
  });

  it('/profile/:id (GET)', async () => {
    jest.setSystemTime(new Date(1_000_000));
    let userId = 1_000_000;
    const userToCreate = {
      email: 'test@example.com',
      displayName: 'John Doe',
      age: 20,
    };
    await request(app.getHttpServer())
      .post('/profiles')
      .send(userToCreate)
      .auth('test', { type: 'bearer' });
    return request(app.getHttpServer())
      .get(`/profiles/${userId}`)
      .auth('test', { type: 'bearer' })
      .expect(200, { id: userId, ...userToCreate });
  });

  it('/profile/:id (GET) no auth', async () => {
    jest.setSystemTime(new Date(1_000_000));
    let userId = 1_000_000;
    const userToCreate = {
      email: 'test@example.com',
      displayName: 'John Doe',
      age: 20,
    };
    await request(app.getHttpServer())
      .post('/profiles')
      .send(userToCreate)
      .auth('test', { type: 'bearer' });
    return request(app.getHttpServer()).get(`/profiles/${userId}`).expect(403, {
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403,
    });
  });

  it('/profile/:id (GET) not existing profile', async () => {
    return request(app.getHttpServer())
      .get(`/profiles/12345`)
      .auth('test', { type: 'bearer' })
      .expect(404, {
        message: 'Profile not found',
        error: 'Not Found',
        statusCode: 404,
      });
  });
});
