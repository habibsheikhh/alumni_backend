const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendSuccess, sendError } = require('../utils/response')

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// @desc    Register new user
// @route   POST /auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password, graduation_year, company, location, role } = req.body

    // Normalize
    const normalizedEmail = email && email.toLowerCase().trim()

    // Basic validation
    if (!name || !normalizedEmail || !password) {
      return sendError(res, 'Please provide name, email and password', 400)
    }

    // If role is alumni, graduation_year is required
    const userRole = role === 'student' ? 'student' : 'alumni'
    if (userRole === 'alumni' && !graduation_year) {
      return sendError(res, 'Please provide graduation_year for alumni', 400)
    }

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail })
    if (userExists) {
      return sendError(res, 'User already exists with this email', 400)
    }

    // Create user
    const userData = {
      name,
      email: normalizedEmail,
      password,
      graduation_year: graduation_year || null,
      company: company || '',
      location: location || '',
      role: userRole,
      // Students are auto-approved, alumni stay pending for admin approval
      status: userRole === 'student' ? 'approved' : 'pending',
    }

    const user = await User.create(userData)

    if (user) {
      // For students, include short success message and note they're approved
      const message = user.role === 'student'
        ? 'Registration successful. Your student account is active.'
        : 'Registration successful. Your account is pending approval.'

      sendSuccess(
        res,
        message,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        201
      )
    } else {
      sendError(res, 'Invalid user data', 400)
    }
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return sendError(res, 'Please provide email and password', 400)
    }

    // Check for user (case-insensitive email)
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      return sendError(res, 'Invalid email or password', 401)
    }

    const isPasswordValid = await user.comparePassword(password)
    
    if (isPasswordValid) {
      // Check if user is approved (unless admin)
      if (user.role === 'alumni' && user.status !== 'approved') {
        return sendError(
          res,
          'Your account is pending approval. Please wait for admin approval.',
          403
        )
      }

      sendSuccess(res, 'Login successful', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        graduation_year: user.graduation_year,
        company: user.company,
        location: user.location,
        profile_photo_url: user.profile_photo_url,
        token: generateToken(user._id),
      })
    } else {
      sendError(res, 'Invalid email or password', 401)
    }
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

module.exports = {
  signup,
  login,
}

