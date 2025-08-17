const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  // Basic pickup information
  pickupId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'PKP' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Location details
  locationType: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'temple', 'event', 'other']
  },
  locationName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  binId: String,
  
  // Pickup details
  estimatedWeight: {
    type: Number,
    required: true,
    min: [0.1, 'Weight must be at least 0.1 kg']
  },
  actualWeight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  flowerTypes: [{
    type: String,
    enum: ['rose', 'marigold', 'jasmine', 'lotus', 'tulsi', 'other']
  }],
  
  // Scheduling
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon', 'evening', 'anytime']
  },
  scheduledDate: Date,
  scheduledTime: String,
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in-transit', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Contact information
  contactName: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  notes: String,
  
  // Images
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Blockchain integration
  blockchainTx: {
    txHash: String,
    blockNumber: Number,
    timestamp: Date,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending'
    }
  },
  
  // Points and rewards
  pointsEarned: {
    type: Number,
    default: 0
  },
  rewardAmount: {
    type: Number,
    default: 0
  },
  
  // Timestamps for different stages
  requestedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  assignedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  
  // Cancellation details
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Feedback and rating
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  
  // Environmental impact
  environmentalImpact: {
    co2Saved: Number, // in kg
    treesEquivalent: Number,
    waterSaved: Number // in liters
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for pickup duration
pickupSchema.virtual('duration').get(function() {
  if (this.startedAt && this.completedAt) {
    return this.completedAt - this.startedAt;
  }
  return null;
});

// Virtual for status duration
pickupSchema.virtual('statusDuration').get(function() {
  const now = new Date();
  switch (this.status) {
    case 'pending':
      return this.confirmedAt ? this.confirmedAt - this.requestedAt : now - this.requestedAt;
    case 'confirmed':
      return this.assignedAt ? this.assignedAt - this.confirmedAt : now - this.confirmedAt;
    case 'assigned':
      return this.startedAt ? this.startedAt - this.assignedAt : now - this.assignedAt;
    case 'in-transit':
      return this.completedAt ? this.completedAt - this.startedAt : now - this.startedAt;
    default:
      return null;
  }
});

// Indexes for better query performance
pickupSchema.index({ userId: 1 });
pickupSchema.index({ collectorId: 1 });
pickupSchema.index({ status: 1 });
pickupSchema.index({ 'address.coordinates': '2dsphere' });
pickupSchema.index({ preferredDate: 1 });
pickupSchema.index({ createdAt: -1 });
pickupSchema.index({ pickupId: 1 });

// Pre-save middleware to calculate points
pickupSchema.pre('save', function(next) {
  if (this.isModified('actualWeight') && this.actualWeight > 0) {
    // Calculate points based on weight (1 kg = 10 points)
    this.pointsEarned = Math.floor(this.actualWeight * 10);
    
    // Calculate environmental impact
    this.environmentalImpact = {
      co2Saved: this.actualWeight * 0.5, // 0.5 kg CO2 saved per kg of flowers
      treesEquivalent: this.actualWeight * 0.1, // 0.1 trees equivalent
      waterSaved: this.actualWeight * 2 // 2 liters of water saved
    };
  }
  next();
});

// Static method to get pickup statistics
pickupSchema.statics.getStats = async function() {
  return await this.aggregate([
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
};

// Instance method to update status
pickupSchema.methods.updateStatus = function(newStatus, userId = null) {
  this.status = newStatus;
  
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = new Date();
      break;
    case 'assigned':
      this.assignedAt = new Date();
      break;
    case 'in-transit':
      this.startedAt = new Date();
      break;
    case 'completed':
      this.completedAt = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      if (userId) this.cancelledBy = userId;
      break;
  }
  
  return this.save();
};

module.exports = mongoose.model('Pickup', pickupSchema);
