const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  avatar: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  shippingAddresses: [
    {
      id: mongoose.Schema.Types.ObjectId,
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      phone: String,
      isDefault: { type: Boolean, default: false },
    },
  ],
  paymentMethods: [
    {
      id: mongoose.Schema.Types.ObjectId,
      type: { type: String, enum: ['card', 'upi', 'netbanking'] },
      cardNumber: String, // Last 4 digits only
      cardBrand: String, // Visa, Mastercard, Amex
      expiryMonth: String,
      expiryYear: String,
      upiId: String,
      bankName: String,
      accountLast4: String,
      isDefault: { type: Boolean, default: false },
    },
  ],
  orderHistory: [
    {
      orderId: String,
      totalAmount: Number,
      status: String,
      date: Date,
      items: Array,
    },
  ],
  aetherPoints: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
