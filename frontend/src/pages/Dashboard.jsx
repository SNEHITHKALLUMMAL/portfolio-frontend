import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  BarChart3,
  Plus,
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  MessageSquareQuote,
  Menu,
  X
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { fetchDashboardStats } from '../redux/slices/analyticsSlice';
import ProtectedRoute from '../components/ProtectedRoute';
import ProfileManagement from '../components/admin/ProfileManagement';
import ProjectsManagement from '../components/admin/ProjectsManagement';
import BlogsManagement from '../components/admin/BlogsManagement';
import SkillsManagement from '../components/admin/SkillsManagement';
import MessagesManagement from '../components/admin/MessagesManagement';
import CertificatesManagement from '../components/admin/CertificatesManagement';
import ExperienceManagement from '../components/admin/ExperienceManagement';
import EducationManagement from '../components/admin/EducationManagement';
import TestimonialsManagement from '../components/admin/TestimonialsManagement';
import useSeo from '../hooks/useSeo';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.analytics);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useSeo({ title: 'Dashboard', noIndex: true });

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Close the mobile drawer automatically after navigating to a section —
  // otherwise it stays open, covering the page you just navigated to.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: FolderOpen, label: 'Projects', path: '/dashboard/projects' },
    { icon: Award, label: 'Certificates', path: '/dashboard/certificates' },
    { icon: Briefcase, label: 'Experience', path: '/dashboard/experience' },
    { icon: GraduationCap, label: 'Education', path: '/dashboard/education' },
    { icon: FileText, label: 'Blogs', path: '/dashboard/blogs' },
    { icon: TrendingUp, label: 'Skills', path: '/dashboard/skills' },
    { icon: MessageSquareQuote, label: 'Testimonials', path: '/dashboard/testimonials' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: Users, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-100 dark:bg-black">
        {/* Mobile top bar — only rendered below lg, where the sidebar is
            off-canvas rather than statically visible. */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-white dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
          <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white/80"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex">
          {/* Backdrop — mobile/tablet only, closes the drawer on click */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* Sidebar — a static column at lg+, an off-canvas drawer below it */}
          <aside
            className={`w-64 min-h-screen bg-white dark:bg-night-900 border-r border-gray-200 dark:border-white/10 fixed left-0 top-0 z-50 transition-transform duration-300 ease-out lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                  className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white/80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full mt-8"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content — no left margin until lg, where the sidebar
              becomes a permanent static column instead of a drawer. */}
          <main className="flex-1 lg:ml-64 p-4 md:p-8 w-full min-w-0">
            <Routes>
              <Route path="/" element={<DashboardOverview stats={stats} />} />
              <Route path="/projects" element={<ProjectsManagement />} />
              <Route path="/certificates" element={<CertificatesManagement />} />
              <Route path="/experience" element={<ExperienceManagement />} />
              <Route path="/education" element={<EducationManagement />} />
              <Route path="/testimonials" element={<TestimonialsManagement />} />
              <Route path="/blogs" element={<BlogsManagement />} />
              <Route path="/skills" element={<SkillsManagement />} />
              <Route path="/messages" element={<MessagesManagement />} />
              <Route path="/profile" element={<ProfileManagement />} />
              <Route path="/settings" element={<SettingsManagement />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const DashboardOverview = ({ stats }) => {
  if (!stats) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  const statCards = [
    { label: 'Total Visitors', value: stats.totalVisitors, icon: Users, color: 'blue' },
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderOpen, color: 'green' },
    { label: 'Total Blogs', value: stats.totalBlogs, icon: FileText, color: 'purple' },
    { label: 'Pending Inquiries', value: stats.pendingInquiries, icon: MessageSquare, color: 'orange' },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-white/[0.04] dark:to-white/[0.02] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1 text-green-500">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-gray-600 dark:text-white/50">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-white/[0.04] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Device Analytics</h3>
          <div className="space-y-4">
            {stats.deviceStats?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-white/70 capitalize">{item._id}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-white/[0.06] rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(item.count / stats.totalVisitors) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-white/50">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.04] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Page Views</h3>
          <div className="space-y-4">
            {stats.pageStats?.slice(0, 5).map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-white/70">{item._id}</span>
                <span className="text-sm text-gray-600 dark:text-white/50">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-white/[0.04] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/projects"
            className="flex items-center space-x-3 p-4 rounded-lg bg-primary-50 dark:bg-accent-violet/15 hover:bg-primary-100 dark:hover:bg-accent-violet/20 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary-600" />
            <span className="text-gray-900 dark:text-white">Add New Project</span>
          </Link>
          <Link
            to="/dashboard/blogs"
            className="flex items-center space-x-3 p-4 rounded-lg bg-primary-50 dark:bg-accent-violet/15 hover:bg-primary-100 dark:hover:bg-accent-violet/20 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary-600" />
            <span className="text-gray-900 dark:text-white">Write New Blog</span>
          </Link>
          <Link
            to="/dashboard/messages"
            className="flex items-center space-x-3 p-4 rounded-lg bg-primary-50 dark:bg-accent-violet/15 hover:bg-primary-100 dark:hover:bg-accent-violet/20 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-primary-600" />
            <span className="text-gray-900 dark:text-white">View Messages</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};





const SettingsManagement = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      <div className="bg-white dark:bg-white/[0.04] rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/10">
        <p className="text-gray-600 dark:text-white/50">Settings module coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;
