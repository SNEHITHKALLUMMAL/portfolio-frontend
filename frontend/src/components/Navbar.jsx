import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, LogOut, User, LayoutDashboard, TerminalSquare } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', !isDark);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { name: 'home', path: '/' },
    { name: 'projects', path: '/projects' },
    { name: 'about', path: '/about' },
    { name: 'blog', path: '/blog' },
    { name: 'contact', path: '/contact' },
  ];

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-ink-950/80 backdrop-blur-md border-b border-ink-900/[0.06] dark:border-white/[0.06] shadow-[0_1px_0_rgba(0,0,0,0.02)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-ink-950 dark:bg-white/[0.06] border border-transparent dark:border-white/10 rounded-lg flex items-center justify-center group-hover:border-primary-400/60 transition-colors">
              <TerminalSquare className="w-5 h-5 text-primary-400" strokeWidth={2} />
            </div>
            <span className="font-mono text-base font-semibold text-ink-950 dark:text-white tracking-tight">
              portfolio<span className="text-primary-500">.</span>dev
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 py-2 font-mono text-sm text-ink-600 dark:text-ink-200 hover:text-ink-950 dark:hover:text-white transition-colors"
              >
                <span className={isActive(link.path) ? 'text-ink-950 dark:text-white' : ''}>
                  {isActive(link.path) && <span className="text-primary-500">./</span>}
                  {link.name}
                </span>
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-primary-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="ml-2 p-2 rounded-lg hover:bg-ink-900/5 dark:hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ rotate: -60, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 60, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-2">
                <Link to="/dashboard" className="btn-secondary !py-2 !px-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>dashboard</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-ink-900/5 dark:hover:bg-white/10 transition-colors" aria-label="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !py-2 !px-4 ml-2">
                <User className="w-4 h-4" />
                <span>login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-1">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-ink-900/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-ink-900/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-white/95 dark:bg-ink-950/95 backdrop-blur-md border-t border-ink-900/[0.06] dark:border-white/[0.06] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 font-mono text-sm">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-2.5 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-ink-900/5 dark:bg-white/10 text-ink-950 dark:text-white'
                        : 'text-ink-600 dark:text-ink-200 hover:bg-ink-900/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {isActive(link.path) && <span className="text-primary-500">./</span>}
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-2.5 rounded-lg bg-ink-950 dark:bg-primary-400 text-white dark:text-ink-950">
                    dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 rounded-lg hover:bg-ink-900/5 dark:hover:bg-white/5 text-ink-600 dark:text-ink-200"
                  >
                    logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block px-4 py-2.5 rounded-lg bg-ink-950 dark:bg-primary-400 text-white dark:text-ink-950">
                  login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
