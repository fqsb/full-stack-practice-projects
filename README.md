# Full Stack Practice Projects

This repository contains cleaned, public-safe versions of several learning projects.

## Projects

- `campus-activity-management-system/`
  - `frontend/`: React + Ant Design campus activity management UI.
  - `backend/`: Express + MongoDB API with JWT authentication, role-based access control, activities, registrations, approvals, notifications, and admin user management.
- `nextjs-blog-app/`
  - Next.js blog demo with Markdown rendering, categories, tags, and comments stored in local mock data.
- `student-management-system-api/`
  - Express + MongoDB API for students and classes, including CRUD and simple statistics.

## Privacy Notes

Sensitive files and generated content are intentionally excluded:

- `.env` files
- `node_modules`
- build output such as `.next`, `build`, and `dist`
- zip archives
- local HTTP request files containing sample tokens, object IDs, or passwords

Use each `.env.example` as a template for local development.

## Quick Start

Install dependencies inside the project you want to run:

```bash
npm install
```

Copy the relevant `.env.example` to `.env`, update values for your local machine, then start the app with the script shown in that project's `package.json`.
