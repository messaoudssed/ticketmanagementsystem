import { Router } from 'express'
import Ticket from '../models/Ticket.js'

const router = Router()

// List tickets (global for Step 1)
router.get('/', async (_req, res) => {
  const list = await Ticket.find().sort({ createdAt: -1 })
  res.json(list)
})

// Create a ticket
router.post('/', async (req, res) => {
  const { title, description, deadline, status, assigneeName } = req.body
  if (!title || !description) return res.status(400).json({ message: 'title and description are required' })
  const t = await Ticket.create({ title, description, deadline, status, assigneeName })
  res.status(201).json(t)
})

// Get by id
router.get('/:id', async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  res.json(t)
})

// Update
router.patch('/:id', async (req, res) => {
  const { title, description, deadline, status, assigneeName } = req.body
  const t = await Ticket.findByIdAndUpdate(
    req.params.id,
    { $set: { title, description, deadline, status, assigneeName } },
    { new: true, runValidators: true }
  )
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  res.json(t)
})

// Delete
router.delete('/:id', async (req, res) => {
  const t = await Ticket.findByIdAndDelete(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  res.json({ message: 'Ticket deleted' })
})

export default router
