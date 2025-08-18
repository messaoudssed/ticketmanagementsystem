# Ticket Management System — Backend (Step 1)

**Stack:** Node.js, Express.js, MongoDB (Mongoose)  
**Date:** 2025-08-18

This Step 1 deliverable sets up the **project structure**, **MongoDB connection**, and **basic ticket management API** (CRUD).

## Quick start
```bash
cd server
cp .env.example .env
npm install
npm run dev
# Health check
curl http://localhost:5000/health
```

## Environment
- `PORT` — default 5000
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — reserved for Step 2 (auth); middleware stub included

## API (initial)
- `GET /health` → `{ status: 'ok' }`
- `GET /api/tickets` — list tickets
- `POST /api/tickets` — create ticket
- `GET /api/tickets/:id` — get ticket
- `PATCH /api/tickets/:id` — update ticket
- `DELETE /api/tickets/:id` — delete ticket

> In Step 2 we'll add **auth (JWT)** and scope tickets to each user.
