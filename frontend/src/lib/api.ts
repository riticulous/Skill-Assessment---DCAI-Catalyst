const API_BASE = import.meta.env.VITE_API_URL || '';

function authHeaders(token: string | null): Record<string, string> {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function createSession(jdText: string, resumeFile: File, token: string | null = null, title: string = '') {
  const formData = new FormData();
  formData.append('jd_text', jdText);
  formData.append('resume', resumeFile);
  if (title) formData.append('title', title);

  const res = await fetch(`${API_BASE}/api/session`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to create session' }));
    throw new Error(err.detail || 'Failed to create session');
  }

  return res.json();
}

export async function createSessionText(jdText: string, resumeText: string, token: string | null = null) {
  const formData = new FormData();
  formData.append('jd_text', jdText);
  formData.append('resume_text', resumeText);

  const res = await fetch(`${API_BASE}/api/session/text`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to create session' }));
    throw new Error(err.detail || 'Failed to create session');
  }

  return res.json();
}

export async function getReport(sessionId: string, token: string | null = null) {
  const res = await fetch(`${API_BASE}/api/report/${sessionId}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to load report' }));
    throw new Error(err.detail || 'Failed to load report');
  }

  return res.json();
}

export async function getUserSessions(token: string) {
  const res = await fetch(`${API_BASE}/api/sessions`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to load sessions' }));
    throw new Error(err.detail || 'Failed to load sessions');
  }

  return res.json();
}

export async function deleteSession(sessionId: string, token: string) {
  const res = await fetch(`${API_BASE}/api/session/${sessionId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to delete session' }));
    throw new Error(err.detail || 'Failed to delete session');
  }

  return res.json();
}

export function getWebSocketUrl(sessionId: string, token: string | null = null): string {
  const wsBase = API_BASE
    ? API_BASE.replace(/^http/, 'ws')
    : `ws://${window.location.host}`;
  const url = `${wsBase}/api/ws/chat/${sessionId}`;
  if (token) return `${url}?token=${token}`;
  return url;
}
