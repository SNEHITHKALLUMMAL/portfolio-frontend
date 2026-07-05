/**
 * AmbientBackground — soft violet/blue glow blobs plus a faint radial fade,
 * matching the Apple/Linear/Stripe-style premium dark aesthetic. Sits behind
 * page content, absolutely positioned, pointer-events disabled.
 */
const AmbientBackground = ({ className = '', particles = false }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-radial-fade opacity-70 dark:opacity-100" />
      <div className="absolute -top-32 -left-24 w-[32rem] h-[32rem] rounded-full bg-accent-violet/20 dark:bg-accent-violet/25 blur-[120px] animate-float-slow" />
      <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-accent-blue/20 dark:bg-accent-blue/25 blur-[130px] animate-float" />
      <div className="absolute bottom-0 left-1/4 w-[22rem] h-[22rem] rounded-full bg-accent-violet/10 blur-[110px] animate-glow-pulse" />

      {particles && (
        <div className="absolute inset-0">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40 dark:bg-white/50 animate-particle"
              style={{
                left: `${(i * 137) % 100}%`,
                bottom: `${(i * 53) % 60}%`,
                animationDelay: `${(i * 0.9) % 12}s`,
                animationDuration: `${10 + (i % 5)}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AmbientBackground;
