import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, LogOut, User, LayoutDashboard, Sparkles } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
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
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-0 right-0 z-50 px-4"
    >
      <nav className="max-w-3xl mx-auto nav-pill">
        <div className="flex items-center justify-between h-14 px-3 md:px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 pl-1 group">
            <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-sm font-bold text-slate-900 dark:text-white hidden sm:inline">
              Portfolio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {isActive(link.path) && (
                  <motion.span
                    layoutId="nav-pill-active"
                    className="absolute inset-0 bg-slate-900/[0.06] dark:bg-white/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full hover:bg-slate-900/[0.06] dark:hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ rotate: -50, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 50, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/dashboard" className="btn-secondary !py-2 !px-4 !text-xs">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-slate-900/[0.06] dark:hover:bg-white/10 transition-colors" aria-label="Logout">
                  <LogOut className="w-[18px] h-[18px]" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:inline-flex btn-primary !py-2 !px-4 !text-xs">
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-slate-900/[0.06] dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden max-w-3xl mx-auto mt-2 glass-panel overflow-hidden"
          >
            <div className="px-3 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-2.5 rounded-xl2 text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-slate-900/[0.06] dark:bg-white/10 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-white/70 hover:bg-slate-900/[0.04] dark:hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-2.5 rounded-xl2 bg-accent-gradient text-white text-sm font-medium">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 rounded-xl2 hover:bg-slate-900/[0.04] dark:hover:bg-white/5 text-slate-600 dark:text-white/70 text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="block px-4 py-2.5 rounded-xl2 bg-accent-gradient text-white text-sm font-medium">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
