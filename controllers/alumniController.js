const User = require('../models/User')
const { sendSuccess, sendError } = require('../utils/response')

// @desc    Get all approved alumni
// @route   GET /alumni
// @access  Private
const getAlumni = async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni', status: 'approved' })
      .select('-password')
      .sort({ name: 1 })

    sendSuccess(res, 'Alumni fetched successfully', alumni)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Get basic alumni stats
// @route   GET /alumni/stats
// @access  Private
const getAlumniStats = async (req, res) => {
  try {
    const totalAlumni = await User.countDocuments({ role: 'alumni', status: 'approved' })

    // Sum profile_views across all users
    const profileViewsAgg = await User.aggregate([
      { $match: { role: 'alumni' } },
      { $group: { _id: null, total: { $sum: { $ifNull: ['$profile_views', 0] } } } },
    ])
    const totalProfileViews = profileViewsAgg[0] ? profileViewsAgg[0].total : 0

    // Sum saved_jobs lengths across users
    const savedJobsAgg = await User.aggregate([
      { $match: { role: 'alumni' } },
      { $project: { savedCount: { $size: { $ifNull: ['$saved_jobs', []] } } } },
      { $group: { _id: null, total: { $sum: '$savedCount' } } },
    ])
    const totalSavedJobs = savedJobsAgg[0] ? savedJobsAgg[0].total : 0

    sendSuccess(res, 'Stats fetched successfully', {
      networkConnections: totalAlumni,
      profileViews: totalProfileViews,
      savedJobs: totalSavedJobs,
    })
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Get pending alumni
// @route   GET /alumni/pending
// @access  Private/Admin
const getPendingAlumni = async (req, res) => {
  try {
    const pendingAlumni = await User.find({ role: 'alumni', status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 })

    sendSuccess(res, 'Pending alumni fetched successfully', pendingAlumni)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Approve alumni
// @route   PUT /alumni/approve/:id
// @access  Private/Admin
const approveAlumni = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    if (user.role !== 'alumni') {
      return sendError(res, 'User is not an alumni', 400)
    }

    user.status = 'approved'
    await user.save()

    const updatedUser = await User.findById(id).select('-password')

    sendSuccess(res, 'Alumni approved successfully', updatedUser)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Reject alumni
// @route   PUT /alumni/reject/:id
// @access  Private/Admin
const rejectAlumni = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    if (user.role !== 'alumni') {
      return sendError(res, 'User is not an alumni', 400)
    }

    user.status = 'rejected'
    await user.save()

    sendSuccess(res, 'Alumni rejected successfully', null)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Update alumni
// @route   PUT /alumni/:id
// @access  Private/Admin
const updateAlumni = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, graduation_year, company, location, profile_photo_url } = req.body

    const user = await User.findById(id)

    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    if (name) user.name = name
    if (email) user.email = email
    if (graduation_year) user.graduation_year = graduation_year
    if (company !== undefined) user.company = company
    if (location !== undefined) user.location = location
    if (profile_photo_url !== undefined) user.profile_photo_url = profile_photo_url

    await user.save()

    const updatedUser = await User.findById(id).select('-password')

    sendSuccess(res, 'Alumni updated successfully', updatedUser)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Delete alumni
// @route   DELETE /alumni/:id
// @access  Private/Admin
const deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    if (user.role !== 'alumni') {
      return sendError(res, 'User is not an alumni', 400)
    }

    await User.findByIdAndDelete(id)

    sendSuccess(res, 'Alumni deleted successfully', null)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

module.exports = {
  getAlumni,
  getAlumniStats,
  getPendingAlumni,
  approveAlumni,
  rejectAlumni,
  updateAlumni,
  deleteAlumni,
}



