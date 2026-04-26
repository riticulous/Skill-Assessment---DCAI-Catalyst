import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashNav } from '../components/dashboard/DashNav';
import { DashHeader } from '../components/dashboard/DashHeader';
import { StatStrip } from '../components/dashboard/StatStrip';
import { NewAssessment } from '../components/dashboard/NewAssessment';
import { PastAssessments } from '../components/dashboard/PastAssessments';
import { Footer } from '../components/landing/Footer';
import { createSession, getUserSessions, deleteSession } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface SessionItem {
  id: string;
  title: string;
  jd_snippet: string;
  is_complete: boolean;
  created_at: string;
  overall_percentage: number | null;
  classification: string | null;
}

export default function AppPage() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;
    let cancelled = false;
    async function load() {
      try {
        const data = await getUserSessions(session!.access_token);
        if (!cancelled) setSessions(data);
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setSessionsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [session?.access_token]);

  const handleStart = async (jd: string, file: File, title: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await createSession(jd, file, session?.access_token ?? null, title);
      navigate(`/assessment/${data.session_id}`, {
        state: { skills: data.skills_to_assess, total: data.total_skills },
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!session?.access_token) return;
    await deleteSession(id, session.access_token);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  const pastItems = sessions.map((s) => ({
    id: s.id,
    title: s.title || s.jd_snippet || 'Untitled assessment',
    date: new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    status: (s.is_complete ? 'done' : 'in_progress') as 'done' | 'in_progress',
    score: s.overall_percentage != null ? Math.round(s.overall_percentage) : undefined,
  }));

  const completedCount = sessions.filter((s) => s.is_complete).length;
  const avgScore =
    sessions.filter((s) => s.overall_percentage != null).length > 0
      ? (
          sessions
            .filter((s) => s.overall_percentage != null)
            .reduce((a, s) => a + (s.overall_percentage ?? 0), 0) /
          sessions.filter((s) => s.overall_percentage != null).length
        ).toFixed(1)
      : '—';

  const stats = [
    { label: 'Probes run', value: String(sessions.length || '—'), note: 'total' },
    { label: 'Completed', value: String(completedCount || '—'), note: 'assessments' },
    { label: 'Avg. score', value: avgScore, note: '/ 100' },
    { label: 'In progress', value: String(sessions.length - completedCount || '—'), note: 'active now' },
  ];

  return (
    <main className="grain min-h-screen bg-background text-foreground">
      <DashNav />
      <DashHeader name={firstName} />
      <StatStrip stats={stats} />

      <section className="mx-auto max-w-[1400px] px-6 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-12 gap-8 lg:gap-10">
          <div className="col-span-12 lg:col-span-7">
            <NewAssessment onStart={handleStart} loading={loading} error={error} />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <PastAssessments items={pastItems} loading={sessionsLoading} onDelete={handleDelete} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
