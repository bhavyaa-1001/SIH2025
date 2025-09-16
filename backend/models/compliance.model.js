const mongoose = require('mongoose');

const complianceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    status: {
      type: String,
      enum: ['Compliant', 'Non-Compliant', 'Partially Compliant', 'Pending'],
      default: 'Pending',
    },
    regulations: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        isCompliant: {
          type: Boolean,
          default: false,
        },
        notes: {
          type: String,
        },
      },
    ],
    recommendations: [
      {
        type: String,
      },
    ],
    reportDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    documentationUrls: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Compliance', complianceSchema);