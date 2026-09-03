# Tomato projects - Form service

## Quick Facts

- **Stack**: Next.js, NestJS, TypeScript, shadcn/ui, React Query, Formik, Zod
- **Frontend**: Next.js with React Query, Formik, Zod, shadcn/ui
- **Backend**: NestJS with Prisma (PostgreSQL), REST API, class-validator
- **Package Manager**: pnpm
- **Monorepo**: Turborepo (`server`, `web`)
- **Test Command**: `pnpm test`
- **Lint Command**: `pnpm lint`
- **Build Command**: `pnpm build`

## Key Directories

### Frontend (`web/src/`)

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components (shadcn/ui + custom)
- `features/` - Feature-grouped business logic (auth, enterprise, user, etc.)
- `services/` - API client service layer
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `lib/` - Utilities and helpers

### Backend (`server/src/`)

- `board/` - Board management module
- `submission/` - Submission management module
- `template/` - Template management module
- `template-version/` - Template versioning module
- `user/` - User management module
- `mail/` - Mail sending module
- `rabbitmq/` - RabbitMQ messaging module
- `health/` - Health check module
- `common/` - Shared decorators, guards, filters, interceptors
- `database/` - Prisma schema, migrations, generated client
- `config/` - Environment configuration

Note: there is currently no auth/RBAC module — endpoints are not guarded and there is no `enterpriseId`/tenant scoping on any model yet.

## API docs

- API docs available at `/api/docs` (Swagger UI)
- API docs json schema at `/api/docs-json` (OpenAPI spec)
- Use `@nestjs/swagger` decorators to keep docs up-to-date with code
- Always update API docs when adding/modifying endpoints
- Always exist response schemas for all endpoints, including error responses

## Code Style

- TypeScript strict mode enabled
- Prefer `interface` over `type` (except unions/intersections)
- No `any` - use `unknown` instead
- Use early returns, avoid nested conditionals
- Prefer composition over inheritance

## Git Conventions

- **Branch naming**: `{initials}/{description}` (e.g., `feat/fix-login`)
- **Commit format**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **PR titles**: Same as commit format

## Critical Rules

- Avoid run project
- Avoid run eslint, typecheck.
- Avoid using generic words in function names.
- If exist `TASK.md`, mark completed tasks.
- Read `./docs` as context

### Error Handling

- NEVER swallow errors silently
- Always show user feedback for errors
- Log errors for debugging

### UI States

- Always handle: loading, error, empty, success states
- Show loading ONLY when no data exists
- Every list needs an empty state

### Mutations

- Disable buttons during async operations
- Show loading indicator on buttons
- Always have onError handler with user feedback

### Backend

- Every tenant-scoped document must include `enterpriseId`
- RBAC permissions must always be enforced — never bypassed
- Business logic in services, not controllers
- Always validate DTOs with class-validator

### Database

- Using uuid for identifiers instead of ObjectId
- Always define indexes for query performance
- Use transactions for multi-document operations
- Use `uuid` for id fields.

## Testing

- Write failing test first (TDD)
- Use factory pattern: `getMockX(overrides)`
- Test behavior, not implementation
- Run tests before committing

## Skill Activation

Before implementing ANY task, check if relevant skills apply:

- Creating tests → `testing-patterns` skill
- Building forms → `formik-patterns` skill
- Debugging issues → `systematic-debugging` skill
- UI components → `react-ui-patterns` skill

## Common Commands

```bash
# From repo root (Turborepo)
pnpm dev             # Start all apps in dev mode
pnpm build           # Build all apps
pnpm test            # Run all tests
pnpm lint            # Lint all apps
pnpm typecheck       # Type-check all apps

# Per-app (from server or web)
pnpm dev             # Start this app only
pnpm test            # Run tests for this app

# Git
gh pr create         # Create PR
```
