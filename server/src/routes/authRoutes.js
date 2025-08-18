import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body
    if (!name || !username || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    const exists = await User.findOne({ $or: [{ email }, { username }] })
    if (exists) return res.status(409).json({ message: 'User already exists' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, username, email, passwordHash, role: role || 'user' })
    res.status(201).json({ id: user._id, name: user.name, username: user.username, email: user.email, role: user.role })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role } })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', async (req, res) => {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    res.json(payload)
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
})

export default router
