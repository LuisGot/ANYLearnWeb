import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './shared/sidebar.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ErrorService } from './shared/error.service';
import { MenubarComponent } from './menubar/menubar.component';
import { CrossIconComponent } from '../../public/icons/cross/cross-icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    MenubarComponent,
    CrossIconComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  sidebarService = inject(SidebarService);
  errorService = inject(ErrorService);
}
