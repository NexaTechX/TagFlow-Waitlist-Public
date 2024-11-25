export interface Comment {
  id: string;
  userEmail: string;
  content: string;
  date: string;
  adminReply?: string;
  adminReplyDate?: string;
}

export interface Update {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  date: string;
  comments: Comment[];
}

export interface WaitlistUser {
  email: string;
  joinedAt: string;
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