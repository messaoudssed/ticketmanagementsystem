import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../src/models/User.js'

const MONGO = process.env.MONGO_URI
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_USER  = process.env.ADMIN_USER  || 'admin'
const ADMIN_PASS  = process.env.ADMIN_PASS  || 'Admin123!'

async function run() {
  if (!MONGO) throw new Error('MONGO_URI missing')
  await mongoose.connect(MONGO)
  let admin = await User.findOne({ role: 'admin' })
  if (admin) {
    console.log('Admin exists:', admin.email)
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASS, 10)
    admin = await User.create({ name:'Administrator', username:ADMIN_USER, email:ADMIN_EMAIL, passwordHash, role:'admin' })
    console.log('Admin created:', admin.email)
  }
  await mongoose.disconnect()
}
run().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1) })
