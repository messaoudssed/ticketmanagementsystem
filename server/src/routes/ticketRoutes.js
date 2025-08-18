import { Router } from 'express'
import Ticket from '../models/Ticket.js'
import { authRequired } from '../middlewares/auth.js'

const router = Router()

router.get('/', authRequired, async (req, res) => {
  const query = (req.user.role === 'user') ? { createdBy: req.user.id } : {}
  const list = await Ticket.find(query).sort({ createdAt: -1 })
  res.json(list)
})

router.post('/', authRequired, async (req, res) => {
  const { title, description, deadline, status, assigneeName } = req.body
  if (!title || !description) return res.status(400).json({ message: 'title and description are required' })
  const t = await Ticket.create({ title, description, deadline, status, assigneeName, createdBy: req.user.id })
  res.status(201).json(t)
})

router.get('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  if (req.user.role === 'user' && String(t.createdBy) !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
  res.json(t)
})

router.patch('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  if (req.user.role === 'user' && String(t.createdBy) !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
  const { title, description, deadline, status, assigneeName } = req.body
  if (title !== undefined) t.title = title
  if (description !== undefined) t.description = description
  if (deadline !== undefined) t.deadline = deadline
  if (status !== undefined) t.status = status
  if (assigneeName !== undefined) t.assigneeName = assigneeName
  await t.save()
  res.json(t)
})

router.delete('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  if (req.user.role === 'user' && String(t.createdBy) !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
  await t.deleteOne()
  res.json({ message: 'Ticket deleted' })
})

export default router
