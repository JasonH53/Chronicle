GoalifyInvest MVP per PRD (Next.js + TypeScript + Tailwind + Prisma)

Quickstart

1) Copy env and set RBC creds

```bash
cp .env.example .env
# edit .env and set RBC_BASE_URL, RBC_TEAM_ID, RBC_TEAM_SECRET
```

2) Install and migrate

```bash
npm install
npx prisma migrate dev --name init
```

3) Run

```bash
npm run dev
```

Routes

- /signup: Create a user (registers client via API)
- /create-goal: Create a goal with manual portfolio type (MVP)
- /dashboard: View goals, current value, and transfer funds

API

- POST /api/register: get JWT (cached)
- POST /api/clients: create client and local user
- POST /api/goals: create portfolio + local goal
- GET /api/goals?userId=...: list user goals
- GET /api/portfolios/:id: current value
- POST /api/portfolios/:id: transfer funds
- POST /api/simulate: projection
