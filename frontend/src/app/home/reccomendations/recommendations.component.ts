import { Component, output, signal } from '@angular/core';

export interface Recommendation {
  topic: string;
  description: string;
  background: string;
}

@Component({
  selector: 'app-recommendations',
  imports: [],
  templateUrl: './recommendations.component.html',
})
export class RecommendationsComponent {
  recommendation = output<Recommendation>();

  applyRecommendation(index: number) {
    this.recommendation.emit(this.recommendations()[index]);
  }

  recommendations = signal<Recommendation[]>([
    { topic: 'Angular', description: 'Learn Angular', background: 'Beginner' },
    { topic: 'React', description: 'Learn React', background: 'Beginner' },
    { topic: 'Vue', description: 'Learn Vue', background: 'Beginner' },
    { topic: 'Svelte', description: 'Learn Svelte', background: 'Beginner' },
  ]);
}
