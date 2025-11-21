# User Management Dashboard

A Next.js application for managing users with viewing, searching, filtering, adding, editing, and deleting capabilities.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Notes

This application uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a fake REST API for demonstration purposes.

### Important Limitations

- **POST/PUT/DELETE operations are simulated**: JSONPlaceholder doesn't actually persist changes. It returns success responses but doesn't modify data on the server.
- **Optimistic updates**: The app uses React Query's optimistic updates to immediately reflect changes in the UI, which is necessary since the API doesn't persist mutations.
- **Data resets on refresh**: Since changes aren't persisted, refreshing the page will show the original data from JSONPlaceholder.

### What Would Change in a Real Backend

1. **Authentication & Authorization**: Add JWT tokens, role-based access control, and secure API endpoints.
2. **Data Persistence**: Implement actual database operations (PostgreSQL, MongoDB, etc.) with proper CRUD operations.
3. **Error Handling**: Real backend would return proper error codes and messages for validation failures, conflicts, etc.
4. **Pagination**: Server-side pagination instead of client-side filtering/slicing.
5. **Search & Filtering**: Backend endpoints for search and filtering to handle large datasets efficiently.
6. **Validation**: Server-side validation for all inputs before persisting to database.
7. **Rate Limiting**: Protect API endpoints from abuse.
8. **Caching Strategy**: Implement proper cache invalidation and refresh strategies.
9. **Real-time Updates**: WebSocket or Server-Sent Events for live updates across clients.
10. **Audit Logging**: Server-side activity logging for compliance and debugging.

## Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

