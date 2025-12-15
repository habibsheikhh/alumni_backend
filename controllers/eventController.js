const Event = require('../models/Event')
const { sendSuccess, sendError } = require('../utils/response')

// @desc    Get all events
// @route   GET /events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('created_by', 'name email')

    sendSuccess(res, 'Events fetched successfully', events)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Create event
// @route   POST /events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, attendees } = req.body

    if (!title || !date || !location) {
      return sendError(res, 'Please provide title, date, and location', 400)
    }

    const event = await Event.create({
      title,
      description: description || '',
      date,
      location,
      attendees: attendees || 0,
      created_by: req.user._id,
    })

    const populatedEvent = await Event.findById(event._id).populate('created_by', 'name email')

    sendSuccess(res, 'Event created successfully', populatedEvent, 201)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Update event
// @route   PUT /events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, date, location, attendees } = req.body

    const event = await Event.findById(id)

    if (!event) {
      return sendError(res, 'Event not found', 404)
    }

    if (title) event.title = title
    if (description !== undefined) event.description = description
    if (date) event.date = date
    if (location) event.location = location
    if (attendees !== undefined) event.attendees = attendees

    await event.save()

    const updatedEvent = await Event.findById(id).populate('created_by', 'name email')

    sendSuccess(res, 'Event updated successfully', updatedEvent)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Delete event
// @route   DELETE /events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params

    const event = await Event.findById(id)

    if (!event) {
      return sendError(res, 'Event not found', 404)
    }

    await Event.findByIdAndDelete(id)

    sendSuccess(res, 'Event deleted successfully', null)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
}



