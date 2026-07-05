import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Download, ExternalLink } from 'lucide-react';
import { fetchPublicProfile } from '../redux/slices/userSlice';
import { fetchSkills } from '../redux/slices/skillSlice';
import api from '../utils/api';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';

const About = () => {
  const dispatch = useDispatch();
  const { publicProfile } = useSelector((state) => state.user);
  const { skills } = useSelector((state) => state.skills);

  useEffect(() => {
    dispatch(fetchPublicProfile());
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleDownloadResume = () => {
    if (publicProfile?.resume) {
      window.open(`${api.defaults.baseURL.replace('/api', '')}${publicProfile.resume}`, '_blank');
    }
  };

  const groupedSkills = skills.skills || {};

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow">cat ./about.md</p>
        <h1 className="section-title mb-8">About Me</h1>

        {/* Profile Section */}
        <div className="window-card mb-8">
          <div className="window-titlebar">
            <span className="window-dot bg-[#ff5f57]" />
            <span className="window-dot bg-[#febc2e]" />
            <span className="window-dot bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-ink-400">profile.json</span>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                {publicProfile?.avatar ? (
                  <img
                    src={publicProfile.avatar}
                    alt={publicProfile.name}
                    className="w-full max-w-xs rounded-xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-full max-w-xs h-64 rounded-xl bg-gradient-to-br from-primary-400 to-keyword-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-6xl font-bold">
                      {publicProfile?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4 text-ink-950 dark:text-white">
                  {publicProfile?.name || 'Developer'}
                </h2>
                <p className="text-lg text-ink-600 dark:text-ink-200 mb-6 leading-relaxed">
                  {publicProfile?.bio || 'A passionate developer creating amazing digital experiences.'}
                </p>

                <div className="space-y-3 mb-6 font-mono text-sm">
                  {publicProfile?.email && (
                    <div className="flex items-center gap-3 text-ink-500 dark:text-ink-300">
                      <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                      <a href={`mailto:${publicProfile.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        {publicProfile.email}
                      </a>
                    </div>
                  )}
                  {publicProfile?.phone && (
                    <div className="flex items-center gap-3 text-ink-500 dark:text-ink-300">
                      <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                      <span>{publicProfile.phone}</span>
                    </div>
                  )}
                  {publicProfile?.location && (
                    <div className="flex items-center gap-3 text-ink-500 dark:text-ink-300">
                      <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                      <span>{publicProfile.location}</span>
                    </div>
                  )}
                </div>

                {publicProfile?.resume && (
                  <button onClick={handleDownloadResume} className="btn-primary">
                    <Download className="w-4 h-4" />
                    <span>download_resume()</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <p className="eyebrow">cat ./skills.json</p>
          <h2 className="text-2xl font-bold mb-6 text-ink-950 dark:text-white">Skills &amp; Expertise</h2>
          {Object.keys(groupedSkills).length > 0 ? (
            Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
              <Reveal key={category} delay={catIndex * 0.06} className="window-card p-6 mb-4">
                <h3 className="text-lg font-semibold mb-4 text-ink-950 dark:text-white font-mono">// {category}</h3>
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill._id}>
                      <div className="flex justify-between mb-1.5 text-sm">
                        <span className="text-ink-700 dark:text-ink-200">{skill.skillName}</span>
                        <span className="text-ink-400 font-mono">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-ink-900/[0.06] dark:bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))
          ) : (
            <p className="text-ink-500 dark:text-ink-300 font-mono">// no skills added yet</p>
          )}
        </div>

        {/* Social Links */}
        {publicProfile?.socialLinks && (
          <Reveal className="window-card p-6">
            <h2 className="text-xl font-bold mb-4 text-ink-950 dark:text-white">Connect With Me</h2>
            <div className="flex flex-wrap gap-3">
              {publicProfile.socialLinks.github && (
                <a href={publicProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <span>GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {publicProfile.socialLinks.linkedin && (
                <a href={publicProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <span>LinkedIn</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {publicProfile.socialLinks.twitter && (
                <a href={publicProfile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <span>Twitter</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {publicProfile.socialLinks.portfolio && (
                <a href={publicProfile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <span>Portfolio</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </Reveal>
        )}
      </motion.div>
    </div>
  );
};

export default About;
