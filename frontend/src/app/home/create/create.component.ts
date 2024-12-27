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
  topic = signal('How to read fast');
  goal = signal('I want to read faster to learn more in less time');
  background = signal('Im a normal reader');

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
        this.courseService.course.set(response);
        this.courseService.isLoading.set(false);
        this.router.navigate(['/course']);
      });
  }
}
