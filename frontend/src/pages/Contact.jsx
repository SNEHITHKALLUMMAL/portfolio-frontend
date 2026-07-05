import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendContact, clearSuccess } from '../redux/slices/contactSlice';
import { fetchPublicProfile } from '../redux/slices/userSlice';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';
import Magnetic from '../components/motion/Magnetic';

// Floating-label field — label sits inside the input until focused/filled
const FloatingField = ({ as = 'input', label, name, value, onChange, error, type = 'text', rows, required }) => {
  const Tag = as;
  return (
    <div className="relative">
      <Tag
        type={as === 'input' ? type : undefined}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder=" "
        className={`peer input-field pt-5 pb-2 ${error ? '!border-danger' : ''}`}
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 top-1 text-[11px] text-muted-light dark:text-muted transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 dark:peer-placeholder-shown:text-white/30
          peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-accent-violet dark:peer-focus:text-accent-light"
      >
        {label}{required && ' *'}
      </label>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
};

const Contact = () => {
  const dispatch = useDispatch();
  const { publicProfile } = useSelector((state) => state.user);
  const { loading, success, error } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [errors, setErrors] = useState({});

  useState(() => {
    dispatch(fetchPublicProfile());
    return () => dispatch(clearSuccess());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await dispatch(sendContact(formData));
    if (!error) {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const infoItems = [
    { icon: Mail, label: 'Email', value: publicProfile?.email, href: publicProfile?.email ? `mailto:${publicProfile.email}` : null },
    { icon: Phone, label: 'Phone', value: publicProfile?.phone, href: publicProfile?.phone ? `tel:${publicProfile.phone}` : null },
    { icon: MapPin, label: 'Location', value: publicProfile?.location, href: null },
  ].filter((item) => item.value);

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <Reveal>
        <p className="eyebrow">Let's talk</p>
        <h1 className="section-title">Get In Touch</h1>
        <p className="text-muted-light dark:text-muted mb-10 max-w-2xl">
          Have a project in mind or want to collaborate? Fill out the form and I'll get back to you.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <Reveal delay={0.05} className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Contact Information</h2>
            <div className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl2 bg-accent-gradient-soft flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-accent-violet dark:text-accent-light" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-light dark:text-muted">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-slate-900 dark:text-white hover:text-accent-violet dark:hover:text-accent-light text-sm">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-slate-900 dark:text-white text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {publicProfile?.socialLinks && (
            <Reveal delay={0.1} className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Follow Me</h2>
              <div className="flex space-x-3">
                {publicProfile.socialLinks.github && (
                  <a href={publicProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn-icon">
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
                {publicProfile.socialLinks.linkedin && (
                  <a href={publicProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn-icon">
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                )}
                {publicProfile.socialLinks.twitter && (
                  <a href={publicProfile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="btn-icon">
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>

        {/* Contact Form */}
        <Reveal delay={0.1} className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Send a Message</h2>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-success/10 border border-success/30 rounded-xl2 flex items-center gap-2 text-success overflow-hidden"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-sm">Message sent successfully! I'll get back to you soon.</span>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl2 flex items-center gap-2 text-danger overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FloatingField label="Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} required />
            <FloatingField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} required />
            <FloatingField label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            <FloatingField label="Subject" name="subject" value={formData.subject} onChange={handleChange} error={errors.subject} required />
            <FloatingField as="textarea" rows="5" label="Message" name="message" value={formData.message} onChange={handleChange} error={errors.message} required />

            <Magnetic className="block w-full">
              <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </Magnetic>
          </form>
        </Reveal>
      </div>
    </div>
  );
};

export default Contact;
