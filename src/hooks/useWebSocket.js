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

// Simulated delay between steps (ms)
const STEP_DELAYS = [1200, 2500, 3500, 2800, 2200, 3000, 0];

/**
 * useWebSocket — connects to a real WebSocket if WS_URL is configured,
 * otherwise simulates step-by-step progress for demo purposes.
 *
 * Expected WebSocket message format:
 * { "step": "downloading" | "transcribing" | ... }
 */
export default function useWebSocket(jobId) {
  const [currentStep, setCurrentStep] = useState('queued');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const mockTimerRef = useRef(null);

  const WS_URL = import.meta.env.VITE_WS_URL;
  const IS_DEV = import.meta.env.VITE_APP_ENV !== 'production';


  const advanceToStep = useCallback((stepId) => {
    const stepIndex = STEP_IDS.indexOf(stepId);
    if (stepIndex === -1) return;

    setCurrentStep(stepId);
    setCompletedSteps(STEP_IDS.slice(0, stepIndex));
  }, []);

  // Mock simulation
  const startMockSimulation = useCallback(() => {
    let stepIndex = 0;
    setIsConnected(true);
    setCurrentStep(STEP_IDS[0]);
    setCompletedSteps([]);

    const runNextStep = () => {
      if (stepIndex >= STEP_IDS.length) return;

      const delay = STEP_DELAYS[stepIndex];
      stepIndex++;

      mockTimerRef.current = setTimeout(() => {
        if (stepIndex < STEP_IDS.length) {
          advanceToStep(STEP_IDS[stepIndex]);
          runNextStep();
        } else {
          // All done
          setCurrentStep('done');
          setCompletedSteps(STEP_IDS.slice(0, -1));
        }
      }, delay);
    };

    runNextStep();
  }, [advanceToStep]);

  // Real WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket(`${WS_URL}/ws/job/${jobId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.step) {
            advanceToStep(data.step);
          }
        } catch {
          console.warn('[Cliprank WS] Could not parse message:', event.data);
        }
      };

      ws.onerror = () => {
        setError('WebSocket connection error. Falling back to demo mode.');
        setIsConnected(false);
        startMockSimulation();
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    } catch (err) {
      setError('Could not connect to WebSocket. Running in demo mode.');
      startMockSimulation();
    }
  }, [WS_URL, jobId, advanceToStep, startMockSimulation]);

  useEffect(() => {
    if (WS_URL && jobId && jobId !== 'demo') {
      connectWebSocket();
    } else {
      // Demo mode — simulate steps
      if (IS_DEV) {
        console.info(
          '[Cliprank] Running in demo mode.\n' +
          'Set VITE_WS_URL in .env.local to connect to a real WebSocket server.'
        );
      }
      startMockSimulation();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (mockTimerRef.current) {
        clearTimeout(mockTimerRef.current);
      }
    };
  }, [jobId, WS_URL, connectWebSocket, startMockSimulation]);

  const isDone = currentStep === 'done' && completedSteps.length === STEP_IDS.length - 1;

  return { currentStep, completedSteps, isConnected, error, isDone };
}
