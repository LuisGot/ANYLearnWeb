import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-settings',
  imports: [],
  templateUrl: './settings-icon.component.html',
  standalone: true,
})
export class SettingsIconComponent {
  classes = input('');
}
