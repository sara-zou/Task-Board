import { Router, Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../middleware/auth'
import { CreateTaskBody, UpdateTaskBody } from '../types'

const router = Router()

// creates a Supabase client
function getUserClient(token: string) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      }
    }
  )
}

// fetch all tasks for the logged in user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const client = getUserClient(req.userToken!)

  const { data, error } = await client
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

// create a new task
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const client = getUserClient(req.userToken!)
  const body: CreateTaskBody = req.body

  if (!body.title || body.title.trim() === '') {
    res.status(400).json({ error: 'Title is required' })
    return
  }

  const { data, error } = await client
    .from('tasks')
    .insert({
      title: body.title.trim(),
      description: body.description,
      priority: body.priority ?? 'normal',
      due_date: body.due_date,
      user_id: req.userId!
    })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

// update a task
router.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  const client = getUserClient(req.userToken!)
  const { id } = req.params
  const body: UpdateTaskBody = req.body

  const { data, error } = await client
    .from('tasks')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

// delete a task
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const client = getUserClient(req.userToken!)
  const { id } = req.params

  const { error } = await client
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(204).send()
})

export default router