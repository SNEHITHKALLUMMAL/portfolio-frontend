import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Database, Globe, Zap, Users, TrendingUp } from 'lucide-react';
import { fetchProjects } from '../redux/slices/projectSlice';
import { fetchSkills } from '../redux/slices/skillSlice';
import { fetchPublicProfile } from '../redux/slices/userSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { skills } = useSelector((state) => state.skills);
  const { publicProfile } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProjects({ featured: 'true', limit: 3 }));
    dispatch(fetchSkills());
    dispatch(fetchPublicProfile());
  }, [dispatch]);

  const featuredProjects = projects.slice(0, 3);
  const allSkills = skills.allSkills || [];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-[80vh] flex items-center justify-center text-center"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            {publicProfile?.avatar ? (
              <img
                src={publicProfile.avatar}
                alt={publicProfile.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-500 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl">
                <span className="text-white text-4xl font-bold">
                  {publicProfile?.name?.charAt(0) || 'P'}
                </span>
              </div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white"
          >
            Hi, I'm {publicProfile?.name || 'Developer'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8"
          >
            {publicProfile?.bio || 'Full Stack Developer | Building amazing digital experiences'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/projects" className="btn-primary flex items-center justify-center space-x-2">
              <span>View My Work</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Code, label: 'Projects', value: featuredProjects.length },
            { icon: Database, label: 'Skills', value: allSkills.length },
            { icon: Globe, label: 'Experience', value: '5+' },
            { icon: Users, label: 'Clients', value: '50+' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary-600" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <h2 className="section-title">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              className="glass-card overflow-hidden group"
            >
              {project.images?.[0] && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/projects/${project._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2"
                >
                  <span>View Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/projects" className="btn-primary inline-flex items-center space-x-2">
            <span>View All Projects</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-16">
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allSkills.slice(0, 12).map((skill, index) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
              className="glass-card p-4 text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl mb-2">{skill.icon || '💻'}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{skill.skillName}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{skill.percentage}%</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="glass-card p-12 text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl mb-8 opacity-90">
            Have a project in mind? I'd love to hear about it.
          </p>
          <Link to="/contact" className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            <span>Get In Touch</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
