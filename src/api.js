const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const TOKEN_KEY = 'cliprank-token';

let onUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function authHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseError(response) {
  try {
    const data = await response.json();
    const { detail } = data;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || d.message || String(d)).join(', ');
    }
    return data.message || 'Request failed';
  } catch {
    return 'Request failed';
  }
}

async function apiFetch(path, options = {}) {
  const headers = {
    ...options.headers,
    ...authHeaders(),
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    setStoredToken(null);
    onUnauthorized?.();
  }

  return response;
}

// ── Auth ──

export async function signup(username, email, password) {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getProfile() {
  const response = await apiFetch('/api/auth/profile');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

// ── Videos & Clips ──

export async function submitVideo(url, options = {}) {
  const { clipLength, captionStyle } = options;
  const body = { url };
  if (clipLength) body.clip_length = clipLength;
  if (captionStyle) body.caption_style = captionStyle;

  const response = await apiFetch('/api/videos', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function listVideos(page = 1, limit = 50) {
  const response = await apiFetch(`/api/videos?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getVideoClips(jobId) {
  const response = await apiFetch(`/api/videos/${jobId}/clips`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function approveClip(clipId) {
  const response = await apiFetch(`/api/clips/${clipId}/approve`, { method: 'POST' });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function rejectClip(clipId) {
  const response = await apiFetch(`/api/clips/${clipId}/reject`, { method: 'POST' });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export function getClipDownloadUrl(clipId) {
  return `${API_URL}/api/clips/${clipId}/download`;
}

export async function downloadClip(clipId, filename = 'clip.mp4') {
  const response = await apiFetch(`/api/clips/${clipId}/download`);
  if (!response.ok) throw new Error(await parseError(response));

  if (response.redirected) {
    window.open(response.url, '_blank');
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
