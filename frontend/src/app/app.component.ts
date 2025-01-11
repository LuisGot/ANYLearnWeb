import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './shared/sidebar.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationService } from './shared/notification.service';
import { MenubarComponent } from './menubar/menubar.component';
import { NotificationComponent } from './notification/notification.component';

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
export class AppComponent {
  sidebarService = inject(SidebarService);
  notificationService = inject(NotificationService);
}
