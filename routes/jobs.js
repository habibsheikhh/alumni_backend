const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { adminOnly } = require('../middleware/admin')
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController')

router.get('/', getJobs)
router.post('/', protect, adminOnly, createJob)
router.put('/:id', protect, adminOnly, updateJob)
router.delete('/:id', protect, adminOnly, deleteJob)

module.exports = router




