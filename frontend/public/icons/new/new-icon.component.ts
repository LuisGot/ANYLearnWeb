import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-new',
  templateUrl: './new-icon.component.html',
})
export class NewIconComponent {
  classes = input('');
}
