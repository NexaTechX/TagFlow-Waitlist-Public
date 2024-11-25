const API_URL = 'http://localhost:5000/api';

// Waitlist Operations
export const addToWaitlist = async (email: string) => {
  const response = await fetch(`${API_URL}/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to join waitlist');
  }
  return response.json();
};

export const getWaitlistUsers = async () => {
  const response = await fetch(`${API_URL}/waitlist`);
  if (!response.ok) throw new Error('Failed to fetch waitlist users');
  return response.json();
};

// Updates Operations
export const createUpdate = async (update: { title: string; content: string; image_url?: string }) => {
  const response = await fetch(`${API_URL}/updates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update)
  });
  if (!response.ok) throw new Error('Failed to create update');
  return response.json();
};

export const getUpdates = async () => {
  const response = await fetch(`${API_URL}/updates`);
  if (!response.ok) throw new Error('Failed to fetch updates');
  return response.json();
};

export const deleteUpdate = async (id: string) => {
  const response = await fetch(`${API_URL}/updates/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete update');
};

// Comments Operations
export const addComment = async (updateId: string, comment: { user_email: string; content: string }) => {
  const response = await fetch(`${API_URL}/updates/${updateId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  });
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};

export const updateComment = async (updateId: string, commentId: string, adminReply: string) => {
  const response = await fetch(`${API_URL}/updates/${updateId}/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ admin_reply: adminReply })
  });
  if (!response.ok) throw new Error('Failed to update comment');
  return response.json();
};

export const deleteComment = async (updateId: string, commentId: string) => {
  const response = await fetch(`${API_URL}/updates/${updateId}/comments/${commentId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete comment');
}; 