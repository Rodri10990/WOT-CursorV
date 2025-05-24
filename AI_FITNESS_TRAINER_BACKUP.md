# AI Fitness Trainer - Complete Code Backup

## Project Overview
Advanced AI-powered personal fitness companion with auto-save workout generation, conversational AI trainer, and PWA support optimized for Samsung S25 Ultra.

## Key Features
- ✅ AI Trainer with Gemini integration for natural conversations
- ✅ Auto-save workout generation with rich metadata
- ✅ Progressive Web App (PWA) with mobile optimization
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Modern React frontend with TypeScript
- ✅ Tab-based navigation optimized for mobile

## Recent Updates
- Fixed persistent "30-minute strength routine" auto-generation issue
- Removed equipment selector completely per user request
- Enhanced PWA manifest for Samsung S25 Ultra optimization
- Implemented auto-save functionality for AI-generated workouts
- Updated database schema with rich metadata fields
- Fixed storage imports and database table structure

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter routing
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Google Gemini API for conversations and workout generation
- **UI**: Shadcn/ui components, Radix UI primitives
- **State**: Zustand for client state management
- **Build**: Vite for development and bundling

## Environment Variables Required
```
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key (optional)
```

## Installation Instructions
1. Clone/copy all project files
2. Run `npm install` to install dependencies
3. Set up PostgreSQL database and add DATABASE_URL
4. Get Gemini API key and add to environment
5. Run `npm run db:push` to create database tables
6. Run `npm run dev` to start development server

## Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and stores
│   │   └── main.tsx        # App entry point
│   └── public/             # Static assets and PWA manifest
├── server/                 # Express backend
│   ├── helpers/            # AI integration helpers
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database layer
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schema
│   └── schema.ts           # Database schema and types
└── package.json            # Dependencies and scripts
```

## Key API Endpoints
- `GET /api/trainer/conversation` - Get AI conversation history
- `POST /api/trainer/message` - Send message to AI trainer
- `POST /api/generate-workout` - Generate and auto-save workout
- `GET /api/workouts` - Get user's workout library
- `POST /api/workouts` - Manual workout creation

## Database Schema
- `users` - User profiles and authentication
- `workouts` - AI-generated and manual workouts with rich metadata
- `exercises` - Exercise definitions and form guides
- `workout_exercises` - Many-to-many workout-exercise relationships
- `progress_entries` - User progress tracking
- `ai_conversations` - AI chat history and context

## Deployment Notes
- Optimized for Replit deployment
- PWA manifest configured for mobile installation
- Environment variables configured for production
- Database migrations handled by Drizzle ORM

---

Generated: $(date)
Version: Auto-save workout generation with database persistence