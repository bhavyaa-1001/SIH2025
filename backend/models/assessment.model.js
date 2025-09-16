const mongoose = require('mongoose');

const assessmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    addressComponents: {
      state: {
        type: String,
        trim: true
      },
      district: {
        type: String,
        trim: true
      },
      block: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      }
    },
    roofArea: {
      type: Number,
      required: [true, 'Please add roof area'],
    },
    propertyType: {
      type: String,
      enum: ['Residential', 'Commercial', 'Institutional', 'Industrial'],
    },
    roofMaterial: {
      type: String,
      enum: ['Concrete', 'Metal', 'Tile', 'Asphalt', 'Other'],
    },
    soilType: {
      type: String,
      required: [true, 'Please add soil type'],
      enum: ['Sandy', 'Loamy', 'Clay', 'Silt', 'Rocky', 'Other'],
    },
    systemType: {
      type: String,
      enum: ['Storage', 'Recharge', 'Hybrid'],
    },
    storageCapacity: {
      type: Number,
    },
    filtrationSystem: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Advanced', 'None'],
    },
    rechargePit: {
      depth: {
        type: Number,
      },
      diameter: {
        type: Number,
      }
    },
    userContext: {
      expertise: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
        default: 'Beginner'
      },
      interests: [{
        type: String,
        enum: ['Cost savings', 'Environmental impact', 'Technical details', 'Maintenance requirements', 'Regulatory compliance']
      }],
      preferredLanguage: {
        type: String,
        enum: ['English', 'Hindi', 'Tamil', 'Marathi', 'Kannada'],
        default: 'English'
      }
    },
    groundwaterLevel: {
      type: Number,
      default: 0,
    },
    annualRainfall: {
      type: Number,
      default: 0,
    },
    roofImage: {
      type: String,
    },
    infiltrationRate: {
      type: Number,
      default: 0,
    },
    rechargePotential: {
      type: Number,
      default: 0,
    },
    complianceStatus: {
      type: String,
      enum: ['Compliant', 'Non-Compliant', 'Pending'],
      default: 'Pending',
    },
    recommendations: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['queued', 'pending', 'completed', 'failed'],
      default: 'queued',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assessment', assessmentSchema);