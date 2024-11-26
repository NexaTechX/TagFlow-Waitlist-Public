export interface Comment {
  id: string;
  update_id: string;
  user_email: string;
  content: string;
  created_at: string | number;
  admin_reply?: string;
  admin_reply_at?: string | number;
}

export interface Update {
  id: string;
  title: string;
  content: string;
  created_at: string;
  comments: Comment[];
  image_url?: string;
  author?: string;
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
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleTheme: () => void;
}

export interface UpdateFormData {
  title: string;
  content: string;
  imageUrl?: string;
}