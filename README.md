# Kanban Task Board

A full-stack Kanban-style task board for task managing.

Live Demo at: https://task-board-gray-five.vercel.app/

---

## Features

- Drag and drop tasks between four different columns (To Do, In Progress, In Review, Done)
- Create, edit, and delete tasks with title, description, priority, and due date
- Task comments to open any task to view and add threaded comments
- Due date indicators to visually show when a task is due soon or overdue
- Priority rankings including low, normal, and high priority with color coding
- Authentication with email/password sign-up, sign-in, or continue as a guest
- Support data transfer after anonymous user signs up and logs in
- Responsive layout supports both mobile and desktop view

---

## Tech Stack

- React
- TypeScript
- Vite
- Node.js
- Express
- Supabase
- Vercel
- dnd-kit
- Render
  
---

## Running Locally

### Prerequisites
- Node.js
- A Supabase project with the schema below applied

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```
SUPABASE_URL=supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=supabase_service_role_key
SUPABASE_ANON_KEY=supabase_anon_key
PORT=3000
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:
```
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=supabase_project_url
VITE_SUPABASE_ANON_KEY=supabase_anon_key
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:3000`.

---

## Database Schema

```sql
CREATE TABLE tasks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT,
  status      TEXT        NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo', 'in_progress', 'in_review', 'done')),
  priority    TEXT        NOT NULL DEFAULT 'normal'
                CHECK (priority IN ('low', 'normal', 'high')),
  due_date    DATE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Row Level Security is enabled on both tables.

