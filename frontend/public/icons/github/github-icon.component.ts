import { Component, input } from '@angular/core';

@Component({
  selector: 'icon-github',
  templateUrl: './github-icon.component.html',
})
export class GithubIconComponent {
  classes = input('');
}
