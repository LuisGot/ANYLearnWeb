import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './shared/sidebar.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationService } from './shared/notification.service';
import { MenubarComponent } from './menubar/menubar.component';
import { CrossIconComponent } from '../../public/icons/cross/cross-icon.component';
import { CheckIconComponent } from '../../public/icons/check/check-icon.component';
import { InfoiconComponent } from '../../public/icons/info/info-icon.component';
import { WarningIconComponent } from '../../public/icons/warning/warning-icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MenubarComponent,
    InfoiconComponent,
    CrossIconComponent,
    CheckIconComponent,
    WarningIconComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  sidebarService = inject(SidebarService);
  notificationService = inject(NotificationService);
}
