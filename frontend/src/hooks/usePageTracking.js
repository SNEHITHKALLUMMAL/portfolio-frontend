import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { trackVisitor } from '../redux/slices/analyticsSlice';
import { detectDevice, detectBrowser, detectOS, generateVisitorId } from '../utils/deviceDetection';

/**
 * Fires an analytics page-view on the initial load AND on every subsequent
 * client-side route change (previously this only ran once, on app mount,
 * so every route after the first was invisible to analytics).
 *
 * A ref guards against firing twice for the same path back-to-back (e.g.
 * React 18 StrictMode's double-invoke in development, or a re-render that
 * doesn't actually change the route).
 */
const usePageTracking = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (lastTrackedPath.current === currentPath) return;
    lastTrackedPath.current = currentPath;

    const visitorId = localStorage.getItem('visitorId') || generateVisitorId();
    localStorage.setItem('visitorId', visitorId);

    // Tracking must never be able to break navigation or the page itself —
    // trackVisitor's thunk already swallows request failures, but this
    // still guards against a synchronous error in the detection helpers.
    try {
      dispatch(trackVisitor({
        visitorId,
        page: currentPath,
        pageTitle: document.title,
        referrer: document.referrer,
        device: detectDevice(),
        browser: detectBrowser(),
        os: detectOS(),
        screenResolution: `${window.screen.width}x${window.screen.height}`
      }));
    } catch (err) {
      console.error('Page tracking failed:', err);
    }
  }, [location.pathname, location.search, dispatch]);
};

export default usePageTracking;
