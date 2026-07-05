import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * CountUp — animates a number from 0 to `value` once it scrolls into view.
 * Accepts numeric or string values; non-numeric strings (e.g. "5+") are
 * split into a numeric part that gets animated and a trailing suffix.
 */
const CountUp = ({ value, duration = 1200, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  const match = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/);
  const numeric = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : String(value);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(numeric * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, duration]);

  return (
    <span ref={ref} className={className}>
      {match ? display : value}
      {suffix}
    </span>
  );
};

export default CountUp;
