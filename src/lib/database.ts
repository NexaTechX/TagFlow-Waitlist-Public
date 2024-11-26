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
  serverTimestamp
} from 'firebase/firestore';
import type { Update, Comment, WaitlistUser } from '../types';

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
export const createUpdate = async (update: Omit<Update, 'id' | 'created_at'>): Promise<Update> => {
  const docRef = await addDoc(collection(db, 'updates'), {
    ...update,
    created_at: serverTimestamp()
  });

  return {
    id: docRef.id,
    ...update,
    created_at: new Date().toISOString(),
    comments: []
  };
};

export const getUpdates = async (): Promise<Update[]> => {
  const updatesQuery = query(collection(db, 'updates'), orderBy('created_at', 'desc'));
  const updatesSnapshot = await getDocs(updatesQuery);
  
  const updates = await Promise.all(updatesSnapshot.docs.map(async doc => {
    const commentsQuery = query(
      collection(db, 'comments'), 
      where('update_id', '==', doc.id),
      orderBy('created_at', 'asc')
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    
    const comments = commentsSnapshot.docs.map(commentDoc => ({
      id: commentDoc.id,
      ...commentDoc.data(),
      created_at: (commentDoc.data().created_at as Timestamp).toDate().toISOString(),
      admin_reply_at: commentDoc.data().admin_reply_at ? 
        (commentDoc.data().admin_reply_at as Timestamp).toDate().toISOString() : 
        undefined
    })) as Comment[];

    return {
      id: doc.id,
      ...doc.data(),
      created_at: (doc.data().created_at as Timestamp).toDate().toISOString(),
      comments
    };
  }));

  return updates as Update[];
};

// Comments Operations
export const addComment = async (comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> => {
  const docRef = await addDoc(collection(db, 'comments'), {
    ...comment,
    created_at: serverTimestamp()
  });

  return {
    id: docRef.id,
    ...comment,
    created_at: new Date().toISOString()
  };
};

export const updateComment = async (id: string, admin_reply: string): Promise<void> => {
  const commentRef = doc(db, 'comments', id);
  await updateDoc(commentRef, {
    admin_reply,
    admin_reply_at: serverTimestamp()
  });
};

export const deleteComment = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'comments', id));
};

// Real-time subscriptions
export const subscribeToUpdates = (callback: (updates: Update[]) => void) => {
  const q = query(collection(db, 'updates'), orderBy('created_at', 'desc'));
  
  return onSnapshot(q, async (snapshot) => {
    const updates = await Promise.all(snapshot.docs.map(async doc => {
      const commentsQuery = query(
        collection(db, 'comments'),
        where('update_id', '==', doc.id),
        orderBy('created_at', 'asc')
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      
      const comments = commentsSnapshot.docs.map(commentDoc => ({
        id: commentDoc.id,
        ...commentDoc.data(),
        created_at: (commentDoc.data().created_at as Timestamp).toDate().toISOString(),
        admin_reply_at: commentDoc.data().admin_reply_at ? 
          (commentDoc.data().admin_reply_at as Timestamp).toDate().toISOString() : 
          undefined
      })) as Comment[];

      return {
        id: doc.id,
        ...doc.data(),
        created_at: (doc.data().created_at as Timestamp).toDate().toISOString(),
        comments
      };
    }));

    callback(updates as Update[]);
  });
};

export const subscribeToWaitlist = (callback: (users: WaitlistUser[]) => void) => {
  const q = query(collection(db, 'waitlist'), orderBy('joined_at', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      joined_at: (doc.data().joined_at as Timestamp).toDate().toISOString()
    })) as WaitlistUser[];
    
    callback(users);
  });
}; 

export interface CommentInput {
  user_email: string;
  content: string;
}

export async function addComment(updateId: string, comment: CommentInput) {
  // ... existing code ...
}

export async function addUpdate(update: Omit<Update, 'id' | 'created_at'>) {
  // ... existing code ...
}

export async function updateUpdate(updateId: string, update: Omit<Update, 'id'>) {
  // ... existing code ...
}

export async function deleteUpdate(updateId: string) {
  // ... existing code ...
}

export async function deleteComment(updateId: string, commentId: string) {
  // ... existing code ...
}

export async function addAdminReply(updateId: string, commentId: string, replyContent: string) {
  // ... existing code ...
} 