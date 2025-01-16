import { computed, inject, Injectable, signal } from '@angular/core';
import { CourseService } from './course.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  courseService = inject(CourseService);
  private router = inject(Router);

  isOpen = signal(true);
  showSearch = signal(false);
  searchTerm = signal('');

  toggleSidebar() {
    this.isOpen.set(!this.isOpen());
  }

  filteredCourseNames = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.courseService.courseNames();
    }
    return this.courseService
      .courseNames()
      .filter((c) => c.toLowerCase().includes(term));
  });

  toggleSearch() {
    if (this.showSearch()) {
      this.clearSearch();
      this.showSearch.set(false);
      return;
    }
    this.showSearch.set(true);
  }

  clearSearch() {
    this.searchTerm.set('');
  }

  learnNew() {
    this.courseService.selectedCourseId.set(null);
    this.router.navigate(['']);
  }
}
