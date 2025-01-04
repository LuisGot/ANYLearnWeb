import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-check',
  templateUrl: './check-icon.component.html',
})
export class CheckIconComponent {
  classes = input('');
}
