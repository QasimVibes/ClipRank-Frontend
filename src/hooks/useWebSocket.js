import { useState, useEffect, useRef, useCallback } from 'react';
import { getStoredToken } from '../api';

const STEP_IDS = [
  'queued',
  'downloading',
  'transcribing',
  'ranking',
  'analyzing',
  'clipping',
  'done',
];

const TERMINAL_STATUSES = new Set(['done', 'failed', 'error']);
const MAX_RETRIES = 6;
const BASE_RETRY_DELAY = 1500; // ms

/**
 * useWebSocket — connects to a real WebSocket to track job processing status.
 *
 * Features:
 * - Fetches current HTTP status immediately on mount (so mid-job navigation shows correct step)
 * - Reconnects automatically with exponential backoff (up to MAX_RETRIES)
 * - Falls back to HTTP polling every 4 seconds when WS is not connected
 * - Stops polling / reconnecting once a terminal status is reached
 *
 * Expected WebSocket message format:
 * { "status": "downloading" | "transcribing" | ... }
 */
export default function useWebSocket(jobId) {
  const [currentStep, setCurrentStep] = useState('queued');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const isTerminalRef = useRef(false);
  const isConnectedRef = useRef(false);

  const WS_URL = import.meta.env.VITE_WS_URL;
  const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');

  // ── Step helpers ────────────────────────────────────────────────────────────

  const advanceToStep = useCallback((stepId) => {
    const stepIndex = STEP_IDS.indexOf(stepId);
    if (stepIndex === -1) return;

    setCurrentStep(stepId);
    setCompletedSteps(STEP_IDS.slice(0, stepIndex));

    if (TERMINAL_STATUSES.has(stepId)) {
      isTerminalRef.current = true;
    }
  }, []);

  // ── HTTP polling fallback ────────────────────────────────────────────────────

  const fetchStatus = useCallback(async () => {
    if (isTerminalRef.current || isConnectedRef.current) return;
    try {
      const token = getStoredToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_URL}/api/videos/${jobId}`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      if (data.status) {
        advanceToStep(data.status);
        if (data.status === 'failed' || data.status === 'error') {
          setError(data.error || 'Job failed during processing.');
        }
      }
    } catch {
      // silently ignore polling errors
    }
  }, [API_URL, jobId, advanceToStep]);

  const startPolling = useCallback(() => {
    if (pollTimerRef.current) return; // already polling
    // Fetch immediately, then every 4 seconds
    fetchStatus();
    pollTimerRef.current = setInterval(() => {
      if (isTerminalRef.current || isConnectedRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
        return;
      }
      fetchStatus();
    }, 4000);
  }, [fetchStatus]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  // ── WebSocket connection ─────────────────────────────────────────────────────

  const connectWebSocket = useCallback(() => {
    if (isTerminalRef.current) return;
    if (!WS_URL || !jobId) {
      setError('WebSocket URL or Job ID is missing.');
      startPolling();
      return;
    }

    try {
      const token = getStoredToken();
      const wsUrl = token
        ? `${WS_URL}/ws/jobs/${jobId}?token=${encodeURIComponent(token)}`
        : `${WS_URL}/ws/jobs/${jobId}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        isConnectedRef.current = true;
        setError(null);
        retryCountRef.current = 0;
        stopPolling(); // WS is live — stop HTTP polling
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'failed' || data.status === 'error') {
            setError(data.error || 'Job failed during processing.');
            setCurrentStep('failed');
            isTerminalRef.current = true;
          } else if (data.status) {
            advanceToStep(data.status);
          }
        } catch {
          console.warn('[ClipRank WS] Could not parse message:', event.data);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
        isConnectedRef.current = false;
        startPolling();
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        isConnectedRef.current = false;

        if (isTerminalRef.current) return;

        // Reconnect with exponential backoff
        if (retryCountRef.current < MAX_RETRIES) {
          const delay = Math.min(BASE_RETRY_DELAY * 2 ** retryCountRef.current, 30000);
          retryCountRef.current += 1;
          startPolling(); // Poll while waiting to reconnect
          retryTimerRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else {
          setError('Live updates unavailable. Falling back to polling...');
          startPolling();
        }
      };
    } catch {
      setError('Could not connect to WebSocket.');
      startPolling();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WS_URL, jobId, advanceToStep, startPolling, stopPolling]);

  // ── Mount: fetch current status immediately, then connect WS ───────────────

  useEffect(() => {
    if (!jobId) return;

    // 1. Fetch current HTTP status right away so UI is correct immediately
    fetchStatus();

    // 2. Connect WebSocket for real-time updates
    connectWebSocket();

    return () => {
      isTerminalRef.current = false;
      isConnectedRef.current = false;
      retryCountRef.current = 0;

      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on unmount
        wsRef.current.close();
        wsRef.current = null;
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      stopPolling();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const isDone = currentStep === 'done' && completedSteps.length === STEP_IDS.length - 1;

  return { currentStep, completedSteps, isConnected, error, isDone };
}
