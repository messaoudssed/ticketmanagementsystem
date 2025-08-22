import { Router } from 'express'
import Ticket from '../models/Ticket.js'
import { authRequired, hasRole } from '../middlewares/auth.js'
import { sendMail } from '../utils/mailer.js'
import User from '../models/User.js'

const router = Router()
router.use(authRequired, hasRole('admin'))

router.get('/', async (req, res) => {
  const { status, q, sort='createdAt', order='desc', page=1, limit=20 } = req.query
  const p = Math.max(parseInt(page)||1,1)
  const l = Math.min(Math.max(parseInt(limit)||20,1),100)
  const query = {}
  if (status) query.status = status
  if (q) query.$or = [
    { title: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } }
  ]
  const dir = order === 'asc' ? 1 : -1
  const total = await Ticket.countDocuments(query)
  const items = await Ticket.find(query).sort({ [sort]: dir, createdAt: -1 }).skip((p-1)*l).limit(l).populate('createdBy','name username email role')
  res.json({ items, total, page:p, pages: Math.ceil(total/l) })
})

router.patch('/:id', async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  const prevStatus = t?.status
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  const fields = ['title','description','deadline','status','assigneeName','priority','resolutionNotes','resolvedBy','resolvedAt']
  fields.forEach(f => { if (req.body[f] !== undefined) t[f] = req.body[f] })
  await t.save()
  // notify creator on close
  try {
    if (prevStatus !== 'closed' && t.status === 'closed') {
      const user = await User.findById(t.createdBy)
      if (user?.email) {
        await sendMail({ to:user.email, subject:'Your ticket was closed', text:`Ticket "${t.title}" is now closed.`, html:`<p>Ticket <b>${t.title}</b> is now <b>closed</b>.</p>` })
      }
    }
  } catch (e) { console.log('mail error:', e.message) }
  res.json(t)
})

router.delete('/:id', async (req, res) => {
  const t = await Ticket.findById(req.params.id)
  const prevStatus = t?.status
  if (!t) return res.status(404).json({ message: 'Ticket not found' })
  await t.deleteOne()
  res.json({ message: 'Ticket deleted' })
})

export default router
