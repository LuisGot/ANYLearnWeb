import { inject, Injectable, signal } from '@angular/core';
import { CourseService } from './course.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  courseService = inject(CourseService);
  private router = inject(Router);

  isOpen = signal(true);

  toggleSidebar() {
    this.isOpen.set(!this.isOpen());
  }

  learnNew() {
    this.courseService.selectedCourseId.set(null);
    this.router.navigate(['']);
  }
}
