require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

// 👉 Ensure your .env is created and filled before starting server
// Make sure MONGO_URI and JWT_SECRET are set in your .env file

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB()

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/alumni', require('./routes/alumni'))
app.use('/events', require('./routes/events'))
app.use('/jobs', require('./routes/jobs'))
app.use('/announcements', require('./routes/announcements'))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Alumni System API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: err.message || 'Server error',
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📝 Make sure your .env file has MONGO_URI and JWT_SECRET configured`)
})

