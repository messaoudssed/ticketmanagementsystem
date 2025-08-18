import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date },
  status: { type: String, enum: ['not_addressed','in_progress','closed'], default: 'not_addressed' },
  assigneeName: { type: String }, // optional: name of the technician (if addressed/closed)
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Step 2
  // assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }     // Step 2
}, { timestamps: true })

export default mongoose.model('Ticket', ticketSchema)
