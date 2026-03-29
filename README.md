# Project: CHHAYA (TEAM 74)
# Event: Nepal‑US Hackathon 2026

## A warm space for South Asian women — to share, to feel, and to be heard. No judgment. No login. Just didi energy.

# Core Development Team

| **Name**         | **Role**              | **Key Contributions**                                            | **Expertise**                               |
| ---------------- | --------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| [@Abiralstha99]  | Lead Developer        | Core architecture & backend implementation                       | Python, Backend Systems, Database Design    |
| [@TejaswiAmatya] | Project Architect     | Project initialization, technical strategy & Feature development | Systems Design, Project Management, Backend |
| [@La-Lhakpa]     | Technical Writer      | Feature development & developer guides                           | Technical Documentation, Frontend, Testing  |
| [@KungaLama]     | Full-Stack Engineer   | Feature development, bug fixes & performance optimization        | Frontend, Backend, Testing                  |
| @Rob Basnet      | DevOps/Infrastructure | deployment automation & infrastructure management                | Docker, Vercel, GitHub Actions              |

# Presentation prepared by all team members and Presented by @TejaswiAmatya!

## Docker Quickstart

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3001`
- Swagger: `http://localhost:3001/api-docs`

Detailed guide: see [`DOCKER_DEPLOY.md`](./DOCKER_DEPLOY.md).

---

## What This API Does

**Meri Katha** is the anonymous story feed feature of Chhaya. It lets users:

- **Share** a short anonymous story (10–500 characters)
- **Browse** the latest 50 stories from the community
- **Sunein** ("I heard you") a story — a one-tap acknowledgement that replaces likes

---

### Features

### 📖 **Meri Katha** — Story Sharing

- **Share** a short anonymous story (10–500 characters) — text or voice recording
- **Browse** the latest 50 community stories, newest first
- **Sunein** ("I heard you") a story — a one-tap acknowledgement that replaces likes
- **Comment** — leave a comment under a story
- **Bilingual feed** — toggle between English and South Asian languages; stories auto-translate via Groq API (llama-3.3-70b-versatile)
- Completely anonymous — no accounts, no authentication needed

### 🙏 **Aangan Bot** — Peer Companion Chat

- **Talk to a caring AI didi** (elder sister) — someone to listen without judgment
- **Built on Groq LLM** — fast, warm, culturally fluent responses in South Asian languages
- **Mirror your language** — respond in Hindi, English, Urdu, Bengali, or codemixed based on how you write
- **Never gives advice** — only validates feelings and witnesses your experience
- **No clinical language** — uses culturally grounded framing instead of mental health terminology
- Chat history is kept during your session; completely anonymous

**Backend Endpoint:**

- `POST /api/bot/chat` — Send message, receive Aangan Bot response

### 🪔 **Diyo** — Light a Virtual Prayer

- **Light a virtual diyo** (oil lamp) — set a private intention, wish, or fear
- **Add an affirmation** — leave a warm message on someone else's diyo
- **See the flame grow** — diyos glow brighter as more affirmations are added
- Warm, minimal design with flickering flame animations
- Frontend-only feature; diyo data is seeded locally (no backend endpoints)

### 🤝 **Sahara** — Crisis Resources Directory

- **Curated helplines** for Nepal, the United States, UK, and Australia
- One-tap **call or text** directly from the page (tel/sms links)
- Covers domestic violence, sexual assault, and general crisis support
- Resources include South Asian community-specific lines (e.g. API-GBV)
- Always accessible — reachable from the bottom nav on any page via the **सहारा** button

---

## Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Runtime    | Node.js                                             |
| Framework  | Express 5                                           |
| Language   | TypeScript (strict mode)                            |
| Database   | Supabase (PostgreSQL)                               |
| ORM        | Prisma 7 (with `@prisma/adapter-pg`)                |
| Validation | Zod 4                                               |
| AI / LLM   | Groq — `llama-3.3-70b-versatile` (Aangan Bot + translation) |
| API Docs   | Swagger UI (`swagger-jsdoc` + `swagger-ui-express`) |
| Dev Server | `ts-node-dev`                                       |

---

## Folder Structure

```
backend/
├── index.ts                  # Entry point — Express app setup, middleware, route mounting
├── prisma.config.ts          # Prisma config (points DIRECT_URL to port 5432 for migrations)
├── tsconfig.json             # TypeScript config (strict mode, ES2020, CommonJS)
│
├── config/
│   └── swagger.ts            # Swagger/OpenAPI spec definition and schema components
│
├── controllers/
│   └── meriKathaControllers.ts  # Business logic: getStories, setStories, suneinStory
│
├── routes/
│   └── meriKathaRoutes.ts    # Express router + JSDoc Swagger annotations for each route
│
├── schema/
│   └── storySchema.ts        # Zod validation schema for story input (content: min 10, max 500)
│
├── lib/
│   └── prisma.ts             # Singleton Prisma client (with pg pool adapter for Supabase)
│
└── prisma/
    ├── schema.prisma         # Prisma data model — defines the Story model
    └── seed.ts               # Seed script — loads initial stories into the DB
```

> **Note:** The `generated/prisma/` directory is git-ignored. It is auto-generated by `prisma generate` and should never be committed.

---

## Local Setup

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works fine)

### Steps

```bash
# 1. Clone the repo
git clone <repo-url>
cd MeriKatha/backend

# 2. Install dependencies (this also runs `prisma generate` automatically via postinstall)
npm install

# 3. Copy the env template and fill in your Supabase credentials
cp .env.example .env
# Edit .env — see "Environment Variables" section below

# 4. Push the Prisma schema to your database
npx prisma db push

# 5. (Optional) Seed the database with sample stories
npm run seed

# 6. Start the dev server
npm run dev
```

The server starts on `http://localhost:3001` (or whatever `PORT` is set to).

---

## Environment Variables

Create a `.env` file in `backend/` with the following:

```env
# Pooled connection — used by the app at runtime (port 6543, PgBouncer)
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# Direct connection — used by Prisma migrations (port 5432)
DIRECT_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"

# Port the Express server listens on
PORT=3001
```

**Where to find these values:**

1. Go to your Supabase project dashboard
2. Navigate to **Settings → Database**
3. Under **Connection string**, select **URI** mode
4. Copy the **Pooling** URL (`DATABASE_URL`) and the **Direct** URL (`DIRECT_URL`)

> Never commit `.env`. It is already in `.gitignore`.

---

## Database Setup & Prisma Commands

The project uses **Prisma with the `@prisma/adapter-pg` driver** to connect to Supabase via a `pg` connection pool. This is required because Supabase uses PgBouncer, which is incompatible with Prisma's default connection handling.

### Current Schema

```prisma
model Story {
  id          String   @id @default(cuid())
  content     String
  suneinCount Int      @default(0)
  createdAt   DateTime @default(now())
}
```

### Common Commands

```bash
# Generate the Prisma client (run after any schema changes)
npx prisma generate

# Push schema changes to the database (dev workflow — no migration files)
npx prisma db push

# Seed the database with sample stories
npm run seed

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Create a formal migration (production workflow)
npx prisma migrate dev --name <migration-name>
```

> **Important:** `prisma db push` uses `DIRECT_URL` (port 5432) for the migration connection. `DATABASE_URL` (port 6543) is used at runtime by the app.

---

## API Endpoints

Base URL: `http://localhost:3001/api`

All responses follow this shape:

```json
{ "success": true, "data": <payload>, "error": "optional, only on failure" }
```

### Stories

| Method | Endpoint                  | Description                                  |
| ------ | ------------------------- | -------------------------------------------- |
| `GET`  | `/api/stories`            | Fetch the latest 50 stories, newest first    |
| `POST` | `/api/stories`            | Share a new anonymous story                  |
| `POST` | `/api/stories/:id/sunein` | Increment the "maine suna" count for a story |

---

### `GET /api/stories`

Returns the 50 most recent stories.

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clxyz123abc",
      "content": "Aaja din ekdum tuff thiyo yaar...",
      "suneinCount": 12,
      "createdAt": "2026-03-28T10:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/stories`

Share a new anonymous story.

**Request body:**

```json
{ "content": "Ghar ma koi bujhdaina, tara yeha bhanna paauchu..." }
```

- `content` is required, minimum 10 characters, maximum 500 characters.

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "id": "clxyz456def",
    "content": "Ghar ma koi bujhdaina, tara yeha bhanna paauchu...",
    "suneinCount": 0,
    "createdAt": "2026-03-28T11:00:00.000Z"
  }
}
```

**Response `400` (validation failure):**

```json
{
  "success": false,
  "data": null,
  "error": "Aphno katha lekh ta — kam se kam 10 characters chahiyo"
}
```

---

### `POST /api/stories/:id/sunein`

Acknowledge a story ("Maine suna" — I heard you). No request body needed.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": "clxyz123abc",
    "content": "...",
    "suneinCount": 13,
    "createdAt": "2026-03-28T10:00:00.000Z"
  }
}
```

**Response `404` (story not found):**

```json
{
  "success": false,
  "data": null,
  "error": "Yo katha ferina — sायद delete bhaisakyo"
}
```

---

## Swagger / API Docs

Interactive API documentation is available at:

```
http://localhost:3001/api-docs
```

Built with **Swagger UI** + **swagger-jsdoc**. The spec is defined in two places:

- **`backend/config/swagger.ts`** — OpenAPI 3.0 definition, server URL, and reusable component schemas (`Story`, `StoryInput`, `ApiResponse`)
- **`backend/routes/meriKathaRoutes.ts`** — Per-route `@swagger` JSDoc comments that document request/response shapes

To update the docs, edit the JSDoc comments directly above each route definition in `meriKathaRoutes.ts`. The UI auto-reflects changes on server restart.

---

## Scripts Reference

```bash
npm run dev     # Start dev server with hot reload (ts-node-dev)
npm run seed    # Seed the database with sample stories
```

---
