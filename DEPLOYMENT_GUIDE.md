# Soptosur Chain of Command — Database-Based Deployment Guide
### Soptosur Governance OS (North South University • Office of Student Affairs)

This guide walks you through deploying **Soptosur Governance OS** with a live, persistent PostgreSQL database.

---

## Architecture Overview

- **Frontend & API**: Next.js 14+ (App Router)
- **Database**: PostgreSQL 15+ (with custom PL/pgSQL triggers, enums, and partial unique indexes)
- **ORM**: Prisma Client + Raw SQL Migrations (`prisma/migrations/20260930000000_init_governance_rules/migration.sql`)
- **Seeding**: Automatic Founder Council, NSU OSA Config, and baseline roles (`prisma/seed.ts`)

---

## Method 1: Cloud Production Deployment (Vercel + Neon Postgres) — Recommended & Free

This is the standard enterprise stack. It takes ~3-5 minutes, is 100% free, and requires zero server maintenance.

### Step 1: Create a Free PostgreSQL Database on Neon
1. Go to [neon.tech](https://neon.tech) and create a free account.
2. Create a new project named: `soptosur-governance`.
3. In the Neon Console Dashboard, copy your **Connection String** (`DATABASE_URL`). It looks like:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[endpoint].us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### Step 2: Apply Migrations & Seed the Database from Local
In your local project directory:
```bash
# 1. Temporarily set your DATABASE_URL in .env (or run in terminal)
# In PowerShell:
$env:DATABASE_URL="your-neon-database-url-here"

# 2. Deploy all Prisma migrations and custom SQL triggers to the cloud DB:
npx prisma migrate deploy

# 3. Seed initial NSU OSA configuration and Founder Council:
npm run seed
```
> [!NOTE]
> All 9 PL/pgSQL database triggers (Single-supervisor, coordinator quota cap, independent auditor disqualification, etc.) will be active immediately on your cloud database!

### Step 3: Deploy the Web App on Vercel
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: ready for cloud deployment"
   git branch -M master
   git remote add origin https://github.com/your-username/soptosur-chain-of-command.git
   git push -u origin master
   ```
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `soptosur-chain-of-command` repository.
4. Under **Environment Variables**, add:
   - `DATABASE_URL`: `your-neon-database-url-here`
   - `NODE_ENV`: `production`
5. Click **Deploy**.
   - Vercel automatically runs `postinstall: prisma generate` and builds the Next.js production bundle.
   - Your live website URL (e.g. `https://soptosur-chain-of-command.vercel.app`) is now online and connected to your cloud database!

---

## Method 2: One-Click Docker Container Deployment (Local or VPS)

If you want to run everything self-hosted on your machine or on an Ubuntu VPS:

### Prerequisites:
- Docker Desktop or Docker Engine installed.

### Execution:
In the project root, run:
```bash
docker compose up --build -d
```

### What happens automatically:
1. Docker spins up a persistent PostgreSQL 16 container (`soptosur_db`) on port `5432`.
2. Docker builds the Next.js production container (`soptosur_app`).
3. Automatically runs `npx prisma migrate deploy` and `npm run seed`.
4. The application is live at:
   ```
   http://localhost:3000
   ```

To view live container logs:
```bash
docker compose logs -f app
```

To stop the containers:
```bash
docker compose down
```

---

## Method 3: Local PostgreSQL + Native Next.js Run

If you have PostgreSQL installed natively on your local computer (e.g. via Postgres.app, pgAdmin, or Homebrew):

1. **Create the database in PostgreSQL:**
   ```sql
   CREATE DATABASE soptosur_governance;
   ```
2. **Configure `.env`:**
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/soptosur_governance?schema=public"
   NODE_ENV="production"
   PORT=3000
   ```
3. **Execute database migrations:**
   ```bash
   npx prisma migrate deploy
   ```
4. **Seed the database:**
   ```bash
   npm run seed
   ```
5. **Build and start the Next.js production server:**
   ```bash
   npm run build
   npm run start
   ```

---

## Verification & Post-Deployment Checklist

1. **Verify Constitution:** Open `/charter` to verify all 14 articles are rendered.
2. **Verify Single-Supervisor:** Switch between personas in the navbar dropdown to verify Tier 1 through Tier 5 clearance gating.
3. **Verify Database Records:**
   ```bash
   npx prisma studio
   ```
   Opens Prisma Studio at `http://localhost:5555` where you can inspect every User, Role, Requisition, and Attendance record visually.
