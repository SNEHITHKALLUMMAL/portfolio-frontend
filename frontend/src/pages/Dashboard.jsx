import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
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
  TrendingUp
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { fetchDashboardStats } from '../redux/slices/analyticsSlice';
import ProtectedRoute from '../components/ProtectedRoute';
import ProfileManagement from '../components/admin/ProfileManagement';
import ProjectsManagement from '../components/admin/ProjectsManagement';
import BlogsManagement from '../components/admin/BlogsManagement';
import SkillsManagement from '../components/admin/SkillsManagement';
import MessagesManagement from '../components/admin/MessagesManagement';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: FolderOpen, label: 'Projects', path: '/dashboard/projects' },
    { icon: FileText, label: 'Blogs', path: '/dashboard/blogs' },
    { icon: TrendingUp, label: 'Skills', path: '/dashboard/skills' },
    { icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
    { icon: Users, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 min-h-screen bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Admin Panel</h2>
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
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

          {/* Main Content */}
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={<DashboardOverview stats={stats} />} />
              <Route path="/projects" element={<ProjectsManagement />} />
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
            className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
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
            <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Device Analytics</h3>
          <div className="space-y-4">
            {stats.deviceStats?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 capitalize">{item._id}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(item.count / stats.totalVisitors) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Page Views</h3>
          <div className="space-y-4">
            {stats.pageStats?.slice(0, 5).map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{item._id}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/projects"
            className="flex items-center space-x-3 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary-600" />
            <span className="text-gray-900 dark:text-white">Add New Project</span>
          </Link>
          <Link
            to="/dashboard/blogs"
            className="flex items-center space-x-3 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <Plus className="w-5 h-5 text-primary-600" />
            <span className="text-gray-900 dark:text-white">Write New Blog</span>
          </Link>
          <Link
            to="/dashboard/messages"
            className="flex items-center space-x-3 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
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
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">Settings module coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;
