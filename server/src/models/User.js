import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','tech','admin'], default: 'user' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })
export default mongoose.model('User', userSchema)
