# Shofiqul Admin Dashboard

A standalone, private Admin CMS built with **Next.js 15**, **TypeScript**, and **Tailwind CSS** — completely independent from the public portfolio (`client/`).

---

## 🏗 Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Framework      | Next.js 15 (App Router)         |
| Language       | TypeScript                      |
| Styling        | Tailwind CSS                    |
| Authentication | HTTP-only cookie + JWT (`jose`) |
| Forms          | `react-hook-form` + `zod`       |
| HTTP Client    | `axios`                         |
| Notifications  | `sonner`                        |
| Icons          | `lucide-react`                  |

---

## 📁 Project Structure

```text
dashboard/
├── src/
│   ├── app/
│   │   ├── api/auth/           # Server-side auth API routes
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── session/route.ts
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Dashboard shell (Sidebar + Header)
│   │   │   ├── page.tsx        # Overview / Stats
│   │   │   ├── projects/       # Projects CRUD
│   │   │   ├── articles/       # Blog CMS
│   │   │   ├── messages/       # Client messages inbox
│   │   │   └── settings/       # Settings + API health
│   │   ├── login/page.tsx      # Authentication page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Redirects to /dashboard
│   ├── lib/
│   │   ├── api/index.ts        # API abstraction layer
│   │   └── auth/session.ts     # JWT session helpers
│   ├── middleware.ts            # Route protection
│   └── types/index.ts          # TypeScript interfaces
├── .env.local                  # Environment variables (do not commit)
├── .env.example                # Template for env vars
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd dashboard
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
JWT_SECRET=your-random-jwt-secret-key
```

### 3. Run Development Server

The dashboard runs on **port 3001** to avoid conflicting with the client on port 3000.

```bash
npm run dev
# → Open http://localhost:3001
```

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 🔐 Authentication

- Login page at `/login`
- Credentials validated server-side via Next.js API routes
- Session stored as an **HTTP-only cookie** (JWT signed with `jose`)
- Middleware in `src/middleware.ts` protects all `/dashboard/*` routes
- **Credentials are never exposed to the client bundle**

Default credentials (change in `.env.local`):

- Username: `admin`
- Password: `adminpassword123`

---

## 🌐 Deployment on Vercel

1. Create a **new Vercel project** pointing to the `dashboard/` subdirectory
2. Set the **Root Directory** to `dashboard`
3. Add all environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_NEXT_PUBLIC_API_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
4. Deploy!

---

## 📡 Backend API Endpoints Used

| Resource | Methods                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------- |
| Projects | `GET /api/projects`, `POST /api/projects/create`, `PATCH /api/projects/:id`, `DELETE /api/projects/:id` |
| Articles | `GET /api/blogs`, `POST /api/blogs/create`, `PATCH /api/blogs/:id`, `DELETE /api/blogs/:id`             |
| Messages | `GET /api/message`, `DELETE /api/message/:id`                                                           |
