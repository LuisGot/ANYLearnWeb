import {
  Component,
  Input,
  Output,
  EventEmitter,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isSidebarOpen = input();
  @Output() toggleSidebar = new EventEmitter();
}
