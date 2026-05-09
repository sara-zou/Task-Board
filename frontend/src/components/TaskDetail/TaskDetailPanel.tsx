import { useState, useEffect } from 'react'
import type { Task, Comment } from '../../types'
import { api } from '../../lib/api'
import { LuPencil, LuTrash2, LuSend } from 'react-icons/lu'

interface TaskDetailPanelProps {
  task: Task
  onClose: () => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<void>
}

export default function TaskDetailPanel({
  task,
  onClose,
  onEdit,
  onDelete
}: TaskDetailPanelProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [task.id])

  async function fetchComments() {
    try {
      setLoadingComments(true)
      const data = await api.getComments(task.id)
      setComments(data)
    } catch {
      console.error('Failed to load comments')
    } finally {
      setLoadingComments(false)
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const comment = await api.createComment(task.id, newComment.trim())
      setComments(prev => [...prev, comment])
      setNewComment('')
    } catch {
      console.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteComment(id: string) {
    try {
      await api.deleteComment(id)
      setComments(prev => prev.filter(c => c.id !== id))
    } catch {
      console.error('Failed to delete comment')
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <span className={`priority-badge priority-badge--${task.priority}`}>
            {task.priority}
          </span>
          <div className="detail-header-actions">
            <button
              className="task-edit-btn"
              onClick={() => onEdit(task)}
              aria-label="Edit task"
            >
              <LuPencil size={14} />
            </button>
            <button
              className="task-delete-btn"
              onClick={async () => {
                await onDelete(task.id)
                onClose()
              }}
              aria-label="Delete task"
            >
              <LuTrash2 size={14} />
            </button>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="detail-body">
          <h2 className="detail-title">{task.title}</h2>

          {task.description && (
            <p className="detail-description">{task.description}</p>
          )}

          <div className="detail-meta">
            <span className="detail-meta-item">
              Status: <strong>{task.status.replace('_', ' ')}</strong>
            </span>
            {task.due_date && (
              <span className="detail-meta-item">
                Due: <strong>{new Date(task.due_date + 'T00:00:00').toLocaleDateString()}</strong>
              </span>
            )}
          </div>

          <div className="detail-comments">
            <h3 className="detail-comments-title">
              Comments {comments.length > 0 && `· ${comments.length}`}
            </h3>

            {loadingComments ? (
              <div className="comments-loading">
                <div className="skeleton-card" style={{ height: '48px' }} />
                <div className="skeleton-card" style={{ height: '48px' }} />
              </div>
            ) : comments.length === 0 ? (
              <p className="comments-empty">No comments yet</p>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <span className="comment-time">{formatDate(comment.created_at)}</span>
                      <button
                        className="task-delete-btn"
                        onClick={() => handleDeleteComment(comment.id)}
                        aria-label="Delete comment"
                      >
                        <LuTrash2 size={12} />
                      </button>
                    </div>
                    <p className="comment-body">{comment.body}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="comment-input-row">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              />
              <button
                className="comment-send-btn"
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
                aria-label="Send comment"
              >
                <LuSend size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}