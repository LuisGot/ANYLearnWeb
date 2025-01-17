import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CourseService } from './course.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  platformId = inject(PLATFORM_ID);
  courseService = inject(CourseService);
  private router = inject(Router);

  isOpen = signal(this.SidebarState());

  private SidebarState(): boolean {
    if (this.isBrowser()) {
      const savedState = sessionStorage.getItem('sidebarOpen');
      return savedState === null ? true : savedState === 'true';
    }
    return false;
  }

  toggleSidebar() {
    const newState = !this.isOpen();
    this.isOpen.set(newState);
    if (this.isBrowser()) {
      sessionStorage.setItem('sidebarOpen', newState.toString());
    }
  }

  learnNew() {
    this.courseService.selectedCourseId.set(null);
    this.router.navigate(['']);
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
