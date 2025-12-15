const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendError } = require('../utils/response')

const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return sendError(res, 'Not authorized, no token', 401)
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return sendError(res, 'User not found', 404)
      }

      next()
    } catch (error) {
      return sendError(res, 'Not authorized, token failed', 401)
    }
  } catch (error) {
    return sendError(res, 'Authentication error', 500)
  }
}

module.exports = { protect }



