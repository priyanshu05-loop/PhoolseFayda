const mongoose = require('mongoose');

const impactSchema = new mongoose.Schema({
  // Impact period
  period: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'all-time']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Environmental metrics
  totalFlowersCollected: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWeight: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // CO2 and environmental impact
  co2Saved: {
    type: Number,
    default: 0,
    min: 0
  },
  treesEquivalent: {
    type: Number,
    default: 0,
    min: 0
  },
  waterSaved: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Waste diversion metrics
  wasteDiverted: {
    type: Number,
    default: 0,
    min: 0
  },
  landfillSpaceSaved: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Economic impact
  totalPointsDistributed: {
    type: Number,
    default: 0,
    min: 0
  },
  totalRewardsGiven: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Participation metrics
  totalUsers: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPickups: {
    type: Number,
    default: 0,
    min: 0
  },
  activeCollectors: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Geographic impact
  citiesCovered: [{
    name: String,
    pickups: Number,
    weight: Number,
    impact: Number
  }],
  
  // Flower type breakdown
  flowerTypeBreakdown: [{
    type: String,
    count: Number,
    weight: Number,
    percentage: Number
  }],
  
  // Blockchain metrics
  blockchainTransactions: {
    total: {
      type: Number,
      default: 0
    },
    successful: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    }
  },
  
  // Sustainability goals
  goals: {
    monthlyTarget: {
      type: Number,
      default: 1000 // kg
    },
    yearlyTarget: {
      type: Number,
      default: 12000 // kg
    },
    achievementPercentage: {
      type: Number,
      default: 0
    }
  },
  
  // Additional metrics
  energySaved: {
    type: Number,
    default: 0
  },
  methaneEmissionReduced: {
    type: Number,
    default: 0
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isCalculated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for achievement percentage
impactSchema.virtual('achievementPercentage').get(function() {
  if (this.period === 'monthly' && this.goals.monthlyTarget > 0) {
    return Math.min((this.totalWeight / this.goals.monthlyTarget) * 100, 100);
  } else if (this.period === 'yearly' && this.goals.yearlyTarget > 0) {
    return Math.min((this.totalWeight / this.goals.yearlyTarget) * 100, 100);
  }
  return 0;
});

// Virtual for environmental score
impactSchema.virtual('environmentalScore').get(function() {
  let score = 0;
  
  // CO2 saved (max 30 points)
  if (this.co2Saved > 0) {
    score += Math.min((this.co2Saved / 100) * 30, 30);
  }
  
  // Trees equivalent (max 25 points)
  if (this.treesEquivalent > 0) {
    score += Math.min((this.treesEquivalent / 10) * 25, 25);
  }
  
  // Water saved (max 25 points)
  if (this.waterSaved > 0) {
    score += Math.min((this.waterSaved / 1000) * 25, 25);
  }
  
  // Waste diverted (max 20 points)
  if (this.wasteDiverted > 0) {
    score += Math.min((this.wasteDiverted / 100) * 20, 20);
  }
  
  return Math.round(score);
});

// Indexes for better query performance
impactSchema.index({ period: 1, startDate: 1, endDate: 1 });
impactSchema.index({ 'goals.achievementPercentage': -1 });
impactSchema.index({ totalWeight: -1 });
impactSchema.index({ co2Saved: -1 });

// Pre-save middleware to calculate derived fields
impactSchema.pre('save', function(next) {
  // Calculate achievement percentage
  if (this.period === 'monthly' && this.goals.monthlyTarget > 0) {
    this.goals.achievementPercentage = Math.min((this.totalWeight / this.goals.monthlyTarget) * 100, 100);
  } else if (this.period === 'yearly' && this.goals.yearlyTarget > 0) {
    this.goals.achievementPercentage = Math.min((this.totalWeight / this.goals.yearlyTarget) * 100, 100);
  }
  
  // Update last updated timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Static method to calculate impact for a period
impactSchema.statics.calculateImpact = async function(startDate, endDate, period = 'custom') {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Aggregate data from pickups
  const pickupData = await mongoose.model('Pickup').aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalPickups: { $sum: 1 },
        totalWeight: { $sum: '$actualWeight' },
        totalPoints: { $sum: '$pointsEarned' },
        totalCO2Saved: { $sum: '$environmentalImpact.co2Saved' },
        totalTreesEquivalent: { $sum: '$environmentalImpact.treesEquivalent' },
        totalWaterSaved: { $sum: '$environmentalImpact.waterSaved' }
      }
    }
  ]);
  
  if (pickupData.length === 0) {
    return null;
  }
  
  const data = pickupData[0];
  
  // Create or update impact record
  const impact = await this.findOneAndUpdate(
    { period, startDate: start, endDate: end },
    {
      totalPickups: data.totalPickups,
      totalWeight: data.totalWeight,
      totalPoints: data.totalPoints,
      co2Saved: data.totalCO2Saved,
      treesEquivalent: data.totalTreesEquivalent,
      waterSaved: data.totalWaterSaved,
      wasteDiverted: data.totalWeight,
      landfillSpaceSaved: data.totalWeight * 0.8, // 80% of weight as landfill space
      totalPointsDistributed: data.totalPoints,
      isCalculated: true
    },
    { upsert: true, new: true }
  );
  
  return impact;
};

// Static method to get leaderboard data
impactSchema.statics.getLeaderboard = async function(limit = 10) {
  return await mongoose.model('User').aggregate([
    {
      $match: { isActive: true }
    },
    {
      $project: {
        name: 1,
        totalPickups: 1,
        totalWeight: 1,
        totalPoints: 1,
        profileImage: 1,
        address: 1
      }
    },
    {
      $sort: { totalPoints: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

module.exports = mongoose.model('Impact', impactSchema);
