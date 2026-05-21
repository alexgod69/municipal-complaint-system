import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import { seedIfEmpty } from './seed.js'
import authRoutes       from './routes/auth.js'
import complaintRoutes  from './routes/complaints.js'
import departmentRoutes from './routes/departments.js'
import userRoutes       from './routes/users.js'
import analyticsRoutes  from './routes/analytics.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await connectDB()
await seedIfEmpty()

const app = express()
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : true
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth',        authRoutes)
app.use('/api/complaints',  complaintRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/users',       userRoutes)
app.use('/api/analytics',   analyticsRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
