import { useState, useEffect } from 'react';
import { Update } from '../types';
import toast from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';
import { subscribeToUpdates, addComment, CommentInput } from '../lib/database';

export default function UpdatesSection() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [commentText, setCommentText] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const { isDark } = useAdminStore();

  useEffect(() => {
    try {
      const unsubscribe = subscribeToUpdates((updatedUpdates) => {
        setUpdates(updatedUpdates);
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error loading updates:', error);
      toast.error('Failed to load updates. Please refresh the page.');
    }
  }, []);

  const handleComment = async (updateId: string) => {
    if (!commentText.trim() || !userEmail.trim()) {
      toast.error('Please enter both email and comment');
      return;
    }

    const commentInput: CommentInput = {
      user_email: userEmail.trim(),
      content: commentText.trim()
    };

    try {
      await addComment(updateId, commentInput);

      setCommentText('');
      setUserEmail('');
      setCommentingOn(null);
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className={`py-12 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {updates.map((update) => (
            <div 
              key={update.id} 
              className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-6 rounded-lg shadow-sm`}
            >
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {update.title}
              </h3>
              <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {update.content}
              </p>
              {update.image_url && (
                <img 
                  src={update.image_url} 
                  alt={update.title}
                  className="mt-4 rounded-lg max-h-64 object-cover"
                />
              )}
              <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Posted on {new Date(update.created_at).toLocaleDateString()}
              </p>

              {/* Comments Section */}
              <div className="mt-6 space-y-4">
                <h4 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Comments ({update.comments.length})
                </h4>
                
                {update.comments.map((comment) => (
                  <div 
                    key={comment.id}
                    className={`${isDark ? 'bg-gray-600' : 'bg-white'} p-4 rounded-md`}
                  >
                    <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {comment.content}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      By: {comment.user_email} • {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                    
                    {comment.admin_reply && (
                      <div className="mt-2 pl-4 border-l-2 border-blue-500">
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {comment.admin_reply}
                        </p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Admin Reply • {new Date(comment.admin_reply_at!).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Comment Form */}
                {commentingOn === update.id ? (
                  <div className="mt-4 space-y-3">
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Your email"
                      className={`w-full px-3 py-2 text-sm rounded-md ${
                        isDark 
                          ? 'bg-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white text-gray-900 placeholder-gray-500'
                      } border border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Your comment"
                      rows={3}
                      className={`w-full px-3 py-2 text-sm rounded-md ${
                        isDark 
                          ? 'bg-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white text-gray-900 placeholder-gray-500'
                      } border border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setCommentingOn(null);
                          setCommentText('');
                          setUserEmail('');
                        }}
                        className={`px-3 py-1 text-sm rounded-md ${
                          isDark 
                            ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleComment(update.id)}
                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setCommentingOn(update.id)}
                    className={`mt-2 text-sm ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Add a comment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}