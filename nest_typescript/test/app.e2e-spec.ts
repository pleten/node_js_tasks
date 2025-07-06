import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/teas (GET)', () => {
    return request(app.getHttpServer())
      .get('/teas')
      .expect(200)
      .expect({
        pagination: {
          page: 1,
          pageSize: 100,
          total: 0,
        },
      });
  });
});
