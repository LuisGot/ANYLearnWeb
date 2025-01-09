import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CourseService } from '../../shared/course.service';
import { ErrorService } from '../../shared/error.service';
import { SidebarService } from '../../shared/sidebar.service';
import {
  Recommendation,
  RecommendationsComponent,
} from '../reccomendations/recommendations.component';

@Component({
  selector: 'app-create',
  imports: [FormsModule, RecommendationsComponent],
  templateUrl: './create.component.html',
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

  http = inject(HttpClient);
  router = inject(Router);
  courseService = inject(CourseService);
  errorService = inject(ErrorService);
  sidebarService = inject(SidebarService);

  createModal = viewChild<ElementRef>('createModal');

  onSubmit() {
    this.courseService.isLoading.set(true);
    this.http
      .post('http://localhost:8000/generate/course', this.formData())
      .subscribe({
        next: (response) => this.handleResponse(response),
        error: () => {
          this.errorService.showError(
            'An error occurred while generating the course.'
          );
          this.courseService.isLoading.set(false);
        },
      });
  }

  private handleResponse(response: any) {
    if (!response.error) {
      this.courseService.addCourse(response, this.topic());
      this.courseService.course.set(response);
      this.router.navigate(['/course']);
    }
    this.courseService.isLoading.set(false);
  }

  showModal() {
    this.createModal()?.nativeElement.showModal();
  }

  applyRecommendation(recommendation: Recommendation) {
    this.showModal();
    this.topic.set(recommendation.topic);
    this.goal.set(recommendation.description);
    this.background.set(recommendation.background);
  }
}
