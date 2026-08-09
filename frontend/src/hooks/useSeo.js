import { useEffect } from 'react';

const SITE_NAME = 'Portfolio';
const DEFAULT_DESCRIPTION = 'Professional portfolio showcasing projects, experience, skills, and certifications.';

const setMetaTag = (attr, key, content) => {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setCanonical = (path) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', `${window.location.origin}${path}`);
};

/**
 * Sets document.title, meta description, canonical URL, and Open Graph tags
 * for the current page — no react-helmet dependency needed for something
 * this small, and it keeps every page's SEO fields co-located with the
 * page itself instead of a single static index.html.
 *
 * Tags are restored to sensible site-wide defaults on unmount so navigating
 * away from a page (e.g. a blog post) doesn't leave stale metadata behind
 * for the next route.
 */
const useSeo = ({ title, description = DEFAULT_DESCRIPTION, image, type = 'website', noIndex = false }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', window.location.href);
    if (image) setMetaTag('property', 'og:image', image);
    setMetaTag('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    if (!noIndex) setCanonical(window.location.pathname);

    return () => {
      document.title = SITE_NAME;
      setMetaTag('name', 'description', DEFAULT_DESCRIPTION);
      setMetaTag('name', 'robots', 'index, follow');
    };
  }, [title, description, image, type, noIndex]);
};

export default useSeo;
