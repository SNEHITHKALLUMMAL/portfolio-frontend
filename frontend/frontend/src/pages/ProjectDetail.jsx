import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { fetchProject, clearCurrentProject } from '../redux/slices/projectSlice';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="page-container">
        <p className="text-gray-600 dark:text-gray-400">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Projects</span>
        </Link>

        {/* Project Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm mb-4 inline-block">
                {currentProject.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {currentProject.title}
              </h1>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {currentProject.githubUrl && (
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              )}
              {currentProject.liveUrl && (
                <a
                  href={currentProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {currentProject.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(currentProject.startDate).toLocaleDateString()} - {currentProject.endDate ? new Date(currentProject.endDate).toLocaleDateString() : 'Present'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded capitalize">
                {currentProject.status}
              </span>
            </div>
          </div>
        </div>

        {/* Project Images */}
        {currentProject.images && currentProject.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProject.images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`${currentProject.title} ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {currentProject.technologies?.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        {currentProject.tags && currentProject.tags.length > 0 && (
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {currentProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectDetail;
