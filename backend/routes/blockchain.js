const express = require('express');
const aptosService = require('../services/aptosService');
const Pickup = require('../models/Pickup');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/blockchain/status
// @desc    Get blockchain connection status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const status = await aptosService.getConnectionStatus();
    
    res.json({
      success: true,
      data: {
        status,
        network: process.env.APTOS_NODE_URL || 'https://fullnode.mainnet.aptoslabs.com',
        moduleAddress: process.env.APTOS_MODULE_ADDRESS
      }
    });
  } catch (error) {
    console.error('Get blockchain status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/blockchain/connect-wallet
// @desc    Connect user wallet to blockchain
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

    // Get wallet balance
    const balance = await aptosService.getBalance(walletAddress);

    // Update user's wallet information
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        aptosWallet: {
          address: walletAddress,
          publicKey,
          isConnected: true
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        wallet: user.aptosWallet,
        balance
      }
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/blockchain/wallet/:address
// @desc    Get wallet information
// @access  Public
router.get('/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!/^0x[a-fA-F0-9]{64}$/.test(address)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aptos wallet address format'
      });
    }

    const [balance, resources] = await Promise.all([
      aptosService.getBalance(address),
      aptosService.getResources(address)
    ]);

    res.json({
      success: true,
      data: {
        address,
        balance,
        resources
      }
    });
  } catch (error) {
    console.error('Get wallet info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/blockchain/record-pickup
// @desc    Record pickup on blockchain
// @access  Private
router.post('/record-pickup', async (req, res) => {
  try {
    const { pickupId } = req.body;

    if (!pickupId) {
      return res.status(400).json({
        success: false,
        message: 'Pickup ID is required'
      });
    }

    // Get pickup details
    const pickup = await Pickup.findOne({ pickupId }).populate('userId', 'aptosWallet');
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user has connected wallet
    if (!pickup.userId.aptosWallet.isConnected) {
      return res.status(400).json({
        success: false,
        message: 'User wallet not connected'
      });
    }

    // Record pickup on blockchain
    const transaction = await aptosService.recordPickup({
      pickupId: pickup.pickupId,
      estimatedWeight: pickup.actualWeight || pickup.estimatedWeight,
      locationType: pickup.address.city || 'Unknown',
      contactName: pickup.contactName || 'Unknown',
      preferredDate: pickup.createdAt
    });

    // Update pickup with blockchain transaction
    pickup.blockchainTx = {
      txHash: transaction.hash,
      blockNumber: transaction.blockNumber,
      timestamp: new Date(),
      status: 'confirmed'
    };

    await pickup.save();

    res.json({
      success: true,
      message: 'Pickup recorded on blockchain successfully',
      data: {
        transaction: pickup.blockchainTx
      }
    });
  } catch (error) {
    console.error('Record pickup on blockchain error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/blockchain/claim-rewards
// @desc    Claim rewards on blockchain
// @access  Private
router.post('/claim-rewards', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid reward amount is required'
      });
    }

    // Get user with wallet
    const user = await User.findById(req.user.userId);
    if (!user || !user.aptosWallet.isConnected) {
      return res.status(400).json({
        success: false,
        message: 'User wallet not connected'
      });
    }

    // Check if user has enough points
    if (user.totalPoints < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points to claim rewards'
      });
    }

    // Claim rewards on blockchain
    const transaction = await aptosService.claimRewards({
      userAddress: user.aptosWallet.address,
      amount,
      timestamp: new Date()
    });

    // Update user points
    user.totalPoints -= amount;
    await user.save();

    res.json({
      success: true,
      message: 'Rewards claimed successfully',
      data: {
        transaction: {
          txHash: transaction.hash,
          blockNumber: transaction.blockNumber,
          timestamp: new Date(),
          status: 'confirmed'
        },
        remainingPoints: user.totalPoints
      }
    });
  } catch (error) {
    console.error('Claim rewards error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/blockchain/transactions
// @desc    Get user's blockchain transactions
// @access  Private
router.get('/transactions', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    // Get user's pickups with blockchain transactions
    const pickups = await Pickup.find({
      userId: req.user.userId,
      'blockchainTx.txHash': { $exists: true }
    })
    .select('pickupId blockchainTx actualWeight createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset));

    // Get transaction details from blockchain
    const transactions = await Promise.all(
      pickups.map(async (pickup) => {
        try {
          const txDetails = await aptosService.getTransaction(pickup.blockchainTx.txHash);
          return {
            pickupId: pickup.pickupId,
            weight: pickup.actualWeight,
            transaction: {
              ...pickup.blockchainTx.toObject(),
              details: txDetails
            },
            createdAt: pickup.createdAt
          };
        } catch (error) {
          return {
            pickupId: pickup.pickupId,
            weight: pickup.actualWeight,
            transaction: pickup.blockchainTx,
            createdAt: pickup.createdAt,
            error: 'Failed to fetch transaction details'
          };
        }
      })
    );

    res.json({
      success: true,
      data: {
        transactions,
        total: await Pickup.countDocuments({
          userId: req.user.userId,
          'blockchainTx.txHash': { $exists: true }
        })
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/blockchain/stats
// @desc    Get blockchain statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    // Get total pickups recorded on blockchain
    const totalBlockchainPickups = await Pickup.countDocuments({
      'blockchainTx.txHash': { $exists: true }
    });

    // Get total weight recorded on blockchain
    const totalBlockchainWeight = await Pickup.aggregate([
      {
        $match: {
          'blockchainTx.txHash': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$actualWeight' }
        }
      }
    ]);

    // Get recent transactions
    const recentTransactions = await Pickup.find({
      'blockchainTx.txHash': { $exists: true }
    })
    .select('pickupId blockchainTx createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      success: true,
      data: {
        totalBlockchainPickups,
        totalBlockchainWeight: totalBlockchainWeight[0]?.totalWeight || 0,
        recentTransactions,
        networkStatus: await aptosService.getConnectionStatus()
      }
    });
  } catch (error) {
    console.error('Get blockchain stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
