import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpService } from './http.service';
import { NotificationService } from './notification.service';

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
  platformId = inject(PLATFORM_ID);
  httpService = inject(HttpService);
  notificationService = inject(NotificationService);

  isLoading = signal(false);
  courses = signal<CourseData[]>([]);
  selectedCourseId = signal<number | null>(null);

  currentSubtopics = signal<string[]>([]);
  currentTopic = signal<string>('');
  generating = signal(false);
  generatingCourseId = signal<number | null>(null);
  generatingIndex = signal(0);
  generatingSubtopics = signal<string[]>([]);
  shouldRedirect = signal(false);

  courseNames = computed(() =>
    this.courses().map((course) => course.courseName)
  );

  course = computed<Course[]>(() => {
    const id = this.selectedCourseId();
    if (id === null || id < 0 || id >= this.courses().length) {
      return [];
    }
    return this.courses()[id].course;
  });

  constructor() {
    if (this.isBrowser()) {
      this.loadCourses();
      if (this.courses().length > 0) {
        this.setCourse(0);
      }
    }
  }

  startNewCourse(topicName: string, subtopics: string[]): void {
    const newCourse: CourseData = {
      courseName: topicName,
      course: [],
    };
    const updatedCourses = [newCourse, ...this.courses()];
    this.courses.set(updatedCourses);
    this.saveCourses();

    const newCourseId = 0;

    this.generating.set(true);
    this.generatingCourseId.set(newCourseId);
    this.generatingIndex.set(0);
    this.generatingSubtopics.set(subtopics);

    this.setCourse(newCourseId);
    this.processNextSubtopic();
  }

  setCourse(id: number): void {
    const courseData = this.courses()[id];
    if (courseData) {
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

  addCourse(course: Course[], courseName: string): void {
    if (this.isBrowser()) {
      const newCourse: CourseData = { courseName, course };
      this.courses.set([newCourse, ...this.courses()]);
      this.saveCourses();
      this.setCourse(0);
    }
  }

  processNextSubtopic(): void {
    if (!this.generating()) {
      return;
    }

    const idx = this.generatingIndex();
    const subs = this.generatingSubtopics();

    if (idx >= subs.length) {
      this.finishGeneration();
      return;
    }

    const maintopic = this.currentTopic();
    const currentSubtopic = subs[idx];
    const body = {
      maintopic,
      subtopics: subs,
      subtopic: currentSubtopic,
    };

    this.httpService
      .post<any>('http://localhost:8000/generate/content', body)
      .subscribe({
        next: (response) => this.handleGenerationResponse(response),
        error: () => {
          this.generating.set(false);
          this.notificationService.showNotification(
            'Failed to generate content.',
            'error'
          );
          this.saveCourses();
        },
      });
  }

  handleGenerationResponse(response: any) {
    if (!this.generating()) {
      return;
    }

    if (response.subtopic && response.content) {
      const courseIndex = this.generatingCourseId();
      if (courseIndex !== null) {
        const allCourses = [...this.courses()];
        const targetCourse = allCourses[courseIndex];

        targetCourse.course.push({
          subtopic: response.subtopic,
          content: response.content,
        });

        this.courses.set(allCourses);
        this.saveCourses();
      }
    }

    this.generatingIndex.set(this.generatingIndex() + 1);
    this.processNextSubtopic();
  }

  finishGeneration(): void {
    this.generating.set(false);
    this.saveCourses();
    this.notificationService.showNotification(
      `Your course "${this.currentTopic()}" got generated!`,
      'success'
    );
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  loadCourses(): void {
    if (!this.isBrowser()) return;
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      try {
        const parsedCourses: CourseData[] = JSON.parse(storedCourses);
        this.courses.set(parsedCourses);
      } catch (e) {
        this.notificationService.showNotification(
          'Failed to parse courses from localStorage.',
          'error'
        );
        this.courses.set([]);
      }
    }
  }

  saveCourses(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('courses', JSON.stringify(this.courses()));
  }
}
