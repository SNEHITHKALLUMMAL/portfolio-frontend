import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, TerminalSquare } from 'lucide-react';
import TypeWriter from '../components/motion/TypeWriter';
import AmbientBackground from '../components/motion/AmbientBackground';

const NotFound = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      <AmbientBackground />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="window-card max-w-lg w-full shadow-xl"
      >
        <div className="window-titlebar">
          <span className="window-dot bg-[#ff5f57]" />
          <span className="window-dot bg-[#febc2e]" />
          <span className="window-dot bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-ink-400">error.log</span>
        </div>
        <div className="p-10 font-mono text-left">
          <p className="text-red-500 text-sm mb-2">Traceback (most recent call last):</p>
          <p className="text-ink-400 text-sm mb-6">RouteNotFoundError: no matching route for this path</p>
          <h1 className="text-6xl font-extrabold text-primary-500 mb-2">404</h1>
          <p className="text-ink-600 dark:text-ink-200 mb-6 text-sm">
            <TypeWriter text="page could not be resolved." loop={false} speed={35} />
          </p>
          <Link to="/" className="btn-primary inline-flex">
            <Home className="w-4 h-4" />
            <span>cd ~/</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
