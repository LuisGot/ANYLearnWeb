import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

import { CourseService } from '../shared/course.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [MarkdownComponent, CommonModule],
  templateUrl: './course.component.html',
})
export class CourseComponent {
  courseService = inject(CourseService);

  isGenerating = computed(() => {
    return (
      this.courseService.generating() &&
      this.courseService.generatingCourseId() ===
        this.courseService.selectedCourseId()
    );
  });

  course = computed(() => this.courseService.course());
}
