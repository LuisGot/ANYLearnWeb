import { Component, signal } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [SidebarComponent],
})
export class HomeComponent {
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}
