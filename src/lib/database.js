import { collection, addDoc, getDocs, query, where, serverTimestamp, deleteDoc, doc, onSnapshot, orderBy, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase.js';

// Real-time subscriptions
export function subscribeToWaitlist(callback) {
  try {
    const q = query(
      collection(db, 'waitlist'), 
      orderBy('joined_at', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joined_at: doc.data().joined_at?.toDate?.()?.toISOString() || new Date().toISOString()
      }));
      callback(users);
    }, (error) => {
      console.error('Waitlist subscription error:', error);
    });

    // Return the unsubscribe function
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up waitlist subscription:', error);
    // Return a no-op function if setup fails
    return () => {};
  }
}

// Waitlist Operations
export async function addToWaitlist(email) {
  try {
    // Normalize email to lowercase to prevent case-sensitive duplicates
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email exists
    const emailQuery = query(
      collection(db, 'waitlist'), 
      where('email', '==', normalizedEmail)
    );
    
    const querySnapshot = await getDocs(emailQuery);
    
    // If email exists, return success but with a different status
    if (!querySnapshot.empty) {
      return {
        status: 'already_exists',
        message: 'You are already on the waitlist! We\'ll notify you of any updates.',
        data: {
          id: querySnapshot.docs[0].id,
          email: normalizedEmail,
          joined_at: querySnapshot.docs[0].data().joined_at?.toDate?.()?.toISOString() || new Date().toISOString()
        }
      };
    }

    // Add new user if email doesn't exist
    const docRef = await addDoc(collection(db, 'waitlist'), {
      email: normalizedEmail,
      joined_at: serverTimestamp(),
      ip: window.sessionStorage.getItem('userIP') || 'unknown',
      userAgent: navigator.userAgent
    });

    return {
      status: 'success',
      message: 'Successfully joined the waitlist!',
      data: {
        id: docRef.id,
        email: normalizedEmail,
        joined_at: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    throw error;
  }
}

export async function getWaitlistUsers() {
  try {
    const q = query(collection(db, 'waitlist'), orderBy('joined_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joined_at: doc.data().joined_at?.toDate?.()?.toISOString() || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error getting waitlist users:', error);
    throw error;
  }
}

export async function deleteWaitlistUser(userId) {
  try {
    // First verify admin session
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    // Get user document reference
    const userRef = doc(db, 'waitlist', userId);
    
    // Verify user exists before deleting
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    // Delete the document
    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error('Error deleting waitlist user:', error);
    throw error;
  }
}

// Updates Operations
export async function addUpdate(update) {
  try {
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    const docRef = await addDoc(collection(db, 'updates'), {
      title: update.title,
      content: update.content,
      image_url: update.image_url || '',
      created_at: serverTimestamp(),
      comments: [],
      author: 'admin'
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding update:', error);
    throw error;
  }
}

export async function updateUpdate(updateId, update) {
  try {
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    const updateRef = doc(db, 'updates', updateId);
    await updateDoc(updateRef, {
      title: update.title,
      content: update.content,
      image_url: update.image_url || '',
      updated_at: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error updating update:', error);
    throw error;
  }
}

export async function deleteUpdate(updateId) {
  try {
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    await deleteDoc(doc(db, 'updates', updateId));
    return true;
  } catch (error) {
    console.error('Error deleting update:', error);
    throw error;
  }
}

export function subscribeToUpdates(callback) {
  try {
    const q = query(
      collection(db, 'updates'), 
      orderBy('created_at', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const updates = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          content: data.content || '',
          image_url: data.image_url || '',
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          comments: data.comments || [],
          author: data.author || 'admin'
        };
      });
      callback(updates);
    });
  } catch (error) {
    console.error('Error setting up updates subscription:', error);
    return () => {};
  }
}

// Add this new function for updating user feedback
export async function updateUserFeedback(userId, feedback) {
  try {
    // Verify admin session first
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    const userRef = doc(db, 'waitlist', userId);
    
    // Verify user exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    await updateDoc(userRef, {
      feedback,
      feedback_at: serverTimestamp(),
      updated_by: adminSession.data().timestamp
    });

    return {
      id: userId,
      ...userDoc.data(),
      feedback,
      feedback_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating user feedback:', error);
    throw error;
  }
}

// Add these functions for comment handling
export async function addComment(updateId, comment) {
  try {
    const updateRef = doc(db, 'updates', updateId);
    const updateSnapshot = await getDoc(updateRef);

    if (!updateSnapshot.exists()) {
      throw new Error('Update not found');
    }

    const newComment = {
      id: Date.now().toString(),
      update_id: updateId,
      user_email: comment.user_email,
      content: comment.content,
      created_at: new Date().toISOString(),
      admin_reply: null,
      admin_reply_at: null
    };

    const currentComments = updateSnapshot.data().comments || [];
    
    await updateDoc(updateRef, {
      comments: [...currentComments, newComment]
    });

    return newComment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function addAdminReply(updateId, commentId, replyContent) {
  try {
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    const updateRef = doc(db, 'updates', updateId);
    const updateSnapshot = await getDoc(updateRef);

    if (!updateSnapshot.exists()) {
      throw new Error('Update not found');
    }

    const comments = updateSnapshot.data().comments || [];
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          admin_reply: replyContent,
          admin_reply_at: new Date().toISOString()
        };
      }
      return comment;
    });

    await updateDoc(updateRef, { comments: updatedComments });
    return true;
  } catch (error) {
    console.error('Error adding admin reply:', error);
    throw error;
  }
}

export async function deleteComment(updateId, commentId) {
  try {
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    const updateRef = doc(db, 'updates', updateId);
    const updateSnapshot = await getDoc(updateRef);

    if (!updateSnapshot.exists()) {
      throw new Error('Update not found');
    }

    const comments = updateSnapshot.data().comments || [];
    const updatedComments = comments.filter(comment => comment.id !== commentId);

    await updateDoc(updateRef, { 
      comments: updatedComments,
      lastModified: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
} 