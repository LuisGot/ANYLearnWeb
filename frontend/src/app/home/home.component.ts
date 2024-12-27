import { Component, signal } from '@angular/core';
import { CreateComponent } from './create/create.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CreateComponent],
})
export class HomeComponent {}
