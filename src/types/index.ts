export interface Comment {
  id: string;
  update_id: string;
  user_email: string;
  content: string;
  created_at: string;
  admin_reply?: string;
  admin_reply_at?: string;
}

export interface Update {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  comments?: Comment[];
}

export interface WaitlistUser {
  id: string;
  email: string;
  joined_at: string;
  feedback?: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  isDark: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleTheme: () => void;
}

export interface UpdateFormData {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface WaitlistEmailData {
  email: string;
  feedback?: string;
  joinedAt: string;
}