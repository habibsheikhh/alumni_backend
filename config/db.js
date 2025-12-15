const mongoose = require('mongoose')

// 👉 Paste your MongoDB URI into .env as MONGO_URI
// Format: mongodb+srv://username:password@cluster.mongodb.net/alumni-db

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    console.error('👉 Please check your MONGO_URI in .env file')
    process.exit(1)
  }
}

module.exports = connectDB



