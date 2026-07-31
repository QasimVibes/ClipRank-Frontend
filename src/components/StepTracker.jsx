import { CheckCircle2, Circle, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    id: 'queued',
    label: 'Queued',
    description: 'Your job is in the queue',
    icon: '📥',
  },
  {
    id: 'downloading',
    label: 'Downloading',
    description: 'Fetching video from source',
    icon: '⬇️',
  },
  {
    id: 'transcribing',
    label: 'Transcribing',
    description: 'Converting speech to text',
    icon: '📝',
  },
  {
    id: 'ranking',
    label: 'Ranking',
    description: 'AI scoring each moment',
    icon: '🧠',
  },
  {
    id: 'analyzing',
    label: 'Analyzing',
    description: 'Finding the best clips',
    icon: '🔍',
  },
  {
    id: 'clipping',
    label: 'Clipping',
    description: 'Generating short videos',
    icon: '✂️',
  },
  {
    id: 'done',
    label: 'Done',
    description: 'Your clips are ready!',
    icon: '🎉',
  },
];

export default function StepTracker({ currentStep, completedSteps = [] }) {

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="flex flex-col gap-1">
          {STEPS.map((step, index) => {
            const isDoneStep = step.id === 'done';
            const isCompleted = completedSteps.includes(step.id) || (isDoneStep && currentStep === 'done');
            const isActive = step.id === currentStep && !isDoneStep;
            const isPending = !isCompleted && !isActive;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                className={`
                  relative flex items-start gap-4 px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-accent/10 border border-accent/20' : ''}
                  ${isCompleted ? 'bg-success/5' : ''}
                `}
              >
                {/* Step icon / state indicator */}
                <div className="relative z-10 flex-shrink-0 mt-0.5">
                  <AnimatePresence mode="wait">
                    {isCompleted && (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <CheckCircle2 className="w-10 h-10 text-success" />
                      </motion.div>
                    )}

                    {isActive && (
                      <motion.div
                        key="active"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative"
                      >
                        <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-accent animate-spin" />
                        </div>
                        {/* Ping animation */}
                        <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-30" />
                      </motion.div>
                    )}

                    {isPending && (
                      <motion.div
                        key="pending"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                          <Circle className="w-4 h-4 text-border" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`
                      text-sm font-semibold transition-colors duration-300
                      ${isCompleted ? 'text-success' : isActive ? 'text-primary' : 'text-muted/50'}
                    `}>
                      {step.label}
                    </span>

                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1 text-xs bg-accent/20 text-accent-light px-2 py-0.5 rounded-full font-medium"
                      >
                        <Zap className="w-3 h-3" />
                        In progress
                      </motion.span>
                    )}

                    {isCompleted && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-success/70 font-medium"
                      >
                        Complete
                      </motion.span>
                    )}
                  </div>

                  <p className={`
                    text-xs mt-0.5 transition-colors duration-300
                    ${isActive ? 'text-muted' : isPending ? 'text-muted/30' : 'text-muted/60'}
                  `}>
                    {step.description}
                  </p>

                  {/* Active step progress bar */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 h-1 bg-border rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
                        initial={{ width: '5%' }}
                        animate={{ width: '70%' }}
                        transition={{ duration: 2.5, ease: 'easeInOut' }}
                      />
                    </motion.div>
                  )}
                </div>

                {/* Emoji */}
                <div className={`
                  text-lg transition-opacity duration-300 flex-shrink-0
                  ${isPending ? 'opacity-20' : 'opacity-100'}
                `}>
                  {step.icon}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { STEPS };
