import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('MONGO_URI not set. Set it in .env before using the database.')
    } else {
      await mongoose.connect(MONGO_URI)
      console.log('MongoDB connected')
    }
    app.listen(PORT, () => console.log(`API listening on :${PORT}`))
  } catch (err) {
    console.error('Startup error:', err)
    process.exit(1)
  }
}

start()
