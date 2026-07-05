/**
 * AmbientBackground — a quiet animated backdrop: a faint code-editor grid
 * plus two softly drifting glow blobs in the accent colors. Sits behind
 * page content, absolutely positioned, pointer-events disabled.
 */
const AmbientBackground = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-code-grid mask-fade-b opacity-70" />
      <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary-400/20 dark:bg-primary-400/10 blur-[100px] animate-float-slow" />
      <div className="absolute top-1/3 -right-32 w-[24rem] h-[24rem] rounded-full bg-keyword-500/20 dark:bg-keyword-500/10 blur-[110px] animate-float" />
      <div className="absolute bottom-0 left-1/4 w-[20rem] h-[20rem] rounded-full bg-stringc-500/10 blur-[100px] animate-glow-pulse" />
    </div>
  );
};

export default AmbientBackground;
