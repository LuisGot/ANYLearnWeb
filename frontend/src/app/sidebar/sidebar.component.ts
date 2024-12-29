import { Component, inject } from '@angular/core';
import { CourseService } from '../shared/course.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
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
    this.router.navigate(['/']);
  }
}
