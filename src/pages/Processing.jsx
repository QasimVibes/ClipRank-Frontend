import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, WifiOff, Clock, Scissors, ArrowRight, AlertCircle
} from 'lucide-react';
import StepTracker, { STEPS } from '../components/StepTracker';
import useWebSocket from '../hooks/useWebSocket';

const ESTIMATED_TIMES = {
  queued: '~2 min remaining',
  downloading: '~90 sec remaining',
  transcribing: '~120 sec remaining',
  ranking: '~60 sec remaining',
  analyzing: '~30 sec remaining',
  clipping: '~60 sec remaining',
  done: 'Complete!',
};

export default function Processing() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentStep, completedSteps, isConnected, error, isDone } = useWebSocket(jobId);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Auto-redirect to gallery when done
  useEffect(() => {
    if (isDone && !hasRedirected) {
      setHasRedirected(true);
      const timer = setTimeout(() => {
        navigate(`/gallery/${jobId}`);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isDone, jobId, navigate, hasRedirected]);

  const currentStepData = STEPS.find((s) => s.id === currentStep);
  const stepNumber = STEPS.findIndex((s) => s.id === currentStep) + 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col gap-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-accent" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary">
            {isDone ? '🎉 Clips Ready!' : 'Processing your video'}
          </h1>
          <p className="text-muted text-sm">
            {isDone
              ? 'Redirecting you to the clip gallery...'
              : `Job ${jobId ? `#${jobId.slice(-8)}` : 'in progress'}`}
          </p>
        </motion.div>

        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface border border-border"
        >
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-success" />
            ) : (
              <WifiOff className="w-4 h-4 text-muted" />
            )}
            <span className="text-xs text-muted">
              {isConnected ? 'Live updates connected' : 'Connecting or Offline...'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="w-3.5 h-3.5" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStep}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {ESTIMATED_TIMES[currentStep]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/30"
          >
            <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-warning">{error}</p>
          </motion.div>
        )}

        {/* Current step callout */}
        <AnimatePresence mode="wait">
          {!isDone && currentStepData && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4 px-6 rounded-2xl bg-accent/10 border border-accent/20"
            >
              <div className="text-3xl mb-2">{currentStepData.icon}</div>
              <div className="text-sm font-semibold text-accent-light">
                Step {stepNumber} of {STEPS.length}
              </div>
              <div className="text-base font-bold text-primary mt-1">
                {currentStepData.label}
              </div>
              <div className="text-xs text-muted mt-1">{currentStepData.description}</div>
            </motion.div>
          )}

          {isDone && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 px-6 rounded-2xl bg-success/10 border border-success/30"
            >
              <div className="text-4xl mb-3">🎉</div>
              <div className="text-lg font-bold text-success">All clips are ready!</div>
              <div className="text-xs text-muted mt-1">
                Redirecting to gallery automatically...
              </div>
              <div className="mt-4 h-1 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-success rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: 'linear' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step tracker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6"
        >
          <StepTracker currentStep={currentStep} completedSteps={completedSteps} />
        </motion.div>

        {/* Manual navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-ghost text-sm"
            id="back-to-submit"
          >
            ← Submit another
          </button>
          <button
            onClick={() => navigate(isDone ? `/gallery/${jobId}` : '/history')}
            className={`${isDone ? 'btn-primary' : 'btn-secondary'} text-sm flex items-center gap-2`}
            id="go-to-gallery"
          >
            {isDone ? 'Go to gallery' : 'Go to history'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
