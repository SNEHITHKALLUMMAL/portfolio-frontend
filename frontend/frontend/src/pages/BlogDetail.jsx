import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { fetchBlogBySlug, clearCurrentBlog, addComment } from '../redux/slices/blogSlice';

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="page-container">
        <p className="text-gray-600 dark:text-gray-400">Article not found.</p>
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
          to="/blog"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Blog</span>
        </Link>

        {/* Article Header */}
        <div className="glass-card p-8 mb-8">
          {currentBlog.coverImage && (
            <img
              src={currentBlog.coverImage}
              alt={currentBlog.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
            />
          )}

          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full">
              {currentBlog.category}
            </span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(currentBlog.publishedAt || currentBlog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{currentBlog.views} views</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {currentBlog.title}
          </h1>

          <div className="flex items-center space-x-3">
            {currentBlog.createdBy?.avatar ? (
              <img
                src={currentBlog.createdBy.avatar}
                alt={currentBlog.createdBy.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold">{currentBlog.createdBy?.name?.charAt(0)}</span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{currentBlog.createdBy?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Author</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="glass-card p-8 mb-8">
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentBlog.content }}
          />
        </div>

        {/* Tags */}
        {currentBlog.tags && currentBlog.tags.length > 0 && (
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {currentBlog.tags.map((tag) => (
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

        {/* Comments Section */}
        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center space-x-2">
            <MessageSquare className="w-6 h-6" />
            <span>Comments ({currentBlog.comments?.filter(c => c.approved).length || 0})</span>
          </h3>

          {/* Comment Form */}
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
            <button type="submit" className="btn-primary">
              Submit Comment
            </button>
            {commentSubmitted && (
              <p className="mt-2 text-green-600 dark:text-green-400">
                Comment submitted for moderation.
              </p>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {currentBlog.comments?.filter(c => c.approved).map((comment) => (
              <div key={comment._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">
                      {comment.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{comment.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogDetail;
