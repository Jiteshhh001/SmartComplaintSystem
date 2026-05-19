// Backend Wake-Up Screen - Shows while Render free-tier backend is cold-starting
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Server, Wifi, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const TIPS = [
  'Initializing secure connection...',
  'Waking up the server...',
  'Connecting to database...',
  'Almost there...',
  'Loading your data...',
];

const BackendWakeUp = ({ children }) => {
  const [backendReady, setBackendReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cycle through loading tips
  useEffect(() => {
    if (backendReady) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [backendReady]);

  // Animate progress bar
  useEffect(() => {
    if (backendReady) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Cap at 90% until actually ready
        return prev + Math.random() * 3;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [backendReady]);

  // Health check with retry
  useEffect(() => {
    let cancelled = false;
    let retryTimeout;

    const checkBackend = async () => {
      try {
        await api.get('/health');
        if (!cancelled) {
          setProgress(100);
          setShowSuccess(true);
          // Brief pause to show the success state
          setTimeout(() => {
            if (!cancelled) {
              setBackendReady(true);
              setChecking(false);
            }
          }, 800);
        }
      } catch (err) {
        // Backend not ready yet — retry in 2 seconds
        if (!cancelled) {
          retryTimeout = setTimeout(checkBackend, 2000);
        }
      }
    };

    checkBackend();

    return () => {
      cancelled = true;
      clearTimeout(retryTimeout);
    };
  }, []);

  // If backend responds instantly (local dev), skip the loading screen
  if (backendReady) return children;
  if (!checking) return children;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{
            boxShadow: showSuccess
              ? '0 0 40px rgba(34, 197, 94, 0.3)'
              : [
                  '0 0 20px rgba(99, 102, 241, 0.2)',
                  '0 0 40px rgba(99, 102, 241, 0.4)',
                  '0 0 20px rgba(99, 102, 241, 0.2)',
                ],
          }}
          transition={{ duration: 2, repeat: showSuccess ? 0 : Infinity }}
          className={`w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center ${
            showSuccess ? 'bg-emerald-500' : 'gradient-bg'
          }`}
        >
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="shield"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {showSuccess ? 'Connected!' : 'SmartComplaint AI'}
        </h1>

        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          {showSuccess
            ? 'Server is ready. Loading your experience...'
            : 'Please wait while we connect to the server'}
        </p>

        {/* Progress Bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden mb-6"
          style={{ backgroundColor: 'var(--border-color)' }}
        >
          <motion.div
            className={`h-full rounded-full ${showSuccess ? 'bg-emerald-500' : 'gradient-bg'}`}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Status Steps */}
        <div className="space-y-3 mb-8">
          {[
            { icon: Server, label: 'Server', done: progress > 30 },
            { icon: Wifi, label: 'Database', done: progress > 60 },
            { icon: Shield, label: 'Application', done: showSuccess },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    step.done
                      ? 'bg-emerald-100 dark:bg-emerald-900/20'
                      : 'bg-indigo-100 dark:bg-indigo-900/20'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  )}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {step.label}
                </span>
                <span
                  className="ml-auto text-xs font-medium"
                  style={{ color: step.done ? 'rgb(34, 197, 94)' : 'var(--text-muted)' }}
                >
                  {step.done ? 'Ready' : 'Connecting...'}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Rotating Tips */}
        {!showSuccess && (
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default BackendWakeUp;
