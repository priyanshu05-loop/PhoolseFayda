const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Enable CORS for frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Test pickup endpoint
app.post('/api/pickups', (req, res) => {
  console.log('Received pickup request:', req.body);
  
  // Simulate processing delay
  setTimeout(() => {
    const pickupId = 'PKP' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const pickup = {
      pickupId,
      ...req.body,
      status: 'pending',
      requestedAt: new Date(),
      _id: 'test-id-' + Date.now()
    };
    
    console.log('Created pickup:', pickup);
    
    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully',
      data: {
        pickup: pickup,
        blockchainTx: null
      }
    });
  }, 1000);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Phoolse Fayda Test Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test Backend is working!', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Test Backend running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
});
