import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Download, ExternalLink } from 'lucide-react';
import { fetchPublicProfile } from '../redux/slices/userSlice';
import { fetchSkills } from '../redux/slices/skillSlice';
import api, { getFileUrl } from '../utils/api';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';
import Magnetic from '../components/motion/Magnetic';

const About = () => {
  const dispatch = useDispatch();
  const { publicProfile } = useSelector((state) => state.user);
  const { skills: groupedSkillsRaw } = useSelector((state) => state.skills);

  useEffect(() => {
    dispatch(fetchPublicProfile());
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleDownloadResume = () => {
    if (publicProfile?.resume) {
      window.open(getFileUrl(publicProfile.resume), '_blank');
    }
  };

  const groupedSkills = groupedSkillsRaw || {};

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="eyebrow">Get to know me</p>
        <h1 className="section-title mb-10">About Me</h1>

        {/* Profile Section */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              {publicProfile?.avatar ? (
                <img
                  src={getFileUrl(publicProfile.avatar)}
                  alt={publicProfile.name}
                  className="w-full max-w-xs rounded-2xl2 object-cover shadow-glass"
                />
              ) : (
                <div className="w-full max-w-xs h-64 rounded-2xl2 bg-accent-gradient flex items-center justify-center shadow-glow-violet">
                  <span className="text-white text-6xl font-bold font-display">
                    {publicProfile?.name?.charAt(0) || 'P'}
                  </span>
                </div>
              )}
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                {publicProfile?.name || 'Developer'}
              </h2>
              <p className="text-lg text-muted-light dark:text-muted mb-6 leading-relaxed">
                {publicProfile?.bio || 'A passionate developer creating amazing digital experiences.'}
              </p>

              <div className="space-y-3 mb-6 text-sm">
                {publicProfile?.email && (
                  <div className="flex items-center gap-3 text-muted-light dark:text-muted">
                    <Mail className="w-4 h-4 text-accent-violet dark:text-accent-light shrink-0" />
                    <a href={`mailto:${publicProfile.email}`} className="hover:text-accent-violet dark:hover:text-accent-light">
                      {publicProfile.email}
                    </a>
                  </div>
                )}
                {publicProfile?.phone && (
                  <div className="flex items-center gap-3 text-muted-light dark:text-muted">
                    <Phone className="w-4 h-4 text-accent-violet dark:text-accent-light shrink-0" />
                    <span>{publicProfile.phone}</span>
                  </div>
                )}
                {publicProfile?.location && (
                  <div className="flex items-center gap-3 text-muted-light dark:text-muted">
                    <MapPin className="w-4 h-4 text-accent-violet dark:text-accent-light shrink-0" />
                    <span>{publicProfile.location}</span>
                  </div>
                )}
              </div>

              {publicProfile?.resume && (
                <Magnetic>
                  <button onClick={handleDownloadResume} className="btn-primary">
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>
                </Magnetic>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section — bento grid of category cards */}
        <div className="mb-8">
          <p className="eyebrow">Expertise</p>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Skills &amp; Expertise</h2>
          {Object.keys(groupedSkills).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
                <Reveal key={category} delay={catIndex * 0.06} className="glass-card glass-card-hover p-6">
                  <h3 className="text-base font-semibold mb-4 text-slate-900 dark:text-white">{category}</h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill._id}>
                        <div className="flex justify-between mb-1.5 text-sm">
                          <span className="text-slate-700 dark:text-white/80">{skill.skillName}</span>
                          <span className="text-muted-light dark:text-muted">{skill.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-900/[0.06] dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-accent-gradient h-1.5 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-muted-light dark:text-muted">No skills added yet.</p>
          )}
        </div>

        {/* Social Links */}
        {publicProfile?.socialLinks && (
          <Reveal className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Connect With Me</h2>
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
