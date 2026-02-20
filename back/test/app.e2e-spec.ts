import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';

describe('API Standards (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  it('/ (GET) - Should return 200 OK', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('/api/unknown/route (GET) - Should return 404 with Standard Error Format', () => {
    return request(app.getHttpServer())
      .get('/api/unknown/route')
      .expect(404)
      .expect((res) => {
        const body = res.body;
        expect(body).toHaveProperty('statusCode', 404);
        expect(body).toHaveProperty('code', 'RESOURCE_NOT_FOUND');
        expect(body).toHaveProperty('timestamp');
        expect(body).toHaveProperty('path', '/api/unknown/route');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
