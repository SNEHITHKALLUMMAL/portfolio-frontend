// Centralized user-agent sniffing for analytics.
//
// Ordering matters here and is the source of two real bugs this file fixes:
//  - Modern Edge is Chromium-based, so its UA string contains "Chrome" AND
//    "Edg/". Checking for "Chrome" first meant every Edge visitor was
//    logged as Chrome.
//  - Android UA strings contain "Linux" (Android is Linux-based), so
//    checking for "Linux" before "Android" meant every Android visitor was
//    logged as Linux.
// Each check below is ordered from most-specific to least-specific for
// exactly this reason — don't reorder without re-checking real UA strings.

export const detectDevice = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const detectBrowser = () => {
  const ua = navigator.userAgent;

  if (/Edg\//.test(ua)) return 'Edge'; // Chromium Edge — must precede Chrome
  if (/OPR\/|Opera/.test(ua)) return 'Opera'; // Opera is also Chromium-based
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  // Real Safari has "Safari" without "Chrome" (Chrome's UA also contains
  // "Safari" for legacy compatibility, so this must come after Chrome/Edge/Opera).
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'Safari';
  return 'Other';
};

export const detectOS = () => {
  const ua = navigator.userAgent;

  if (/Android/.test(ua)) return 'Android'; // must precede Linux (Android UA contains "Linux")
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua)) return 'MacOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Other';
};

export const generateVisitorId = () => {
  return 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now();
};
