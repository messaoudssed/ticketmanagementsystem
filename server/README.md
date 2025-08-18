# Ticket Management System — Backend (Phase 2)

**Phase:** User Authentication & Authorization  
**Date:** 2025-08-18

This update adds **JWT-based authentication**, a **User** model, and **per-user ticket scoping**.

## What changed
- Added **User model** (`name`, `username`, `email`, `passwordHash`, `role`).
- New endpoints:
  - `POST /api/auth/register` — create account
  - `POST /api/auth/login` — login with username/email + password
  - `GET /api/auth/me` — returns the authenticated user
- Added **JWT middleware** (`Authorization: Bearer <token>`).
- Tickets are now **associated to the creator** (`createdBy`) and **secured**:
  - **Users** can see **only their own** tickets and can update/delete only their tickets.
  - **Tech/Admin** can see **all** tickets and update/delete any.
