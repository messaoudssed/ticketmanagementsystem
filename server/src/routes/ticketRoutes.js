import { Router } from 'express'
import Ticket from '../models/Ticket.js'
import { authRequired } from '../middlewares/auth.js'

const router = Router()

// Filtering & sorting + ownership
router.get('/', authRequired, async (req, res) => {
  const { status, q, sort = 'deadline', order = 'asc' } = req.query
  const query = (req.user.role === 'user') ? { createdBy: req.user.id } : {}

  if (status) query.status = status
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ]
  }

  const sortMap = { deadline: 'deadline', priority: 'priority', createdAt: 'createdAt' }
  const sortField = sortMap[sort] || 'deadline'
  const sortDir = order === 'desc' ? -1 : 1

  const list = await Ticket.find(query).sort({ [sortField]: sortDir, createdAt: -1 })
  res.json(list)
})

// Create
router.post('/', authRequired, async (req, res) => {
  const { title, description, deadline, status, assigneeName, priority } = req.body
  if (!title || !description) return res.status(400).json({ message: 'title and description are required' })
  const t = await Ticket.create({ title, description, deadline, status, assigneeName, priority, createdBy: req.user.id })
  res.status(201).json(t)
})

// Read
router.get('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  const isOwner = String(t.createdBy) === req.user.id
  const isElevated = req.user.role !== 'user'
  if (!isOwner && !isElevated) return res.status(403).json({ message: 'Forbidden' })
  res.json(t)
})

// Update
router.patch('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  const isOwner = String(t.createdBy) === req.user.id
  const isElevated = req.user.role !== 'user'
  if (!isOwner && !isElevated) return res.status(403).json({ message: 'Forbidden' })
  const { title, description, deadline, status, assigneeName, priority } = req.body
  if (title !== undefined) t.title = title
  if (description !== undefined) t.description = description
  if (deadline !== undefined) t.deadline = deadline
  if (status !== undefined) t.status = status
  if (assigneeName !== undefined) t.assigneeName = assigneeName
  if (priority !== undefined) t.priority = priority
  await t.save()
  res.json(t)
})

// Delete
router.delete('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  const isOwner = String(t.createdBy) === req.user.id
  const isElevated = req.user.role !== 'user'
  if (!isOwner && !isElevated) return res.status(403).json({ message: 'Forbidden' })
  await t.deleteOne()
  res.json({ message: 'Ticket deleted' })
})

export default router
