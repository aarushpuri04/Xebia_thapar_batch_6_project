

import mongoose from 'mongoose';
import moment from 'moment';

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  transaction_type: { type: String, enum: ['withdraw', 'deposit'], required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  updated_balance: { type: Number, required: true }
  // Assuming you store the transaction date
});

// Address Schema
const addressSchema = new mongoose.Schema({
  houseOrBuildingName: { type: String, required: true },
  subBuildingName: { type: String },  // optional
  flatOrBuildingNumber: { type: String, required: true },
  streetName: { type: String, required: true },
  secondaryStreetName: { type: String },  // optional
  townOrCity: { type: String, required: true },
  state: { type: String, required: true },
  postcode: { 
    type: String, 
    required: true,
    // match: [postcodeRegex, '{VALUE} is not a valid postcode!'] 
  },
  country: { type: String, required: true },
 // stayingDuration: { type: String, required: true, enum: ['6 months or more', 'less than 6 months'] }
});

// Employment Schema
const validateDate = (date) => moment(date, 'DD-MM-YYYY', true).isValid();

const employmentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'self-employed', 'retired', 'student', 'not-employed']
  },
  company: {
    type: String,
    required: function() { return this.type === 'full-time' || this.type === 'part-time'; }
  },
  position: {
    type: String,
    required: function() { return this.type === 'full-time' || this.type === 'part-time'; }
  },
  startDate: {
    type: String,
    required: function() { return this.type === 'full-time'; },
    validate: {
      validator: validateDate,
      message: 'Start Date must be a valid date in the format DD-MM-YYYY'
    }
  },
  salary: {
    type: Number,
    required: function() { return this.type === 'full-time'; },
    min: [0, 'Salary must be a positive number']
  },
  hours: {
    type: Number,
    required: function() { return this.type === 'part-time'; },
    min: [0, 'Hours per week must be a positive number']
  },
  hourlyRate: {
    type: Number,
    required: function() { return this.type === 'part-time'; },
    min: [0, 'Hourly Rate must be a positive number']
  },
  businessName: {
    type: String,
    required: function() { return this.type === 'self-employed'; }
  },
  industry: {
    type: String,
    required: function() { return this.type === 'self-employed'; }
  },
  yearsBusiness: {
    type: Number,
    required: function() { return this.type === 'self-employed'; },
    min: [0, 'Years in Business must be a positive number']
  },
  annualIncome: {
    type: Number,
    required: function() { return this.type === 'self-employed'; },
    min: [0, 'Annual Income must be a positive number']
  },
  retirementDate: {
    type: String,
    required: function() { return this.type === 'retired'; },
    validate: {
      validator: validateDate,
      message: 'Retirement Date must be a valid date in the format DD-MM-YYYY'
    }
  },
  previousOccupation: {
    type: String,
    required: function() { return this.type === 'retired'; }
  },
  pension: {
    type: Number,
    required: function() { return this.type === 'retired'; },
    min: [0, 'Monthly Pension must be a positive number']
  },
  school: {
    type: String,
    required: function() { return this.type === 'student'; }
  },
  major: {
    type: String,
    required: function() { return this.type === 'student'; }
  },
  graduationYear: {
    type: Number,
    required: function() { return this.type === 'student'; },
    validate: {
      validator: function(v) {
        return /^\d{4}$/.test(v) && v >= 1900 && v <= new Date().getFullYear() + 10;
      },
      message: 'Graduation Year must be a four-digit year between 1900 and 10 years in the future'
    }
  },
  partTimeJob: {
    type: String,
    required: function() { return this.type === 'student'; },
    enum: ['yes', 'no']
  },
  lastJob: { type: String },
  reason: {
    type: String,
    required: function() { return this.type === 'not-employed'; }
  },
  seekingWork: {
    type: String,
    required: function() { return this.type === 'not-employed'; },
    enum: ['yes', 'no']
  }
});

// Document Schema
const documentVerificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['PAN Card', 'Aadhar Card'],
    required: true
  },
  fileName: { type: String, required: true },
  downloadLink: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  filePath: { type: String, required: true }
});

// Citizenship Schema
const citizenshipSchema = new mongoose.Schema({
  nationality: { type: String, required: [true, "Nationality is required"] },
  taxResidency: { type: String, required: [true, "Tax residency is required"] }
}, { timestamps: true });

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String }, // optional
  lastName: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, unique: true ,sparse:true}, // Not required initially
  emailVerified: { type: Boolean, default: false },
  phone: { type: String }, // Not required initially
  phoneVerified: { type: Boolean, default: false },
  address: { type: addressSchema, required: true }, // Address is required initially
  employment: employmentSchema,
  citizenship: citizenshipSchema,
  documents: [documentVerificationSchema],
  username: { type: String, unique: true, minlength: 8, maxlength: 20 ,sparse:true}, // Not required initially
  password: { type: String }, // Not required initially
  initial_balance: { type: Number, default: 50000 },
  transactions: [transactionSchema],
  balance: { type: Number, default: 50000 },
  
}, { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;

