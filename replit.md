# FLOREAANE Productivity Application

## Overview

FLOREAANE is a comprehensive productivity application built for personal task management, project tracking, and life organization. The application is designed with a modern full-stack architecture featuring a React frontend, Express backend, and PostgreSQL database. The interface supports Haitian Creole (Kreyòl) language throughout, providing a culturally-specific user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using **React 18** with **TypeScript** and **Vite** as the build tool. The UI framework leverages **shadcn/ui** components built on top of **Radix UI** primitives, providing a consistent and accessible design system. The styling is handled through **Tailwind CSS** with a custom dark theme featuring vibrant blue primary colors and lime green accents.

**Key Frontend Decisions:**
- **Problem**: Need for a modern, responsive UI with consistent components
- **Solution**: shadcn/ui + Radix UI + Tailwind CSS combination
- **Rationale**: Provides pre-built accessible components while maintaining design flexibility
- **Trade-offs**: Larger bundle size but significantly faster development and better accessibility

### Backend Architecture
The server uses **Express.js** with TypeScript running on Node.js. The architecture follows a modular approach with separate concerns for routing, database operations, and storage management.

**Key Backend Decisions:**
- **Problem**: Need for rapid development with type safety
- **Solution**: Express + TypeScript with modular structure
- **Rationale**: Express provides flexibility while TypeScript ensures type safety
- **Trade-offs**: More initial setup complexity but better maintainability

### Database Architecture
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The database is hosted on **Neon** (serverless PostgreSQL).

**Key Database Decisions:**
- **Problem**: Need for relational data with complex relationships
- **Solution**: PostgreSQL with Drizzle ORM
- **Rationale**: PostgreSQL handles complex relationships well, Drizzle provides excellent TypeScript integration
- **Trade-offs**: More complex than NoSQL but provides data integrity and complex queries

## Key Components

### 1. Dashboard System
- **MoodSelector**: Daily mood tracking with visual feedback
- **DayPreview**: Time-based task organization (morning, afternoon, evening)
- **AISuggestions**: Intelligent recommendations based on user patterns
- **QuickStats**: Real-time metrics for projects, tasks, finances, and contacts

### 2. Task Management (Agenda)
- Interactive calendar with task scheduling
- Task categorization with priority levels
- Time blocking and duration tracking
- Location and objective tagging
- Recurring task support

### 3. Project Management
- Project lifecycle tracking (planning, development, control, completed)
- Progress monitoring with visual indicators
- Budget and timeline management
- Team collaboration features
- Category-based organization

### 4. UI Component System
- Comprehensive component library based on shadcn/ui
- Custom theming with CSS variables
- Responsive design patterns
- Accessibility-first approach
- Toast notifications and modal dialogs

### 5. Storage Layer
The application implements a storage interface pattern with both in-memory and database implementations, allowing for flexible data persistence strategies.

## Data Flow

### Client-Server Communication
1. **Frontend** makes HTTP requests to Express API endpoints prefixed with `/api`
2. **Express middleware** handles request logging, JSON parsing, and error handling
3. **Route handlers** process business logic and interact with storage layer
4. **Storage interface** abstracts database operations through Drizzle ORM
5. **Database** operations are executed against PostgreSQL via Neon connection

### State Management
- **React Query** (@tanstack/react-query) handles server state management
- Local component state uses React hooks
- Form state managed through react-hook-form with Zod validation
- Toast notifications provide user feedback

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form** + **@hookform/resolvers**: Form handling with validation
- **zod**: Schema validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Vite dev server** with HMR for frontend development
- **tsx** for running TypeScript server code directly
- **Replit-specific optimizations** with runtime error overlay and cartographer integration

### Production Build
1. **Frontend**: Vite builds React app to static assets in `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations handle schema changes
4. **Deployment**: Single Node.js process serves both API and static files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection (development/production)
- **REPL_ID**: Replit-specific environment detection

The application is optimized for deployment on Replit with built-in development tools and error handling, but can be deployed to any Node.js hosting environment with PostgreSQL support.