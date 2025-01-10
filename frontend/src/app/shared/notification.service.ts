import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  message = signal('');
  type = signal('');

  showNotification(
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' | '' = '',
    duration: number = 5000
  ) {
    this.message.set(message);
    this.type.set(type);
    setTimeout(() => {
      this.clearNotification();
    }, duration);
  }

  clearNotification() {
    this.message.set('');
  }

  hasNotification() {
    return this.message().trim() !== '';
  }
}
