# Quickstart Guide: Modern Frontend UI for Todo Application

**Feature**: 001-modern-frontend-ui
**Date**: 2026-01-05
**Status**: Complete

## Project Setup

### Prerequisites
- Node.js 18+
- npm or yarn package manager
- Git

### Initial Setup
1. Clone the repository
2. Navigate to the `frontend/` directory
3. Install dependencies: `npm install` or `yarn install`
4. Create `.env.local` file with required environment variables
5. Run development server: `npm run dev` or `yarn dev`

### Environment Variables
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
```

## Development Workflow

### Running the Application
- Development: `npm run dev` (hot reloading enabled)
- Build: `npm run build`
- Production: `npm start`

### Key Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run lint` - Run linting checks
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Key Directories and Files

### App Router Structure
```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Home page (redirects to dashboard if authenticated)
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── dashboard/          # Protected dashboard page
```

### Components Structure
```
frontend/components/
├── ui/                     # Reusable UI components
├── auth/                   # Authentication-related components
├── tasks/                  # Task management components
├── layout/                 # Layout components (sidebar, header, etc.)
└── theme/                  # Theme-related components
```

## API Integration

### API Service
- Located at `frontend/lib/api.ts`
- Handles JWT token attachment to all requests
- Implements error handling and response parsing
- Provides CRUD operations for tasks

### Authentication Service
- Located at `frontend/lib/auth.ts`
- Manages Better Auth integration
- Provides authentication state management
- Handles token refresh and storage

## Styling Guidelines

### Tailwind CSS
- All styling uses Tailwind utility classes
- Custom configuration in `tailwind.config.js`
- Design tokens defined for consistent colors, spacing, and typography
- Dark mode support using `dark:` variants

### Component Styling
- Components implement responsive design patterns
- Use of consistent spacing and sizing tokens
- Proper focus states for accessibility
- Smooth transitions for micro-interactions

## Testing

### Component Testing
- Unit tests using Jest and React Testing Library
- Focus on component behavior and user interactions
- Mock API calls and authentication state
- Test both light and dark mode rendering

### Accessibility Testing
- Verify proper semantic HTML structure
- Test keyboard navigation
- Validate ARIA attributes
- Check color contrast ratios

## Deployment

### Build Process
1. Run `npm run build` to create optimized production build
2. Serve the build output with a static server
3. Ensure environment variables are configured for target environment

### Environment Configuration
- Development: Local API endpoints
- Staging: Staging API endpoints
- Production: Production API endpoints