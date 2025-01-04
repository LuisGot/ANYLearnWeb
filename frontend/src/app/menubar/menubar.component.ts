import { Component, inject } from '@angular/core';
import { SidebarService } from '../shared/sidebar.service';
import { SidebarIcon } from '../../../public/icons/sidebar/sidebar-icon.component';

@Component({
  selector: 'app-menubar',
  imports: [SidebarIcon],
  templateUrl: './menubar.component.html',
})
export class MenubarComponent {
  sidebarService = inject(SidebarService);
}
