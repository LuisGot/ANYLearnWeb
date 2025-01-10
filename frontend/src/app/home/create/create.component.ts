import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../shared/course.service';
import { ErrorService } from '../../shared/error.service';
import { SidebarService } from '../../shared/sidebar.service';
import {
  Recommendation,
  RecommendationsComponent,
} from '../reccomendations/recommendations.component';
import { HttpService } from '../../shared/http.service';

@Component({
  selector: 'app-create',
  imports: [FormsModule, RecommendationsComponent],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  httpService = inject(HttpService);
  router = inject(Router);
  courseService = inject(CourseService);
  errorService = inject(ErrorService);
  sidebarService = inject(SidebarService);

  createModal = viewChild<ElementRef>('createModal');

  topic = signal<string>('');
  goal = signal<string>('');
  background = signal<string>('');

  formData = computed(() => ({
    topic: this.topic(),
    goal: this.goal(),
    background: this.background(),
  }));

  onSubmit() {
    this.courseService.isLoading.set(true);

    this.httpService
      .post<{ subtopics: any }>(
        'http://localhost:8000/generate/subtopics',
        this.formData()
      )
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: () => {
          this.errorService.showError(
            'An error occurred while generating subtopics.'
          );
          this.courseService.isLoading.set(false);
        },
      });
  }

  handleResponse(response: any) {
    this.courseService.isLoading.set(false);
    if (response?.subtopics) {
      this.courseService.currentSubtopics.set(response.subtopics);
      this.courseService.currentTopic.set(this.topic());
      this.courseService.startNewCourse(this.topic(), response.subtopics);
      this.router.navigate(['/course']);
    } else {
      this.errorService.showError(
        'Invalid response format from subtopics endpoint.'
      );
    }
  }

  showModal() {
    this.createModal()?.nativeElement.showModal();
  }

  applyRecommendation(recommendation: Recommendation) {
    this.topic.set(recommendation.topic);
    this.goal.set(recommendation.description);
    this.background.set(recommendation.background);
    this.showModal();
  }
}
