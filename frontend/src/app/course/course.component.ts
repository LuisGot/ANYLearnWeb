import { Component, inject } from '@angular/core';
import { CourseService } from '../shared/course.service';

@Component({
  selector: 'app-course',
  imports: [],
  templateUrl: './course.component.html',
})
export class CourseComponent {
  courseService = inject(CourseService);
  courses = this.courseService.course;
}
