import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription(
      `
      Документация LMS (NestJS)
      
      ## Аутентификация
      
      ### Access Token
      Используйте Bearer Token для доступа к защищенным эндпоинтам.
      Получите access token через /auth/login
      
      ### Refresh Token
      Для обновления access token используйте /auth/refresh
      - Введите refresh token в поле "refreshToken" в теле запроса
      - Или используйте Bearer Token с refresh token в заголовке Authorization
      
      ### Роли пользователей
      - **STUDENT**: Может просматривать курсы, модули, уроки и отправлять задания
      - **TEACHER**: Может создавать и управлять своими курсами, модулями и уроками
      - **ADMIN**: Полный доступ ко всем функциям системы
    `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT token (access token или refresh token)',
        in: 'header',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите refresh token для обновления access token',
        in: 'header',
      },
      'refresh-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
