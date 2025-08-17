const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Pickup = require('../models/Pickup');
const Impact = require('../models/Impact');
const { requireAdmin } = require('../middleware/authenticate');

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
          verifiedUsers: { $sum: { $cond: ['$isVerified', 1, 0] } },
          usersWithWallet: { $sum: { $cond: ['$aptosWallet.isConnected', 1, 0] } }
        }
      }
    ]);

    // Get role breakdown
    const roleBreakdown = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get pickup statistics
    const pickupStats = await Pickup.aggregate([
      {
        $group: {
          _id: null,
          totalPickups: { $sum: 1 },
          completedPickups: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pendingPickups: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          totalWeight: { $sum: '$actualWeight' },
          totalPoints: { $sum: '$pointsEarned' }
        }
      }
    ]);

    // Get status breakdown
    const statusBreakdown = await Pickup.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent pickups
    const recentPickups = await Pickup.find()
      .populate('userId', 'name email')
      .populate('collectorId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('pickupId status locationName address actualWeight createdAt');

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role isActive createdAt');

    // Get environmental impact
    const environmentalImpact = await Pickup.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalCO2Saved: { $sum: '$environmentalImpact.co2Saved' },
          totalTreesEquivalent: { $sum: '$environmentalImpact.treesEquivalent' },
          totalWaterSaved: { $sum: '$environmentalImpact.waterSaved' }
        }
      }
    ]);

    // Get city-wise statistics
    const cityStats = await Pickup.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$address.city',
          pickups: { $sum: 1 },
          weight: { $sum: '$actualWeight' },
          impact: { $sum: '$environmentalImpact.co2Saved' }
        }
      },
      { $sort: { impact: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        userStats: userStats[0] || {},
        roleBreakdown,
        pickupStats: pickupStats[0] || {},
        statusBreakdown,
        recentPickups,
        recentUsers,
        environmentalImpact: environmentalImpact[0] || {},
        cityStats
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, status } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total,
          usersPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/admin/pickups
// @desc    Get all pickups with pagination
// @access  Private (Admin)
router.get('/pickups', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, locationType, startDate, endDate } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (locationType) {
      query.locationType = locationType;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [pickups, total] = await Promise.all([
      Pickup.find(query)
        .populate('userId', 'name email')
        .populate('collectorId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Pickup.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        pickups,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalPickups: total,
          pickupsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (admin only)
// @access  Private (Admin)
router.put('/users/:id', [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('role').optional().isIn(['user', 'collector', 'admin']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, role, isActive, isVerified } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/admin/pickups/:id/assign
// @desc    Assign pickup to collector
// @access  Private (Admin)
router.put('/pickups/:id/assign', [
  body('collectorId').isMongoId().withMessage('Valid collector ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { collectorId } = req.body;

    // Check if collector exists and has collector role
    const collector = await User.findOne({ _id: collectorId, role: 'collector' });
    if (!collector) {
      return res.status(400).json({
        success: false,
        message: 'Collector not found or invalid role'
      });
    }

    const pickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      {
        collectorId,
        status: 'assigned',
        assignedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email')
     .populate('collectorId', 'name email');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    res.json({
      success: true,
      message: 'Pickup assigned successfully',
      data: {
        pickup
      }
    });
  } catch (error) {
    console.error('Assign pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/admin/impact/calculate
// @desc    Calculate impact for a period
// @access  Private (Admin)
router.post('/impact/calculate', [
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('period').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Valid period is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { startDate, endDate, period } = req.body;

    const impact = await Impact.calculateImpact(startDate, endDate, period);

    if (!impact) {
      return res.status(404).json({
        success: false,
        message: 'No pickup data found for this period'
      });
    }

    res.json({
      success: true,
      message: 'Impact calculated successfully',
      data: {
        impact
      }
    });
  } catch (error) {
    console.error('Calculate impact error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/admin/reports
// @desc    Get various reports
// @access  Private (Admin)
router.get('/reports', async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let reportData = {};

    switch (type) {
      case 'pickup-trends':
        reportData = await Pickup.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
              },
              count: { $sum: 1 },
              weight: { $sum: '$actualWeight' }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);
        break;

      case 'user-growth':
        reportData = await User.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              newUsers: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        break;

      case 'location-analysis':
        reportData = await Pickup.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end },
              status: 'completed'
            }
          },
          {
            $group: {
              _id: '$address.city',
              pickups: { $sum: 1 },
              weight: { $sum: '$actualWeight' },
              impact: { $sum: '$environmentalImpact.co2Saved' }
            }
          },
          { $sort: { impact: -1 } }
        ]);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    res.json({
      success: true,
      data: {
        reportType: type,
        period: { start, end },
        data: reportData
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
