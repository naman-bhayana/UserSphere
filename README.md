# User Management Dashboard

A modern Next.js admin dashboard for managing users with full CRUD operations, real-time search, filtering, pagination, and dark mode support. Built with TypeScript, TailwindCSS, Radix UI, React Query, and Zustand.

## Project Description

UserSphere is a comprehensive user management system that demonstrates modern React patterns including optimistic updates, client-side state management, and accessible UI components. The application provides an intuitive interface for viewing, searching, filtering, adding, editing, and deleting users with a clean, responsive design.

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/naman-bhayana/UserSphere.git
cd UserSphere
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Create an optimized production build:
```bash
npm run build
```

### Start Production Server

Start the production server (after building):
```bash
npm start
```

The production server will run on [http://localhost:3000](http://localhost:3000).

## Deployment to Vercel

### Step-by-Step Guide

1. **Push code to GitHub**
   - Ensure all your code is committed and pushed to your GitHub repository
   - Make sure the repository is public or you have Vercel access to private repos

2. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

3. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository (UserSphere)
   - Vercel will automatically detect Next.js

4. **Configure Project** (optional)
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

6. **Environment Variables** (if needed)
   - If you add environment variables later, go to Project Settings → Environment Variables
   - Add variables and redeploy

7. **Custom Domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain and follow DNS configuration instructions

### Automatic Deployments

Vercel automatically deploys:
- Every push to the `main` branch (production)
- Pull requests get preview deployments
- You can configure branch deployments in Project Settings

## API Notes

### JSONPlaceholder Integration

This application uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a fake REST API for demonstration purposes. JSONPlaceholder provides a realistic API interface but doesn't persist data.

### Important Limitations

- **POST/PUT/DELETE operations are simulated**: JSONPlaceholder returns success responses (200/201) but doesn't actually modify data on the server
- **Data resets on refresh**: Since changes aren't persisted, refreshing the page will show the original data from JSONPlaceholder
- **No real validation**: The API accepts any data structure and always returns success

### Optimistic Updates

The application uses **React Query's optimistic updates** to provide immediate UI feedback:

- When adding a user, the UI immediately shows the new user before the API call completes
- When editing, changes appear instantly in the table
- When deleting, the user disappears immediately
- If the API call fails, the UI automatically reverts to the previous state
- This pattern is essential for a good user experience, especially with JSONPlaceholder's simulated responses

### What Would Change in a Real Backend

1. **Authentication & Authorization**: JWT tokens, role-based access control, secure API endpoints
2. **Data Persistence**: Real database operations (PostgreSQL, MongoDB, etc.) with proper CRUD
3. **Error Handling**: Proper HTTP status codes and error messages for validation failures
4. **Server-side Pagination**: Backend handles pagination for large datasets
5. **Server-side Search & Filtering**: Efficient database queries instead of client-side filtering
6. **Input Validation**: Server-side validation before persisting to database
7. **Rate Limiting**: Protect API endpoints from abuse
8. **Caching Strategy**: Proper cache invalidation and refresh strategies
9. **Real-time Updates**: WebSocket or Server-Sent Events for live updates
10. **Audit Logging**: Server-side activity logging for compliance

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **State Management**: Zustand (with persist middleware)
- **Deployment**: Vercel

## Features

- ✅ User list with avatar, name, email, phone, company
- ✅ Real-time search by name
- ✅ Sort by email (A-Z / Z-A)
- ✅ Filter by company
- ✅ Add new users with validation
- ✅ Edit existing users
- ✅ Delete users with confirmation
- ✅ Pagination (10 users per page)
- ✅ User detail page with full address
- ✅ Dark mode toggle (persisted)
- ✅ Activity log (persisted)
- ✅ Responsive design
- ✅ Accessible UI components

## License

MIT

