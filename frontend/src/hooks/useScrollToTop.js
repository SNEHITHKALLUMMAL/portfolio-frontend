import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll position to the top on every route change. Without this,
 * navigating from partway down a long page (e.g. the Blog list) to a new
 * route lands the visitor mid-page instead of at its top — easy to miss
 * during development since you're usually navigating from the top anyway.
 *
 * Hash links (e.g. "#contact-form" on the same page) are left alone so
 * anchor scrolling still works.
 */
const useScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    // No `behavior: 'smooth'` here on purpose — the fade-in from
    // PageTransition already provides the "smooth" feel; a smooth *scroll*
    // on top of that would fight it and take longer than the transition
    // itself. This just resets position before the new page fades in.
    window.scrollTo(0, 0);
  }, [pathname, hash]);
};

export default useScrollToTop;
