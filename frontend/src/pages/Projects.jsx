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
        <p className="eyebrow">ls -la ./projects</p>
        <h1 className="section-title">Projects</h1>
        <p className="text-ink-500 dark:text-ink-300 mb-8 max-w-2xl">
          A collection of things I've built — each one a different problem, stack, or idea worth exploring.
        </p>
      </Reveal>

      {/* Search and Filter */}
      <Reveal delay={0.08} className="window-card p-5 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-300" />
            <input
              type="text"
              placeholder="grep -i 'project name'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 font-mono text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-ink-300 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field font-mono text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Reveal>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-400 border-t-transparent"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Reveal className="text-center py-20 window-card">
          <FolderGit2 className="w-10 h-10 mx-auto mb-4 text-ink-300" />
          <p className="text-ink-500 dark:text-ink-300 font-mono">No projects matched your search.</p>
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
                className="window-card group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink-950/5 dark:hover:shadow-black/30"
              >
                <div className="window-titlebar justify-between">
                  <div className="flex gap-1.5">
                    <span className="window-dot bg-[#ff5f57]" />
                    <span className="window-dot bg-[#febc2e]" />
                    <span className="window-dot bg-[#28c840]" />
                  </div>
                  {project.featured && (
                    <span className="pill bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400">featured</span>
                  )}
                </div>

                {project.images?.[0] ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary-400 to-keyword-500 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">{project.title.charAt(0)}</span>
                  </div>
                )}

                <div className="p-6">
                  <span className="pill bg-keyword-500/10 text-keyword-600 dark:text-keyword-400 mb-3 inline-block">
                    {project.category}
                  </span>

                  <h3 className="text-lg font-semibold mb-2 text-ink-950 dark:text-white">{project.title}</h3>
                  <p className="text-ink-500 dark:text-ink-300 mb-4 line-clamp-2 text-sm">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.technologies?.slice(0, 4).map((tech) => (
                      <span key={tech} className="pill bg-ink-900/5 dark:bg-white/10 text-ink-600 dark:text-ink-200">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/projects/${project._id}`}
                      className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-mono text-sm font-medium group/link"
                    >
                      <span>details()</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-ink-950 dark:hover:text-white transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-ink-950 dark:hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
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
