# MannSathi — Claude Code Rules

## What This Project Is
MannSathi is a women-first Nepali mental health platform. It is culturally grounded, trauma-informed, and built specifically for Nepali women in Nepal and the diaspora. Every technical decision must serve that mission.

---

## Stack

### Backend
- **Framework:** Express + TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Validation:** Zod (on all incoming request bodies, no exceptions)
- **Auth:** bcrypt + JWT in httpOnly cookie (30-day expiry)
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Dev server:** ts-node-dev

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v3 with custom design tokens
- **Routing:** React Router DOM v6
- **Fonts:** Playfair Display (serif) + Hind (sans)
- **Dev server:** `vite` (`npm run dev` inside `frontend/`)

---

## Folder Structure
```
backend/
├── index.ts
├── app.ts
├── routes/
├── controller/
├── middleware/
├── lib/
├── types/
└── prisma/
    └── schema.prisma

frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── assets/
│   ├── components/
│   │   └── ui/          (DhakaBand, SOSButton, …)
│   ├── context/
│   │   └── AuthContext.tsx  (AuthProvider, useAuth hook)
│   ├── hooks/           (useReveal, …)
│   └── pages/           (Landing, Login, Signup, …)
├── public/
├── tailwind.config.js
└── vite.config.ts
```

---

## Frontend Routes
| Path | Description |
|------|-------------|
| `/` | Landing page (Chhaya home) |
| `/login` | Login page |
| `/signup` | Signup page |
| `/feed` | Meri Katha / Mann ko Mausam / Aangan Bot / Diyo — stub for now |
| `/sahara` | Crisis resources page — stub for now |

---

## Design Tokens (Tailwind)
| Token | Hex | Use |
|-------|-----|-----|
| `pageBg` | `#F5F0E6` | Page background |
| `feedBg` | `#EDE8DC` | Card / feed background |
| `ink` | `#1A1410` | Primary text / buttons |
| `sindoor` | `#C0392B` | Accent red (CTA pulses, highlights) |
| `marigold` | `#E8A020` | Accent yellow |
| `maroon` | `#7B3F2B` | Dark section backgrounds |
| `himalayan` | `#4A9B7E` | Green accent |
| `sand` | `#D4C5A9` | Borders, dividers |
| `cardWhite` | `#FFFFFF` | Card surfaces |
| `peach` | `#F4D9C6` | Soft accent |
| `textBody` | `#5C4A35` | Body copy |
| `textMuted` | `#9A7B5A` | Muted / secondary text |

---

## UI Components
- **DhakaBand** — decorative horizontal Dhaka-pattern stripe, used as section dividers
- **SOSButton** — fixed bottom-right "सहारा" button that opens a crisis resources sheet (Saathi Nepal, TPO Nepal, Emergency 100)
- **useReveal** — IntersectionObserver hook for scroll-triggered `animate-fadeUp` reveals

---

## API Response Shape
Every single endpoint must return this shape — no exceptions:
```ts
{ success: boolean, data: T, error?: string }
```

---

## Cultural Rules — Non-Negotiable
These apply to code comments, seed data, error messages, bot prompts, and any user-facing string:

- **No clinical words anywhere** — never use: depression, trauma, assault, therapy, mental illness, disorder, suicide, PTSD
- **Use Nenglish** — the natural Nepali-English codemix diaspora women actually speak. Example: "Stress lagyo yaar" not "I am stressed"
- **Bot never advises** — the Aangan Bot only witnesses and validates. It never says "you should", "have you tried", "I recommend"
- **Always believes first** — harassment mode never questions the experience, never asks "are you sure?"
- **Warm, not clinical** — error messages, loading states, empty states should feel like a friend, not a system

---

## Naming Conventions
- Route files: `feature.ts` (e.g. `stories.ts`, `mood.ts`)
- Controller files: `feature.controller.ts`
- Zod schemas: `featureSchema` (e.g. `storySchema`, `moodSchema`)
- Database models: PascalCase (Prisma default)
- Environment variables: SCREAMING_SNAKE_CASE

---

## Prisma + Supabase Rules
- Always use `DATABASE_URL` for app queries (pooler, port 6543)
- Always use `DIRECT_URL` for migrations (port 5432)
- Both must be set in `.env` — never hardcode connection strings
- Use `prisma db push` for schema changes during development
- Never commit `.env`
- Prisma client is generated to `../generated/prisma` (outside `backend/`) — import from `../lib/prisma` (singleton in `lib/prisma.ts`)

---

## Auth Rules
- JWT stored in httpOnly cookie (`token`, 30-day expiry)
- Stories routes — **no auth, no userId** — completely open
- Mood + circle routes — apply `requireAuth` middleware from `middleware/auth.ts`
- CORS must include `credentials: true` and explicit origin (not `*`)
- `req.user` is typed via `types/express.d.ts` (augments Express `Request` with `user?: JwtPayload`)

### Implemented Auth Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | none | Create account, sets cookie |
| POST | `/api/auth/login` | none | Login, sets cookie |
| POST | `/api/auth/logout` | none | Clears cookie |
| GET | `/api/auth/me` | `requireAuth` | Returns `{ userId, email }` |

### Frontend Auth
- `AuthProvider` wraps the entire app in `App.tsx`
- `useAuth()` hook exposes: `user`, `loading`, `signup()`, `login()`, `logout()`
- All fetch calls use `credentials: 'include'` for cookie transport
- On mount, `AuthProvider` calls `/api/auth/me` to restore session

---

## What NOT To Build
- ❌ Native mobile app — web only
- ❌ Didi Circles backend — show as mockup only
- ❌ Real-time features — out of scope
- ❌ Video/voice — out of scope
- ❌ Matching algorithm — seed circles manually
