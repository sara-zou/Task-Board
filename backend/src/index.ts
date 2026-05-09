import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import taskRoutes from './routes/tasks'
import commentRoutes from './routes/comments'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
app.use(express.json())

app.use('/tasks', taskRoutes)
app.use('/tasks', commentRoutes)

app.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})