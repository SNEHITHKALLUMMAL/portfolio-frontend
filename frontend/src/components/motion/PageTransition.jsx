import { motion } from 'framer-motion';

/**
 * Wraps the current route's content so AnimatePresence (in App.jsx) can
 * animate it in/out on navigation. Kept deliberately subtle — a fade with
 * a small rise, not a slide/scale — so it reads as polish rather than a
 * distraction on every single click. MotionConfig's reducedMotion="user"
 * (set in main.jsx) automatically collapses this to an instant swap for
 * anyone with prefers-reduced-motion enabled, since it's driven by the
 * standard animate/exit props.
 */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
