const mongoose = require('mongoose');
//import bcrypt(for hashing passwords)
const bcrypt = require('bcryptjs');
//creates schema for user model
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
    select: false,
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
      cardNumber: String,
      cardBrand: String,
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
//hash password before saving user
userSchema.pre('save', async function (next) {
  const user = this;
  //only hash password if it has been modified or is new
  if (!user.isModified('password')) return next();

  try {
    //add randomness
    const salt = await bcrypt.genSalt(10);
    //convert password to hash
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
//method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
