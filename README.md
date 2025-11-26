# TaskTrackr

A full-stack task manager with an Express/MongoDB backend and a Vite/React frontend. This guide captures everything needed to run the project locally and ship it safely.

## Prerequisites
- Node.js 20+
- npm 10+
- MongoDB Atlas cluster or accessible MongoDB instance

## Local Development

### Backend (`/backend`)
```bash
cd backend
npm install
npm run dev          # runs ts-node with nodemon
```
Environment variables live in `backend/.env` (see `.env.example` for the required keys).

### Frontend (`/frontend`)
```bash
cd frontend
npm install
npm run dev          # starts Vite on http://localhost:5173
```
Create a `.env` file (see `.env.example`) so the client knows where to find the API.

## Production Builds
- Backend: `npm run build --prefix backend` produces ESM output in `backend/dist`, then start with `npm run start --prefix backend`.
- Frontend: `npm run build --prefix frontend` outputs static assets to `frontend/dist` (serve via Netlify/Vercel or any static host).

## Environment Variables
| Scope    | Key         | Description                               |
|----------|-------------|-------------------------------------------|
| Backend  | `MONGO_URI` | Connection string for MongoDB             |
| Backend  | `PORT`      | Port for Express (defaults to `5000`)     |
| Frontend | `VITE_API_URL` | URL the client uses for API requests |

## Deployment Checklist
- [ ] Copy `.env.example` files to real `.env` files with production secrets.
- [ ] Run `npm run build --prefix backend` and `npm run build --prefix frontend`.
- [ ] Start the backend using `npm start --prefix backend` (or Docker/host equivalent) and verify `/health`.
- [ ] Serve `frontend/dist` from your hosting provider, pointing `VITE_API_URL` at the production backend URL.
- [ ] Configure CI (e.g., GitHub Actions) to run the build commands on each push before deploying.
- [ ] Monitor logs/metrics for the backend process after deploy.

## Useful Commands
- `npm test --prefix frontend` *(placeholder – add tests when ready)*
- `npm run lint --prefix frontend`
- `npm run dev --prefix backend` / `npm run dev --prefix frontend`

Update this file as your deployment process evolves so future deploys stay repeatable.

