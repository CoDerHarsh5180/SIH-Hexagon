import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES = {
  success: {
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    icon: 'text-emerald-500',
    bar: 'bg-emerald-500',
    title: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    bg: 'bg-red-500/10 border-red-500/30',
    icon: 'text-red-500',
    bar: 'bg-red-500',
    title: 'text-red-600 dark:text-red-400',
  },
  warning: {
    bg: 'bg-amber-500/10 border-amber-500/30',
    icon: 'text-amber-500',
    bar: 'bg-amber-500',
    title: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    bg: 'bg-blue-500/10 border-blue-500/30',
    icon: 'text-blue-500',
    bar: 'bg-blue-500',
    title: 'text-blue-600 dark:text-blue-400',
  },
};

const TOAST_TITLES = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Notice',
};

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 4500) => {
      const id = ++toastIdCounter;
      const toast = { id, message, type, duration, createdAt: Date.now() };
      setToasts((prev) => [...prev.slice(-4), toast]); // max 5 toasts visible

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = useCallback(
    (message, type = 'info', duration) => addToast(message, type, duration),
    [addToast]
  );

  toast.success = (msg, duration) => addToast(msg, 'success', duration);
  toast.error = (msg, duration) => addToast(msg, 'error', duration ?? 6000);
  toast.warning = (msg, duration) => addToast(msg, 'warning', duration ?? 5500);
  toast.info = (msg, duration) => addToast(msg, 'info', duration);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container — fixed top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const style = TOAST_STYLES[t.type] || TOAST_STYLES.info;
            const IconComp = TOAST_ICONS[t.type] || Info;
            const title = TOAST_TITLES[t.type] || 'Notice';

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`pointer-events-auto relative overflow-hidden rounded-xl border backdrop-blur-md shadow-lg ${style.bg}`}
              >
                {/* Progress bar */}
                {t.duration > 0 && (
                  <motion.div
                    className={`absolute bottom-0 left-0 h-[3px] ${style.bar} rounded-full`}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: t.duration / 1000, ease: 'linear' }}
                  />
                )}

                <div className="flex items-start gap-3 p-3.5 pr-9">
                  <IconComp className={`w-5 h-5 shrink-0 mt-0.5 ${style.icon}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold uppercase tracking-wide ${style.title}`}>
                      {title}
                    </p>
                    <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed break-words">
                      {t.message}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="absolute top-2.5 right-2.5 p-1 rounded-md text-foreground/40 hover:text-foreground/80 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
