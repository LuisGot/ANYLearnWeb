import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [FormsModule],
  templateUrl: './create.component.html',
  standalone: true,
})
export class CreateComponent {
  topic = signal('');
  goal = signal('');
  background = signal('');

  formData = computed(() => ({
    topic: this.topic(),
    goal: this.goal(),
    background: this.background(),
  }));

  onSubmit() {}
}
