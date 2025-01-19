import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarService } from './shared/sidebar.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationService } from './shared/notification.service';
import { MenubarComponent } from './menubar/menubar.component';
import { NotificationComponent } from './notification/notification.component';
import { ShortcutService } from './shared/shortcut.service';
import { SearchComponent } from './search/search.component';
import { SearchService } from './shared/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MenubarComponent,
    NotificationComponent,
    SearchComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  router = inject(Router);
  sidebarService = inject(SidebarService);
  notificationService = inject(NotificationService);
  shortcutService = inject(ShortcutService);
  searchService = inject(SearchService);

  ngOnInit(): void {
    this.shortcutService.startListening();

    this.shortcutService.registerShortcut('ctrl+shift+s', () => {
      this.sidebarService.toggleSidebar();
    });

    this.shortcutService.registerShortcut('ctrl+k', () => {
      this.searchService.toggle();
    });

    this.shortcutService.registerShortcut('ctrl+shift+o', () => {
      this.sidebarService.learnNew();
    });

    this.shortcutService.registerShortcut('ctrl+shift+i', () => {
      this.router.navigate(['/settings']);
    });
  }

  ngOnDestroy(): void {
    this.shortcutService.stopListening();
  }
}
