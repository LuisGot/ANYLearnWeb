import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-icon.component.html',
})
export class SidebarIcon {
  classes = input('');
}
