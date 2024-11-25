import { supabase } from './supabase';
import type { Update, Comment, WaitlistUser } from '../types';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Waitlist Operations
export const addToWaitlist = async (email: string): Promise<WaitlistUser> => {
  const { data: existing } = await supabase
    .from('waitlist')
    .select()
    .eq('email', email)
    .single();

  if (existing) {
    throw new Error('Email already exists in waitlist');
  }

  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ 
      email,
      joined_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWaitlistUsers = async (): Promise<WaitlistUser[]> => {
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('joined_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateUserFeedback = async (id: string, feedback: string): Promise<void> => {
  const { error } = await supabase
    .from('waitlist')
    .update({ feedback })
    .eq('id', id);

  if (error) throw error;
};

export const deleteWaitlistUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('waitlist')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const subscribeToWaitlist = (callback: (users: WaitlistUser[]) => void) => {
  return supabase
    .channel('waitlist_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'waitlist' },
      async (_payload: RealtimePostgresChangesPayload<WaitlistUser>) => {
        const { data } = await supabase
          .from('waitlist')
          .select('*')
          .order('joined_at', { ascending: false });
        callback(data || []);
      }
    )
    .subscribe();
};

// Updates Operations
export const createUpdate = async (update: Omit<Update, 'id' | 'created_at'>): Promise<Update> => {
  const { data, error } = await supabase
    .from('updates')
    .insert([update])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUpdates = async (): Promise<Update[]> => {
  const { data, error } = await supabase
    .from('updates')
    .select(`
      *,
      comments (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updatePost = async (id: string, update: Partial<Update>): Promise<void> => {
  const { error } = await supabase
    .from('updates')
    .update(update)
    .eq('id', id);

  if (error) throw error;
};

export const deleteUpdate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('updates')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Comments Operations
export const addComment = async (comment: Omit<Comment, 'id' | 'created_at'>): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateComment = async (id: string, admin_reply: string): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .update({ 
      admin_reply, 
      admin_reply_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteComment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Real-time subscriptions
export const subscribeToUpdates = (callback: (update: Update) => void) => {
  return supabase
    .channel('updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'updates' },
      (payload: RealtimePostgresChangesPayload<Update>) => callback(payload.new as Update)
    )
    .subscribe();
};

export const subscribeToComments = (callback: (comment: Comment) => void) => {
  return supabase
    .channel('comments')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'comments' },
      (payload: RealtimePostgresChangesPayload<Comment>) => callback(payload.new as Comment)
    )
    .subscribe();
}; 