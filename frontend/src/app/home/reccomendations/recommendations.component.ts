import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
  output,
  signal,
} from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { CourseService } from '../../shared/course.service';
import { isPlatformBrowser } from '@angular/common';

export interface Recommendation {
  topic: string;
  goal: string;
  background: string;
}

@Component({
  selector: 'app-recommendations',
  imports: [],
  templateUrl: './recommendations.component.html',
})
export class RecommendationsComponent implements OnInit {
  platformId = inject(PLATFORM_ID);
  httpService = inject(HttpService);
  courseService = inject(CourseService);

  recommendation = output<Recommendation>();
  recommendations = signal<Recommendation[]>([]);

  ngOnInit(): void {
    this.generateRecommendations();
  }

  applyRecommendation(index: number) {
    this.recommendation.emit(this.recommendations()[index]);
  }

  generateRecommendations() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const courses = this.courseService.courses();
    const data = {
      courses: courses.map((course) => ({
        courseName: course.courseName,
        subtopics: course.course.map((subtopic) => subtopic.subtopic),
      })),
    };

    this.httpService
      .post<{ recommendations: any }>(
        'http://localhost:8000/generate/recommendations',
        data
      )
      .subscribe({
        next: (response) => {
          this.recommendations.set(response.recommendations);
        },
        error: () => {
          this.recommendations.set([]);
        },
      });
  }
}
