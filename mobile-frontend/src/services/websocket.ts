import io from 'socket.io-client';
import { scheduleLocalNotification } from './notifications';

const SOCKET_URL = __DEV__ ? 'http://10.0.2.2:5000' : 'https://your-api.com';

class WebSocketService {
  private socket: any = null;
  private listeners: { [key: string]: Function[] } = {};

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('issue_updated', (data: any) => {
      this.emit('issue_updated', data);
      scheduleLocalNotification(
        'Issue Updated',
        `Your issue "${data.title}" status changed to ${data.status}`
      );
    });

    this.socket.on('new_issue', (data: any) => {
      this.emit('new_issue', data);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export const websocketService = new WebSocketService();