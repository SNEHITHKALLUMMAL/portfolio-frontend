import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, GraduationCap, Calendar } from 'lucide-react';
import {
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation
} from '../../redux/slices/educationSlice';

const TYPES = ['degree', 'certification', 'course', 'bootcamp'];

const emptyForm = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  current: false,
  grade: '',
  description: '',
  type: 'degree'
};

const formatDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');

const EducationManagement = () => {
  const dispatch = useDispatch();
  const { education, loading, error } = useSelector((state) => state.education);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

  const handleAdd = () => {
    setEditing(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (edu) => {
    setEditing(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field || '',
      startDate: edu.startDate ? edu.startDate.slice(0, 10) : '',
      endDate: edu.endDate ? edu.endDate.slice(0, 10) : '',
      current: edu.current,
      grade: edu.grade || '',
      description: edu.description || '',
      type: edu.type || 'degree'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this education entry? This cannot be undone.')) {
      await dispatch(deleteEducation(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // The Education model requires endDate (unlike Experience, where it's
    // optional) — for a currently-ongoing program we send today's date so
    // validation passes, since "current" is what the UI actually reads for
    // display purposes.
    const payload = {
      ...formData,
      endDate: formData.current ? new Date().toISOString().slice(0, 10) : formData.endDate
    };

    if (editing) {
      await dispatch(updateEducation({ id: editing._id, educationData: payload }));
    } else {
      await dispatch(createEducation(payload));
    }
    setSubmitting(false);
    setShowModal(false);
  };

  const sorted = [...education].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Education Management</h1>
        <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Education</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl2 text-danger text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <GraduationCap className="w-10 h-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-white/50 mb-4">No education entries yet.</p>
          <button onClick={handleAdd} className="btn-primary">Add Your First Entry</button>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((edu) => (
            <div key={edu._id} className="glass-card p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                  <span className="px-2 py-0.5 bg-primary-100 dark:bg-accent-violet/15 text-primary-600 dark:text-accent-light rounded-full text-xs capitalize">
                    {edu.type}
                  </span>
                  {edu.current && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs">
                      In progress
                    </span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-white/80 mb-1">{edu.institution}{edu.field ? ` · ${edu.field}` : ''}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-white/50 mb-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}</span>
                  {edu.grade && <span>Grade: {edu.grade}</span>}
                </div>
                {edu.description && <p className="text-sm text-gray-600 dark:text-white/60">{edu.description}</p>}
              </div>
              <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                <button onClick={() => handleEdit(edu)} className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(edu._id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {editing ? 'Edit Education' : 'Add Education'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Institution *</label>
                    <input type="text" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Degree *</label>
                    <input type="text" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} className="input-field" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Field of Study</label>
                    <input type="text" value={formData.field} onChange={(e) => setFormData({ ...formData, field: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
                      {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Start Date *</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">End Date {!formData.current && '*'}</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input-field" disabled={formData.current} required={!formData.current} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="edu-current" checked={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                  <label htmlFor="edu-current" className="text-sm text-gray-700 dark:text-white/70">Currently studying here</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Grade / GPA</label>
                  <input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="input-field" placeholder="e.g. 3.8 / 4.0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="3" />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
                    {submitting ? 'Saving...' : editing ? 'Update Entry' : 'Create Entry'}
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

export default EducationManagement;
