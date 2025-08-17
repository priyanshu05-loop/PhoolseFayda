const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const aptosService = require('../services/aptosService');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation middleware
const validatePickupRequest = [
  body('locationType').isIn(['residential', 'commercial', 'temple', 'event', 'other']).withMessage('Invalid location type'),
  body('locationName').trim().isLength({ min: 3, max: 100 }).withMessage('Location name must be between 3 and 100 characters'),
  body('estimatedWeight').isFloat({ min: 0.1 }).withMessage('Estimated weight must be at least 0.1 kg'),
  body('preferredDate').isISO8601().withMessage('Preferred date must be a valid date'),
  body('preferredTime').isIn(['morning', 'afternoon', 'evening', 'anytime']).withMessage('Invalid preferred time'),
  body('contactName').trim().isLength({ min: 2, max: 50 }).withMessage('Contact name must be between 2 and 50 characters'),
  body('contactPhone').matches(/^[0-9]{10}$/).withMessage('Contact phone must be a valid 10-digit number'),
  body('address.street').optional().trim().isLength({ min: 5 }).withMessage('Street address must be at least 5 characters'),
  body('address.city').optional().trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('address.state').optional().trim().isLength({ min: 2 }).withMessage('State must be at least 2 characters'),
  body('address.pincode').optional().matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
  body('address.coordinates.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('address.coordinates.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

const validatePickupUpdate = [
  body('status').optional().isIn(['pending', 'confirmed', 'assigned', 'in-transit', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('actualWeight').optional().isFloat({ min: 0 }).withMessage('Actual weight cannot be negative'),
  body('collectorId').optional().isMongoId().withMessage('Invalid collector ID'),
  body('scheduledDate').optional().isISO8601().withMessage('Scheduled date must be a valid date'),
  body('scheduledTime').optional().isIn(['morning', 'afternoon', 'evening']).withMessage('Invalid scheduled time')
];

// @route   POST /api/pickups
// @desc    Create a new pickup request
// @access  Public (but can be authenticated)
router.post('/', validatePickupRequest, async (req, res) => {
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

    const pickupData = req.body;
    
    // If user is authenticated, use their ID, otherwise create anonymous pickup
    if (req.user) {
      pickupData.userId = req.user.userId;
    }
    // For anonymous pickups, we don't set userId

    // Create pickup record
    const pickup = new Pickup(pickupData);
    await pickup.save();

    // Try to create blockchain record if user has wallet connected
    let blockchainTx = null;
    if (req.user) {
      const user = await User.findById(req.user.userId);
      if (user && user.aptosWallet && user.aptosWallet.isConnected) {
        try {
          blockchainTx = await aptosService.createPickupRecord({
            pickupId: pickup.pickupId,
            estimatedWeight: pickup.estimatedWeight,
            locationType: pickup.locationType,
            contactName: pickup.contactName,
            preferredDate: pickup.preferredDate
          });
          
          // Update pickup with blockchain transaction
          pickup.blockchainTx = blockchainTx;
          await pickup.save();
        } catch (blockchainError) {
          console.error('Blockchain transaction failed:', blockchainError);
          // Continue without blockchain integration
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Pickup request created successfully',
      data: {
        pickup: pickup.toObject(),
        blockchainTx
      }
    });

  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   GET /api/pickups
// @desc    Get all pickups with filtering and pagination
// @access  Public
router.get('/', [
  query('status').optional().isIn(['pending', 'confirmed', 'assigned', 'in-transit', 'completed', 'cancelled']),
  query('locationType').optional().isIn(['residential', 'commercial', 'temple', 'event', 'other']),
  query('city').optional().trim().isLength({ min: 2 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['createdAt', 'preferredDate', 'estimatedWeight', 'status']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
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

    const {
      status,
      locationType,
      city,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (locationType) filter.locationType = locationType;
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get pickups with pagination
    const pickups = await Pickup.find(filter)
      .populate('userId', 'name email phone')
      .populate('collectorId', 'name phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Pickup.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        pickups,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   GET /api/pickups/:id
// @desc    Get pickup by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('collectorId', 'name phone');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    res.json({
      success: true,
      data: { pickup }
    });

  } catch (error) {
    console.error('Get pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   GET /api/pickups/track/:pickupId
// @desc    Track pickup by pickup ID
// @access  Public
router.get('/track/:pickupId', async (req, res) => {
  try {
    const pickup = await Pickup.findOne({ pickupId: req.params.pickupId })
      .populate('userId', 'name')
      .populate('collectorId', 'name phone');

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    res.json({
      success: true,
      data: { pickup }
    });

  } catch (error) {
    console.error('Track pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   PUT /api/pickups/:id
// @desc    Update pickup
// @access  Private (Admin/Collector)
router.put('/:id', validatePickupUpdate, async (req, res) => {
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

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user has permission to update
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin' && user.role !== 'collector') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // If collector, check if they're assigned to this pickup
    if (user.role === 'collector' && pickup.collectorId?.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update pickups assigned to you'
      });
    }

    const updateData = req.body;
    const oldStatus = pickup.status;

    // Update pickup
    Object.assign(pickup, updateData);
    await pickup.save();

    // Update status timestamps
    if (updateData.status && updateData.status !== oldStatus) {
      await pickup.updateStatus(updateData.status, req.user.userId);
    }

    // Try to update blockchain if user has wallet
    if (user.aptosWallet.isConnected && updateData.status) {
      try {
        const blockchainTx = await aptosService.updatePickupStatus(
          pickup.pickupId,
          updateData.status,
          updateData.actualWeight || 0
        );
        
        pickup.blockchainTx = blockchainTx;
        await pickup.save();
      } catch (blockchainError) {
        console.error('Blockchain update failed:', blockchainError);
      }
    }

    // Award points if pickup is completed
    if (updateData.status === 'completed' && updateData.actualWeight > 0) {
      const pointsEarned = Math.floor(updateData.actualWeight * 10);
      
      // Update user statistics
      if (pickup.userId) {
        const pickupUser = await User.findById(pickup.userId);
        if (pickupUser) {
          await pickupUser.updateStats(updateData.actualWeight, pointsEarned);
          
          // Award points on blockchain if wallet connected
          if (pickupUser.aptosWallet.isConnected) {
            try {
              await aptosService.awardPoints(
                pickupUser.aptosWallet.address,
                pointsEarned,
                `Flower waste pickup: ${pickup.pickupId}`
              );
            } catch (blockchainError) {
              console.error('Blockchain points award failed:', blockchainError);
            }
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Pickup updated successfully',
      data: { pickup }
    });

  } catch (error) {
    console.error('Update pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   DELETE /api/pickups/:id
// @desc    Cancel pickup
// @access  Private (User/Admin)
router.delete('/:id', async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user has permission to cancel
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin' && pickup.userId?.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // Check if pickup can be cancelled
    if (['completed', 'cancelled'].includes(pickup.status)) {
      return res.status(400).json({
        success: false,
        message: 'Pickup cannot be cancelled in current status'
      });
    }

    // Cancel pickup
    pickup.status = 'cancelled';
    pickup.cancelledAt = new Date();
    pickup.cancelledBy = req.user.userId;
    pickup.cancellationReason = req.body.reason || 'Cancelled by user';
    
    await pickup.save();

    res.json({
      success: true,
      message: 'Pickup cancelled successfully',
      data: { pickup }
    });

  } catch (error) {
    console.error('Cancel pickup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   POST /api/pickups/:id/upload-image
// @desc    Upload image for pickup
// @access  Private
router.post('/:id/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user has permission to upload image
    if (req.user.userId !== pickup.userId?.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // Add image to pickup
    pickup.images.push({
      url: req.file.path,
      caption: req.body.caption || 'Pickup image'
    });

    await pickup.save();

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: { image: pickup.images[pickup.images.length - 1] }
    });

  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   POST /api/pickups/:id/feedback
// @desc    Submit feedback for completed pickup
// @access  Private
router.post('/:id/feedback', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Feedback must be between 10 and 500 characters')
], async (req, res) => {
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

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup not found'
      });
    }

    // Check if user has permission to submit feedback
    if (req.user.userId !== pickup.userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // Check if pickup is completed
    if (pickup.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for completed pickups'
      });
    }

    // Update pickup with feedback
    pickup.rating = req.body.rating;
    pickup.feedback = req.body.feedback;
    
    await pickup.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: { pickup }
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// @route   GET /api/pickups/stats/overview
// @desc    Get pickup statistics overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Pickup.getStats();
    
    res.json({
      success: true,
      data: { stats: stats[0] || {} }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

module.exports = router;
