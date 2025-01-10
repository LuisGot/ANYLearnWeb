import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-warning',
  imports: [],
  templateUrl: './warning-icon.component.html',
})
export class WarningIconComponent {
  classes = input('');
}
