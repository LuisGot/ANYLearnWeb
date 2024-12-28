import { Component, inject } from '@angular/core';
import { CourseService } from '../shared/course.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private courseService = inject(CourseService);
  private router = inject(Router);

  courseNames = this.courseService.courseNames;

  setCourse(id: number) {
    this.courseService.setCourse(id);
    this.router.navigate(['/course']);
  }

  deleteCourse(id: number) {
    this.courseService.deleteCourse(id);
  }
}
