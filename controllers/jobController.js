const Job = require('../models/Job')
const { sendSuccess, sendError } = require('../utils/response')

// @desc    Get all jobs
// @route   GET /jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('created_by', 'name email')

    sendSuccess(res, 'Jobs fetched successfully', jobs)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Create job
// @route   POST /jobs
// @access  Private/Admin
const createJob = async (req, res) => {
  try {
    const { title, company, location, salary, description } = req.body

    if (!title || !company || !location) {
      return sendError(res, 'Please provide title, company, and location', 400)
    }

    const job = await Job.create({
      title,
      company,
      location,
      salary: salary || '',
      description: description || '',
      created_by: req.user._id,
    })

    const populatedJob = await Job.findById(job._id).populate('created_by', 'name email')

    sendSuccess(res, 'Job created successfully', populatedJob, 201)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Update job
// @route   PUT /jobs/:id
// @access  Private/Admin
const updateJob = async (req, res) => {
  try {
    const { id } = req.params
    const { title, company, location, salary, description } = req.body

    const job = await Job.findById(id)

    if (!job) {
      return sendError(res, 'Job not found', 404)
    }

    if (title) job.title = title
    if (company) job.company = company
    if (location) job.location = location
    if (salary !== undefined) job.salary = salary
    if (description !== undefined) job.description = description

    await job.save()

    const updatedJob = await Job.findById(id).populate('created_by', 'name email')

    sendSuccess(res, 'Job updated successfully', updatedJob)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

// @desc    Delete job
// @route   DELETE /jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params

    const job = await Job.findById(id)

    if (!job) {
      return sendError(res, 'Job not found', 404)
    }

    await Job.findByIdAndDelete(id)

    sendSuccess(res, 'Job deleted successfully', null)
  } catch (error) {
    sendError(res, error.message || 'Server error', 500)
  }
}

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
}



