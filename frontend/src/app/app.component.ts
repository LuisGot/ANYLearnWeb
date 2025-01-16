import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './shared/sidebar.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationService } from './shared/notification.service';
import { MenubarComponent } from './menubar/menubar.component';
import { NotificationComponent } from './notification/notification.component';
import { ShortcutService } from './shared/shortcut.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MenubarComponent,
    NotificationComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarService = inject(SidebarService);
  notificationService = inject(NotificationService);
  shortcutService = inject(ShortcutService);

  ngOnInit(): void {
    this.shortcutService.startListening();

    this.shortcutService.registerShortcut('ctrl+shift+s', () => {
      this.sidebarService.toggleSidebar();
    });

    this.shortcutService.registerShortcut('ctrl+k', () => {
      this.sidebarService.toggleSearch();
    });

    this.shortcutService.registerShortcut('ctrl+shift+o', () => {
      this.sidebarService.learnNew();
    });
  }

  ngOnDestroy(): void {
    this.shortcutService.stopListening();
  }
}
