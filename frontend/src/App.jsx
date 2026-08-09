import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Certificates from './pages/Certificates';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import usePageTracking from './hooks/usePageTracking';
import useScrollToTop from './hooks/useScrollToTop';
import ScrollProgress from './components/motion/ScrollProgress';
import PageTransition from './components/motion/PageTransition';

// The admin dashboard (and everything it transitively imports — every
// *Management component, react-quill for the blog editor, etc.) is by far
// the heaviest part of this app, and a public visitor never needs any of
// it. Splitting it into its own chunk keeps that weight out of the bundle
// everyone else downloads on first load.
const Dashboard = lazy(() => import('./pages/Dashboard'));

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-violet border-t-transparent" />
  </div>
);

function App() {
  // Tracks the initial load AND every subsequent client-side route change.
  usePageTracking();
  useScrollToTop();
  const location = useLocation();

  // The dashboard has its own internal sidebar navigation (a nested
  // <Routes> inside Dashboard.jsx) — keying the outer page transition off
  // the *full* pathname would replay the fade on every single admin click
  // (Projects -> Certificates -> Blogs...), unmounting the sidebar itself
  // each time. Collapsing every /dashboard/* path to one key means the
  // transition only plays once, on the way in and out of the admin area.
  const transitionKey = location.pathname.startsWith('/dashboard') ? '/dashboard' : location.pathname;

  return (
    <ErrorBoundary>
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={transitionKey}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/projects/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
            <Route path="/blog/:slug" element={<PageTransition><BlogDetail /></PageTransition>} />
            <Route path="/certificates" element={<PageTransition><Certificates /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute requireAdmin>
                  <Suspense fallback={<RouteFallback />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
    </ErrorBoundary>
  );
}

export default App;
