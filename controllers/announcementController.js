const Announcement = require('../models/Announcement')
const { sendSuccess, sendError } = require('../utils/response')

// @desc    Get all announcements
// @route   GET /announcements
// @access  Public
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('created_by', 'name email')

    sendSuccess(res, 'Announcements fetched successfully', announcements)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Create announcement
// @route   POST /announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category } = req.body

    if (!title || !content) {
      return sendError(res, 'Please provide title and content', 400)
    }

    const announcement = await Announcement.create({
      title,
      content,
      category: category || 'Updates',
      created_by: req.user._id,
    })

    const populatedAnnouncement = await Announcement.findById(announcement._id).populate(
      'created_by',
      'name email'
    )

    sendSuccess(res, 'Announcement created successfully', populatedAnnouncement, 201)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Update announcement
// @route   PUT /announcements/:id
// @access  Private/Admin
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, category } = req.body

    const announcement = await Announcement.findById(id)

    if (!announcement) {
      return sendError(res, 'Announcement not found', 404)
    }

    if (title) announcement.title = title
    if (content) announcement.content = content
    if (category) announcement.category = category

    await announcement.save()

    const updatedAnnouncement = await Announcement.findById(id).populate('created_by', 'name email')

    sendSuccess(res, 'Announcement updated successfully', updatedAnnouncement)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Delete announcement
// @route   DELETE /announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params

    const announcement = await Announcement.findById(id)

    if (!announcement) {
      return sendError(res, 'Announcement not found', 404)
    }

    await Announcement.findByIdAndDelete(id)

    sendSuccess(res, 'Announcement deleted successfully', null)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
}



