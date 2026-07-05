import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink, Github, ArrowRight, FolderGit2 } from 'lucide-react';
import { fetchProjects } from '../redux/slices/projectSlice';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Web Development', 'Mobile App', 'UI/UX Design', 'Machine Learning', 'Data Science', 'Other'];

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    dispatch(fetchProjects(params));
  }, [dispatch, searchTerm, selectedCategory]);

  const filteredProjects = projects;

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <Reveal>
        <p className="eyebrow">Portfolio</p>
        <h1 className="section-title">Projects</h1>
        <p className="text-muted-light dark:text-muted mb-10 max-w-2xl">
          A collection of things I've built — each one a different problem, stack, or idea worth exploring.
        </p>
      </Reveal>

      {/* Search and Filter */}
      <Reveal delay={0.08} className="glass-card p-5 mb-10 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light dark:text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-light dark:text-muted shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </Reveal>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-violet border-t-transparent"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Reveal className="text-center py-20 glass-card">
          <FolderGit2 className="w-10 h-10 mx-auto mb-4 text-muted-light dark:text-muted" />
          <p className="text-muted-light dark:text-muted">No projects matched your search.</p>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="glass-card glass-card-hover overflow-hidden group relative"
              >
                {/* animated gradient border on hover */}
                <div className="absolute -inset-px rounded-2xl2 bg-accent-gradient opacity-0 group-hover:opacity-30 blur transition-opacity duration-500 -z-10" />

                <div className="relative">
                  {project.images?.[0] ? (
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-night-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn-icon !w-9 !h-9 !bg-white/90 !text-slate-900">
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="btn-icon !w-9 !h-9 !bg-white/90 !text-slate-900">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-accent-gradient flex items-center justify-center">
                      <span className="text-white text-4xl font-bold font-display">{project.title.charAt(0)}</span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="pill bg-accent-gradient-soft text-accent-violet dark:text-accent-light">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="pill bg-warning/10 text-warning">Featured</span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{project.title}</h3>
                    <p className="text-muted-light dark:text-muted mb-4 line-clamp-2 text-sm">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.technologies?.slice(0, 4).map((tech) => (
                        <span key={tech} className="pill bg-slate-900/[0.05] dark:bg-white/10 text-slate-600 dark:text-white/70">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/projects/${project._id}`}
                      className="flex items-center gap-1.5 text-accent-violet dark:text-accent-light hover:opacity-80 text-sm font-semibold group/link"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Projects;
