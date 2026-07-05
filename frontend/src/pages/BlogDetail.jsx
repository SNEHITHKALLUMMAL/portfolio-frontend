import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Eye, MessageSquare, Send } from 'lucide-react';
import { fetchBlogBySlug, clearCurrentBlog, addComment } from '../redux/slices/blogSlice';
import Reveal from '../components/motion/Reveal';
import AmbientBackground from '../components/motion/AmbientBackground';
import Magnetic from '../components/motion/Magnetic';

const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentBlog, loading } = useSelector((state) => state.blogs);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '' });
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogBySlug(slug));
    return () => dispatch(clearCurrentBlog());
  }, [dispatch, slug]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    dispatch(addComment({ id: currentBlog._id, commentData: commentForm }));
    setCommentSubmitted(true);
    setCommentForm({ name: '', email: '', comment: '' });
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-violet border-t-transparent"></div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="page-container">
        <p className="text-muted-light dark:text-muted">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-light dark:text-muted hover:text-slate-900 dark:hover:text-white text-sm mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Blog</span>
        </Link>

        {/* Article Header */}
        <div className="glass-card mb-8 p-8">
          {currentBlog.coverImage && (
            <img
              src={currentBlog.coverImage}
              alt={currentBlog.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl2 mb-6"
            />
          )}

          <div className="flex items-center flex-wrap gap-4 mb-4 text-xs text-muted-light dark:text-muted">
            <span className="pill bg-accent-gradient-soft text-accent-violet dark:text-accent-light">
              {currentBlog.category}
            </span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(currentBlog.publishedAt || currentBlog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{currentBlog.views} views</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            {currentBlog.title}
          </h1>

          <div className="flex items-center gap-3">
            {currentBlog.createdBy?.avatar ? (
              <img src={currentBlog.createdBy.avatar} alt={currentBlog.createdBy.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentBlog.createdBy?.name?.charAt(0)}</span>
              </div>
            )}
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-sm">{currentBlog.createdBy?.name}</p>
              <p className="text-xs text-muted-light dark:text-muted">Author</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Reveal className="glass-card p-8 mb-8">
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentBlog.content }}
          />
        </Reveal>

        {/* Tags */}
        {currentBlog.tags && currentBlog.tags.length > 0 && (
          <Reveal className="glass-card p-6 mb-8">
            <h3 className="text-sm font-semibold mb-4 text-slate-900 dark:text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {currentBlog.tags.map((tag) => (
                <span key={tag} className="pill bg-slate-900/[0.05] dark:bg-white/10 text-slate-600 dark:text-white/70">
                  #{tag}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {/* Comments Section */}
        <Reveal className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent-violet dark:text-accent-light" />
            <span>Comments ({currentBlog.comments?.filter(c => c.approved).length || 0})</span>
          </h3>

          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your Name"
                value={commentForm.name}
                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={commentForm.email}
                onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <textarea
              placeholder="Your Comment"
              value={commentForm.comment}
              onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
              className="input-field mb-4"
              rows="4"
              required
            />
            <Magnetic>
              <button type="submit" className="btn-primary">
                <Send className="w-4 h-4" />
                <span>Submit Comment</span>
              </button>
            </Magnetic>
            {commentSubmitted && (
              <p className="mt-3 text-sm text-success">
                ✓ Comment submitted for moderation
              </p>
            )}
          </form>

          <div className="space-y-6">
            {currentBlog.comments?.filter(c => c.approved).map((comment) => (
              <div key={comment._id} className="border-b border-slate-900/[0.07] dark:border-white/[0.07] pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-accent-gradient-soft flex items-center justify-center">
                    <span className="text-accent-violet dark:text-accent-light font-bold text-sm">
                      {comment.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{comment.name}</p>
                    <p className="text-xs text-muted-light dark:text-muted">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-white/80 text-sm">{comment.comment}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </motion.div>
    </div>
  );
};

export default BlogDetail;
