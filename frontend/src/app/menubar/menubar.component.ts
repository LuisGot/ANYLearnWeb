import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from '../shared/sidebar.service';
import { SidebarIcon } from '../../../public/icons/sidebar/sidebar-icon.component';
import { DownloadiconComponent } from '../../../public/icons/download/download-icon.component';
import { CourseService } from '../shared/course.service';

@Component({
  selector: 'app-menubar',
  imports: [SidebarIcon, DownloadiconComponent],
  templateUrl: './menubar.component.html',
})
export class MenubarComponent {
  sidebarService = inject(SidebarService);
  courseService = inject(CourseService);
  router = inject(Router);

  saveCurrentCourse() {
    const currentCourse = this.courseService.getCurrentCourse();
    if (currentCourse) {
      const dataStr = JSON.stringify(currentCourse);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentCourse.courseName
        .toLowerCase()
        .replaceAll(' ', '-')}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
