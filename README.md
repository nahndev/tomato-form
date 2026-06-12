# TOMATO (302) - Form Service

## Overview

TOMATO is a workflow-driven form platform designed to facilitate communication and collaboration across departments within an organization.

It enables teams to create structured processes where multiple users can contribute, review, approve, and enrich information throughout the lifecycle of a form submission.

All submissions are organized and tracked through management boards, providing visibility and control over business processes.

---

## Core Features

### Form Builder

Create and customize forms for a wide range of business processes.

Features include:

- Support for multiple field types and data formats
- Multi-step workflows
- Conditional logic and branching
- User assignments and role-based interactions
- Approval and confirmation stages
- Collaboration between multiple participants within the same process

---

### Shared Data Management

Manage centralized datasets that can be reused across forms and workflows.

Examples:

- Employees
- Departments
- Projects
- Customers
- Vendors

Capabilities:

- Reusable reference data
- Relationships between datasets
- Automatic synchronization and updates
- Workflow automation based on shared data

---

### Management Boards

Organize and monitor form submissions through configurable boards.

Features include:

- Board-based organization
- Advanced search and filtering
- Status tracking
- Process monitoring
- Team collaboration and oversight

---

## Typical Workflow

1. A manager creates a form and defines the workflow.
2. User A submits initial information.
3. User B reviews or provides additional details.
4. User C receives notifications and continues the process.
5. The submission progresses through predefined workflow stages.
6. All activities are tracked and managed through boards.

---

## Purpose

TOMATO aims to become a unified platform for internal business processes, replacing fragmented communication channels with structured, traceable, and collaborative workflows.

---

# Project Structure

Monorepo managed with [Turborepo](https://turbo.build/) and `pnpm` workspaces.

```
tomato-form/
├── website/                  # Next.js frontend (@tomato-form/website)
│   └── src/
│       ├── app/              # Next.js App Router pages and layouts
│       ├── components/       # Reusable UI components (shadcn/ui + custom)
│       │   └── ui/           # shadcn/ui primitives
│       └── lib/              # Utilities and helpers
└── server/                   # NestJS backend (@tomato-form/server)
    └── src/
        ├── common/           # Shared filters and interceptors
        │   ├── filters/
        │   └── interceptors/
        ├── config/           # Environment configuration
        ├── database/         # MongoDB connection config
        └── health/           # Health check endpoint
```

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | Next.js 15, React 18, React Query, Formik, Zod, Zustand |
| Styling  | Tailwind CSS v4, shadcn/ui, Radix UI                    |
| Backend  | NestJS 10, Mongoose (MongoDB), class-validator          |
| API Docs | Swagger UI at `/api/docs`                               |
| Tooling  | Turborepo, pnpm, TypeScript, Jest, ESLint               |

## Common Commands

```bash
# From repo root
pnpm dev        # Start all apps in dev mode
pnpm build      # Build all apps
pnpm test       # Run all tests
pnpm lint       # Lint all apps
pnpm typecheck  # Type-check all apps
```

## Ports

- Frontend: `http://localhost:3021`
- Backend: `http://localhost:3022`
- API Docs: `http://localhost:3022/api/docs`

## Database

- MongoDB connection string is configured.
- Using uuid for identifiers instead of ObjectId.
