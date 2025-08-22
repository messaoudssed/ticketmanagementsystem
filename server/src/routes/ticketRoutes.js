import { Router } from 'express'
import Ticket from '../models/Ticket.js'
import { authRequired } from '../middlewares/auth.js'

const router = Router()

router.get('/', authRequired, async (req, res) => {
  const { status, q, sort='deadline', order='asc', page=1, limit=10 } = req.query
  const p = Math.max(parseInt(page)||1,1)
  const l = Math.min(Math.max(parseInt(limit)||10,1),100)
  const query = { createdBy: req.user.id }
  if (status) query.status = status
  if (q) query.$or = [
    { title: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } }
  ]
  const sortMap = { deadline: 'deadline', priority: 'priority', createdAt: 'createdAt' }
  const field = sortMap[sort] || 'deadline'
  const dir = order === 'desc' ? -1 : 1
  const total = await Ticket.countDocuments(query)
  const items = await Ticket.find(query).sort({ [field]: dir, createdAt: -1 }).skip((p-1)*l).limit(l)
  res.json({ items, total, page:p, pages: Math.ceil(total/l) })
})

router.get('/export', authRequired, async (req, res) => {
  const { status, q, sort='deadline', order='asc' } = req.query
  const query = { createdBy: req.user.id }
  if (status) query.status = status
  if (q) query.$or = [
    { title: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } }
  ]
  const sortMap = { deadline: 'deadline', priority: 'priority', createdAt: 'createdAt' }
  const field = sortMap[sort] || 'deadline'
  const dir = order === 'desc' ? -1 : 1
  const list = await Ticket.find(query).sort({ [field]: dir, createdAt: -1 })
  const header = ['Title','Status','Deadline','Priority','Assignee','CreatedAt']
  const rows = list.map(t => [
    (t.title ?? '').replaceAll('"','""'),
    (t.status ?? '').replaceAll('"','""'),
    t.deadline ? new Date(t.deadline).toISOString() : '',
    t.priority ?? '',
    (t.assigneeName ?? '').replaceAll('"','""'),
    t.createdAt ? new Date(t.createdAt).toISOString() : ''
  ])
  const csv = [header.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="tickets.csv"')
  res.send(csv)
})

router.post('/', authRequired, async (req, res) => {
  const { title, description, deadline, status, assigneeName, priority } = req.body
  if (!title || !description) return res.status(400).json({ message: 'title and description are required' })
  const t = await Ticket.create({ title, description, deadline, status, assigneeName, priority, createdBy: req.user.id })
  res.status(201).json(t)
})

router.get('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  if (String(t.createdBy) !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
  res.json(t)
})

router.patch('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  if (String(t.createdBy) !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
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

router.delete('/:id', authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  if (String(t.createdBy) !== req.user.id) return res.status(403).json({ message: 'Forbidden' })
  await t.deleteOne()
  res.json({ message: 'Ticket deleted' })
})

export default router
