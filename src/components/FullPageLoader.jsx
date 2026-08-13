import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          {/* Outer glow rings */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-2xl bg-accent/30"
          />
          <motion.div
            animate={{
              scale: [1, 1.8, 1.8],
              opacity: [0.3, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            className="absolute inset-0 rounded-2xl bg-purple-500/20"
          />

          {/* Logo container */}
          <div
            className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(124,58,237,0.4)]"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #a855f7)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Scissors className="h-10 w-10 text-white" />
            </motion.div>
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <h2 className="text-xl font-extrabold tracking-tight text-primary">
            ClipRank
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
