import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Course {
  subtopic: string;
  content: string;
}

interface CourseData {
  courseName: string;
  course: Course[];
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private platformId = inject(PLATFORM_ID);

  isLoading = signal(false);
  course = signal<Course[]>([]);
  courses = signal<CourseData[]>([]);
  shouldRedirect = signal(false);

  selectedCourseId = signal<number | null>(null);

  currentSubtopics = signal<string[]>([]);
  currentTopic = signal<string>('');

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
    if (!this.isBrowser()) return;
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
    if (!this.isBrowser()) return;
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
        this.shouldRedirect.set(true);
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
