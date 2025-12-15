require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    console.error('👉 Please check your MONGO_URI in .env file')
    process.exit(1)
  }
}

const seedUsers = async () => {
  try {
    // Connect to database
    await connectDB()

    // Test Admin Account
    const adminExists = await User.findOne({ email: 'admin@alumni.com' })
    if (adminExists) {
      console.log('⚠️  Admin account already exists, updating...')
      // Mark password as modified so pre-save hook triggers
      adminExists.password = 'admin123'
      adminExists.markModified('password')
      adminExists.role = 'admin'
      adminExists.status = 'approved'
      adminExists.name = 'Admin User'
      adminExists.graduation_year = 2020
      adminExists.company = 'Alumni System'
      adminExists.location = 'San Francisco, CA'
      await adminExists.save()
      console.log('✅ Admin account updated')
    } else {
      await User.create({
        name: 'Admin User',
        email: 'admin@alumni.com',
        password: 'admin123', // Let pre-save hook hash it
        role: 'admin',
        status: 'approved',
        graduation_year: 2020,
        company: 'Alumni System',
        location: 'San Francisco, CA',
      })
      console.log('✅ Admin account created')
    }

    // Test Alumni Account (Approved)
    const alumniExists = await User.findOne({ email: 'alumni@alumni.com' })
    if (alumniExists) {
      console.log('⚠️  Alumni account already exists, updating...')
      alumniExists.password = 'alumni123'
      alumniExists.markModified('password')
      alumniExists.role = 'alumni'
      alumniExists.status = 'approved'
      alumniExists.name = 'Alumni User'
      alumniExists.graduation_year = 2022
      alumniExists.company = 'TechCorp'
      alumniExists.location = 'New York, NY'
      await alumniExists.save()
      console.log('✅ Alumni account updated')
    } else {
      await User.create({
        name: 'Alumni User',
        email: 'alumni@alumni.com',
        password: 'alumni123', // Let pre-save hook hash it
        role: 'alumni',
        status: 'approved',
        graduation_year: 2022,
        company: 'TechCorp',
        location: 'New York, NY',
      })
      console.log('✅ Alumni account created')
    }

    // Test Pending Alumni Account
    const pendingExists = await User.findOne({ email: 'pending@alumni.com' })
    if (pendingExists) {
      console.log('⚠️  Pending alumni account already exists, updating...')
      pendingExists.password = 'pending123'
      pendingExists.markModified('password')
      pendingExists.role = 'alumni'
      pendingExists.status = 'pending'
      pendingExists.name = 'Pending User'
      pendingExists.graduation_year = 2023
      pendingExists.company = 'Startup Co'
      pendingExists.location = 'Austin, TX'
      await pendingExists.save()
      console.log('✅ Pending alumni account updated')
    } else {
      await User.create({
        name: 'Pending User',
        email: 'pending@alumni.com',
        password: 'pending123', // Let pre-save hook hash it
        role: 'alumni',
        status: 'pending',
        graduation_year: 2023,
        company: 'Startup Co',
        location: 'Austin, TX',
      })
      console.log('✅ Pending alumni account created')
    }

    console.log('\n🎉 Test accounts created successfully!\n')
    console.log('📋 Test Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('👤 ADMIN ACCOUNT:')
    console.log('   Email:    admin@alumni.com')
    console.log('   Password: admin123')
    console.log('   Status:   ✅ Approved')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('👤 ALUMNI ACCOUNT (Approved):')
    console.log('   Email:    alumni@alumni.com')
    console.log('   Password: alumni123')
    console.log('   Status:   ✅ Approved')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('👤 PENDING ACCOUNT (For Testing):')
    console.log('   Email:    pending@alumni.com')
    console.log('   Password: pending123')
    console.log('   Status:   ⏳ Pending Approval')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}



const Job = require('./models/Job') // <-- add this at the top with other imports

const seedJobs = async () => {
  try {
    console.log('\n🌱 Seeding Jobs...\n')

    const admin = await User.findOne({ email: 'admin@alumni.com' })
    if (!admin) {
      console.log("❌ Admin not found. Cannot assign jobs.")
      return
    }

    const jobs = [
      {
        title: "Frontend Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        salary: "$85,000 - $110,000",
        created_by: admin._id,
      },
      {
        title: "Backend Engineer",
        company: "CloudNova",
        location: "New York, NY",
        salary: "$95,000 - $130,000",
        created_by: admin._id,
      },
      {
        title: "Full Stack Developer",
        company: "InnovateX",
        location: "Remote",
        salary: "$100,000 - $140,000",
        created_by: admin._id,
      },
    ]

    for (const job of jobs) {
      const exists = await Job.findOne({ title: job.title })
      if (exists) {
        console.log(`⚠️  Job "${job.title}" already exists, skipping...`)
      } else {
        await Job.create(job)
        console.log(`✅ Job "${job.title}" created`)
      }
    }

    console.log('\n🎉 Job seeding complete!\n')

  } catch (err) {
    console.error('❌ Error seeding jobs:', err)
  }
}

// Run full seed
const runSeed = async () => {
  await seedUsers()
  await seedJobs()
}

runSeed()
