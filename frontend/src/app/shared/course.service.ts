import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

interface CourseData {
  courseName: string;
  course: Course[];
}

interface Course {
  subtopic: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  isLoading = signal(false);
  course = signal<Course[]>([]);
  private courses = signal<CourseData[]>([]);

  selectedCourseId = signal<number | null>(null);

  courseNames = computed(() =>
    this.courses().map((course) => course.courseName)
  );

  constructor() {
    if (this.isBrowser()) {
      this.loadCourses();
      if (this.courses().length > 0) {
        this.setCourse(0);
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadCourses(): void {
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      try {
        const parsedCourses: CourseData[] = JSON.parse(storedCourses);
        this.courses.set(parsedCourses);
      } catch (e) {
        console.error('Failed to parse courses from localStorage', e);
        this.courses.set([]);
      }
    }
  }

  private saveCourses(): void {
    localStorage.setItem('courses', JSON.stringify(this.courses()));
  }

  addCourse(course: Course[], courseName: string): void {
    if (this.isBrowser()) {
      const newCourse: CourseData = { courseName, course };
      this.courses.set([newCourse, ...this.courses()]);
      this.saveCourses();
      this.setCourse(0);
    }
  }

  setCourse(id: number): void {
    const courseData = this.courses()[id];
    if (courseData) {
      this.course.set(courseData.course);
      this.selectedCourseId.set(id);
    }
  }

  deleteCourse(id: number): void {
    if (this.isBrowser() && id >= 0 && id < this.courses().length) {
      const updatedCourses = [...this.courses()];
      updatedCourses.splice(id, 1);
      this.courses.set(updatedCourses);
      this.saveCourses();

      if (updatedCourses.length > 0) {
        this.setCourse(0);
      } else {
        this.course.set([]);
        this.selectedCourseId.set(null);
        this.router.navigate(['/']);
      }
    }
  }

  updateCourseName(id: number, newName: string): void {
    if (this.isBrowser() && id >= 0 && id < this.courses().length) {
      const updatedCourses = [...this.courses()];
      updatedCourses[id].courseName = newName;
      this.courses.set(updatedCourses);
      this.saveCourses();
    }
  }
}
