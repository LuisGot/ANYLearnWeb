import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-trash',
  imports: [],
  templateUrl: './trash-icon.component.html',
})
export class TrashIconComponent {
  classes = input('');
}
