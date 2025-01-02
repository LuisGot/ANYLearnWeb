import { Component, inject } from '@angular/core';
import { CourseService } from '../shared/course.service';
import { MarkdownComponent } from 'ngx-markdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [MarkdownComponent, CommonModule],
  templateUrl: './course.component.html',
})
export class CourseComponent {
  courseService = inject(CourseService);
  course = this.courseService.course;
}
