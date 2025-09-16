const mongoose = require('mongoose');

const waterSavingsSchema = mongoose.Schema(
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
    roofArea: {
      type: Number,
      required: [true, 'Please add roof area'],
    },
    annualRainfall: {
      type: Number,
      required: [true, 'Please add annual rainfall'],
    },
    runoffCoefficient: {
      type: Number,
      default: 0.8,
    },
    potentialCollection: {
      type: Number,
      required: true,
    },
    financialSavings: {
      type: Number,
      required: true,
    },
    selfSufficiencyPercentage: {
      type: Number,
      required: true,
    },
    environmentalImpact: {
      type: Number,
      required: true,
    },
    waterPrice: {
      type: Number,
      default: 0.002, // price per liter in currency
    },
    householdSize: {
      type: Number,
      default: 4,
    },
    calculationDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WaterSavings', waterSavingsSchema);