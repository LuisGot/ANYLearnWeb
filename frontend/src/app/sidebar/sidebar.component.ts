import { Component, inject, effect, signal, computed } from '@angular/core';
import { CourseService } from '../shared/course.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  courseService = inject(CourseService);
  private router = inject(Router);

  courseNames = this.courseService.courseNames;

  editingCourseId = signal<number | null>(null);
  editedCourseName: string = '';

  showSearch = signal(false);
  searchTerm = signal('');

  filteredCourseNames = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.courseService.courseNames();
    }
    return this.courseService
      .courseNames()
      .filter((c) => c.toLowerCase().includes(term));
  });

  constructor() {
    effect(() => {
      if (this.courseService.shouldRedirect()) {
        this.courseService.shouldRedirect.set(false);
        this.router.navigate(['']);
      }
    });
  }

  toggleSearch() {
    if (this.showSearch()) {
      this.searchTerm.set('');
      this.showSearch.set(false);
      return;
    }
    this.showSearch.set(true);
  }

  clearSearch() {
    this.searchTerm.set('');
  }

  setCourse(id: number) {
    this.courseService.setCourse(id);
    this.router.navigate(['/course']);
  }

  deleteCourse(id: number) {
    this.courseService.deleteCourse(id);
    if (this.editingCourseId() === id) {
      this.cancelEdit();
    }
  }

  startEditing(id: number) {
    this.editingCourseId.set(id);
    this.editedCourseName = this.courseNames()[id];
  }

  saveEdit(id: number) {
    const trimmedName = this.editedCourseName.trim();
    if (trimmedName) {
      this.courseService.updateCourseName(id, trimmedName);
      this.editingCourseId.set(null);
      this.editedCourseName = '';
    }
  }

  cancelEdit() {
    this.editingCourseId.set(null);
    this.editedCourseName = '';
  }

  learnNew() {
    this.courseService.selectedCourseId.set(null);
    this.router.navigate(['']);
  }
}
