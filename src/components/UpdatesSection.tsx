import { useState, useEffect } from 'react';
import { Update, Comment } from '../types';
import toast, { Toaster } from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';

export default function UpdatesSection() {
  const { isDark } = useAdminStore();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);

  const refreshUpdates = () => {
    try {
      const savedUpdates = JSON.parse(localStorage.getItem('updates') || '[]');
      const formattedUpdates = savedUpdates.map((update: Update) => ({
        ...update,
        comments: update.comments || []
      }));
      setUpdates(formattedUpdates);
    } catch (error) {
      console.error('Error refreshing updates:', error);
      toast.error('Error loading updates');
    }
  };

  useEffect(() => {
    refreshUpdates();
    const interval = setInterval(refreshUpdates, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCommentSubmit = (updateId: string) => {
    if (!userEmail.trim()) {
      toast.error('Please enter your email to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      userEmail,
      content: newComment,
      date: new Date().toISOString()
    };

    const updatedUpdates = updates.map(update => {
      if (update.id === updateId) {
        return {
          ...update,
          comments: [...(update.comments || []), comment]
        };
      }
      return update;
    });

    setUpdates(updatedUpdates);
    localStorage.setItem('updates', JSON.stringify(updatedUpdates));
    setNewComment('');
    setCommentingOn(null);
    setUserEmail('');
    toast.success('Comment added successfully!');
  };

  if (updates.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Toaster position="top-right" />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
          Latest Updates
        </h2>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          No updates available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-300`}>
        Latest Updates
      </h2>
      <div className="space-y-6">
        {updates.map((update) => (
          <div key={update.id} 
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden 
              transform transition-all duration-300 hover:shadow-xl`}
          >
            <div className="p-4 sm:p-6">
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                {update.title}
              </h3>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                {update.content}
              </p>
              {update.imageUrl && (
                <img
                  src={update.imageUrl}
                  alt={update.title}
                  className="mt-4 rounded-lg max-h-64 w-full object-cover"
                  loading="lazy"
                />
              )}
              <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                Posted on {new Date(update.date).toLocaleDateString()}
              </p>

              {/* Comments Section */}
              <div className="mt-6">
                <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 transition-colors duration-300`}>
                  Comments ({update.comments?.length || 0})
                </h4>
                <div className="space-y-4">
                  {update.comments?.map((comment) => (
                    <div key={comment.id} 
                      className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg 
                        transition-colors duration-300`}
                    >
                      <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {comment.content}
                      </p>
                      <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          By: {comment.userEmail}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(comment.date).toLocaleDateString()}
                        </p>
                      </div>
                      {comment.adminReply && (
                        <div className={`mt-3 pl-4 border-l-2 ${isDark ? 'border-blue-400' : 'border-blue-300'}`}>
                          <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            {comment.adminReply}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            Admin Reply • {new Date(comment.adminReplyDate!).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Comment Form */}
                {commentingOn === update.id ? (
                  <div className="mt-4 space-y-3">
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Your email"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm 
                        ${isDark 
                          ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                          : 'border-gray-300'
                        } focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                      required
                    />
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your comment..."
                      className={`w-full px-3 py-2 border rounded-md shadow-sm 
                        ${isDark 
                          ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                          : 'border-gray-300'
                        } focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                      rows={3}
                      required
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleCommentSubmit(update.id)}
                        className={`px-4 py-2 rounded-md text-white 
                          ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}
                          transition-colors duration-300 flex-1 sm:flex-none`}
                      >
                        Submit Comment
                      </button>
                      <button
                        onClick={() => {
                          setCommentingOn(null);
                          setNewComment('');
                          setUserEmail('');
                        }}
                        className={`px-4 py-2 rounded-md 
                          ${isDark 
                            ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          } transition-colors duration-300 flex-1 sm:flex-none`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setCommentingOn(update.id)}
                    className={`mt-4 text-sm font-medium 
                      ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}
                      transition-colors duration-300`}
                  >
                    Add a Comment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}