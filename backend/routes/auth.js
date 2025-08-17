const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const aptosService = require('../services/aptosService');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('address.street').optional().trim().isLength({ min: 5 }).withMessage('Street address must be at least 5 characters'),
  body('address.city').optional().trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('address.state').optional().trim().isLength({ min: 2 }).withMessage('State must be at least 2 characters'),
  body('address.pincode').optional().matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      address
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data (without password) and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   POST /api/auth/connect-wallet
// @desc    Connect Aptos wallet to user account
// @access  Private
router.post('/connect-wallet', async (req, res) => {
  try {
    const { walletAddress, publicKey } = req.body;

    if (!walletAddress || !publicKey) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and public key are required'
      });
    }

    // Validate Aptos address format
    if (!/^0x[a-fA-F0-9]{64}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aptos wallet address format'
      });
    }

    // Check if wallet is already connected to another account
    const existingWalletUser = await User.findOne({
      'aptosWallet.address': walletAddress,
      _id: { $ne: req.user.userId }
    });

    if (existingWalletUser) {
      return res.status(400).json({
        success: false,
        message: 'This wallet is already connected to another account'
      });
    }

    // Update user's wallet information
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.aptosWallet = {
      address: walletAddress,
      publicKey,
      isConnected: true
    };

    await user.save();

    // Get wallet balance
    const balance = await aptosService.getBalance(walletAddress);

    res.json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        wallet: user.aptosWallet,
        balance
      }
    });

  } catch (error) {
    console.error('Wallet connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   POST /api/auth/disconnect-wallet
// @desc    Disconnect Aptos wallet from user account
// @access  Private
router.post('/disconnect-wallet', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Disconnect wallet
    user.aptosWallet = {
      address: null,
      publicKey: null,
      isConnected: false
    };

    await user.save();

    res.json({
      success: true,
      message: 'Wallet disconnected successfully'
    });

  } catch (error) {
    console.error('Wallet disconnection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get wallet balance if connected
    let walletData = null;
    if (user.aptosWallet.isConnected) {
      const balance = await aptosService.getBalance(user.aptosWallet.address);
      walletData = {
        ...user.aptosWallet.toObject(),
        balance
      };
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
        wallet: walletData
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh-token', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password-reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    // For now, just return the token
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email',
      data: {
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.type !== 'password-reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Update user password
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;
