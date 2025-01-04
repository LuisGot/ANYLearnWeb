import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  isOpen = signal(true);

  toggle() {
    this.isOpen.set(!this.isOpen());
  }
}
