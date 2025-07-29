# Jink API

A RESTful API built with [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), and PostgreSQL.  
It provides authentication, user management, post creation, and bookmark management features.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [License](#license)
- [Author](#author)
- [Notes](#notes)

---

## Features

- User registration and authentication (JWT)
- User profile management (view and edit)
- Post creation and retrieval
- Bookmark CRUD (Create, Read, Update, Delete)
- E2E and unit testing
- API validation with DTOs
- Swagger (OpenAPI) documentation

---

## Tech Stack

- **Backend:** [NestJS](https://nestjs.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Authentication:** JWT (Passport.js)
- **Validation:** class-validator, class-transformer
- **Testing:** Jest, Pactum
- **API Docs:** Swagger (OpenAPI)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (for local PostgreSQL)

### Installation

```bash
git clone https://github.com/mrrmartin01/jink.git
cd jink
yarn install
```

### Environment Variables

Copy `.env` and `.env.test` (for testing) from the repo or create them:

```
DATABASE_URL="postgresql://postgres:123@localhost:5434/jink?schema=public"
JWT_SECRET='your-super-secret'
```

> **Note:** The default database name is `jink` (not `jinkdb`).

### Database Setup

Start the PostgreSQL database using Docker Compose:

```sh
yarn db:dev:up
```

Run migrations:

```sh
yarn prisma:dev:deploy
```

### Running the App

Start the development server:

```sh
yarn start:dev
```

The API will be available at [http://localhost:9000](http://localhost:9000) (default).


---

> **Note:** The default port can be changed by apending `-p 5000` to `"start": "nest start"` at [package.json](./package.json) to run it at port 5000.


## API Documentation

After starting the app, access Swagger UI at:

```
http://localhost:9000/api
```

You can interact with all endpoints and view schemas.

---

## Testing

### End-to-End (E2E) Tests

```sh
yarn test:e2e
```

This will spin up a test database (see `docker-compose.yaml`), run migrations, and execute all E2E tests in `test/app.e2e-spec.ts`.

---

## Project Structure

```
src/
  auth/         # Authentication (JWT, Passport, DTOs)
  user/         # User module (profile, edit)
  post/         # Post module (create, list)
  bookmark/     # Bookmark module (CRUD)
  prisma/       # Prisma service and module
  main.ts       # App entry point
  app.module.ts # Root module

test/
  app.e2e-spec.ts # End-to-end tests

prisma/
  schema.prisma   # Prisma schema
  migrations/     # Database migrations
```

---

## Scripts

Common scripts from `package.json`:

| Script                   | Description                   |
| ------------------------ | ----------------------------- |
| `yarn start:dev`         | Start app in development mode |
| `yarn build`             | Build the app                 |
| `yarn test`              | Run unit tests                |
| `yarn test:e2e`          | Run end-to-end tests          |
| `yarn db:dev:up`         | Start dev database (Docker)   |
| `yarn db:dev:rm`         | Remove dev database (Docker)  |
| `yarn prisma:dev:deploy` | Run dev migrations            |

---

## License

This project is **UNLICENSED**.  
Feel free to use for learning or personal projects.

---

## Author

- [Theophilus Martin](mailto:theophilusmartin@zohomail.com)

---

## Notes

- Update the `DATABASE_URL` and `JWT_SECRET` in your `.env` files as needed.
- Variables in both `.env` and `.env.test` should have the same name but different values if you prefer.
- `.env.test` is provided as a guide.
- For production, review security and deployment best practices.
- For more details, see the source code and Swagger docs.


## Happy coding


*The simple dark-themed fella*