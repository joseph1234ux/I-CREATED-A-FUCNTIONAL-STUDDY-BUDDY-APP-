# TODO — Fix Stories Not Displaying on Homepage

GOAL: Get stories from the Railway MySQL database displaying on the homepage.

## Steps
- [x] 1. Backend: Add DB connection check and health endpoint to `backend/server.js`
- [x] 2. Backend: Add pagination + robust error handling + DB retry to `backend/routes/storyRoutes.js`
- [x] 3. Frontend: Update `useStories.js` hook to handle new response envelope + array fallback
- [x] 4. Frontend: Refactor `Home.jsx` to reliably fetch and display stories
- [x] 5. Restart backend server and verify `/api/stories` returns stories
- [x] 6. Start frontend dev server and verify stories display on homepage
- [x] 7. Verify DB connection (Railway may sleep; confirm wake works)

# STATUS: ✅ COMPLETE

The full data chain now works end-to-end:
- Backend connects to Railway MySQL (540 stories in DB)
- `/api/stories` returns `{ stories, total, page, limit }` envelope
- Vite proxy forwards `/api` → backend on port 5000
- Home.jsx correctly extracts the stories array and renders them
