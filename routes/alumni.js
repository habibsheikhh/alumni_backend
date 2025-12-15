const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { adminOnly } = require('../middleware/admin')
const {
  getAlumni,
  getAlumniStats,
  getPendingAlumni,
  approveAlumni,
  rejectAlumni,
  updateAlumni,
  deleteAlumni,
} = require('../controllers/alumniController')

router.get('/', protect, getAlumni)
router.get('/stats', protect, getAlumniStats)
router.get('/pending', protect, adminOnly, getPendingAlumni)
router.put('/approve/:id', protect, adminOnly, approveAlumni)
router.put('/reject/:id', protect, adminOnly, rejectAlumni)
router.put('/:id', protect, adminOnly, updateAlumni)
router.delete('/:id', protect, adminOnly, deleteAlumni)

module.exports = router



