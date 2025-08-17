const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Phoolse Fayda Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Simple auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email && password) {
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { email, id: '123' },
      token: 'fake-jwt-token'
    });
  } else {
    res.status(400).json({ success: false, message: 'Email and password required' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple Backend running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
});
