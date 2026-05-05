# AI Workflow Note

## Tools Used
- GitHub Copilot (inline suggestions)
- ChatGPT-4 (architecture, code generation)

## Where AI helped
- Prisma schema and NextAuth boilerplate
- TipTap editor wrapper with toolbar
- File upload endpoint
- Share dialog component

## What I changed/rejected
- AI suggested WebSockets → rejected due to timebox
- AI proposed MongoDB → rejected for SQLite simplicity
- Simplified permission system to owner + view/edit

## Verification
- Manual end‑to‑end testing
- `npm test` for API test
- Cross‑browser editor checks (Chrome, Firefox)