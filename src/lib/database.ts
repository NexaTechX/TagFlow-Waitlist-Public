import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import type { Update, Comment, WaitlistUser } from '../types';

// Interfaces
export interface CommentInput {
  user_email: string;
  content: string;
}

// Waitlist Operations
export const addToWaitlist = async (email: string): Promise<WaitlistUser> => {
  // Check if email already exists
  const q = query(collection(db, 'waitlist'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    throw new Error('Email already exists in waitlist');
  }

  const docRef = await addDoc(collection(db, 'waitlist'), {
    email,
    joined_at: serverTimestamp()
  });

  return {
    id: docRef.id,
    email,
    joined_at: new Date().toISOString()
  };
};

export const getWaitlistUsers = async (): Promise<WaitlistUser[]> => {
  const q = query(collection(db, 'waitlist'), orderBy('joined_at', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    joined_at: (doc.data().joined_at as Timestamp).toDate().toISOString()
  })) as WaitlistUser[];
};

export const updateUserFeedback = async (id: string, feedback: string): Promise<void> => {
  const userRef = doc(db, 'waitlist', id);
  await updateDoc(userRef, { feedback });
};

export const deleteWaitlistUser = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'waitlist', id));
};

// Updates Operations
export async function addUpdate(update: Omit<Update, 'id' | 'created_at'>) {
  try {
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    const docRef = await addDoc(collection(db, 'updates'), {
      ...update,
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

export async function updateUpdate(updateId: string, update: Omit<Update, 'id'>) {
  try {
    const adminSession = await getDoc(doc(db, 'admin_sessions', 'current'));
    if (!adminSession.exists() || !adminSession.data().authenticated) {
      throw new Error('Unauthorized');
    }

    const updateRef = doc(db, 'updates', updateId);
    await updateDoc(updateRef, {
      ...update,
      updated_at: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error updating update:', error);
    throw error;
  }
}

export async function deleteUpdate(updateId: string) {
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

// Comments Operations
export async function addComment(updateId: string, comment: CommentInput) {
  try {
    const updateRef = doc(db, 'updates', updateId);
    const updateSnapshot = await getDoc(updateRef);

    if (!updateSnapshot.exists()) {
      throw new Error('Update not found');
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      update_id: updateId,
      user_email: comment.user_email,
      content: comment.content,
      created_at: new Date().toISOString(),
      admin_reply: undefined,
      admin_reply_at: undefined
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

export async function deleteComment(updateId: string, commentId: string) {
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
    const updatedComments = comments.filter((comment: Comment) => comment.id !== commentId);

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

export async function addAdminReply(updateId: string, commentId: string, replyContent: string) {
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
    const updatedComments = comments.map((comment: Comment) => {
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

// Subscriptions
export const subscribeToUpdates = (callback: (updates: Update[]) => void) => {
  const q = query(collection(db, 'updates'), orderBy('created_at', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const updates = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      comments: doc.data().comments || []
    })) as Update[];
    callback(updates);
  });
};

export const subscribeToWaitlist = (callback: (users: WaitlistUser[]) => void) => {
  const q = query(collection(db, 'waitlist'), orderBy('joined_at', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joined_at: doc.data().joined_at?.toDate?.()?.toISOString() || new Date().toISOString()
    })) as WaitlistUser[];
    callback(users);
  });
}; 