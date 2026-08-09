import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, MessageSquareQuote, CheckCircle, XCircle } from 'lucide-react';
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  unapproveTestimonial
} from '../../redux/slices/testimonialSlice';

const emptyForm = {
  clientName: '',
  clientPosition: '',
  clientCompany: '',
  clientImage: '',
  review: '',
  rating: 5,
  featured: false
};

const TestimonialsManagement = () => {
  const dispatch = useDispatch();
  const { testimonials, loading, error } = useSelector((state) => state.testimonials);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // all | pending | approved

  useEffect(() => {
    // No params = admin view, includes pending (unapproved) testimonials.
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const handleAdd = () => {
    setEditing(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (t) => {
    setEditing(t);
    setFormData({
      clientName: t.clientName,
      clientPosition: t.clientPosition || '',
      clientCompany: t.clientCompany || '',
      clientImage: t.clientImage || '',
      review: t.review,
      rating: t.rating,
      featured: t.featured
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial? This cannot be undone.')) {
      await dispatch(deleteTestimonial(id));
    }
  };

  const handleToggleApproval = (t) => {
    if (t.approved) {
      dispatch(unapproveTestimonial(t._id));
    } else {
      dispatch(approveTestimonial(t._id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (editing) {
      await dispatch(updateTestimonial({ id: editing._id, testimonialData: formData }));
    } else {
      // New testimonials added by the admin directly are pre-approved —
      // the approval workflow exists for testimonials submitted by others,
      // not ones the site owner is entering themselves.
      await dispatch(createTestimonial({ ...formData, approved: true }));
    }
    setSubmitting(false);
    setShowModal(false);
  };

  const filtered = testimonials.filter((t) => {
    if (filter === 'pending') return !t.approved;
    if (filter === 'approved') return t.approved;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials Management</h1>
        <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl2 text-danger text-sm">{error}</div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'approved'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-accent-gradient text-white'
                : 'bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/[0.1]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <MessageSquareQuote className="w-10 h-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-white/50">No testimonials in this view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((t) => (
            <div key={t._id} className="glass-card p-6 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {t.clientImage ? (
                    <img src={t.clientImage} alt={t.clientName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-white text-sm font-bold">
                      {t.clientName?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.clientName}</p>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      {[t.clientPosition, t.clientCompany].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-warning text-warning' : 'text-gray-300 dark:text-white/20'}`} />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-white/70 flex-1 mb-4">&ldquo;{t.review}&rdquo;</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
                <button
                  onClick={() => handleToggleApproval(t)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    t.approved
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400'
                  }`}
                >
                  {t.approved ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {t.approved ? 'Approved' : 'Pending'}
                </button>

                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {editing ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Client Name *</label>
                    <input type="text" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Rating *</label>
                    <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="input-field" required>
                      {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Position</label>
                    <input type="text" value={formData.clientPosition} onChange={(e) => setFormData({ ...formData, clientPosition: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Company</label>
                    <input type="text" value={formData.clientCompany} onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })} className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Client Photo URL</label>
                  <input type="url" value={formData.clientImage} onChange={(e) => setFormData({ ...formData, clientImage: e.target.value })} className="input-field" placeholder="https://..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Review *</label>
                  <textarea value={formData.review} onChange={(e) => setFormData({ ...formData, review: e.target.value })} className="input-field" rows="4" required />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="featured-testimonial" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                  <label htmlFor="featured-testimonial" className="text-sm text-gray-700 dark:text-white/70">Featured Testimonial</label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
                    {submitting ? 'Saving...' : editing ? 'Update Testimonial' : 'Create Testimonial'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialsManagement;
