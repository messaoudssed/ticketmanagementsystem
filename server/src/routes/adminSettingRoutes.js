import { Router } from 'express'
import Setting from '../models/Setting.js'
import { authRequired, hasRole } from '../middlewares/auth.js'

const router = Router()
router.use(authRequired, hasRole('admin'))

router.get('/', async (_req, res) => {
  const all = await Setting.find({})
  res.json(all)
})

router.put('/:key', async (req, res) => {
  const { key } = req.params
  const { value } = req.body
  const doc = await Setting.findOneAndUpdate({ key }, { value }, { upsert:true, new:true })
  res.json(doc)
})

router.delete('/:key', async (req, res) => {
  const { key } = req.params
  await Setting.findOneAndDelete({ key })
  res.json({ message: 'Deleted' })
})

export default router
