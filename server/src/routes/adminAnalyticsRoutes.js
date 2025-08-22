import { Router } from 'express'
import { authRequired, hasRole } from '../middlewares/auth.js'
import Ticket from '../models/Ticket.js'
const router = Router()
router.use(authRequired, hasRole('admin'))
router.get('/summary', async (_req, res) => {
  const byStatus = await Ticket.aggregate([{ $group: { _id:'$status', count:{$sum:1} } }])
  const byAssignee = await Ticket.aggregate([{ $group: { _id:'$assigneeName', count:{$sum:1} } }])
  const byPriority = await Ticket.aggregate([{ $group: { _id:'$priority', count:{$sum:1} } }, { $sort: { _id:1 } }])
  const dailyCreated = await Ticket.aggregate([{ $group: { _id:{ $dateToString:{format:'%Y-%m-%d', date:'$createdAt'} }, count:{$sum:1} } }, { $sort:{ _id:1 } }])
  res.json({ byStatus, byAssignee, byPriority, dailyCreated })
})
export default router
