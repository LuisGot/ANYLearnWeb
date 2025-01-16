import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShortcutService {
  platformId = inject(PLATFORM_ID);
  private keydownSubscription?: Subscription;
  private shortcuts: Map<string, () => void> = new Map();

  startListening() {
    if (isPlatformBrowser(this.platformId)) {
      this.keydownSubscription = fromEvent<KeyboardEvent>(
        window,
        'keydown'
      ).subscribe((event) => this.handleKeydown(event));
    }
  }

  stopListening() {
    this.keydownSubscription?.unsubscribe();
  }

  registerShortcut(shortcut: string, callback: () => void) {
    this.shortcuts.set(this.normalizeShortcut(shortcut), callback);
  }

  unregisterShortcut(shortcut: string) {
    this.shortcuts.delete(this.normalizeShortcut(shortcut));
  }

  private handleKeydown(event: KeyboardEvent) {
    const normalizedKey = this.normalizeShortcut(
      `${event.ctrlKey ? 'ctrl+' : ''}${event.altKey ? 'alt+' : ''}${
        event.shiftKey ? 'shift+' : ''
      }${event.key.toLowerCase()}`
    );
    const callback = this.shortcuts.get(normalizedKey);
    if (callback) {
      event.preventDefault();
      callback();
    }
  }

  private normalizeShortcut(shortcut: string): string {
    return shortcut.toLowerCase().replace(/\s+/g, '').trim();
  }
}
