import { Router } from 'express'
import Ticket from '../models/Ticket.js'
import { authRequired, hasRole } from '../middlewares/auth.js'

const router = Router()
router.use(authRequired, hasRole('tech', 'admin'))

router.get('/tickets', async (req, res) => {
  const { status, q, sort='createdAt', order='desc', page=1, limit=20 } = req.query
  const p = Math.max(parseInt(page) || 1, 1)
  const l = Math.min(Math.max(parseInt(limit) || 20, 1), 100)
  const query = {}
  if (status) query.status = status
  if (q) query.$or = [
    { title: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } }
  ]
  const dir = order === 'asc' ? 1 : -1
  const total = await Ticket.countDocuments(query)
  const items = await Ticket.find(query).sort({ [sort]: dir, createdAt: -1 }).skip((p - 1) * l).limit(l)
  res.json({ items, total, page: p, pages: Math.ceil(total / l) })
})

router.patch('/tickets/:id', async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  const fields = ['title','description','deadline','priority','status','assigneeName','resolutionNotes']
  fields.forEach(f => { if (req.body[f] !== undefined) t[f] = req.body[f] })
  if (t.status === 'closed') {
    if (!t.resolvedBy) t.resolvedBy = req.user.name || req.user.username || 'Tech'
    if (!t.resolvedAt) t.resolvedAt = new Date()
  }
  await t.save()
  res.json(t)
})

export default router
