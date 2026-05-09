import { Router, Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../middleware/auth'

const router = Router()

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

router.get('/:taskId/comments', requireAuth, async (req: Request, res: Response) => {
  const client = getUserClient(req.userToken!)
  const { taskId } = req.params

  const { data, error } = await client
    .from('comments')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

router.post('/:taskId/comments', requireAuth, async (req: Request, res: Response) => {
  const client = getUserClient(req.userToken!)
  const { taskId } = req.params
  const { body } = req.body

  if (!body || body.trim() === '') {
    res.status(400).json({ error: 'Comment body is required' })
    return
  }

  const { data, error } = await client
    .from('comments')
    .insert({
      task_id: taskId,
      user_id: req.userId!,
      body: body.trim()
    })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

router.delete('/comments/:id', requireAuth, async (req: Request, res: Response) => {
  const client = getUserClient(req.userToken!)
  const { id } = req.params

  const { error } = await client
    .from('comments')
    .delete()
    .eq('id', id)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(204).send()
})

export default router