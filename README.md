# PhoolSeFayda - Flower Waste Management App

Transform used flowers into eco-products while earning rewards. This Next.js application helps manage flower waste collection and promotes environmental sustainability.

## Features

- 🌸 **Flower Waste Management**: Request pickups and track collection status
- 🏆 **Leaderboard System**: Compete with others and earn points
- 📊 **Impact Tracking**: Monitor your environmental contribution
- 🎉 **Felicitation**: Celebrate achievements and milestones
- 🔐 **Secure Authentication**: Built with Clerk for robust user management

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Clerk
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Node.js, Express (separate backend folder)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clerk account for authentication

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd phoolse-fayda-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `env.example` to `.env.local`
   - Get your Clerk API keys from [Clerk Dashboard](https://dashboard.clerk.com)
   - Update the environment variables with your actual keys

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

The backend is located in the `backend/` folder:

```bash
cd backend
npm install
npm run dev
```

## Authentication with Clerk

This application uses Clerk for authentication. Key features:

- **Sign In/Sign Up**: Custom auth pages with Clerk components
- **Protected Routes**: Middleware-based route protection
- **User Management**: Clerk handles user profiles and sessions
- **Social Login**: Support for multiple authentication providers

### Setting up Clerk

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your API keys from the dashboard
4. Configure authentication methods and appearance
5. Update environment variables

See `CLERK_SETUP.md` for detailed setup instructions.

## Project Structure

```
phoolse-fayda-app/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and auth context
├── hooks/                 # Custom React hooks
├── public/                # Static assets
├── backend/               # Express.js backend server
├── middleware.ts          # Clerk authentication middleware
└── env.example           # Environment variables template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run backend` - Start backend server
- `npm run dev:full` - Start both frontend and backend

## Environment Variables

Create a `.env.local` file with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For authentication support, refer to:
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Support](https://clerk.com/support)

For general app support, please open an issue in the repository.
