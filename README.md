# User Management Dashboard

A modern, high-performance user management dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Features include real-time search with debouncing, optimistic UI updates, and comprehensive testing.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality
- 📋 **User Table** - Display users from JSONPlaceholder API
- 🔍 **Debounced Search** - Real-time search with 300ms debouncing for performance
- 🗑️ **Delete Functionality** - Remove users with confirmation dialog
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- ⚡ **Optimistic UI** - Instant feedback on user actions

### Technical Excellence
- 🎯 **TypeScript** - Full type safety throughout
- 🧪 **Comprehensive Testing** - Unit and integration tests with Jest
- 🚀 **Performance Optimized** - React.memo, useCallback, useMemo, and selective re-renders
- 🎨 **Modern UI** - ShadCN UI components with Tailwind CSS
- 🔄 **State Management** - Zustand for client state, React Query for server state
- 📦 **Production Ready** - Configured for Vercel deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd digis-demo-user-table

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
Deployed to Vercel at https://digis-demo-user-table-5tbu88blr-andriy-polukhins-projects.vercel.app

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Building
npm run build        # Create optimized production build
npm start           # Start production server

# Testing
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Linting
npm run lint        # Run ESLint
```

## 🏗️ Project Structure

```
digis-demo-user-table/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main dashboard page
│   ├── globals.css          # Global styles & Tailwind
│   └── providers.tsx        # React Query provider
│
├── components/
│   ├── ui/                  # ShadCN UI components
│   │   ├── table.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── alert-dialog.tsx
│   │
│   └── users/               # Feature components
│       ├── UserTable.tsx    # Main table container
│       ├── UserTableRow.tsx # Memoized table row
│       ├── SearchBar.tsx    # Debounced search
│       ├── DeleteDialog.tsx # Confirmation modal
│       └── EmptyState.tsx   # Empty state UI
│
├── lib/
│   ├── api/
│   │   └── users.ts         # API service layer (uses env vars)
│   │
│   ├── hooks/
│   │   ├── useUsers.ts      # React Query hook
│   │   └── useDebounce.ts   # Debounce custom hook
│   │
│   ├── store/
│   │   └── userStore.ts     # Zustand store
│   │
│   ├── types/
│   │   └── user.ts          # TypeScript types
│   │
│   └── utils/
│       ├── cn.ts            # Class name utility
│       └── security.ts      # Security utilities
│
├── __tests__/               # Test files
│   ├── components/
│   │   ├── UserTable.test.tsx
│   │   └── SearchBar.test.tsx
│   ├── hooks/
│   │   └── useDebounce.test.ts
│   ├── store/
│   │   └── userStore.test.ts
│   └── utils/
│       └── security.test.ts
│
├── docs/                    # Documentation
│   ├── technical.md         # Technical specifications
│   └── performance-optimizations.md
│
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables (git-ignored)
├── jest.config.ts           # Jest configuration
├── jest.setup.ts            # Jest setup file
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment config
```

## 🛠️ Technology Stack

### Core
- **Next.js 16.0** - React framework with App Router
- **React 19.2** - UI library with latest features
- **TypeScript 5.0** - Type-safe development

### State Management
- **Zustand 5.0** - Lightweight state management
- **React Query 5.90** - Server state management with caching

### UI & Styling
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **ShadCN UI** - Accessible component library
- **Lucide React** - Beautiful icon set
- **Radix UI** - Unstyled, accessible primitives

### Testing
- **Jest 30.2** - Testing framework
- **React Testing Library 16.3** - React component testing
- **@testing-library/user-event 14.6** - User interaction simulation
- **@testing-library/jest-dom 6.9** - Custom Jest matchers

### Development Tools
- **ESLint 9** - Code linting
- **babel-plugin-react-compiler** - React optimization



## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **Unit Tests**
  - `userStore.test.ts` - Zustand store logic
  - `useDebounce.test.ts` - Debounce hook
  
- **Integration Tests**
  - `UserTable.test.tsx` - Full table functionality
  - `SearchBar.test.tsx` - Search with debouncing

### Test Structure
```typescript
describe('UserTable Integration Tests', () => {
  it('should filter users by search', async () => {
    // Comprehensive integration tests
  });
});
```

## 📦 Deployment

This project is optimized for deployment on Vercel.

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Manual Deploy
1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Vercel auto-detects Next.js configuration
4. Click Deploy

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
```

**Available Environment Variables:**

| Variable | Description | Required | Default |
|----------|-------------|----------|----------|
| `NEXT_PUBLIC_API_URL` | API base URL for user data | No | `https://jsonplaceholder.typicode.com` |



### Next.js Config
- React Compiler enabled for automatic optimizations
- Compression enabled for smaller bundle sizes
- Security headers configured (CSP, XSS Protection)
- Image optimization with Next.js Image component
- App Router with React Server Components

### Vercel Config
- Security headers (XSS protection, CSP, HSTS)
- Proper routing configuration for SPA behavior
- Build optimization and caching strategies
- Environment variables auto-configured from dashboard

## 📈 Performance Metrics

### Target Metrics
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3.5s

### Optimizations Applied
✅ Code splitting via Next.js  
✅ React component memoization  
✅ Debounced search (300ms)  
✅ Selective state subscriptions  
✅ React Compiler optimizations  
✅ Production build minification  




## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [ShadCN UI](https://ui.shadcn.com/) - Component library
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Free fake API
- [Vercel](https://vercel.com/) - Hosting platform

---

**Built with ❤️ using Next.js 16 and React 19**
