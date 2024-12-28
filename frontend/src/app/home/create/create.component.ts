import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CourseService } from '../../shared/course.service';

@Component({
  selector: 'app-create',
  imports: [FormsModule],
  templateUrl: './create.component.html',
})
export class CreateComponent {
  topic = signal('FastAPI');
  goal = signal(
    'I want to learn how to build FastAPI endpoints that return data in JSON format.'
  );
  background = signal('I never used FastAPI before.');

  formData = computed(() => ({
    topic: this.topic(),
    goal: this.goal(),
    background: this.background(),
  }));

  http = inject(HttpClient);
  router = inject(Router);
  courseService = inject(CourseService);

  onSubmit() {
    this.courseService.isLoading.set(true);
    this.http
      .post('http://localhost:8000/generate/course', this.formData())
      .subscribe((response: any) => {
        console.log(response);
        if (!response.error) {
          this.courseService.addCourse(response, this.topic());
          this.courseService.course.set(response);
          this.courseService.isLoading.set(false);
          this.router.navigate(['/course']);
        }
        this.courseService.isLoading.set(false);
      });
  }
}
