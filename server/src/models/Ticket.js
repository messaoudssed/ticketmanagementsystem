import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date },
  priority: { type: Number, min: 1, max: 5, default: 3 },
  status: { type: String, enum: ['not_addressed','in_progress','closed'], default: 'not_addressed' },
  assigneeName: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default mongoose.model('Ticket', ticketSchema)
