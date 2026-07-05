import { motion } from 'framer-motion';

/**
 * Reveal — a small wrapper that animates its children into view once,
 * the moment they scroll into the viewport. Keeps animation timing
 * consistent site-wide instead of re-declaring initial/whileInView props
 * on every section.
 */
const directions = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

const Reveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.55,
  className = '',
  as = 'div',
  once = true,
  amount = 0.2,
  ...rest
}) => {
  const offset = directions[direction] || directions.up;
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
