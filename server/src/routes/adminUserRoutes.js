import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { authRequired, hasRole } from '../middlewares/auth.js'

const router = Router()
router.use(authRequired, hasRole('admin'))

router.get('/', async (req, res) => {
  const { q, role, page=1, limit=20 } = req.query
  const p = Math.max(parseInt(page)||1,1)
  const l = Math.min(Math.max(parseInt(limit)||20,1),100)
  const query = {}
  if (role) query.role = role
  if (q) query.$or = [
    { name: { $regex: q, $options: 'i' } },
    { username: { $regex: q, $options: 'i' } },
    { email: { $regex: q, $options: 'i' } }
  ]
  const total = await User.countDocuments(query)
  const items = await User.find(query).skip((p-1)*l).limit(l).select('-passwordHash')
  res.json({ items, total, page:p, pages: Math.ceil(total/l) })
})

router.post('/', async (req, res) => {
  const { name, username, email, password, role='user' } = req.body
  if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' })
  const exists = await User.findOne({ $or:[{email},{username}] })
  if (exists) return res.status(409).json({ message: 'User already exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, username, email, passwordHash, role })
  res.status(201).json({ id:user._id, name, username, email, role })
})

router.patch('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  const { role, isActive, name } = req.body
  if (role) user.role = role
  if (isActive !== undefined) user.isActive = isActive
  if (name !== undefined) user.name = name
  await user.save()
  res.json({ id:user._id, name:user.name, username:user.username, email:user.email, role:user.role, isActive:user.isActive })
})

router.delete('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  await user.deleteOne()
  res.json({ message: 'User deleted' })
})

export default router
