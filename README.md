# Skill Navigator Pro

An AI-powered skill assessment platform that evaluates candidates against job descriptions using conversational AI, MCQs, and coding challenges — then generates personalized learning plans to bridge skill gaps.

## What It Does

1. **Upload a job description + resume** — the AI extracts and cross-references skills from both
2. **Take an adaptive assessment** — conversational questions, MCQs, and (for tech roles) a coding challenge in a sandbox editor
3. **Get a detailed report** — skill scores, gap analysis, and a curated learning plan with resources
4. **Export as PDF** — download a clean report for reference

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS 4, Framer Motion |
| **Backend** | Python, FastAPI, WebSockets |
| **LLM** | Groq (Llama 3.3 70B) with multi-key rotation |
| **Database** | Supabase (PostgreSQL + Auth + RLS) |
| **Code Editor** | CodeMirror 6 (JS, Python, Java, C++ highlighting) |

## Project Structure

```
skill-assessment-agent/
├── backend/
│   ├── app/
│   │   ├── middleware/     # JWT auth
│   │   ├── models/         # Pydantic schemas
│   │   ├── prompts/        # LLM prompt templates
│   │   ├── routes/         # FastAPI endpoints + WebSocket
│   │   └── services/       # LLM, scoring, assessment agent, DB
│   ├── requirements.txt
│   ├── supabase_schema.sql
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Landing, dashboard, assessment, report UI
│   │   ├── hooks/          # useAuth, useWebSocket
│   │   ├── lib/            # API client, Supabase client
│   │   └── pages/          # Home, AppPage, Assessment, Report
│   ├── package.json
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A [Supabase](https://supabase.com) project
- A [Groq](https://console.groq.com) API key

### 1. Database Setup

Run the SQL in `backend/supabase_schema.sql` in your Supabase SQL Editor to create the `sessions`, `messages`, and `reports` tables with RLS policies.

Enable **Google OAuth** in Supabase Auth settings (Authentication > Providers > Google).

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your keys in .env
uvicorn app.main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your Supabase URL and anon key in .env
npm run dev
```

### Environment Variables

**Backend** (`backend/.env`):

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Groq API key(s), comma-separated for rotation |
| `GROQ_MODEL` | Model name (default: `llama-3.3-70b-versatile`) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase **service role** key |
| `FRONTEND_URL` | Frontend origin for CORS |

**Frontend** (`frontend/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon/public** key |
| `VITE_API_URL` | Backend URL (leave empty for same-origin) |

## Key Features

- **Adaptive AI Assessment** — 1 conversational question + 2 MCQs per skill, with real-time scoring
- **Coding Sandbox** — IDE-like editor with syntax highlighting, line numbers, and language detection for tech roles
- **Smart Key Rotation** — multiple Groq API keys from different accounts rotate automatically on rate limits
- **Google OAuth** — one-click sign-in via Supabase Auth
- **PDF Export** — clean, text-based report export
- **Delete Assessments** — manage past assessment history

## Deployment (AWS EC2)

Deploy both frontend and backend on a single EC2 instance:

### 1. Launch EC2

- **AMI**: Ubuntu 24.04 LTS, **Instance**: t2.micro (free tier)
- **Security group**: Open ports 22 (SSH), 80 (HTTP)
- Download your `.pem` key file

### 2. First-time setup

```bash
ssh -i key.pem ubuntu@<EC2_IP> 'bash -s' < deploy/setup.sh
```

### 3. Create env files on the server

```bash
ssh -i key.pem ubuntu@<EC2_IP>

# Create backend env
mkdir -p /home/ubuntu/app/backend /home/ubuntu/app/frontend
nano /home/ubuntu/app/backend/.env    # paste your backend env vars
nano /home/ubuntu/app/frontend/.env   # paste your frontend env vars
exit
```

### 4. Deploy

```bash
./deploy/deploy.sh <EC2_IP> key.pem
```

Site is live at `http://<EC2_IP>`. Subsequent deploys are the same single command.

## License

MIT
