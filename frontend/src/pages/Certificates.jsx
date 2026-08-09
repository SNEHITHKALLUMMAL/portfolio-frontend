import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Award, X, ChevronLeft, ChevronRight, ExternalLink, Calendar
} from 'lucide-react';
import { fetchCertificates } from '../redux/slices/certificateSlice';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';
import useSeo from '../hooks/useSeo';

const CATEGORIES = ['all', 'Technical', 'Professional', 'Academic', 'Achievement', 'Other'];

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
};

const Certificates = () => {
  const dispatch = useDispatch();
  const { certificates, loading } = useSelector((state) => state.certificates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useSeo({
    title: 'Certificates',
    description: 'Certifications and credentials earned.'
  });

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    dispatch(fetchCertificates(params));
  }, [dispatch, searchTerm, selectedCategory]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + certificates.length) % certificates.length)),
    [certificates.length]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % certificates.length)),
    [certificates.length]
  );

  // Keyboard navigation for the lightbox: ESC closes, arrows move between
  // certificates. Only attached while the lightbox is actually open.
  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const activeCertificate = lightboxIndex !== null ? certificates[lightboxIndex] : null;

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <Reveal>
        <p className="eyebrow">Credentials</p>
        <h1 className="section-title">Certificates</h1>
        <p className="text-muted-light dark:text-muted mb-10 max-w-2xl">
          Certifications and credentials earned along the way — click any card for a closer look.
        </p>
      </Reveal>

      {/* Search and Filter */}
      <Reveal delay={0.08} className="glass-card p-5 mb-10 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light dark:text-muted" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11"
            aria-label="Search certificates"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-light dark:text-muted shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </Reveal>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-violet border-t-transparent" />
        </div>
      ) : certificates.length === 0 ? (
        <Reveal className="text-center py-20 glass-card">
          <Award className="w-10 h-10 mx-auto mb-4 text-muted-light dark:text-muted" />
          <p className="text-muted-light dark:text-muted">No certificates matched your search.</p>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {certificates.map((certificate, index) => (
              <motion.button
                type="button"
                layout
                key={certificate._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openLightbox(index)}
                className="glass-card glass-card-hover overflow-hidden group relative text-left"
              >
                <div className="h-44 overflow-hidden relative bg-slate-900/[0.03] dark:bg-white/[0.03]">
                  <img
                    src={certificate.imageUrl}
                    alt={`${certificate.title} certificate`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {certificate.featured && (
                    <span className="absolute top-3 right-3 pill bg-warning/90 text-white shadow">Featured</span>
                  )}
                </div>
                <div className="p-5">
                  <span className="pill bg-accent-gradient-soft text-accent-violet dark:text-accent-light mb-3 inline-block">
                    {certificate.category}
                  </span>
                  <h3 className="text-base font-semibold mb-1 text-slate-900 dark:text-white line-clamp-2">
                    {certificate.title}
                  </h3>
                  <p className="text-muted-light dark:text-muted text-sm mb-2">{certificate.issuer}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-light dark:text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(certificate.issueDate)}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {activeCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${activeCertificate.title} certificate viewer`}
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close certificate viewer"
              className="absolute top-5 right-5 btn-icon !bg-white/10 !border-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {certificates.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  aria-label="Previous certificate"
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 btn-icon !bg-white/10 !border-white/20 text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  aria-label="Next certificate"
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 btn-icon !bg-white/10 !border-white/20 text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <motion.div
              key={activeCertificate._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            >
              <img
                src={activeCertificate.imageUrl}
                alt={`${activeCertificate.title} certificate — full size`}
                className="w-full max-h-[55vh] object-contain bg-black/20"
              />
              <div className="p-6">
                <span className="pill bg-accent-gradient-soft text-accent-violet dark:text-accent-light mb-3 inline-block">
                  {activeCertificate.category}
                </span>
                <h2 className="text-xl font-bold text-white mb-1">{activeCertificate.title}</h2>
                <p className="text-white/70 mb-4">{activeCertificate.issuer}</p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60 mb-4">
                  <span>Issued {formatDate(activeCertificate.issueDate)}</span>
                  {activeCertificate.expiryDate && <span>Expires {formatDate(activeCertificate.expiryDate)}</span>}
                  {activeCertificate.credentialId && <span>ID: {activeCertificate.credentialId}</span>}
                </div>

                {activeCertificate.description && (
                  <p className="text-white/70 text-sm mb-4">{activeCertificate.description}</p>
                )}

                {activeCertificate.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeCertificate.tags.map((tag) => (
                      <span key={tag} className="pill bg-white/10 text-white/70">#{tag}</span>
                    ))}
                  </div>
                )}

                {activeCertificate.credentialUrl && (
                  <a
                    href={activeCertificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Verify Credential</span>
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certificates;
