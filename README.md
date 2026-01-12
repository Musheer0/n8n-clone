# n8n Clone

A mini n8n clone built with Next.js, React Flow, and tRPC for creating and executing workflows.

## Features

- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark Mode** - Full dark/light theme support
- 🔐 **Authentication** - Better Auth with Redis integration
- 📊 **Workflow Editor** - Visual workflow builder using React Flow
- ⚡ **Real-time Execution** - Inngest for background job processing
- 🗄️ **Database** - PostgreSQL with Drizzle ORM
- 🔄 **tRPC** - End-to-end type safety

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **State Management**: Jotai, TanStack Query
- **Backend**: tRPC, Drizzle ORM
- **Database**: PostgreSQL
- **Auth**: Better Auth
- **Background Jobs**: Inngest
- **Cache**: Upstash Redis

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis instance (for auth caching)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd n8n-clone

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Set up your database and environment variables
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
AUTH_SECRET="your-secret-key"
REDIS_URL="redis://..."

# Inngest
INNGEST_EVENT_KEY="your-inngest-key"
INNGEST_SIGNING_KEY="your-signing-key"
```

### Running the App

```bash
# Start development server
pnpm dev

# Run database migrations
pnpm db:migrate

# Start Inngest dev server
pnpm inngest
```

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/            # Reusable UI components
├── features/              # Feature-specific components
│   ├── credentials/       # Credential management
│   ├── execution-history/ # Workflow execution history
│   ├── nodes/            # Workflow nodes (triggers, executors)
│   └── workflows/        # Workflow management
├── trpc/                 # tRPC setup
└── lib/                  # Utilities and helpers
```

## Current Features

### ✅ Completed
- Authentication system with GitHub OAuth
- Workflow CRUD operations
- Visual workflow editor with React Flow
- Node types: Manual trigger, HTTP executor, SMTP mail executor
- Credential management
- Execution history
- Dark mode support

### 🚧 In Progress
- More node types (Google Forms trigger, etc.)
- Workflow scheduling
- Advanced error handling

### 📋 Planned
- Workflow templates
- Team collaboration
- Advanced monitoring and analytics

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome
- `pnpm inngest` - Start Inngest dev server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the linter and tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.