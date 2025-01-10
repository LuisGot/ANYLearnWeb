import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private router = inject(Router);

  errorMessage = signal('');

  showError(message: string, duration: number = 5000) {
    this.errorMessage.set(message);
    this.router.navigate(['']);
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
