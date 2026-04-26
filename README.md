# SkillProbe — AI-Powered Skill Assessment Agent

**Get that dream job.** SkillProbe is an intelligent skill assessment platform that analyzes the gap between a job description and your resume, conducts an adaptive AI-driven assessment (conversational questions, MCQs, and a coding challenge), then generates a detailed report with personalized learning plans to help you prepare.

> **Live:** [https://skillprobe-dcai.duckdns.org](https://skillprobe-dcai.duckdns.org)

---

## How It Works

1. **Paste a job description & upload your resume** — the AI extracts skills from both and identifies gaps.
2. **Take an adaptive assessment** — for each skill gap the agent asks a conversational question followed by two MCQs, dynamically adjusting difficulty based on your answers.
3. **Tackle a coding challenge** — for technical roles, a medium-level DSA problem is generated in the most prominent language from your JD + resume.
4. **Get your report** — scores per skill, an overall proficiency classification, and a curated learning plan with clickable resource links.
5. **Export as PDF** — download a clean, plain-text PDF of your full report.

---

## Screenshots

<!-- Replace the placeholders below with actual screenshots -->

| Landing Page | Dashboard |
|:---:|:---:|
| <img width="1425" height="765" alt="Screenshot 2026-04-26 at 9 14 31 PM" src="https://github.com/user-attachments/assets/5fc84ef6-3ad3-4f24-9651-577c307f2089" /> | <img width="1429" height="768" alt="Screenshot 2026-04-26 at 9 16 01 PM" src="https://github.com/user-attachments/assets/ff17cd85-3c54-4dbb-86ef-cdcb888745d2" /> |

| Assessment — Text & MCQ 
|:---:|:---:|
| <img width="1470" height="764" alt="Screenshot 2026-04-26 at 9 18 54 PM" src="https://github.com/user-attachments/assets/4b1538d3-dd4f-46ff-8eed-7ef242ec9de7" />
 | 

| Report & Learning Plan | PDF Export |
|:---:|:---:|
| <img width="1470" height="766" alt="Screenshot 2026-04-26 at 9 20 02 PM" src="https://github.com/user-attachments/assets/7a6f3ca3-e1d9-46a2-ba28-1229bd12114f" />
 | <img width="1264" height="888" alt="Screenshot 2026-04-26 at 9 20 43 PM" src="https://github.com/user-attachments/assets/8759b5dc-6151-4cf2-aac7-1fdc43babd96" /> |

---

## Features

- **Skill gap analysis** — automatically extracts and compares skills from JD and resume using LLMs
- **Multi-modal assessment** — text-based Q&A, interactive MCQs, and a live code editor with syntax highlighting
- **Adaptive questioning** — the AI agent adjusts follow-up questions based on previous answers
- **Coding challenges** — medium-level DSA problems with starter code, examples, and hints (CodeMirror editor)
- **Real-time WebSocket communication** — seamless, low-latency assessment experience
- **Detailed scoring** — per-skill scores (out of 10) with strengths, gaps, and proficiency levels
- **Learning plans** — curated resources (courses, articles, tutorials) with clickable links
- **PDF export** — plain-text PDF reports with all assessment data
- **Google OAuth** — secure authentication via Supabase Auth
- **Assessment history** — named assessments (e.g., "SWE 3 — Google") stored and accessible from the dashboard
- **API key rotation** — multiple Groq API keys with automatic failover on rate limits
- **Responsive UI** — dark-themed, modern design built with Tailwind CSS v4 and Framer Motion

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion, Recharts |
| **Code Editor** | CodeMirror 6 (Python, JavaScript, Java, C++ support) |
| **Backend** | Python 3.11+, FastAPI, WebSockets, Uvicorn |
| **LLM** | Groq API — Llama 3.3 70B Versatile (with multi-key rotation) |
| **Database & Auth** | Supabase (PostgreSQL + Google OAuth + JWT) |
| **PDF Generation** | jsPDF |
| **Deployment** | AWS EC2, Nginx, systemd, Let's Encrypt SSL |

---

## Project Structure

```
skill-assessment-agent/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app entry point
│   │   ├── config.py               # Environment settings
│   │   ├── middleware/
│   │   │   └── auth.py             # JWT verification (local + Supabase fallback)
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic models
│   │   ├── prompts/
│   │   │   ├── assessment.py       # Assessment, MCQ, coding prompts
│   │   │   └── extraction.py       # Skill extraction prompts
│   │   ├── routes/
│   │   │   ├── session.py          # POST /api/session — create assessment
│   │   │   ├── chat.py             # WS  /api/ws/chat/:id — live assessment
│   │   │   ├── report.py           # GET /api/report/:id — fetch report
│   │   │   └── history.py          # GET /api/sessions — user history
│   │   └── services/
│   │       ├── llm.py              # Groq client + key rotation
│   │       ├── assessment.py       # Assessment agent logic
│   │       ├── scoring.py          # Skill & code scoring
│   │       ├── skill_extractor.py  # JD/resume skill extraction
│   │       ├── resume_parser.py    # PDF text extraction (PyMuPDF)
│   │       └── db.py               # Supabase database operations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── AppPage.tsx         # Dashboard (new assessment + history)
│   │   │   ├── Assessment.tsx      # Live assessment page
│   │   │   └── Report.tsx          # Report + PDF export
│   │   ├── components/
│   │   │   ├── landing/            # Landing page components
│   │   │   ├── dashboard/          # Dashboard components
│   │   │   ├── assessment/         # ChatThread, MCQCard, CodeEditor, etc.
│   │   │   └── report/             # Report sections, learning plan
│   │   ├── hooks/
│   │   │   ├── useAuth.ts          # Supabase auth hook
│   │   │   └── useWebSocket.ts     # WebSocket communication hook
│   │   └── lib/
│   │       └── api.ts              # REST + WebSocket API client
│   ├── package.json
│   └── .env.example
├── deploy/
│   ├── deploy.sh                   # EC2 deployment script
│   ├── setup.sh                    # First-time server setup
│   ├── nginx.conf                  # Nginx reverse proxy config
│   └── skill-navigator.service     # systemd unit file
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites

- **Python 3.11+**
- **Node.js 20+** and npm
- A **Supabase** project (free tier works)
- A **Groq** API key ([console.groq.com](https://console.groq.com))

### 1. Database Setup

Create the following tables in your Supabase SQL editor:

```sql
-- Sessions
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT DEFAULT '',
  jd_text TEXT NOT NULL,
  resume_text TEXT NOT NULL,
  jd_skills JSONB DEFAULT '[]',
  resume_skills JSONB DEFAULT '[]',
  skills_to_assess JSONB DEFAULT '[]',
  current_skill_index INT DEFAULT 0,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reports
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  overall_score NUMERIC DEFAULT 0,
  overall_percentage NUMERIC DEFAULT 0,
  classification TEXT DEFAULT '',
  skill_scores JSONB DEFAULT '[]',
  learning_plans JSONB DEFAULT '[]',
  total_learning_hours NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Then enable **Google OAuth** in your Supabase project under Authentication > Providers.

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env from the example
cp .env.example .env
# Fill in your values (see Environment Variables below)

uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
npm install

# Create .env from the example
cp .env.example .env
# Fill in your values (see Environment Variables below)

npm run dev
```

The app runs at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `LLM_PROVIDER` | LLM provider to use (default: `groq`) |
| `GROQ_API_KEY` | Comma-separated Groq API keys for rotation |
| `GROQ_MODEL` | Model name (default: `llama-3.3-70b-versatile`) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g., `http://localhost:5173`) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase **service_role** key |
| `SUPABASE_JWT_SECRET` | *(Optional)* JWT secret for local token verification |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (leave empty for same-origin in production) |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon/public** key |

---

## Deployment (AWS EC2)

### First-Time Setup

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@<EC2_IP>

# Run the setup script (installs Python, Node 20, Nginx, etc.)
bash deploy/setup.sh
```

### Deploy

```bash
# From your local machine
./deploy/deploy.sh <EC2_IP> path/to/your-key.pem
```

This script will:
1. Pull latest code from GitHub
2. Install backend dependencies
3. Build the frontend
4. Configure Nginx as a reverse proxy
5. Restart the backend via systemd

### SSL (HTTPS)

After the first deploy, set up Let's Encrypt:

```bash
ssh -i your-key.pem ubuntu@<EC2_IP>
sudo certbot --nginx -d yourdomain.example.com
```

Certbot auto-renews certificates via a systemd timer.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/session` | Create a new assessment session (multipart: JD + resume PDF + title) |
| `POST` | `/api/session/text` | Create session with plain-text resume |
| `GET` | `/api/sessions` | List all sessions for the authenticated user |
| `DELETE` | `/api/session/:id` | Delete a session |
| `WS` | `/api/ws/chat/:id` | WebSocket for live assessment (text, MCQ, coding) |
| `GET` | `/api/report/:id` | Fetch the assessment report |
| `GET` | `/health` | Health check |

---
