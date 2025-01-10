import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

import { CourseService } from '../shared/course.service';
import { HttpService } from '../shared/http.service';
import { ErrorService } from '../shared/error.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [MarkdownComponent, CommonModule],
  templateUrl: './course.component.html',
})
export class CourseComponent implements OnInit {
  courseService = inject(CourseService);
  httpService = inject(HttpService);
  errorService = inject(ErrorService);

  generating = signal(false);
  currentIndex = signal(0);
  course = this.courseService.course;

  ngOnInit() {
    const subtopics = this.courseService.currentSubtopics();
    if (subtopics.length) {
      this.initializeCourse(subtopics);
    }
  }

  initializeCourse(subtopics: string[]) {
    this.courseService.course.set([]);
    this.currentIndex.set(0);
    this.generateSubtopics(subtopics);
  }

  generateSubtopics(subtopics: string[]) {
    this.generating.set(true);
    this.processSubtopic(subtopics);
  }

  processSubtopic(subtopics: string[]) {
    const index = this.currentIndex();
    if (index >= subtopics.length) {
      this.finishGeneration();
      return;
    }

    const maintopic = this.courseService.currentTopic();
    const currentSubtopic = subtopics[index];
    const body = { maintopic, subtopics, subtopic: currentSubtopic };

    this.httpService
      .post<any>('http://localhost:8000/generate/content', body)
      .subscribe({
        next: (response) => this.handleResponse(response, subtopics),
        error: () => {
          this.generating.set(false);
          this.errorService.showError('Failed to generate content.');
        },
      });
  }

  handleResponse(response: any, subtopics: string[]) {
    if (response.subtopic && response.content) {
      this.courseService.course.update((course) => [
        ...course,
        { subtopic: response.subtopic, content: response.content },
      ]);
    }
    this.currentIndex.set(this.currentIndex() + 1);
    this.processSubtopic(subtopics);
  }

  finishGeneration() {
    this.generating.set(false);
    this.saveCourseToLocalStorage();
  }

  saveCourseToLocalStorage() {
    const topicName = this.courseService.currentTopic();
    const allSections = this.courseService.course();
    this.courseService.addCourse(allSections, topicName);
  }
}
