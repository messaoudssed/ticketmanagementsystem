import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import ticketRoutes from './routes/ticketRoutes.js'
import techRoutes from './routes/techRoutes.js'
import adminTicketRoutes from './routes/adminTicketRoutes.js'
import adminUserRoutes from './routes/adminUserRoutes.js'
import adminSettingRoutes from './routes/adminSettingRoutes.js'
import adminAnalyticsRoutes from './routes/adminAnalyticsRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/tech', techRoutes)
app.use('/api/admin/tickets', adminTicketRoutes)
app.use('/api/admin/users', adminUserRoutes)
app.use('/api/admin/settings', adminSettingRoutes)
app.use('/api/admin/analytics', adminAnalyticsRoutes)

export default app
