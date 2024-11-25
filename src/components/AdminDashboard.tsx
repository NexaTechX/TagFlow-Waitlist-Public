import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import { Users, Bell, LogOut, Trash2, Edit, Send, Sun, Moon } from 'lucide-react';
import { WaitlistUser, Update, UpdateFormData, WaitlistEmailData } from '../types';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAIL_PUBLIC_KEY);

const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE_ID;
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;

const initialUpdateState: UpdateFormData = {
  title: '',
  content: '',
  imageUrl: '',
};

interface Comment {
  id: string;
  userEmail: string;
  content: string;
  date: string;
  adminReply?: string;
  adminReplyDate?: string;
}

interface UpdateWithComments extends Update {
  comments: Comment[];
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [updates, setUpdates] = useState<UpdateWithComments[]>([]);
  const [newUpdate, setNewUpdate] = useState<UpdateFormData>(initialUpdateState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout, isDark, toggleTheme } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }

    try {
      const waitlistData = localStorage.getItem('waitlist');
      const waitlistEmails = waitlistData ? JSON.parse(waitlistData) : [];
      
      const validEmails = Array.isArray(waitlistEmails) ? waitlistEmails : [];
      
      const formattedUsers = validEmails.map((emailData: string | WaitlistEmailData) => {
        if (typeof emailData === 'string') {
          return {
            email: emailData,
            joinedAt: new Date().toISOString(),
            feedback: ''
          };
        }
        return {
          email: emailData.email,
          joinedAt: emailData.joinedAt || new Date().toISOString(),
          feedback: emailData.feedback || ''
        };
      });
      
      setUsers(formattedUsers);

      // Get updates
      const updatesData = localStorage.getItem('updates');
      const savedUpdates = updatesData ? JSON.parse(updatesData) : [];
      setUpdates(Array.isArray(savedUpdates) ? savedUpdates : []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    }
  }, [isAuthenticated, navigate]);

  const sendEmailNotifications = async (update: Update) => {
    try {
      const waitlistData = localStorage.getItem('waitlist');
      const waitlist = waitlistData ? JSON.parse(waitlistData) : [];
      
      if (!Array.isArray(waitlist)) {
        toast.error('Invalid waitlist data');
        return;
      }

      let successCount = 0;
      const totalEmails = waitlist.length;

      for (const item of waitlist) {
        const userEmail = typeof item === 'string' ? item : item.email;
        
        try {
          const templateParams = {
            to_email: userEmail,
            recipient: userEmail,
            from_name: "TagFlow Team",
            to_name: userEmail.split('@')[0],
            subject: "New Update from TagFlow!",
            update_title: update.title,
            update_content: update.content,
            update_image: update.imageUrl || '',
            update_date: new Date().toLocaleDateString(),
            action_url: window.location.origin,
            email_to: userEmail,
            message: `
              We've just posted a new update that we think you'll be interested in!
              
              ${update.title}
              
              ${update.content}
              
              Visit our website to read more and join the discussion.
            `
          };

          console.log('Sending notification to:', userEmail, templateParams);

          const response = await emailjs.send(
            import.meta.env.VITE_EMAIL_SERVICE_ID,
            import.meta.env.VITE_UPDATE_NOTIFICATION_TEMPLATE_ID,
            templateParams
          );

          if (response.status === 200) {
            successCount++;
            console.log(`Email sent successfully to ${userEmail}`);
          } else {
            throw new Error(`Failed to send email: ${response.text}`);
          }
        } catch (error) {
          console.error(`Failed to send email to ${userEmail}:`, error);
        }
      }

      if (successCount === totalEmails) {
        toast.success('All notification emails sent successfully!');
      } else if (successCount > 0) {
        toast.success(`Sent ${successCount} out of ${totalEmails} notification emails`);
      } else {
        toast.error('Failed to send notification emails');
      }
    } catch (error) {
      console.error('Error sending notification emails:', error);
      toast.error('Failed to send notification emails');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUpdate.title.trim() || !newUpdate.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const update: Update = {
        id: editingId || Date.now().toString(),
        title: newUpdate.title,
        content: newUpdate.content,
        imageUrl: newUpdate.imageUrl || '',
        date: new Date().toISOString(),
        comments: [],
      };

      let updatedList: Update[];
      
      if (editingId) {
        updatedList = updates.map((u) => (u.id === editingId ? update : u));
        toast.success('Update modified successfully!');
      } else {
        updatedList = [update, ...updates];
        // Send email notifications for new posts only
        await sendEmailNotifications(update);
      }

      localStorage.setItem('updates', JSON.stringify(updatedList));
      setUpdates(updatedList.map(update => ({
        ...update,
        comments: update.comments || []
      })));
      setNewUpdate(initialUpdateState);
      setEditingId(null);
    } catch (error) {
      console.error('Error handling update:', error);
      toast.error('Failed to save update');
    }
  };

  const handleEdit = (update: Update) => {
    setEditingId(update.id);
    setNewUpdate({
      title: update.title,
      content: update.content,
      imageUrl: update.imageUrl || '',
    });
  };

  const handleDelete = (id: string) => {
    const updatedList = updates.filter((update) => update.id !== id);
    localStorage.setItem('updates', JSON.stringify(updatedList));
    setUpdates(updatedList);
    toast.success('Update deleted successfully!');
  };

  const handleDeleteUser = (email: string) => {
    const updatedUsers = users.filter(user => user.email !== email);
    const waitlist = updatedUsers.map(user => user.email);
    localStorage.setItem('waitlist', JSON.stringify(waitlist));
    setUsers(updatedUsers);
    toast.success('User deleted successfully!');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const sendWelcomeEmail = async (email: string) => {
    try {
      const templateParams = {
        to_email: email,
        recipient: email,
        from_name: "TagFlow Team",
        to_name: email.split('@')[0],
        subject: 'Welcome to TagFlow Waitlist!',
        email_to: email,
        message: `
          Thank you for joining our waitlist! 
          We're excited to have you on board and will keep you updated on our progress.
          
          You can provide feedback anytime by visiting our website.
          
          Best regards,
          The TagFlow Team
        `
      };

      console.log('Sending welcome email to:', email, templateParams);

      const response = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        toast.success('Welcome email sent successfully!');
      } else {
        throw new Error(`Failed to send email: ${response.text}`);
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast.error('Failed to send welcome email. Please check your EmailJS configuration.');
    }
  };

  const handleFeedbackSubmit = (email: string, feedback: string) => {
    try {
      const updatedUsers = users.map(user => 
        user.email === email ? { ...user, feedback, joinedAt: user.joinedAt } : user
      );
      
      // Update the users state
      setUsers(updatedUsers);
      
      // Get current waitlist and update it with new feedback
      const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
      const updatedWaitlist = waitlist.map((item: string | WaitlistEmailData) => {
        if (typeof item === 'string' && item === email) {
          return {
            email: item,
            feedback,
            joinedAt: new Date().toISOString()
          };
        } else if (typeof item === 'object' && item.email === email) {
          return {
            ...item,
            feedback
          };
        }
        return item;
      });
      
      // Save back to localStorage
      localStorage.setItem('waitlist', JSON.stringify(updatedWaitlist));
      toast.success('Feedback saved successfully!');
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Failed to save feedback');
    }
  };

  const handleDeleteComment = (updateId: string, commentId: string) => {
    const updatedUpdates = updates.map(update => {
      if (update.id === updateId) {
        return {
          ...update,
          comments: update.comments.filter(comment => comment.id !== commentId)
        };
      }
      return update;
    });

    setUpdates(updatedUpdates);
    localStorage.setItem('updates', JSON.stringify(updatedUpdates));
    toast.success('Comment deleted successfully!');
  };

  const handleAdminReply = (updateId: string, commentId: string) => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    const updatedUpdates = updates.map(update => {
      if (update.id === updateId) {
        return {
          ...update,
          comments: update.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                adminReply: replyContent,
                adminReplyDate: new Date().toISOString()
              };
            }
            return comment;
          })
        };
      }
      return update;
    });

    setUpdates(updatedUpdates);
    localStorage.setItem('updates', JSON.stringify(updatedUpdates));
    setReplyContent('');
    setReplyingTo(null);
    toast.success('Reply added successfully!');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster position="top-right" />
      <nav className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDark 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                } transition-colors duration-200`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={handleLogout}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  isDark ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Waitlist Users */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h2 className={`ml-3 text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Waitlist Users ({users.length})
                  </h2>
                </div>
                <button
                  onClick={() => sendWelcomeEmail(users.map(u => u.email).join(','))}
                  className={`px-3 py-1 rounded-md ${
                    isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  }`}
                >
                  Send Welcome Emails
                </button>
              </div>
              <div className="mt-6">
                <ul className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <li key={user.email} className="py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {user.email}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Joined: {new Date(user.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteUser(user.email)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Feedback Section */}
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={user.feedback || ''}
                            onChange={(e) => {
                              const newFeedback = e.target.value;
                              handleFeedbackSubmit(user.email, newFeedback);
                            }}
                            placeholder="Enter feedback..."
                            className={`w-full px-3 py-2 text-sm rounded-md ${
                              isDark 
                                ? 'bg-gray-700 text-white placeholder-gray-400' 
                                : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                            } border border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
                            rows={2}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleFeedbackSubmit(user.email, user.feedback || '')}
                              className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                                isDark
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                              }`}
                            >
                              Save Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Updates Management */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <Bell className="h-6 w-6 text-blue-600" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">
                  Updates Management
                </h2>
              </div>
              <form onSubmit={handleUpdateSubmit} className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Update Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newUpdate.title}
                      onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <textarea
                      id="content"
                      value={newUpdate.content}
                      onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      value={newUpdate.imageUrl}
                      onChange={(e) => setNewUpdate({ ...newUpdate, imageUrl: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {editingId ? 'Update Post' : 'Post Update'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Updates</h3>
                <ul className="mt-4 space-y-4">
                  {updates.map((update) => (
                    <li key={update.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{update.title}</h4>
                            <p className="mt-1 text-sm text-gray-600">{update.content}</p>
                            {update.imageUrl && (
                              <img
                                src={update.imageUrl}
                                alt={update.title}
                                className="mt-2 rounded-lg max-h-40 object-cover"
                              />
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                              {new Date(update.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-4 flex space-x-2">
                            <button
                              onClick={() => handleEdit(update)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit update"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(update.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete update"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-4 space-y-3">
                          <h5 className="text-sm font-medium text-gray-900">User Comments</h5>
                          {update.comments?.map((comment) => (
                            <div key={comment.id} className="bg-white p-3 rounded-md shadow-sm">
                              {/* User Comment */}
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-gray-600">{comment.content}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    By: {comment.userEmail} • {new Date(comment.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleDeleteComment(update.id, comment.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete comment"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {/* Admin Reply Section */}
                              {comment.adminReply ? (
                                <div className="mt-2 pl-4 border-l-2 border-blue-200">
                                  <p className="text-sm text-gray-700">{comment.adminReply}</p>
                                  <p className="text-xs text-gray-500">
                                    Admin Reply • {new Date(comment.adminReplyDate!).toLocaleDateString()}
                                  </p>
                                </div>
                              ) : (
                                <div className="mt-2">
                                  {replyingTo === comment.id ? (
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Type your reply..."
                                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                      />
                                      <button
                                        onClick={() => handleAdminReply(update.id, comment.id)}
                                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                      >
                                        Reply
                                      </button>
                                      <button
                                        onClick={() => {
                                          setReplyingTo(null);
                                          setReplyContent('');
                                        }}
                                        className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setReplyingTo(comment.id)}
                                      className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      Reply to comment
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}