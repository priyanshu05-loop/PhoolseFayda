# PhoolSeFayda - Flower Waste Management App

Transform used flowers into eco-products while earning rewards. This Next.js application helps manage flower waste collection and promotes environmental sustainability with **blockchain-powered transparency and rewards**.

## 🌟 Key Features

- 🌸 **Flower Waste Management**: Request pickups and track collection status
- 🏆 **Leaderboard System**: Compete with others and earn points
- 📊 **Impact Tracking**: Monitor your environmental contribution
- 🎉 **Felicitation**: Celebrate achievements and milestones
- 🔐 **Secure Authentication**: Built with Clerk for robust user management
- ⛓️ **Blockchain Integration**: Aptos blockchain for transparent waste tracking and rewards

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Clerk
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Node.js, Express (separate backend folder)
- **Blockchain**: **Aptos Blockchain** for decentralized waste tracking and rewards
- **Database**: MongoDB for user data and pickup records

## ⛓️ Aptos Blockchain Integration

### Why Aptos?

PhoolSeFayda integrates with **Aptos blockchain** to provide:

- **🔒 Immutable Records**: All flower waste pickups are permanently recorded on the blockchain
- **🎯 Transparent Rewards**: Points and achievements are verifiable and tamper-proof
- **🌍 Environmental Impact Tracking**: CO2 savings, water conservation, and waste diversion metrics are stored on-chain
- **💎 Tokenized Rewards**: Users can earn and claim rewards through smart contracts
- **📱 Wallet Integration**: Connect Aptos wallets for seamless blockchain interactions

### Blockchain Features

- **Smart Contract Integration**: Custom Aptos Move modules for waste management
- **Real-time Transactions**: Instant recording of pickups and status updates
- **Verifiable Impact**: Environmental metrics stored on-chain for transparency
- **Reward System**: Blockchain-based point system with smart contract execution
- **Wallet Connectivity**: Support for Aptos wallet integration

### Aptos Network Support

- **Testnet**: Development and testing environment
- **Mainnet**: Production blockchain deployment
- **Faucet Integration**: Test token distribution for development

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clerk account for authentication
- **Aptos wallet** (Petra, Martian, or other Aptos-compatible wallets)
- MongoDB database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/priyanshu05-loop/PhoolseFayda.git
cd phoolse-fayda-app
```

2. Install dependencies:
```bash
npm install
cd backend && npm install
```

3. Set up environment variables:
   - Copy `backend/env.example` to `backend/.env`
   - Get your Clerk API keys from [Clerk Dashboard](https://dashboard.clerk.com)
   - Configure Aptos blockchain settings (see Blockchain Setup below)

4. Run the development server:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### 🔧 Blockchain Setup

Configure Aptos blockchain integration in `backend/.env`:

```env
# Aptos Blockchain Configuration
APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com
APTOS_FAUCET_URL=https://faucet.mainnet.aptoslabs.com
APTOS_PRIVATE_KEY=your-aptos-private-key
APTOS_MODULE_ADDRESS=your-module-address
```

**For Development/Testnet:**
```env
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com
APTOS_FAUCET_URL=https://faucet.testnet.aptoslabs.com
```

### Backend Setup

The backend includes blockchain services:

```bash
cd backend
npm install
npm run dev
```

## 🔐 Authentication with Clerk

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

## 📱 Wallet Integration

### Connecting Aptos Wallet

1. **Install Aptos Wallet**: Download Petra, Martian, or other Aptos wallets
2. **Create/Import Wallet**: Set up your Aptos wallet
3. **Connect in App**: Use the wallet connection feature in the app
4. **Verify Connection**: Check wallet status and balance

### Supported Wallet Features

- **Address Verification**: Validate Aptos wallet addresses
- **Balance Checking**: View APT token balances
- **Transaction History**: Track all blockchain interactions
- **Smart Contract Calls**: Execute waste management operations

## 🏗️ Project Structure

```
phoolse-fayda-app/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and auth context
├── hooks/                 # Custom React hooks
├── public/                # Static assets
├── backend/               # Express.js backend server
│   ├── services/         # Blockchain and business logic
│   │   └── aptosService.js # Aptos blockchain integration
│   ├── routes/           # API endpoints
│   │   └── blockchain.js # Blockchain-related routes
│   └── models/           # Database models
├── middleware.ts          # Clerk authentication middleware
└── env.example           # Environment variables template
```

## 📊 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run backend` - Start backend server
- `npm run dev:full` - Start both frontend and backend

## 🌐 Environment Variables

Create a `backend/.env` file with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Aptos Blockchain
APTOS_NODE_URL=https://fullnode.mainnet.aptoslabs.com
APTOS_FAUCET_URL=https://faucet.mainnet.aptoslabs.com
APTOS_PRIVATE_KEY=your-aptos-private-key
APTOS_MODULE_ADDRESS=your-module-address

# MongoDB
MONGODB_URI=mongodb://localhost:27017/phoolse-fayda
```

## 🔗 API Endpoints

### Blockchain Routes

- `GET /api/blockchain/status` - Check blockchain connection
- `POST /api/blockchain/connect-wallet` - Connect user wallet
- `GET /api/blockchain/wallet/:address` - Get wallet information
- `POST /api/blockchain/record-pickup` - Record pickup on blockchain
- `POST /api/blockchain/claim-rewards` - Claim rewards
- `GET /api/blockchain/transactions` - Get transaction history
- `GET /api/blockchain/stats` - Get blockchain statistics

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build
npm start
```

### Backend Deployment

```bash
cd backend
npm install
NODE_ENV=production npm start
```

### Blockchain Deployment

1. **Deploy Smart Contracts**: Deploy Move modules to Aptos mainnet
2. **Update Environment**: Set production Aptos node URLs
3. **Verify Contracts**: Ensure all smart contracts are verified
4. **Test Integration**: Verify blockchain functionality in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test blockchain integration
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For authentication support, refer to:
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Support](https://clerk.com/support)

For blockchain support:
- [Aptos Documentation](https://aptos.dev/)
- [Aptos Discord](https://discord.gg/aptos)

For general app support, please open an issue in the repository.

## 🌟 Why PhoolSeFayda?

PhoolSeFayda combines **environmental consciousness** with **blockchain technology** to create a transparent, rewarding system for flower waste management. By leveraging Aptos blockchain, we ensure:

- **Trust**: All operations are verifiable on-chain
- **Transparency**: Environmental impact is publicly accessible
- **Rewards**: Users earn points for sustainable actions
- **Innovation**: Cutting-edge blockchain technology for social good

Join us in making the world greener, one flower at a time! 🌸🌍⛓️
