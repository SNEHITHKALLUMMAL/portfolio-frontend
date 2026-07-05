import { useRef, useState } from 'react';

/**
 * MouseGlow — wraps content and renders a soft radial spotlight that
 * follows the cursor, revealed via a mask. Common on premium SaaS
 * marketing sites (Linear, Vercel) to add depth without noise.
 */
const MouseGlow = ({ children, className = '', color = 'rgba(124,58,237,0.25)' }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 0 });
  const [active, setActive] = useState(false);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(500px circle at ${pos.x}% ${pos.y}%, ${color}, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export default MouseGlow;
