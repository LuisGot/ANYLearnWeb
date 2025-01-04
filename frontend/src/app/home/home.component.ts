import { Component, signal } from '@angular/core';
import { CreateComponent } from './create/create.component';
import { NewIconComponent } from '../../../public/icons/new/new-icon.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CreateComponent, NewIconComponent],
})
export class HomeComponent {}
