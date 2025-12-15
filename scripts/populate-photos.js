require('dotenv').config()
const connectDB = require('../config/db')
const mongoose = require('mongoose')
const User = require('../models/User')

const run = async () => {
  await connectDB()

  // Find alumni with empty or missing profile_photo_url
  const users = await User.find({
    role: 'alumni',
    status: 'approved',
    $or: [{ profile_photo_url: { $exists: false } }, { profile_photo_url: '' }],
  })

  if (!users.length) {
    console.log('No alumni found that need photos')
    process.exit(0)
  }

  for (const u of users) {
    const name = encodeURIComponent(u.name || 'Alumni')
    // Using ui-avatars to generate a quick avatar. You can replace this with your own CDN or upload flow later.
    const avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&rounded=true&size=256`
    u.profile_photo_url = avatarUrl
    await u.save()
    console.log(`Updated ${u._id} -> ${avatarUrl}`)
  }

  console.log('All done')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
