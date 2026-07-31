import { useState, useEffect, useRef, useCallback } from 'react';

const STEP_IDS = [
  'queued',
  'downloading',
  'transcribing',
  'ranking',
  'analyzing',
  'clipping',
  'done',
];

/**
 * useWebSocket — connects to a real WebSocket to track job processing status.
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

  const WS_URL = import.meta.env.VITE_WS_URL;
  const advanceToStep = useCallback((stepId) => {
    const stepIndex = STEP_IDS.indexOf(stepId);
    if (stepIndex === -1) return;

    setCurrentStep(stepId);
    setCompletedSteps(STEP_IDS.slice(0, stepIndex));
  }, []);



  // Real WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket(`${WS_URL}/ws/jobs/${jobId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'failed' || data.status === 'error') {
            setError(data.error || 'Job failed during processing.');
            setCurrentStep('failed');
          } else if (data.status) {
            advanceToStep(data.status);
          }
        } catch {
          console.warn('[Cliprank WS] Could not parse message:', event.data);
        }
      };

      ws.onerror = () => {
        setError('WebSocket connection error.');
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    } catch (err) {
      setError('Could not connect to WebSocket.');
    }
  }, [WS_URL, jobId, advanceToStep]);

  useEffect(() => {
    if (WS_URL && jobId) {
      connectWebSocket();
    } else {
      setError('WebSocket URL or Job ID is missing.');
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [jobId, WS_URL, connectWebSocket]);

  const isDone = currentStep === 'done' && completedSteps.length === STEP_IDS.length - 1;

  return { currentStep, completedSteps, isConnected, error, isDone };
}
