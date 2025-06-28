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
