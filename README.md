# Willow

A web application that demystifies investing for students by anchoring it to their real-life aspirations.

## Overview

Willow transforms abstract financial portfolios into tangible, visual goals. Built for post-secondary students who have some disposable income but feel intimidated by investing, our platform makes the process intuitive, motivating, and directly tied to their life milestones.

## Team Registration

✅ **Team Successfully Registered**
- **Team Name**: Willow
- **Team ID**: `b93dff86-af54-4f74-9150-904e4cb7f134`
- **JWT Token**: Configured and ready to use
- **Token Expires**: September 23, 2025

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm run dev
```

The API server will start on `http://localhost:3001`

### 3. Test the API
```bash
# Health check
curl http://localhost:3001/api/health

# Register a user
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Alex Student", "email": "alex@example.com"}'
```

## API Endpoints

### Health Check
- `GET /api/health` - Check if the API is running

### User Management
- `POST /api/users/register` - Register a new user
  - Body: `{"name": "string", "email": "string"}`

### Goal Management
- `POST /api/goals` - Create a new goal (portfolio)
  - Body: `{"clientId": "string", "goalName": "string", "targetAmount": "number", "targetDate": "string", "portfolioType": "string"}`
- `GET /api/goals/:portfolioId` - Get goal progress
- `POST /api/goals/:portfolioId/fund` - Add funds to a goal
  - Body: `{"amount": "number"}`
- `POST /api/goals/:portfolioId/simulate` - Simulate goal growth
  - Body: `{"clientId": "string", "months": "number"}`

## Development Roadmap

### Phase 1: MVP (Current Focus)
- [x] Team registration and JWT setup
- [x] Backend API server with RBC integration
- [ ] User registration flow
- [ ] Basic goal creation
- [ ] Simple progress display
- [ ] Basic funding functionality

### Phase 2: Core Features
- [ ] Smart portfolio recommendation based on timeline
- [ ] Visual progress tracker
- [ ] Projection power-up feature

### Phase 3: Enhancements
- [ ] Multiple goals support
- [ ] Goal templates
- [ ] Push notifications
- [ ] Recurring contributions

## Technical Stack

- **Backend**: Node.js + Express
- **API Integration**: RBC InvestEase Hackathon API
- **Authentication**: JWT tokens
- **Database**: PostgreSQL (to be configured)

## Next Steps

1. Test the current API endpoints
2. Set up a database for storing user/goal mappings
3. Build the frontend React application
4. Implement the core user flows from the PRD

## Team Credentials

The JWT token is configured in `config.js` and will be used for all RBC API calls. The token expires on September 23, 2025, so you have plenty of time for development and testing.
