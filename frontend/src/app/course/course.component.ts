import { Component, inject } from '@angular/core';
import { CourseService } from '../shared/course.service';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-course',
  imports: [MarkdownComponent],
  templateUrl: './course.component.html',
})
export class CourseComponent {
  courseService = inject(CourseService);
  courses = this.courseService.course;
}
