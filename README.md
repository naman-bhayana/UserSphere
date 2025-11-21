# UserSphere – User Management Dashboard

A modern, production-ready user management dashboard built with Next.js, TypeScript, TailwindCSS, Radix UI, React Query, Zustand, and Axios. Supports full CRUD operations, real-time search, filtering, pagination, dark mode, and more — designed to feel like a real internal admin tool.

- Live Demo: https://user-sphere-six.vercel.app
- GitHub Repo: https://github.com/naman-bhayana/UserSphere

## Overview

UserSphere showcases clean architecture, accessible UI, optimistic updates, persistent global state, and modern React patterns. It allows users to view, search, filter, add, edit, and delete user records with a fast and intuitive experience.

This project was built as part of a React Frontend assignment to demonstrate mastery over:

- Scalable React architecture
- Complex state management with React Query + Zustand
- Radix UI dialogs and selects
- Next.js routing (including dynamic routes)
- Optimistic updates with rollback
- Clean, responsive UI using TailwindCSS

## Features

### User Management
- View users in a clean, responsive table
- Avatar initials generated automatically
- Columns: avatar, name, email, phone, company

### Search, Sort & Filter
- Real-time search (as-you-type)
- Sort users by email (A–Z / Z–A)
- Filter users by company (Radix Select dropdown)

### Create / Update Users
- Add/Edit user via Radix dialog
- Form validation with TypeScript
- Optimistic UI updates
- Axios POST/PUT (mocked via JSONPlaceholder)

### Delete Users
- Radix confirmation dialog
- Axios DELETE
- Optimistic removal with rollback

### Pagination
- Smooth pagination (10 users/page)
- Uses React Query `keepPreviousData`
- Pages don’t reload from scratch

### User Detail Page
- Dynamic route: `/users/[id]`
- Shows full user profile including address
- Fetched via React Query

### Zustand Global State
- Logged-in user stored globally
- Dark mode toggle (Radix Switch)
- Dark mode persisted using `localStorage`

### Bonus — Activity Log
- Logs add/edit/delete actions
- Stored in Zustand
- Persists across navigation and refresh

### UI & UX Enhancements
- Fully responsive layout
- Accessible Radix UI components
- TailwindCSS-based modern styling

## AI Usage

AI tools were used only for initial scaffolding and boilerplate code generation. All business logic, UI components, typing, and state management were manually implemented, reviewed, and optimized.

## Tech Stack

| Category | Technology |
|---------|------------|
| Framework | Next.js 14 |
| Language | TypeScript |
| UI Components | Radix UI |
| Styling | TailwindCSS |
| State Management | Zustand |
| Data Layer | React Query |
| HTTP Client | Axios |
| Deployment | Vercel |
| Icons | Lucide Icons |

## API – JSONPlaceholder

This project uses JSONPlaceholder as a mock REST API.

### Limitations
- POST/PUT/DELETE operations do not persist
- API always returns success responses
- Data resets on refresh
- Search and filtering are done client-side

### What a Real Backend Would Add
- Authentication and authorization
- Database persistence
- Server-side pagination and filtering
- Full validation
- Rate limiting
- WebSocket for real-time sync
- Audit logging

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/naman-bhayana/UserSphere.git
cd UserSphere
npm install
```

### Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

The production server runs on http://localhost:3000.

## Deployment (Vercel)

- Push project to GitHub
- Visit https://vercel.com
- Import your GitHub repo
- Vercel auto-detects Next.js
- Click Deploy
- Vercel redeploys automatically on every push

## Assignment Checklist

| Requirement | Status |
|---|---|
| User List Table | ✔️ |
| Real-time Search | ✔️ |
| Sort by Email | ✔️ |
| Filter by Company | ✔️ |
| Add User | ✔️ |
| Edit User | ✔️ |
| Delete User | ✔️ |
| Radix Dialogs and Select | ✔️ |
| Zustand Global Store | ✔️ |
| Dark Mode Persisted | ✔️ |
| Pagination with React Query | ✔️ |
| Dynamic User Detail Page | ✔️ |
| Activity Log | ✔️ |
| Clean and Responsive UI | ✔️ |
| Accessible Components | ✔️ |

## License

MIT © Naman Bhayana

