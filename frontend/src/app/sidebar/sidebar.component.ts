import { Component, inject, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CourseService } from '../shared/course.service';
import { SidebarService } from '../shared/sidebar.service';
import { TrashIconComponent } from '../../../public/icons/trash/trash-icon.component';
import { PencilIconComponent } from '../../../public/icons/pencil/pencil-icon.component';
import { NewIconComponent } from '../../../public/icons/new/new-icon.component';
import { SearchIconComponent } from '../../../public/icons/search/search-icon.component';
import { SidebarIcon } from '../../../public/icons/sidebar/sidebar-icon.component';
import { CrossIconComponent } from '../../../public/icons/cross/cross-icon.component';
import { CheckIconComponent } from '../../../public/icons/check/check-icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TrashIconComponent,
    PencilIconComponent,
    NewIconComponent,
    SearchIconComponent,
    SidebarIcon,
    CrossIconComponent,
    CheckIconComponent,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  sidebarService = inject(SidebarService);
  courseService = inject(CourseService);
  private router = inject(Router);

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
    this.editedCourseName = this.courseService.courseNames()[id];
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
