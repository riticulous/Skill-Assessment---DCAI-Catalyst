import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ReportNav } from '../components/report/ReportNav';
import { ReportHero } from '../components/report/ReportHero';
import { ReportStats } from '../components/report/ReportStats';
import { SkillMatrix, type SkillScore } from '../components/report/SkillMatrix';
import { GapAnalysis } from '../components/report/GapAnalysis';
import { LearningPlan, type LearningModule } from '../components/report/LearningPlan';
import { ReportCTA } from '../components/report/ReportCTA';
import { Footer } from '../components/landing/Footer';
import { getReport } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface ReportData {
  session_id: string;
  candidate_name: string;
  role_title: string;
  overall_score: number;
  overall_percentage: number;
  classification: string;
  skill_scores: any[];
  learning_plans: any[];
  assessed_skills: any[];
  total_learning_hours: number;
}

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { session } = useAuth();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(() => {
    if (!report || exporting) return;
    setExporting(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pw = 210;
      const margin = 15;
      const cw = pw - margin * 2;
      let y = margin;

      const checkPage = (need: number) => {
        if (y + need > 282) { pdf.addPage(); y = margin; }
      };

      const heading = (text: string, size = 16) => {
        checkPage(12);
        pdf.setFont('helvetica', 'bold').setFontSize(size);
        pdf.text(text, margin, y);
        y += size * 0.5 + 2;
      };

      const label = (text: string) => {
        checkPage(8);
        pdf.setFont('helvetica', 'normal').setFontSize(8).setTextColor(120);
        pdf.text(text.toUpperCase(), margin, y);
        y += 4;
        pdf.setTextColor(0);
      };

      const body = (text: string, indent = 0) => {
        pdf.setFont('helvetica', 'normal').setFontSize(10).setTextColor(40);
        const lines = pdf.splitTextToSize(text, cw - indent);
        for (const line of lines) {
          checkPage(5);
          pdf.text(line, margin + indent, y);
          y += 5;
        }
        pdf.setTextColor(0);
      };

      const separator = () => {
        checkPage(6);
        y += 2;
        pdf.setDrawColor(200);
        pdf.line(margin, y, pw - margin, y);
        y += 4;
      };

      // ── Title ──
      pdf.setFont('helvetica', 'bold').setFontSize(22);
      pdf.text('Skillprobe Report', margin, y);
      y += 10;

      // ── Overview ──
      label('Candidate');
      body(report.candidate_name || 'N/A');
      y += 2;
      label('Target Role');
      body(report.role_title || 'N/A');
      y += 2;
      label('Overall Score');
      body(`${Math.round(report.overall_percentage)}% — ${report.classification}`);
      y += 2;
      label('Learning Plan');
      body(`${report.total_learning_hours.toFixed(0)} hours across ${report.learning_plans.length} skill${report.learning_plans.length !== 1 ? 's' : ''}`);

      separator();

      // ── Skill Scores ──
      heading('Skill Scores');
      y += 2;

      for (const s of report.skill_scores) {
        checkPage(22);
        const maxScore = s.max_score ?? 10;
        pdf.setFont('helvetica', 'bold').setFontSize(11);
        pdf.text(s.skill, margin, y);
        pdf.setFont('helvetica', 'normal').setFontSize(10);
        const scoreText = `${s.score.toFixed(1)} / ${maxScore}`;
        pdf.text(scoreText, pw - margin - pdf.getTextWidth(scoreText), y);
        y += 6;

        if (s.evidence) {
          pdf.setFont('helvetica', 'italic').setFontSize(9).setTextColor(100);
          const evidLines = pdf.splitTextToSize(`"${s.evidence}"`, cw - 4);
          for (const l of evidLines) { checkPage(4.5); pdf.text(l, margin + 2, y); y += 4.5; }
          pdf.setTextColor(0);
        }

        if (s.strengths?.length) {
          for (const t of s.strengths) {
            checkPage(5);
            pdf.setFont('helvetica', 'normal').setFontSize(9).setTextColor(60);
            pdf.text(`  + ${t}`, margin + 2, y);
            y += 4.5;
          }
        }
        if (s.gaps?.length) {
          for (const t of s.gaps) {
            checkPage(5);
            pdf.setFont('helvetica', 'normal').setFontSize(9).setTextColor(60);
            pdf.text(`  - ${t}`, margin + 2, y);
            y += 4.5;
          }
        }
        pdf.setTextColor(0);
        y += 3;
      }

      separator();

      // ── Gap Analysis ──
      const gapSkills = report.skill_scores
        .filter((s: any) => (s.max_score ?? 10) - s.score >= 3)
        .sort((a: any, b: any) => ((b.max_score ?? 10) - b.score) - ((a.max_score ?? 10) - a.score));

      if (gapSkills.length) {
        heading('Gap Analysis');
        y += 2;
        for (const s of gapSkills) {
          const maxScore = s.max_score ?? 10;
          const delta = maxScore - s.score;
          const tag = delta >= 5 ? 'CRITICAL' : 'ADJACENT';
          checkPage(10);
          pdf.setFont('helvetica', 'bold').setFontSize(10);
          pdf.text(`[${tag}] ${s.skill}  (gap: -${delta.toFixed(1)})`, margin, y);
          y += 5;
          if (s.gaps?.length) {
            body(s.gaps.join('. '), 2);
          }
          y += 3;
        }
        separator();
      }

      // ── Learning Plan ──
      if (report.learning_plans.length) {
        heading('Learning Plan');
        y += 2;
        for (const plan of report.learning_plans) {
          checkPage(14);
          pdf.setFont('helvetica', 'bold').setFontSize(11);
          pdf.text(plan.skill, margin, y);
          pdf.setFont('helvetica', 'normal').setFontSize(9).setTextColor(100);
          const meta = `${plan.estimated_hours ?? '?'}h · ${plan.priority || 'high'} priority`;
          pdf.text(meta, pw - margin - pdf.getTextWidth(meta), y);
          pdf.setTextColor(0);
          y += 6;

          for (const r of (plan.resources || [])) {
            checkPage(12);
            pdf.setFont('helvetica', 'normal').setFontSize(9);
            const title = r.title || 'Resource';
            const hrs = r.estimated_hours ? ` (${r.estimated_hours}h)` : '';
            body(`• ${title}${hrs}`, 2);
            if (r.url) {
              pdf.setFont('helvetica', 'normal').setFontSize(8).setTextColor(80);
              checkPage(5);
              pdf.textWithLink(r.url, margin + 6, y, { url: r.url });
              y += 4.5;
              pdf.setTextColor(0);
            }
          }
          y += 4;
        }
      }

      // ── Footer ──
      checkPage(12);
      y += 4;
      pdf.setDrawColor(200);
      pdf.line(margin, y, pw - margin, y);
      y += 6;
      pdf.setFont('helvetica', 'normal').setFontSize(8).setTextColor(140);
      pdf.text(`Generated by Skillprobe · ${new Date().toLocaleDateString()}`, margin, y);

      const filename = report.role_title
        ? `Skillprobe - ${report.role_title.slice(0, 50)}.pdf`
        : 'Skillprobe Report.pdf';
      pdf.save(filename);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setExporting(false);
    }
  }, [exporting, report]);

  useEffect(() => {
    if (!sessionId || !session?.access_token) return;
    let attempts = 0;
    let cancelled = false;
    const fetchReport = async () => {
      if (cancelled) return;
      try {
        const data = await getReport(sessionId, session.access_token);
        if (!cancelled) {
          setReport(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled && ++attempts < 10) {
          setTimeout(fetchReport, 2000);
        } else if (!cancelled) {
          setError(err.message || 'Failed to load report');
          setLoading(false);
        }
      }
    };
    fetchReport();
    return () => { cancelled = true; };
  }, [sessionId, session?.access_token]);

  if (loading) {
    return (
      <main className="grain min-h-screen bg-background text-foreground">
        <ReportNav />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4" style={{ color: 'var(--violet)' }} />
            <p className="text-sm text-muted-foreground">Building your report…</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="grain min-h-screen bg-background text-foreground">
        <ReportNav />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-3" style={{ color: 'var(--rose)' }} />
            <p className="text-sm mb-1">Unable to load report</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const skillScores: SkillScore[] = report.skill_scores.map((s: any) => ({
    name: s.skill,
    score: s.score,
    required: s.max_score ?? 10,
    evidence: s.evidence || 'No additional evidence recorded.',
    rationale:
      [
        ...(s.strengths || []).map((t: string) => `✓ ${t}`),
        ...(s.gaps || []).map((t: string) => `✗ ${t}`),
      ].join(' ') || 'No detailed rationale available.',
  }));

  const gaps = report.skill_scores
    .filter((s: any) => (s.max_score ?? 10) - s.score >= 3)
    .sort((a: any, b: any) => ((b.max_score ?? 10) - b.score) - ((a.max_score ?? 10) - a.score))
    .map((s: any) => ({
      tag: ((s.max_score ?? 10) - s.score >= 5 ? 'Critical' : 'Adjacent') as 'Critical' | 'Adjacent',
      skill: s.skill,
      delta: `−${((s.max_score ?? 10) - s.score).toFixed(1)}`,
      note: s.gaps?.join('. ') || 'Gap identified in this area.',
    }));

  const strengths = report.skill_scores
    .filter((s: any) => s.score >= (s.max_score ?? 10) * 0.7)
    .slice(0, 3)
    .map((s: any) => ({
      skill: s.skill,
      note: s.strengths?.join('. ') || 'Demonstrated solid understanding.',
    }));

  const learningModules: LearningModule[] = report.learning_plans.flatMap(
    (plan: any, planIdx: number) =>
      (plan.resources || []).map((r: any, rIdx: number) => ({
        week: `Wk ${planIdx + 1}`,
        topic: r.title || plan.skill,
        hours: `${r.estimated_hours ?? 5}h`,
        format: (
          r.type === 'course' ? 'Course'
          : r.type === 'project' ? 'Project'
          : r.type === 'workshop' ? 'Workshop'
          : 'Reading'
        ) as LearningModule['format'],
        source: r.title || plan.skill,
        url: r.url || undefined,
        why: rIdx === 0 ? `Covers ${plan.skill} — priority: ${plan.priority || 'high'}` : `Continued ${plan.skill} study`,
      })),
  );

  const totalWeeks = report.learning_plans.length || 1;

  const criticalGapCount = gaps.filter((g) => g.tag === 'Critical').length;

  const reportStats = [
    { value: String(report.skill_scores.length), label: 'Skills probed', hint: 'across the JD' },
    {
      value:
        report.skill_scores.length > 0
          ? (
              report.skill_scores.reduce((a: number, s: any) => a + s.score, 0) /
              report.skill_scores.length
            ).toFixed(1)
          : '—',
      label: 'Avg. depth',
      hint: '/ 10',
    },
    { value: String(criticalGapCount), label: 'Critical gaps', hint: 'below threshold' },
    { value: `${report.total_learning_hours.toFixed(0)}h`, label: 'Learning plan', hint: 'to close the gaps' },
  ];

  const verdict = `${criticalGapCount} critical gap${criticalGapCount !== 1 ? 's' : ''} · ${totalWeeks}-week catch-up`;

  return (
    <main className="grain min-h-screen bg-background text-foreground">
      <ReportNav onExport={handleExport} exporting={exporting} />
      <ReportHero
        candidate={report.candidate_name || 'Candidate'}
        role={report.role_title || 'Target Role'}
        company=""
        score={Math.round(report.overall_percentage)}
        verdict={verdict}
        summary={report.classification || ''}
        completedAt="recently"
      />
      <ReportStats stats={reportStats} />
      {skillScores.length > 0 && <SkillMatrix skills={skillScores} />}
      {gaps.length > 0 && <GapAnalysis gaps={gaps} strengths={strengths} />}
      {learningModules.length > 0 && (
        <LearningPlan
          modules={learningModules}
          totalHours={Math.round(report.total_learning_hours)}
          totalWeeks={totalWeeks}
        />
      )}
      <ReportCTA />
      <Footer />
    </main>
  );
}
