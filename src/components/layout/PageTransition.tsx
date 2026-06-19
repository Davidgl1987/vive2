import { AnimatePresence, motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        className="min-h-full"
        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
        initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
