# Ajaia Docs – Collaborative Document Editor

## Live Demo
https://github.com/yadavrky73/-Ajaia-LLC-Assignment.git

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps
1. Extract or clone this project
2. Run `npm install`
3. Set up database: `npx prisma db push`
4. Run `npm run dev`
5. Open `http://localhost:3000`

### Test Accounts
- **Alice** (owner): alice@example.com
- **Bob** (collaborator): bob@example.com

## Features
- ✅ Create, rename, edit documents (rich text: bold, italic, headings, lists)
- ✅ Upload `.txt` file to create a new document
- ✅ Share documents with other users (view/edit)
- ✅ Owner vs shared document view
- ✅ Persistent storage (SQLite)

## Tradeoffs & Next Steps
See `ARCHITECTURE.md` and `AI_WORKFLOW.md`.