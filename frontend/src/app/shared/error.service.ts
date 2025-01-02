import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  errorMessage = signal('');

  showError(message: string, duration: number = 5000) {
    this.errorMessage.set(message);
    setTimeout(() => {
      this.clearError();
    }, duration);
  }

  clearError() {
    this.errorMessage.set('');
  }

  hasError() {
    return this.errorMessage().trim() !== '';
  }
}
