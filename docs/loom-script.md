# Loom Demo Script - UserSphere

**Duration**: 6-8 minutes  
**Target Audience**: Technical reviewers / Hiring managers

---

## 1. Introduction & Overview (30 seconds)

- "Hi, I'm Naman Bhayana, and I'm going to walk you through UserSphere, a user management dashboard I built for the Jumbo React Frontend Assignment."
- "This is a Next.js application built with TypeScript, featuring full CRUD operations, real-time search, filtering, and dark mode support."
- "Let me show you the live application first, then we'll dive into the code structure."

---

## 2. Feature Demo - User Management (2 minutes)

- **Navigate to the users page** - Show the table with all users
- **Search functionality** - Type a name to demonstrate real-time search
- **Sort by email** - Click the email sort button to show A-Z / Z-A sorting
- **Filter by company** - Use the dropdown to filter by a specific company
- **Add a new user** - Click "Add User", fill out the form, show validation (try invalid email), then submit
- **Edit a user** - Click edit on an existing user, modify fields, save
- **Delete a user** - Click delete, show the confirmation dialog, confirm deletion
- **Pagination** - Show the pagination controls, navigate between pages
- **Dark mode toggle** - Toggle dark mode in the navbar, show it persists on refresh

---

## 3. User Detail Page (30 seconds)

- **Navigate to user detail** - Click on a user's name or navigate to `/users/[id]`
- **Show full details** - Display name, email, phone, company, and full address
- **Back navigation** - Show the back button functionality

---

## 4. Activity Log Feature (30 seconds)

- **Scroll to activity log** - Show the activity log at the bottom of the users page
- **Show recent activities** - Point out the logged actions (add, edit, delete) with timestamps
- **Demonstrate persistence** - Refresh the page to show the log persists

---

## 5. Code Structure & Architecture (2 minutes)

- **Open the project in VS Code** - Show the folder structure:
  - `pages/` - Next.js pages (users list, user detail, index redirect)
  - `src/components/` - Reusable components (Layout, UserDialog, ActivityLog)
  - `src/lib/` - API layer and React Query configuration
  - `src/hooks/` - Custom React Query hooks (useUsers, useAddUser, etc.)
  - `src/stores/` - Zustand store for global state
  - `src/types/` - TypeScript type definitions
- **Show TypeScript strictness** - Open a file, point out no `any` types, strict typing
- **Show API layer** - Open `src/lib/api/users.ts`, explain the axios setup
- **Show React Query hooks** - Open `src/hooks/useUsers.ts`, explain optimistic updates pattern
- **Show Zustand store** - Open `src/stores/useAppStore.ts`, explain persist middleware

---

## 6. Key Technical Decisions (1 minute)

- **Optimistic Updates** - Explain why we use them (JSONPlaceholder doesn't persist, but we want instant UI feedback)
- **Client-side Pagination** - Explain it's for demo purposes, in production would be server-side
- **Radix UI** - Show accessibility features, keyboard navigation, focus management
- **Zustand with Persist** - Explain why we use it for dark mode and activity log persistence

---

## 7. Improvements & Future Enhancements (1 minute)

- **What's missing in production**:
  - Real backend with database persistence
  - Authentication and authorization
  - Server-side pagination and search
  - Proper error handling and validation
  - Unit and integration tests
- **Code quality**:
  - Clean commit history (show git log if time permits)
  - TypeScript strict mode throughout
  - Accessible UI components
  - Responsive design

---

## 8. Deployment & Closing (30 seconds)

- **Show deployed version** - Navigate to the Vercel deployment URL
- **Mention deployment process** - Quick note about Vercel's automatic deployments
- **Closing** - "That's a quick overview of UserSphere. The code is available on GitHub, and I'm happy to answer any questions about the implementation."

---

## Tips for Recording

- **Pace**: Speak clearly, don't rush
- **Screen**: Use a clean desktop, close unnecessary tabs
- **Zoom**: Zoom in on code when showing it (Ctrl/Cmd + Plus)
- **Cursor**: Move cursor slowly when highlighting code
- **Transitions**: Use smooth transitions between sections
- **Practice**: Run through once before recording to ensure smooth flow

---

## Key Points to Emphasize

1. ✅ **TypeScript strictness** - No `any` types, proper typing throughout
2. ✅ **Optimistic updates** - Smooth UX despite fake API
3. ✅ **Accessibility** - Radix UI components, proper ARIA labels
4. ✅ **State management** - Zustand with persistence
5. ✅ **Code organization** - Clean folder structure, separation of concerns
6. ✅ **Modern patterns** - React Query, custom hooks, optimistic mutations

