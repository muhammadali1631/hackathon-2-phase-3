# Todo Application - Frontend

A modern, responsive todo application with a premium UI experience.

## Features

- **Authentication**: Secure login and signup with JWT-based authentication
- **Task Management**: Create, read, update, and delete tasks
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Mode**: Automatic dark/light mode detection with manual toggle
- **Accessibility**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- **Modern UI**: Clean, minimalist design with subtle animations and micro-interactions

## Tech Stack

- Next.js 16+ (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Better Auth

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the `frontend` directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env.local` file in the `frontend` directory with the following environment variables:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
```

5. Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── auth/           # Authentication components
│   ├── tasks/          # Task management components
│   ├── layout/         # Layout components
│   └── theme/          # Theme components
├── lib/                # Utility functions and services
├── styles/             # Global styles
├── hooks/              # Custom React hooks
├── providers/          # React context providers
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

## Environment Variables

- `NEXT_PUBLIC_BASE_URL`: Base URL of the frontend application
- `NEXT_PUBLIC_API_URL`: URL of the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL`: URL of the Better Auth service
- `BETTER_AUTH_SECRET`: Secret key for Better Auth (only needed on the backend)

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run linting checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.