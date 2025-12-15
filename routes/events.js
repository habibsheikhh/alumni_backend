const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { adminOnly } = require('../middleware/admin')
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController')

router.get('/', getEvents)
router.post('/', protect, adminOnly, createEvent)
router.put('/:id', protect, adminOnly, updateEvent)
router.delete('/:id', protect, adminOnly, deleteEvent)

module.exports = router




