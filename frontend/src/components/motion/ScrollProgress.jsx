import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A hairline progress bar across the very top of the viewport, filling as
 * the visitor scrolls the current page. Spring-smoothed so it doesn't feel
 * like it's stepping with the scroll wheel. Purely informational rather
 * than decorative, so it's left out of the reduced-motion opt-out — a
 * smoothed width isn't the kind of large/parallax motion that
 * prefers-reduced-motion is meant to suppress.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-accent-gradient z-[70]"
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
