import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Briefcase, MapPin, Calendar } from 'lucide-react';
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} from '../../redux/slices/experienceSlice';

const TYPES = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

const emptyForm = {
  company: '',
  designation: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  achievements: [],
  technologies: [],
  type: 'full-time'
};

const formatDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '');

const ExperienceManagement = () => {
  const dispatch = useDispatch();
  const { experiences, loading, error } = useSelector((state) => state.experience);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [achievementInput, setAchievementInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchExperiences());
  }, [dispatch]);

  const resetForm = () => {
    setFormData(emptyForm);
    setAchievementInput('');
    setTechInput('');
  };

  const handleAdd = () => {
    setEditing(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (exp) => {
    setEditing(exp);
    setFormData({
      company: exp.company,
      designation: exp.designation,
      location: exp.location || '',
      startDate: exp.startDate ? exp.startDate.slice(0, 10) : '',
      endDate: exp.endDate ? exp.endDate.slice(0, 10) : '',
      current: exp.current,
      description: exp.description || '',
      achievements: exp.achievements || [],
      technologies: exp.technologies || [],
      type: exp.type || 'full-time'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this experience entry? This cannot be undone.')) {
      await dispatch(deleteExperience(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      endDate: formData.current ? null : (formData.endDate || null)
    };

    if (editing) {
      await dispatch(updateExperience({ id: editing._id, experienceData: payload }));
    } else {
      await dispatch(createExperience(payload));
    }
    setSubmitting(false);
    setShowModal(false);
  };

  const addToList = (field, input, setInput) => {
    const value = input.trim();
    if (value && !formData[field].includes(value)) {
      setFormData({ ...formData, [field]: [...formData[field], value] });
      setInput('');
    }
  };

  const removeFromList = (field, value) => {
    setFormData({ ...formData, [field]: formData[field].filter((v) => v !== value) });
  };

  const sorted = [...experiences].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Experience Management</h1>
        <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Experience</span>
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
          <Briefcase className="w-10 h-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-white/50 mb-4">No experience entries yet.</p>
          <button onClick={handleAdd} className="btn-primary">Add Your First Experience</button>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((exp) => (
            <div key={exp._id} className="glass-card p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.designation}</h3>
                  <span className="px-2 py-0.5 bg-primary-100 dark:bg-accent-violet/15 text-primary-600 dark:text-accent-light rounded-full text-xs capitalize">
                    {exp.type}
                  </span>
                  {exp.current && (
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-white/80 mb-1">{exp.company}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-white/50 mb-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  {exp.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{exp.location}</span>}
                </div>
                {exp.description && <p className="text-sm text-gray-600 dark:text-white/60 mb-2">{exp.description}</p>}
                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/60 rounded-full text-xs">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                <button onClick={() => handleEdit(exp)} className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(exp._id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400">
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
                {editing ? 'Edit Experience' : 'Add Experience'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Company *</label>
                    <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Designation *</label>
                    <input type="text" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="input-field" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Location</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input-field" />
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">End Date</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input-field" disabled={formData.current} />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="current" checked={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
                  <label htmlFor="current" className="text-sm text-gray-700 dark:text-white/70">I currently work here</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="3" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Achievements</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={achievementInput}
                      onChange={(e) => setAchievementInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('achievements', achievementInput, setAchievementInput))}
                      className="input-field flex-1"
                      placeholder="Add achievement and press Enter"
                    />
                    <button type="button" onClick={() => addToList('achievements', achievementInput, setAchievementInput)} className="btn-secondary">Add</button>
                  </div>
                  <ul className="space-y-1">
                    {formData.achievements.map((a) => (
                      <li key={a} className="flex items-center justify-between text-sm bg-gray-100 dark:bg-white/[0.05] rounded-lg px-3 py-1.5">
                        <span className="text-gray-700 dark:text-white/70">{a}</span>
                        <button type="button" onClick={() => removeFromList('achievements', a)} className="text-red-500 hover:text-red-600">×</button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Technologies</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('technologies', techInput, setTechInput))}
                      className="input-field flex-1"
                      placeholder="Add technology and press Enter"
                    />
                    <button type="button" onClick={() => addToList('technologies', techInput, setTechInput)} className="btn-secondary">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((t) => (
                      <span key={t} className="px-3 py-1 bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70 rounded-full text-sm flex items-center space-x-2">
                        <span>{t}</span>
                        <button type="button" onClick={() => removeFromList('technologies', t)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
                    {submitting ? 'Saving...' : editing ? 'Update Experience' : 'Create Experience'}
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

export default ExperienceManagement;
