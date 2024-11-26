import { io, Socket } from 'socket.io-client';
import { Update, WaitlistUser } from '../types';

const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com'
  : 'http://localhost:5000';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(BACKEND_URL, {
      transports: ['websocket'],
      secure: true,
      rejectUnauthorized: false,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason);
      if (reason === 'io server disconnect') {
        this.connect();
      }
    });

    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  // Waitlist events
  onWaitlistUpdate(callback: (users: WaitlistUser[]) => void) {
    this.socket?.on('waitlist-updated', callback);
  }

  // Update events
  onUpdatePosted(callback: (update: Update) => void) {
    this.socket?.on('update-posted', callback);
  }

  // Comment events
  onCommentAdded(callback: (updateId: string, comment: Comment) => void) {
    this.socket?.on('comment-added', callback);
  }

  // Emit events
  joinWaitlist(email: string) {
    this.socket?.emit('join-waitlist', email);
  }

  postUpdate(update: Omit<Update, 'id' | 'created_at'>) {
    this.socket?.emit('post-update', update);
  }

  addComment(updateId: string, comment: Omit<Comment, 'id' | 'created_at'>) {
    this.socket?.emit('add-comment', { updateId, comment });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const wsService = new WebSocketService(); 