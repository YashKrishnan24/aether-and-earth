const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route   POST /auth/signup
// @desc    Register a new user
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create new user
    user = new User({
      name,
      email: email.toLowerCase(),
      password,
      aetherPoints: 100, // Welcome bonus
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email);

    // Return user data and token (exclude password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        aetherPoints: user.aetherPoints,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /auth/login
// @desc    Login user
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    // Return user data and token
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        aetherPoints: user.aetherPoints,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   GET /auth/me
// @desc    Get current user profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        aetherPoints: user.aetherPoints,
        shippingAddresses: user.shippingAddresses,
        paymentMethods: user.paymentMethods,
        orderHistory: user.orderHistory,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   PUT /auth/update-profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        aetherPoints: user.aetherPoints,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /auth/add-shipping-address
// @desc    Add shipping address
// @access  Private
exports.addShippingAddress = async (req, res) => {
  try {
    const { firstName, lastName, street, city, state, zipCode, country, phone, isDefault } = req.body;

    const user = await User.findById(req.userId);

    // If this is the default address, remove default from others
    if (isDefault) {
      user.shippingAddresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.shippingAddresses.push({
      firstName,
      lastName,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault: isDefault || user.shippingAddresses.length === 0,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address added successfully',
      shippingAddresses: user.shippingAddresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /auth/remove-shipping-address/:addressId
// @desc    Remove shipping address
// @access  Private
exports.removeShippingAddress = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.shippingAddresses = user.shippingAddresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address removed successfully',
      shippingAddresses: user.shippingAddresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /auth/add-payment-method
// @desc    Add payment method
// @access  Private
exports.addPaymentMethod = async (req, res) => {
  try {
    const { type, cardNumber, cardBrand, expiryMonth, expiryYear, upiId, bankName, accountLast4, isDefault } = req.body;

    const user = await User.findById(req.userId);

    // If this is the default method, remove default from others
    if (isDefault) {
      user.paymentMethods.forEach(method => {
        method.isDefault = false;
      });
    }

    user.paymentMethods.push({
      type,
      cardNumber, // Only store last 4 digits in production
      cardBrand,
      expiryMonth,
      expiryYear,
      upiId,
      bankName,
      accountLast4,
      isDefault: isDefault || user.paymentMethods.length === 0,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment method added successfully',
      paymentMethods: user.paymentMethods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   DELETE /auth/remove-payment-method/:methodId
// @desc    Remove payment method
// @access  Private
exports.removePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.paymentMethods = user.paymentMethods.filter(
      method => method._id.toString() !== req.params.methodId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment method removed successfully',
      paymentMethods: user.paymentMethods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /auth/logout
// @desc    Logout user (frontend clears token)
// @access  Private
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
