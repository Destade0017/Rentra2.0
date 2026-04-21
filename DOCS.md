# Rentra: Technical System Documentation

## 1. System Overview
Rentra is a minimalist, high-fidelity property management SaaS tailored for small-scale landlords. It replaces fragmented data management with a centralized, insight-driven workspace.

## 2. Technical Stack
- **Frontend**: Next.js 14/15 (App Router), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express 5.
- **Database**: MongoDB Atlas (Mongoose ODM).
- **Authentication**: Stateless JWT (JSON Web Tokens).
- **Hosting**: Vercel (Frontend), Render (Backend).

## 3. Architecture
Decoupled client-server architecture using a RESTful API. The frontend is a stateless consumer, while the backend serves as a secured logic gateway.

## 4. Key Performance Wins
- **Inline Skeleton States**: Eliminates "flash of empty content" by rendering layout shells during API fetches.
- **Memoized Metrics**: Uses `useMemo` to prevent expensive re-calculations of portfolio summaries on every render.
- **Base64 Acquisition**: Self-contained image upload system for instant property media preview and storage.

## 5. Security & Reliability
- **BCrypt Hashing**: 10-round salt hashing for credential protection.
- **Protected Routes**: Client-side `AuthGuard` paired with server-side JWT verification middleware.
- **CORS Optimization**: Strict origin whitelisting for production safety.
