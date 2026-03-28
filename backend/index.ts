// Must be set before any TLS connections
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'
import swaggerUi from 'swagger-ui-express'
import meriKathaRouter from './routes/meriKathaRoutes'
import { swaggerSpec } from './config/swagger'

const app = express()
const PORT = process.env.PORT || 3000
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

app.use(cors())
app.use(express.json())

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// All story routes (with content moderation built in)
app.use('/api', meriKathaRouter)

// Health check
app.get('/', (_req, res) => {
  res.json({ success: true, data: 'MannSathi API chalirako cha' })
})

app.listen(PORT, () => {
  console.log(`MannSathi server ${PORT} maa chalirako cha`)
})

export default app
