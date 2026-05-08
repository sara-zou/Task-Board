import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import taskRoutes from './routes/tasks'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors({
  origin: 'http://localhost:5173' 
}))
app.use(express.json())

app.use('/tasks', taskRoutes)

app.get('/health', (_, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})