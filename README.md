# Gearment Backend API

> 📝 <b>Development Note</b>
> 
> Due to time constraints, test coverage is limited to select examples:
> - Unit tests: `auth/domain/entities/__tests__`
> - Integration tests: `employee/application/commands/review-leave-request/review-leave-request.integration.ts`
> - Repository tests: `src/core/employee/infrastructure/repositories/sql-employee.repository.integration.ts`

## Overview

Gearment is a backend API built with NestJS and TypeScript. It provides authentication and employee management features including leave request handling.

## Features

- Authentication with JWT
- Employee management
- Leave request workflow
- Swagger API documentation

## Prerequisites

- Node.js (v16+)
- pnpm
- Docker and Docker Compose (for local database)

## Installation

```bash
# Install dependencies
pnpm install
```

## Environment Variables

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description | Default |
|----------|-------------|--------|
| NODE_ENV | Environment (development, production) | development |
| JWT_SECRET | Secret key for JWT token generation | hieudeptrai |
| JWT_EXPIRATION_SECONDS | JWT token expiration time in seconds | 86400 |
| DATABASE_HOST | PostgreSQL database host | localhost |
| DATABASE_PORT | PostgreSQL database port | 5432 |
| DATABASE_USER | PostgreSQL database user | gearment |
| DATABASE_PASSWORD | PostgreSQL database password | gearment |
| DATABASE_NAME | PostgreSQL database name | gearment |
| PORT | Application port | 3000 |

## Database Setup

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d db-gearment
```

This will start a PostgreSQL instance with the credentials specified in the `.env` file.

## Available Scripts

```bash
# Development
pnpm start:dev       # Start the application in development mode with watch

# Production
pnpm build           # Build the application
pnpm start:prod      # Start the application in production mode

# Testing
pnpm test            # Run tests

# Database Migrations
pnpm migration:run           # Run migrations
pnpm migration:revert        # Revert the last migration
pnpm migration:generate "./src/migrations/name"  # Generate a new migration

# Other
pnpm format          # Format code with Prettier
pnpm lint            # Lint code with ESLint
pnpm cli             # Run CLI commands
```

## Project Structure

```
src/
├── app.module.ts        # Main application module
├── main.ts              # Application entry point
├── cli.ts               # CLI entry point
├── commands/            # CLI commands
├── core/                # Core business logic
│   ├── auth/            # Authentication module
│   └── employee/        # Employee management module
├── migrations/          # Database migrations
└── shared/              # Shared utilities and configurations
```

## API Documentation

When running in development mode, Swagger API documentation is available at:

```
http://localhost:3000/docs
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected endpoints:

1. Obtain a token by authenticating through the login endpoint
2. Include the token in the Authorization header of subsequent requests:
   ```
   Authorization: Bearer <your_token>
   ```

## Testing

```bash
# Start the test database
docker-compose up -d db-gearment-test

# Run the migration in test database
NODE_ENV=test pnpm run migration:run

# Run tests
pnpm test            # Unit tests
```

## License

This project is licensed under the MIT license.

