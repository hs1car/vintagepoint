# Database Migrations

## PostgreSQL Setup (Production)

### 1. Install PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# macOS
brew install postgresql

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
```

### 2. Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE vintagepoint;

# Create user
CREATE USER vintagepoint_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vintagepoint TO vintagepoint_user;

# Exit
\q
```

### 3. Update .env
```env
DATABASE_URL="postgresql://vintagepoint_user:your_secure_password@localhost:5432/vintagepoint?schema=public"
```

### 4. Run Migrations
```bash
# Generate migration
npx prisma migrate dev --name init

# Push to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Fallback: SQLite (Development Only)

If you need SQLite for local development:

```env
DATABASE_URL="file:./dev.db"
```

Change `provider = "sqlite"` in `schema.prisma`

## Migration Commands

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (DANGER: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Rollback Migration

```bash
# Revert last migration
npx prisma migrate resolve --rolled-back migration_name
```
