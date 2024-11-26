import { io, Socket } from 'socket.io-client';

interface ServerToClientEvents {
  connect_error: (error: Error) => void;
  disconnect: (reason: string) => void;
  // ... other events
}

interface ClientToServerEvents {
  // ... your events
}

class WebSocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL);
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
    });
  }
}

export default WebSocketService; 