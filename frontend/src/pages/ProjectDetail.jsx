import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar } from 'lucide-react';
import { fetchProject, clearCurrentProject } from '../redux/slices/projectSlice';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProject(id));
    return () => dispatch(clearCurrentProject());
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="page-container">
        <p className="text-ink-500 dark:text-ink-300 font-mono">// project not found</p>
      </div>
    );
  }

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-ink-500 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white font-mono text-sm mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>cd ../projects</span>
        </Link>

        {/* Project Header */}
        <div className="window-card mb-8">
          <div className="window-titlebar">
            <span className="window-dot bg-[#ff5f57]" />
            <span className="window-dot bg-[#febc2e]" />
            <span className="window-dot bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-ink-400">{currentProject.title.toLowerCase().replace(/\s+/g, '-')}.md</span>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <span className="pill bg-keyword-500/10 text-keyword-600 dark:text-keyword-400 mb-4 inline-block">
                  {currentProject.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-ink-950 dark:text-white">
                  {currentProject.title}
                </h1>
              </div>
              <div className="flex gap-3">
                {currentProject.githubUrl && (
                  <a href={currentProject.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <Github className="w-4 h-4" />
                    <span>github</span>
                  </a>
                )}
                {currentProject.liveUrl && (
                  <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <ExternalLink className="w-4 h-4" />
                    <span>live demo</span>
                  </a>
                )}
              </div>
            </div>

            <p className="text-lg text-ink-600 dark:text-ink-200 mb-6 leading-relaxed">
              {currentProject.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm font-mono text-ink-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(currentProject.startDate).toLocaleDateString()} → {currentProject.endDate ? new Date(currentProject.endDate).toLocaleDateString() : 'present'}
                </span>
              </div>
              <span className="pill bg-ink-900/5 dark:bg-white/10 capitalize">{currentProject.status}</span>
            </div>
          </div>
        </div>

        {/* Project Images */}
        {currentProject.images && currentProject.images.length > 0 && (
          <div className="mb-8">
            <p className="eyebrow">ls ./gallery</p>
            <h2 className="text-2xl font-bold mb-4 text-ink-950 dark:text-white">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProject.images.map((image, index) => (
                <Reveal key={index} direction="none" delay={index * 0.08} className="window-card overflow-hidden">
                  <img
                    src={image}
                    alt={`${currentProject.title} ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        <Reveal className="window-card p-8 mb-8">
          <p className="eyebrow">stack</p>
          <h2 className="text-2xl font-bold mb-4 text-ink-950 dark:text-white">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {currentProject.technologies?.map((tech) => (
              <span key={tech} className="pill text-sm bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 !py-1.5 !px-4">
                {tech}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Tags */}
        {currentProject.tags && currentProject.tags.length > 0 && (
          <Reveal className="window-card p-8">
            <h2 className="text-xl font-bold mb-4 text-ink-950 dark:text-white">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {currentProject.tags.map((tag) => (
                <span key={tag} className="pill bg-ink-900/5 dark:bg-white/10 text-ink-600 dark:text-ink-200">
                  #{tag}
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectDetail;
