const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function submitVideo(url) {
  const response = await fetch(`${API_URL}/api/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!response.ok) throw new Error('Failed to submit video');
  return response.json();
}

export async function listVideos(page = 1, limit = 50) {
  const response = await fetch(`${API_URL}/api/videos?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to list videos');
  return response.json();
}

export async function getVideoClips(jobId) {
  const response = await fetch(`${API_URL}/api/videos/${jobId}/clips`);
  if (!response.ok) throw new Error('Failed to fetch clips');
  return response.json();
}

export async function approveClip(clipId) {
  const response = await fetch(`${API_URL}/api/clips/${clipId}/approve`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to approve clip');
  return response.json();
}

export async function rejectClip(clipId) {
  const response = await fetch(`${API_URL}/api/clips/${clipId}/reject`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to reject clip');
  return response.json();
}

export function getClipDownloadUrl(clipId) {
  return `${API_URL}/api/clips/${clipId}/download`;
}
