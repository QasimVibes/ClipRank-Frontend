const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
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
    if (detail && typeof detail === 'object') {
      if (typeof detail.message === 'string') return detail.message;
      if (typeof detail.error === 'string') return detail.error;
    }
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || d.message || String(d)).join(', ');
    }
    return data.message || data.error || 'Request failed';
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

export async function deleteVideo(jobId) {
  const response = await apiFetch(`/api/videos/${jobId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

// ── Manual Video Cutter ──

export async function fetchManualVideo(url) {
  const response = await apiFetch('/api/manual-clip/fetch', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function processManualClips(url, videoId, clips) {
  const response = await apiFetch('/api/manual-clip/process', {
    method: 'POST',
    body: JSON.stringify({ url, videoId, clips }),
  });
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

// ── Social / YouTube ──

export async function getYouTubeStatus() {
  const response = await apiFetch('/api/social/youtube/status');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getYouTubeConnectUrl() {
  const response = await apiFetch('/api/social/youtube/connect-url');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function disconnectYouTube() {
  const response = await apiFetch('/api/social/youtube/disconnect', { method: 'DELETE' });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function listSocialUploads(platform = null, page = 1, limit = 20) {
  const platformParam = platform ? `&platform=${platform}` : '';
  const response = await apiFetch(`/api/social/uploads?page=${page}&limit=${limit}${platformParam}`);
  if (!response.ok) throw new Error(await parseError(response));
  const data = await response.json();
  if (platform && data.items) {
    data.items = data.items.filter(item => !item.platform || item.platform === platform);
  }
  return data;
}

export async function listUploadJobs(platform = null, page = 1, limit = 20) {
  const platformParam = platform ? `&platform=${platform}` : '';
  const response = await apiFetch(`/api/social/jobs?page=${page}&limit=${limit}${platformParam}`);
  if (!response.ok) throw new Error(await parseError(response));
  const data = await response.json();
  if (platform && data.items) {
    data.items = data.items.filter(item => !item.platform || item.platform === platform);
  }
  return data;
}

export async function publishClipToYouTube(clipId, { title, description, privacyStatus = 'private', tags } = {}) {
  const response = await apiFetch(`/api/social/clips/${clipId}/publish/youtube`, {
    method: 'POST',
    body: JSON.stringify({ title, description, privacyStatus, tags }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function bulkPublishToYouTube(clips) {
  const response = await apiFetch('/api/social/clips/publish/youtube/bulk', {
    method: 'POST',
    body: JSON.stringify({
      clips: clips.map((c) => ({
        clip_id: c.clipId,
        title: c.title,
        description: c.description,
        privacyStatus: c.privacyStatus ?? 'private',
        tags: c.tags,
      })),
    }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getUploadJob(jobId) {
  const response = await apiFetch(`/api/social/jobs/${jobId}`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getBatchUploadJobs(batchId) {
  const response = await apiFetch(`/api/social/jobs/batch/${batchId}`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

/** Clips ready to publish (approved/completed, has video, not yet on YouTube) */
export async function fetchPublishableClips(platform = 'youtube') {
  const { items: videos } = await listVideos(1, 50);
  const doneVideos = (videos ?? []).filter((v) => v.status === 'done');
  const publishable = [];

  for (const video of doneVideos) {
    const clips = await getVideoClips(video._id);
    for (const clip of clips) {
      const postedToPlatform = (clip.posted_to ?? []).some(
        (entry) => (typeof entry === 'object' ? entry.platform : String(entry)) === platform,
      );
      const isReady = (clip.status === 'approved' || clip.status === 'completed') && clip.public_url;
      if (isReady && !postedToPlatform) {
        const dur = Math.max(0, Math.round((clip.end || 0) - (clip.start || 0)));
        publishable.push({
          id: clip._id,
          title: clip.title || `Clip at ${Math.round(clip.start || 0)}s`,
          reason: clip.reason,
          score: clip.score,
          duration: `${Math.floor(dur / 60)}:${(dur % 60).toString().padStart(2, '0')}`,
          public_url: clip.public_url,
          videoId: video._id,
          videoTitle: video.title || 'Untitled',
        });
      }
    }
  }

  return publishable;
}

// ── Social / Facebook ──

export async function getFacebookStatus() {
  const response = await apiFetch('/api/social/facebook/status');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getFacebookConnectUrl() {
  const response = await apiFetch('/api/social/facebook/connect-url');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function disconnectFacebook() {
  const response = await apiFetch('/api/social/facebook/disconnect', { method: 'DELETE' });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function listFacebookPages() {
  const response = await apiFetch('/api/social/facebook/pages');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function publishClipToFacebook(clipId, { title, description, privacyStatus = 'public', pageId, tags } = {}) {
  const response = await apiFetch(`/api/social/clips/${clipId}/publish/facebook`, {
    method: 'POST',
    body: JSON.stringify({ title, description, privacyStatus, pageId, tags }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function bulkPublishToFacebook(clips) {
  const response = await apiFetch('/api/social/clips/publish/facebook/bulk', {
    method: 'POST',
    body: JSON.stringify({
      clips: clips.map((c) => ({
        clip_id: c.clipId,
        title: c.title,
        description: c.description,
        privacyStatus: c.privacyStatus ?? 'public',
        pageId: c.pageId,
        tags: c.tags,
      })),
    }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

// ── Social / Instagram ──

export async function getInstagramStatus() {
  const response = await apiFetch('/api/social/instagram/status');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function getInstagramConnectUrl() {
  const response = await apiFetch('/api/social/instagram/connect-url');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function disconnectInstagram() {
  const response = await apiFetch('/api/social/instagram/disconnect', { method: 'DELETE' });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function listInstagramAccounts() {
  const response = await apiFetch('/api/social/instagram/accounts');
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function publishClipToInstagram(clipId, { title, description, pageId, tags } = {}) {
  const response = await apiFetch(`/api/social/clips/${clipId}/publish/instagram`, {
    method: 'POST',
    body: JSON.stringify({ title, description, pageId, tags }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function bulkPublishToInstagram(clips) {
  const response = await apiFetch('/api/social/clips/publish/instagram/bulk', {
    method: 'POST',
    body: JSON.stringify({
      clips: clips.map((c) => ({
        clip_id: c.clipId,
        title: c.title,
        description: c.description,
        pageId: c.pageId,
        tags: c.tags,
      })),
    }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}
