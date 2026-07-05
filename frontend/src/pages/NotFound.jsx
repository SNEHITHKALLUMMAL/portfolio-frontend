import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import AmbientBackground from '../components/motion/AmbientBackground';
import Magnetic from '../components/motion/Magnetic';

const NotFound = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      <AmbientBackground />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card max-w-lg w-full p-12"
      >
        <h1 className="text-7xl font-extrabold gradient-text mb-4 font-display">404</h1>
        <p className="text-lg text-slate-700 dark:text-white/80 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Magnetic>
          <Link to="/" className="btn-primary inline-flex">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Magnetic>
      </motion.div>
    </div>
  );
};

export default NotFound;
