Overview  
GoalifyInvest is a web application designed to demystify investing for students by anchoring it to their real-life aspirations. The core problem students face with investing isn't a lack of ambition, but a disconnect; traditional platforms are abstract, focusing on percentages and market jargon. GoalifyInvest solves this by transforming abstract financial portfolios into tangible, visual goals.

It's built for post-secondary students who have some disposable income but feel intimidated by investing. Whether it's saving for a grad trip, a down payment on a car, or a new laptop for school, our platform makes the process intuitive, motivating, and directly tied to their life milestones. The value lies in shifting the user's mindset from "I'm investing in a 'balanced' portfolio" to "I'm investing in my trip to Spain."

Core Features  
1. Goal Creation Wizard

What it does: Allows users to define a financial goal with a name (e.g., "Grad Trip"), a target amount, and a target date.

Why it's important: This is the foundational feature that makes investing personal and relatable. It immediately connects the user's money to a meaningful outcome, increasing motivation and engagement.

How it works: A user is guided through a simple, multi-step form. They input the goal details. Upon completion, the backend communicates with the RBC InvestEase API to create a dedicated portfolio tailored to this specific goal.

2. Smart Portfolio Recommendation

What it does: Automatically suggests an appropriate investment strategy (e.g., conservative, balanced, growth) based on the timeline of the user's goal.

Why it's important: It removes the biggest point of friction for new investors: choosing the right portfolio. This feature makes an expert-level decision on behalf of the user, building confidence and simplifying the onboarding process.

How it works: The application uses a simple rules-based engine. For example:

Goal timeline < 12 months: Recommends very_conservative or conservative.

Goal timeline 12 - 36 months: Recommends balanced.

Goal timeline > 36 months: Recommends growth.
The selected strategy is then used in the type parameter when creating a portfolio via the API.

3. Visual Progress Tracker

What it does: A dashboard that displays each goal with a dynamic visual, such as a progress bar, a photo being "un-pixelated," or a plane moving across a map, representing the completion percentage.

Why it's important: It makes tracking progress rewarding and fun. Seeing a visual representation of their goal getting closer is far more motivating for a student than watching a number fluctuate on a chart.

How it works: The application fetches the current_value of the portfolio associated with the goal from the API. It then calculates the percentage complete relative to the target amount and updates the UI component accordingly.

4. Projection Power-Up

What it does: Shows the user a simulated future projection of their goal's growth based on their current investment.

Why it's important: This feature answers the user's key question: "Am I on track?" It gamifies saving by showing them how consistent contributions could help them reach their goal even faster, encouraging positive financial habits.

How it works: The feature leverages the /client/{clientId}/simulate API endpoint. It runs a simulation for a set number of months (e.g., 12) and displays the projectedValue in a clear, easy-to-understand message like, "At this rate, you could reach your goal 2 months early! 🚀".

User Experience  
User Persona

Name: Alex, the Ambitious Student

Age: 20

Occupation: 3rd-year University Student (Business)

Goals: Wants to save for a backpacking trip across Southeast Asia after graduation (~16 months away). Also wants to buy a reliable used car for internships.

Frustrations: Has a part-time job and some savings but finds traditional investing apps confusing. Doesn't know the difference between a "growth" and "balanced" portfolio and is afraid of making the wrong choice.

Key User Flows

Onboarding & First Goal:

Alex signs up. The app creates a client via the API.

Alex is immediately prompted to "Create your first goal."

He enters "Grad Trip," target $3500, and a date 16 months in the future.

The app recommends a balanced portfolio. Alex agrees.

The app creates the portfolio via the API and prompts him to make his first transfer.

Funding a Goal:

Alex logs in to the dashboard.

He sees his "Grad Trip" goal at 10% completion.

He clicks "Add Funds," enters $150 (from his client cash balance).

The app executes a transfer via the API. The visual progress bar updates.

Checking Progress & Projections:

A week later, Alex logs in to see his progress.

He clicks the "Projection Power-Up" button on his goal card.

A modal appears: "Looking good! If the market performs as projected, your current investment could be worth $550 in 12 months."

UI/UX Considerations

Mobile-First Design: The interface must be clean, responsive, and optimized for a mobile experience.

Minimal Jargon: Avoid financial terms. Instead of "portfolio," use "goal fund." Instead of "risk tolerance," use "timeline."

Visual & Encouraging: Use bright colors, celebratory animations for milestones, and positive reinforcement language.

Technical Architecture  
System Components

Frontend: A responsive single-page application (SPA) built with React.

Backend: A lightweight server using Node.js (Express). Its primary roles are to securely store the API key, map internal Goal models to API Portfolio IDs, and contain the "Smart Portfolio Recommendation" logic.

Third-Party API: The RBC InvestEase Hackathon API for all client, portfolio, and simulation operations.

Data Models

User (in our backend DB):

id (Primary Key)

clientId (Foreign Key from RBC API)

name

email

Goal (in our backend DB):

id (Primary Key)

userId (links to User)

portfolioId (Foreign Key from RBC API)

name (e.g., "Grad Trip")

targetAmount

targetDate

visualTheme (e.g., 'travel', 'vehicle')

APIs and Integrations

POST /teams/register: To get the team's JWT.

POST /clients: For user signup.

POST /clients/{clientId}/portfolios: To create a new portfolio for a goal.

POST /portfolios/{portfolioId}/transfer: To add money to a goal.

GET /portfolios/{portfolioId}: To fetch current_value for the visual tracker.

POST /client/{clientId}/simulate: For the "Projection Power-Up" feature.

Infrastructure Requirements

Frontend Hosting: Vercel or Netlify.

Backend Hosting: Heroku or Render.

Database: A simple PostgreSQL or MongoDB instance for storing the User/Goal mapping.

Development Roadmap  
Phase 1: Minimum Viable Product (MVP)

The goal is to get a single, core user flow working end-to-end.

User Authentication: User can sign up, creating a client with the API.

Basic Goal Creation: A form to create one goal. The user must manually select a portfolio type for now (removes recommendation logic from MVP scope).

Basic Funding: Ability to transfer funds from client cash to the goal's portfolio.

Simple Progress Display: A dashboard that shows the goal name, target amount, and current value as plain text.

Phase 2: Core Feature Enhancements

Implement Smart Portfolio Recommendation: Add the timeline-based logic to automate portfolio selection during goal creation.

Implement Visual Progress Tracker: Replace the plain text display with dynamic, visual progress bars/graphics.

Implement Projection Power-Up: Build the UI to call the simulate endpoint and display the projected value in a user-friendly way.

Phase 3: Future Enhancements (Post-Hackathon)

Multiple Goals: Allow users to create and manage multiple goals simultaneously.

Goal Templates: Pre-filled templates for common student goals ("First Car," "Textbooks," "Spring Break").

Push Notifications: Reminders and milestone celebrations to keep users engaged.

Contribution Scheduling: Set up recurring transfers to a goal.

Logical Dependency Chain
API Authentication (Foundation): First, build the backend service that can successfully register the team and get a JWT. This token is required for all subsequent steps.

User Creation (Client Endpoint): Build the frontend signup form and backend logic to hit the POST /clients endpoint. This establishes the user context.

Core Goal-to-Portfolio Link (Visible Frontend):

Build the "Create Goal" UI.

Upon submission, have the backend call POST /clients/{clientId}/portfolios.

Crucially, save the returned portfolioId in our database and link it to our internal Goal record.

This creates the first end-to-end, visible feature.

Displaying Data:

Build the basic dashboard UI.

Fetch the portfolioId from our database for the user's goal.

Use that ID to call GET /portfolios/{portfolioId} and display the current_value. This makes the app dynamic.

Adding Interactivity:

Build the "Add Funds" feature, which calls POST /portfolios/{portfolioId}/transfer.

Build the "Projection Power-Up" feature, which calls POST /client/{clientId}/simulate.

UI Polish: With all core API logic working, focus on transforming the basic text displays into the rich, visual trackers.

Risks and Mitigations  
Risk: The logic mapping one "Goal" to one "Portfolio" could be complex.

Mitigation: Keep our backend data models simple. The database's only job is to be a "lookup table" connecting a goalId to a portfolioId. All financial logic is handled by the RBC API.

Risk: Scope creep; trying to build all the visual elements before the core functionality is solid.

Mitigation: Adhere strictly to the Logical Dependency Chain. Get API calls working with console.log and basic HTML elements first. Build the "pretty" UI components only after the data is flowing correctly.

Risk: Time constraints of a hackathon.

Mitigation: Focus entirely on the MVP scope for Phase 1. The "Smart Recommendation" and "Projection Power-Up" are fantastic stretch goals, but the core value is in creating a goal and funding it. Nail that flow first.

Appendix  
Research Findings: N/A for this PRD, but would typically include survey data on student saving habits.

Technical Specifications: The RBC InvestEase API documentation is the primary technical specification. We assume all endpoints will function as described. We also assume that new clients created via the API will start with a non-zero cash balance for testing purposes.

