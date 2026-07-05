import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar } from 'lucide-react';
import { fetchProject, clearCurrentProject } from '../redux/slices/projectSlice';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';
import Magnetic from '../components/motion/Magnetic';

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
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-violet border-t-transparent"></div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="page-container">
        <p className="text-muted-light dark:text-muted">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-muted-light dark:text-muted hover:text-slate-900 dark:hover:text-white text-sm mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Projects</span>
        </Link>

        {/* Project Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <span className="pill bg-accent-gradient-soft text-accent-violet dark:text-accent-light mb-4 inline-block">
                {currentProject.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                {currentProject.title}
              </h1>
            </div>
            <div className="flex gap-3">
              {currentProject.githubUrl && (
                <Magnetic>
                  <a href={currentProject.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </Magnetic>
              )}
              {currentProject.liveUrl && (
                <Magnetic>
                  <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                </Magnetic>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-light dark:text-muted mb-6 leading-relaxed">
            {currentProject.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-light dark:text-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(currentProject.startDate).toLocaleDateString()} — {currentProject.endDate ? new Date(currentProject.endDate).toLocaleDateString() : 'Present'}
              </span>
            </div>
            <span className="pill bg-slate-900/[0.05] dark:bg-white/10 capitalize">{currentProject.status}</span>
          </div>
        </div>

        {/* Project Images */}
        {currentProject.images && currentProject.images.length > 0 && (
          <div className="mb-8">
            <p className="eyebrow">Gallery</p>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProject.images.map((image, index) => (
                <Reveal key={index} direction="none" delay={index * 0.08} className="glass-card overflow-hidden">
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
        <Reveal className="glass-card p-8 mb-8">
          <p className="eyebrow">Stack</p>
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {currentProject.technologies?.map((tech) => (
              <span key={tech} className="pill text-sm bg-accent-gradient-soft text-accent-violet dark:text-accent-light !py-1.5 !px-4">
                {tech}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Tags */}
        {currentProject.tags && currentProject.tags.length > 0 && (
          <Reveal className="glass-card p-8">
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {currentProject.tags.map((tag) => (
                <span key={tag} className="pill bg-slate-900/[0.05] dark:bg-white/10 text-slate-600 dark:text-white/70">
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
