import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Calendar, Download, ExternalLink } from 'lucide-react';
import { fetchPublicProfile } from '../redux/slices/userSlice';
import { fetchSkills } from '../redux/slices/skillSlice';
import api from '../utils/api';

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
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="section-title">About Me</h1>

        {/* Profile Section */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              {publicProfile?.avatar ? (
                <img
                  src={publicProfile.avatar}
                  alt={publicProfile.name}
                  className="w-full max-w-xs rounded-lg object-cover shadow-lg"
                />
              ) : (
                <div className="w-full max-w-xs h-64 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                  <span className="text-white text-6xl font-bold">
                    {publicProfile?.name?.charAt(0) || 'P'}
                  </span>
                </div>
              )}
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {publicProfile?.name || 'Developer'}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {publicProfile?.bio || 'A passionate developer creating amazing digital experiences.'}
              </p>
              
              <div className="space-y-3 mb-6">
                {publicProfile?.email && (
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <a href={`mailto:${publicProfile.email}`} className="hover:text-primary-600">
                      {publicProfile.email}
                    </a>
                  </div>
                )}
                {publicProfile?.phone && (
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span>{publicProfile.phone}</span>
                  </div>
                )}
                {publicProfile?.location && (
                  <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span>{publicProfile.location}</span>
                  </div>
                )}
              </div>

              {publicProfile?.resume && (
                <button
                  onClick={handleDownloadResume}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Resume</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Skills & Expertise</h2>
          {Object.keys(groupedSkills).length > 0 ? (
            Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 mb-4"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{category}</h3>
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill._id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{skill.skillName}</span>
                        <span className="text-gray-600 dark:text-gray-400">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-primary-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No skills added yet.</p>
          )}
        </div>

        {/* Social Links */}
        {publicProfile?.socialLinks && (
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Connect With Me</h2>
            <div className="flex flex-wrap gap-4">
              {publicProfile.socialLinks.github && (
                <a
                  href={publicProfile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {publicProfile.socialLinks.linkedin && (
                <a
                  href={publicProfile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {publicProfile.socialLinks.twitter && (
                <a
                  href={publicProfile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <span>Twitter</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {publicProfile.socialLinks.portfolio && (
                <a
                  href={publicProfile.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <span>Portfolio</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default About;
