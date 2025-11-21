# Commit History Plan

This document maps each development step to the files changed and suggested commit messages for creating a clean, logical git history.

## Step 0: Project Scaffold

**Files Changed:**
- `package.json`
- `tsconfig.json`
- `next.config.js`
- `postcss.config.js`
- `tailwind.config.js`
- `pages/_app.tsx`
- `styles/globals.css`
- `.gitignore`
- `README.md`

**Commit Message:**
```
chore: initial project scaffold
```

---

## Step 1: Types and API Layer

**Files Changed:**
- `src/types.ts`
- `src/lib/api/users.ts`
- `src/lib/reactQuery.ts`

**Commit Message:**
```
feat(api): add types and users fetchers
```

---

## Step 2: Layout and State Management

**Files Changed:**
- `src/components/Layout.tsx`
- `src/stores/useAppStore.ts`
- `pages/_app.tsx`
- `tailwind.config.js` (dark mode support)

**Commit Message:**
```
feat(ui): layout + zustand skeleton
```

---

## Step 3: Users Table (Read-Only)

**Files Changed:**
- `pages/users/index.tsx`
- `pages/index.tsx` (redirect to /users)

**Commit Message:**
```
feat(ui): users table (read-only)
```

---

## Step 4: Search, Sort, and Filter

**Files Changed:**
- `pages/users/index.tsx`

**Commit Message:**
```
feat(ui): add search, sort by email, company filter
```

---

## Step 5: Add/Edit User Modal

**Files Changed:**
- `src/components/UserDialog.tsx`
- `src/hooks/useUsers.ts`

**Commit Message:**
```
feat(user): add/edit modal + optimistic mutations
```

---

## Step 6: Integrate Add/Edit Modal

**Files Changed:**
- `pages/users/index.tsx`

**Commit Message:**
```
feat(user): integrate add/edit modal and basic validation
```

---

## Step 7: Delete User with Confirmation

**Files Changed:**
- `src/hooks/useUsers.ts` (add useDeleteUser)
- `pages/users/index.tsx`

**Commit Message:**
```
feat(user): delete with confirmation + optimistic update
```

---

## Step 8: Logged-in User and Dark Mode

**Files Changed:**
- `src/stores/useAppStore.ts`
- `src/components/Layout.tsx`

**Commit Message:**
```
feat(state): set logged-in user + dark mode persistence
```

---

## Step 9: Pagination

**Files Changed:**
- `pages/users/index.tsx`

**Commit Message:**
```
feat(ui): add pagination to users table
```

---

## Step 10: User Detail Page

**Files Changed:**
- `pages/users/[id].tsx`

**Commit Message:**
```
feat(route): add dynamic user detail page
```

---

## Step 11: Activity Log

**Files Changed:**
- `src/stores/useAppStore.ts` (extend with activityLog)
- `src/components/ActivityLog.tsx`
- `pages/users/index.tsx` (integrate activity log)

**Commit Message:**
```
feat(state): activity log + UI
```

---

## Step 12: Accessibility and Polish

**Files Changed:**
- `README.md`
- `styles/globals.css`

**Commit Message:**
```
style: accessibility & responsive polish
```

---

## Step 13: Server-Side Rendering with React Query

**Files Changed:**
- `pages/users/index.tsx` (add getServerSideProps)
- `pages/_app.tsx` (add HydrationBoundary)

**Commit Message:**
```
perf: add SSR prefetch + react-query dehydrate/hydrate for users list
```

---

## Step 14: Code Cleanup and Structure

**Files Changed:**
- `src/hooks/useUsers.ts` (remove duplicate fetchUsers/fetchUserById, import from api)
- `pages/users/index.tsx` (remove console.debug statements, unused queryClient)
- `src/lib/reactQuery.ts` (deleted - unused file)

**Commit Message:**
```
refactor: remove duplicate code and cleanup unused files
```

---

## Summary

Total commits: 14

Each commit represents a logical, incremental feature addition that can be reviewed and understood independently. This approach ensures:
- Clear progression of features
- Easy rollback if needed
- Better code review experience
- Clean git history for future reference

