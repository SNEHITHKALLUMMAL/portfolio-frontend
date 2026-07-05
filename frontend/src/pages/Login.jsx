import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, clearError } from '../redux/slices/authSlice';
import { Loader2, Mail, Lock, AlertCircle, TerminalSquare } from 'lucide-react';
import AmbientBackground from '../components/motion/AmbientBackground';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-paper-50 dark:bg-ink-950">
      <AmbientBackground />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="window-card shadow-xl">
          <div className="window-titlebar">
            <span className="window-dot bg-[#ff5f57]" />
            <span className="window-dot bg-[#febc2e]" />
            <span className="window-dot bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-ink-400">login.sh</span>
          </div>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-ink-950 dark:bg-white/[0.06] border border-transparent dark:border-white/10 flex items-center justify-center mx-auto mb-4">
                <TerminalSquare className="w-6 h-6 text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-ink-950 dark:text-white mb-1">Welcome Back</h1>
              <p className="text-ink-500 dark:text-ink-300 text-sm font-mono">sign in to continue</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-ink-500 dark:text-ink-300 mb-2">email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className={`input-field pl-10 ${errors.email ? '!border-red-500' : ''}`} placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono text-ink-500 dark:text-ink-300 mb-2">password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                  <input
                    type="password" name="password" value={formData.password} onChange={handleChange}
                    className={`input-field pl-10 ${errors.password ? '!border-red-500' : ''}`} placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>signing_in...</span>
                  </>
                ) : (
                  <span>sign_in()</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-ink-500 dark:text-ink-300">
                Don't have an account?{' '}
                <Link to="/about" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
                  Contact to get access
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
