import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-info',
  standalone: true,
  imports: [],
  templateUrl: './info-icon.component.html',
})
export class InfoiconComponent {
  classes = input('');
}
