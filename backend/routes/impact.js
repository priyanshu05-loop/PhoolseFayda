const express = require('express');
const Impact = require('../models/Impact');
const Pickup = require('../models/Pickup');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/impact/overview
// @desc    Get overall impact overview
// @access  Public
router.get('/overview', async (req, res) => {
  try {
    // Get all-time impact
    const allTimeImpact = await Impact.findOne({ period: 'all-time' });
    
    // Get current month impact
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const monthlyImpact = await Impact.findOne({
      period: 'monthly',
      startDate: monthStart,
      endDate: monthEnd
    });

    // Get current year impact
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);
    
    const yearlyImpact = await Impact.findOne({
      period: 'yearly',
      startDate: yearStart,
      endDate: yearEnd
    });

    // Calculate real-time stats from pickups
    const realTimeStats = await Pickup.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalPickups: { $sum: 1 },
          totalWeight: { $sum: '$actualWeight' },
          totalCO2Saved: { $sum: '$environmentalImpact.co2Saved' },
          totalTreesEquivalent: { $sum: '$environmentalImpact.treesEquivalent' },
          totalWaterSaved: { $sum: '$environmentalImpact.waterSaved' }
        }
      }
    ]);

    // Get top contributors
    const topContributors = await User.aggregate([
      { $match: { isActive: true } },
      { $sort: { totalPoints: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          totalPickups: 1,
          totalWeight: 1,
          totalPoints: 1,
          profileImage: 1
        }
      }
    ]);

    // Get city-wise impact
    const cityImpact = await Pickup.aggregate([
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
        allTime: allTimeImpact || {},
        monthly: monthlyImpact || {},
        yearly: yearlyImpact || {},
        realTime: realTimeStats[0] || {},
        topContributors,
        cityImpact,
        goals: {
          monthly: {
            target: 1000, // kg
            current: monthlyImpact?.totalWeight || 0,
            percentage: monthlyImpact ? (monthlyImpact.totalWeight / 1000) * 100 : 0
          },
          yearly: {
            target: 12000, // kg
            current: yearlyImpact?.totalWeight || 0,
            percentage: yearlyImpact ? (yearlyImpact.totalWeight / 12000) * 100 : 0
          }
        }
      }
    });
  } catch (error) {
    console.error('Get impact overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/impact/period/:period
// @desc    Get impact for specific period
// @access  Public
router.get('/period/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const { startDate, endDate } = req.query;

    let query = { period };
    
    if (startDate && endDate) {
      query.startDate = new Date(startDate);
      query.endDate = new Date(endDate);
    }

    const impact = await Impact.findOne(query);
    
    if (!impact) {
      return res.status(404).json({
        success: false,
        message: 'Impact data not found for this period'
      });
    }

    res.json({
      success: true,
      data: {
        impact
      }
    });
  } catch (error) {
    console.error('Get period impact error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/impact/leaderboard
// @desc    Get impact leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 20, period = 'all-time' } = req.query;
    
    let matchStage = {};
    if (period !== 'all-time') {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }
      
      if (startDate) {
        matchStage = { createdAt: { $gte: startDate } };
      }
    }

    const leaderboard = await User.aggregate([
      { $match: { isActive: true, ...matchStage } },
      {
        $project: {
          name: 1,
          totalPickups: 1,
          totalWeight: 1,
          totalPoints: 1,
          profileImage: 1,
          address: 1,
          role: 1
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: {
        leaderboard,
        period
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/impact/analytics
// @desc    Get detailed analytics
// @access  Public
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    const end = endDate ? new Date(endDate) : new Date();

    let groupStage;
    switch (groupBy) {
      case 'hour':
        groupStage = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
        break;
      case 'day':
        groupStage = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'week':
        groupStage = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'month':
        groupStage = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        groupStage = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const analytics = await Pickup.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: groupStage,
          pickups: { $sum: 1 },
          weight: { $sum: '$actualWeight' },
          co2Saved: { $sum: '$environmentalImpact.co2Saved' },
          treesEquivalent: { $sum: '$environmentalImpact.treesEquivalent' },
          waterSaved: { $sum: '$environmentalImpact.waterSaved' },
          points: { $sum: '$pointsEarned' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
    ]);

    // Get flower type breakdown
    const flowerBreakdown = await Pickup.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      { $unwind: '$flowerTypes' },
      {
        $group: {
          _id: '$flowerTypes',
          count: { $sum: 1 },
          weight: { $sum: '$actualWeight' }
        }
      },
      { $sort: { weight: -1 } }
    ]);

    // Get location type breakdown
    const locationBreakdown = await Pickup.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$locationType',
          count: { $sum: 1 },
          weight: { $sum: '$actualWeight' }
        }
      },
      { $sort: { weight: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        analytics,
        flowerBreakdown,
        locationBreakdown,
        period: { start, end },
        groupBy
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/impact/calculate
// @desc    Calculate impact for a period (admin only)
// @access  Private (Admin)
router.post('/calculate', async (req, res) => {
  try {
    const { startDate, endDate, period } = req.body;

    if (!startDate || !endDate || !period) {
      return res.status(400).json({
        success: false,
        message: 'Start date, end date, and period are required'
      });
    }

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

module.exports = router;
