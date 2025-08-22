import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import PasswordReset from '../models/PasswordReset.js'
import crypto from 'crypto'
import { sendMail } from '../utils/mailer.js'
const router = Router()
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    const exists = await User.findOne({ $or: [{ email }, { username }] })
    if (exists) return res.status(409).json({ message: 'User already exists' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, username, email, passwordHash, role: role || 'user' })
    res.status(201).json({ id: user._id, name: user.name, username: user.username, email: user.email, role: user.role })
  } catch (e) { res.status(500).json({ message: 'Server error' }) }
})
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role } })
  } catch { res.status(500).json({ message: 'Server error' }) }
})
router.get('/me', (req, res) => {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try { res.json(jwt.verify(token, process.env.JWT_SECRET)) }
  catch { res.status(401).json({ message: 'Invalid token' }) }
})
export default router


// Request password reset
router.post('/request-reset', async (req, res) => {
  const { identifier } = req.body
  const user = await User.findOne({ $or:[{email:identifier},{username:identifier}] })
  if (!user) return res.json({ message: 'If the account exists, an email was sent.' })
  const token = (await import('crypto')).randomBytes(32).toString('hex')
  const cryptoMod = (await import('crypto'))
  const tokenHash = cryptoMod.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + 1000*60*30)
  await PasswordReset.create({ userId: user._id, tokenHash, expiresAt })
  const base = process.env.APP_BASE_URL || 'http://localhost:5173'
  const link = `${base}/reset-password?token=${token}`
  await sendMail({ to:user.email, subject:'Password Reset', text:`Reset your password: ${link}`, html:`<a href="${link}">${link}</a>` })
  res.json({ message: 'If the account exists, an email was sent.' })
})

// Apply new password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body
  if (!token || !newPassword) return res.status(400).json({ message: 'Missing token or newPassword' })
  const cryptoMod = (await import('crypto'))
  const tokenHash = cryptoMod.createHash('sha256').update(token).digest('hex')
  const rec = await PasswordReset.findOne({ tokenHash, used:false, expiresAt: { $gt: new Date() } })
  if (!rec) return res.status(400).json({ message: 'Invalid or expired token' })
  const user = await (await import('../models/User.js')).default.findById(rec.userId)
  if (!user) return res.status(404).json({ message: 'User not found' })
  const bcrypt = (await import('bcryptjs')).default
  user.passwordHash = await bcrypt.hash(newPassword, 10)
  await user.save()
  rec.used = true; await rec.save()
  res.json({ message: 'Password updated successfully' })
})
