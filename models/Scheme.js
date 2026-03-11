const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    benefits: {
      type: String,
      required: [true, 'Benefits are required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Health',
        'Education',
        'Women',
        'Farmers',
        'Senior Citizens',
        'Startup/MSME',
        'Housing',
        'Employment',
        'Financial Assistance',
        'Agriculture',
        'Disability',
        'Minority Welfare',
        'Youth Development',
      ],
    },
    schemeType: {
      type: String,
      required: [true, 'Scheme type is required'],
      enum: ['Central', 'State'],
    },
    eligibility: {
      minAge: {
        type: Number,
        min: 0,
        max: 150,
      },
      maxAge: {
        type: Number,
        min: 0,
        max: 150,
      },
      minIncome: {
        type: Number,
        min: 0,
      },
      maxIncome: {
        type: Number,
        min: 0,
      },
      states: [
        {
          type: String,
        },
      ],
      categories: [
        {
          type: String,
          enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
        },
      ],
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
      },
      requiresDisability: {
        type: Boolean,
        default: false,
      },
      requiresMinority: {
        type: Boolean,
        default: false,
      },
      occupations: [
        {
          type: String,
        },
      ],
    },
    documents: [
      {
        type: String,
      },
    ],
    applicationLink: {
      type: String,
    },
    lastDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    officialWebsite: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Scheme = mongoose.model('Scheme', schemeSchema);

module.exports = Scheme;