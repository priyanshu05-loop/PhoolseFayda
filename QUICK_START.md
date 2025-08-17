# 🚀 Quick Start Guide - Phoolse Fayda App

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- npm or pnpm

## 🏃‍♂️ Quick Start

### Option 1: Use the provided scripts (Recommended)
1. **Windows Batch File**: Double-click `start-app.bat`
2. **PowerShell**: Right-click `start-app.ps1` → "Run with PowerShell"

### Option 2: Manual start
1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on: http://localhost:5000

2. **Start Frontend** (in a new terminal):
   ```bash
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

### Option 3: Use npm scripts
```bash
npm run dev:full  # Starts both frontend and backend
```

## 🔧 Configuration

### Backend Environment Variables
The backend will use default values, but you can customize by editing `backend/.env`:

```env
# MongoDB (required)
MONGODB_URI=mongodb://localhost:27017/phoolse-fayda

# JWT Secret (required)
JWT_SECRET=your-super-secret-jwt-key-here

# Aptos Blockchain (optional for basic functionality)
APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com
APTOS_PRIVATE_KEY=your-private-key
APTOS_MODULE_ADDRESS=your-module-address
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Docs**: http://localhost:5000/api

## 🚨 Troubleshooting

### Backend won't start?
1. Check if MongoDB is running
2. Verify all dependencies are installed: `cd backend && npm install`
3. Check the console for error messages

### Frontend won't start?
1. Verify dependencies: `npm install`
2. Check if port 3000 is available
3. Check the console for error messages

### MongoDB Connection Issues?
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `backend/.env`
3. Ensure MongoDB service is running

## 📱 Features Available

- ✅ User authentication
- ✅ Pickup request management
- ✅ Impact tracking
- ✅ Blockchain integration (Aptos)
- ✅ Admin dashboard
- ✅ Modern UI with Tailwind CSS

## 🎯 Next Steps

1. **Set up MongoDB**: Install locally or create a free MongoDB Atlas account
2. **Customize blockchain**: Add your Aptos private key and module address
3. **Seed data**: Run `cd backend && npm run seed` to add sample data
4. **Deploy**: Ready for production deployment

## 🆘 Need Help?

Check the console output for detailed error messages. The backend includes comprehensive logging to help debug issues.
