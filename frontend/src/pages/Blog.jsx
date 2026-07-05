import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Calendar, Eye, ArrowRight, Newspaper } from 'lucide-react';
import { fetchBlogs } from '../redux/slices/blogSlice';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';

const Blog = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Technology', 'Tutorial', 'Career', 'Personal', 'Other'];

  useEffect(() => {
    const params = { status: 'published' };
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    dispatch(fetchBlogs(params));
  }, [dispatch, searchTerm, selectedCategory]);

  const filteredBlogs = blogs;

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <Reveal>
        <p className="eyebrow">tail -f ./blog.log</p>
        <h1 className="section-title">Blog</h1>
        <p className="text-ink-500 dark:text-ink-300 mb-8 max-w-2xl">
          Thoughts, tutorials, and notes-to-self about building software.
        </p>
      </Reveal>

      {/* Search and Filter */}
      <Reveal delay={0.08} className="window-card p-5 mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-300" />
            <input
              type="text"
              placeholder="grep -i 'article title'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 font-mono text-sm"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field font-mono text-sm md:w-56"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </Reveal>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-400 border-t-transparent"></div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <Reveal className="text-center py-20 window-card">
          <Newspaper className="w-10 h-10 mx-auto mb-4 text-ink-300" />
          <p className="text-ink-500 dark:text-ink-300 font-mono">No articles found.</p>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                layout
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="window-card group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink-950/5 dark:hover:shadow-black/30"
              >
                {blog.coverImage ? (
                  <div className="h-44 overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-keyword-500 to-primary-400 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">{blog.title.charAt(0)}</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center flex-wrap gap-3 mb-3 text-xs font-mono text-ink-400">
                    <span className="pill bg-keyword-500/10 text-keyword-600 dark:text-keyword-400">
                      {blog.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{blog.views}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-ink-950 dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-ink-500 dark:text-ink-300 mb-4 line-clamp-3 text-sm">
                    {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                  </p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="pill bg-ink-900/5 dark:bg-white/10 text-ink-600 dark:text-ink-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-mono text-sm font-medium flex items-center gap-1.5 group/link"
                  >
                    <span>read_more()</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Blog;
