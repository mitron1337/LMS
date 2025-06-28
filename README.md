# LMS (Learning Management System) — Backend

Ушбу лойиҳа NestJS, TypeORM, PostgreSQL, JWT аутентификация, Docker ва Swagger асосида қурилган онлайн таълим платформасининг сервер қисми ҳисобланади.

## Функционал

- **Роллар:** Студент, Ўқитувчи, Админ
- **Курслар, Модуллар, Дарслар, Топшириқлар, Результатлар, Студент-Курслар** модуллари
- **JWT аутентификация** (access ва refresh токенлар, куки орқали)
- **Роллар асосида ҳимояланган эндпоинтлар**
- **Swagger** орқали API ҳужжатлаш
- **Docker Compose** орқали тез ишга тушириш

## Бошлаш

### 1. Клонинг ва ўрнатинг

```bash
git clone <репо-url>
cd lms
npm install
```

### 2. .env файлини яратинг

`.env` файлини яратиб, қуйидагиларни киритинг:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=parol
DB_NAME=lms
JWT_SECRET=supersecret
JWT_REFRESH_SECRET=refreshsecret
```

### 3. Docker орқали ишга тушириш

```bash
docker-compose up -d
```

### 4. Лойиҳани ишга тушириш

```bash
npm run start:dev
```

### 5. Swagger API

Браузерда очинг:  
[http://localhost:3000/api](http://localhost:3000/api)

## Асосий эндпоинтлар

- `POST /auth/register` — Рўйхатдан ўтиш (роль танланади: STUDENT, TEACHER, ADMIN)
- `POST /auth/login` — Тизимга кириш (access ва refresh токен)
- `POST /auth/refresh` — Access токенни янгилаш (refresh токен орқали)
- `POST /auth/logout` — Тизимдан чиқиш

- `GET /courses` — Барча курслар
- `POST /courses` — Янги курс яратиш (фаќат ўқитувчи ва админ)
- `PATCH /courses/:id` — Курсни таҳрирлаш (фаќат эгаси ёки админ)
- `DELETE /courses/:id` — Курсни ўчириш (фаќат эгаси ёки админ)

- `GET /modules`, `POST /modules`, ...
- `GET /lessons`, `POST /lessons`, ...
- `GET /assignments`, `POST /assignments`, ...
- `GET /results`, `POST /results`, ...
- `GET /student-courses`, `POST /student-courses`, ...

## Аутентификация ва роллар

- **STUDENT**: Курсларга ёзилади, топшириқ топширади, натижаларини кўради
- **TEACHER**: Фақат ўз курсларини, модулларини, дарсларини яратади ва таҳрирлайди
- **ADMIN**: Барча маълумотларга тўлиқ кириш

## Swagger орқали тест қилиш

1. `/auth/login` орқали access ва refresh токен олинг
2. Swagger'да "Authorize" тугмасини босиб, access токенни киритинг
3. Refresh токенни янгилаш учун `/auth/refresh` эндпоинтидан фойдаланинг

## Docker орқали ишлаш

- `docker-compose up -d` — PostgreSQL базасини ишга туширади
- `.env` файлидаги маълумотлар билан базага уланади

## Муҳим

- `synchronize: true` — фақат тест учун! Продакшнда false қилинг.
- Барча эндпоинтлар Swagger'да тўлиқ ҳужжатланган.

---

Агар қўшимча саволлар бўлса, bemalol мурожаат қилинг!

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
