import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Search, Filter, ExternalLink, CheckCircle, XCircle,
  ArrowUp, ArrowDown, ImagePlus, Star
} from 'lucide-react';
import {
  fetchAllCertificatesAdmin,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  updateCertificateStatus,
  reorderCertificates
} from '../../redux/slices/certificateSlice';

const CATEGORIES = ['Technical', 'Professional', 'Academic', 'Achievement', 'Other'];

const emptyForm = {
  title: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  credentialUrl: '',
  description: '',
  category: 'Technical',
  tags: [],
  featured: false,
  status: 'published'
};

const CertificatesManagement = () => {
  const dispatch = useDispatch();
  const { adminCertificates, adminLoading, error } = useSelector((state) => state.certificates);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    dispatch(fetchAllCertificatesAdmin(params));
  }, [dispatch, searchTerm, selectedCategory]);

  // Revoke the local object URL when it's no longer needed to avoid leaking memory.
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const resetForm = () => {
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setTagInput('');
  };

  const handleAdd = () => {
    setEditingCertificate(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      issueDate: certificate.issueDate ? certificate.issueDate.slice(0, 10) : '',
      expiryDate: certificate.expiryDate ? certificate.expiryDate.slice(0, 10) : '',
      credentialId: certificate.credentialId || '',
      credentialUrl: certificate.credentialUrl || '',
      description: certificate.description || '',
      category: certificate.category,
      tags: certificate.tags || [],
      featured: certificate.featured,
      status: certificate.status
    });
    setImageFile(null);
    setImagePreview(certificate.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this certificate? This cannot be undone.')) {
      await dispatch(deleteCertificate(id));
    }
  };

  const handleToggleStatus = (certificate) => {
    dispatch(updateCertificateStatus({
      id: certificate._id,
      status: certificate.status === 'published' ? 'draft' : 'published'
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingCertificate && !imageFile) {
      window.alert('Please choose a certificate image.');
      return;
    }

    setSubmitting(true);
    const payload = { ...formData, ...(imageFile ? { image: imageFile } : {}) };

    if (editingCertificate) {
      await dispatch(updateCertificate({ id: editingCertificate._id, certificateData: payload }));
    } else {
      await dispatch(createCertificate(payload));
    }
    setSubmitting(false);
    setShowModal(false);
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !formData.tags.includes(value)) {
      setFormData({ ...formData, tags: [...formData.tags, value] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const sortedCertificates = [...adminCertificates].sort((a, b) => a.displayOrder - b.displayOrder);

  // Simple, dependency-free reordering: swap the certificate with its
  // neighbor and persist the resulting displayOrder values. Avoids pulling
  // in a drag-and-drop library for what's fundamentally a short,
  // admin-only list.
  const moveCertificate = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sortedCertificates.length) return;

    const reordered = [...sortedCertificates];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    const updates = reordered.map((cert, i) => ({ id: cert._id, displayOrder: i }));
    dispatch(reorderCertificates(updates));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificates Management</h1>
        <button onClick={handleAdd} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Certificate</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl2 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="glass-card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {adminLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : sortedCertificates.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-600 dark:text-white/50 mb-4">No certificates found.</p>
          <button onClick={handleAdd} className="btn-primary">Add Your First Certificate</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-white/[0.06]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider">Certificate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {sortedCertificates.map((certificate, index) => (
                <tr key={certificate._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.08]">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={certificate.imageUrl}
                        alt={certificate.title}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{certificate.title}</div>
                        <div className="text-sm text-gray-500 dark:text-white/50">{certificate.issuer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary-100 dark:bg-accent-violet/15 text-primary-600 dark:text-accent-light rounded-full text-xs">
                      {certificate.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(certificate)}
                      className={`px-2 py-1 rounded-full text-xs capitalize ${
                        certificate.status === 'published'
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-white/50'
                      }`}
                      title="Click to toggle published/draft"
                    >
                      {certificate.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {certificate.featured ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveCertificate(index, -1)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/[0.1] text-gray-600 dark:text-white/50 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveCertificate(index, 1)}
                        disabled={index === sortedCertificates.length - 1}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/[0.1] text-gray-600 dark:text-white/50 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {certificate.credentialUrl && (
                        <a
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/[0.1] text-gray-600 dark:text-white/50"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(certificate)}
                        className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(certificate._id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
                    Certificate Image {!editingCertificate && '*'}
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-white/10" />
                    ) : (
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400">
                        <ImagePlus className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleImageChange}
                        className="text-sm text-gray-600 dark:text-white/50"
                      />
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, or GIF · up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Issuer *</label>
                    <input
                      type="text"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Issue Date *</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Credential ID</label>
                    <input
                      type="text"
                      value={formData.credentialId}
                      onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Verification URL</label>
                    <input
                      type="url"
                      value={formData.credentialUrl}
                      onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                      required
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input-field"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Tags</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="input-field flex-1"
                      placeholder="Add tag and press Enter"
                    />
                    <button type="button" onClick={addTag} className="btn-secondary">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-white/70 rounded-full text-sm flex items-center space-x-2">
                        <span>#{tag}</span>
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700 dark:text-white/70 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> Featured Certificate
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
                    {submitting ? 'Saving...' : editingCertificate ? 'Update Certificate' : 'Create Certificate'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CertificatesManagement;
