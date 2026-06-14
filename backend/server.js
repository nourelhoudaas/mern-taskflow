const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mern-taskflow.vercel.app' // ← ton URL Vercel
  ],
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/teams', require('./routes/teams'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/notifications', require('./routes/notifications'))

// Test route
app.get('/', (req, res) => {
  res.send('TaskFlow API is running ✅')
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected')
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log('❌ Connection error :', err)
  })