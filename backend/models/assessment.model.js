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
    roofArea: {
      type: Number,
      required: [true, 'Please add roof area'],
    },
    roofMaterial: {
      type: String,
      required: [true, 'Please add roof material'],
      enum: ['Concrete', 'Metal', 'Tile', 'Asphalt', 'Other'],
    },
    soilType: {
      type: String,
      required: [true, 'Please add soil type'],
      enum: ['Sandy', 'Loamy', 'Clay', 'Silt', 'Rocky', 'Other'],
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
      enum: ['Draft', 'Submitted', 'Approved', 'Rejected'],
      default: 'Draft',
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