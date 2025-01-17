import { Injectable, inject, signal } from '@angular/core';
import { CourseService } from './course.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private courseService = inject(CourseService);
  private router = inject(Router);

  isVisible = signal(false);
  searchTerm = signal('');
  filteredCourses = signal<string[]>([]);
  closeWithAnimation?: () => void;

  constructor() {
    this.updateFilteredCourses();
  }

  private updateFilteredCourses() {
    const term = this.searchTerm().toLowerCase().trim();
    const courses = this.courseService.courseNames();

    if (!term) {
      this.filteredCourses.set(courses.slice(0, 5));
      return;
    }

    this.filteredCourses.set(
      courses
        .filter((course) => course.toLowerCase().includes(term))
        .slice(0, 5)
    );
  }

  show() {
    this.searchTerm.set('');
    this.updateFilteredCourses();
    this.isVisible.set(true);
  }

  close() {
    this.isVisible.set(false);
    this.searchTerm.set('');
    this.filteredCourses.set([]);
  }

  toggle() {
    if (this.isVisible()) {
      if (this.closeWithAnimation) {
        this.closeWithAnimation();
      } else {
        this.close();
      }
    } else {
      this.show();
    }
  }

  updateSearch(term: string) {
    this.searchTerm.set(term);
    this.updateFilteredCourses();
  }

  selectCourse(index: number) {
    const courseId = this.courseService
      .courseNames()
      .indexOf(this.filteredCourses()[index]);
    if (courseId !== -1) {
      this.courseService.setCourse(courseId);
      this.router.navigate(['/course']);
      this.close();
    }
  }
}
