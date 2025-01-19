import { Component, inject } from '@angular/core';
import { CourseService } from '../shared/course.service';
import { NotificationService } from '../shared/notification.service';
import { ExporticonComponent } from '../../../public/icons/export/export-icon.component';
import { ImporticonComponent } from '../../../public/icons/import/import-icon.component';
import { GithubIconComponent } from '../../../public/icons/github/github-icon.component';
import { MailIconComponent } from '../../../public/icons/mail/mail-icon.component';
import { DiscordIconComponent } from '../../../public/icons/discord/discord-icon.component';

@Component({
  selector: 'app-settings',
  imports: [
    ExporticonComponent,
    ImporticonComponent,
    GithubIconComponent,
    MailIconComponent,
    DiscordIconComponent,
  ],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  courseService = inject(CourseService);
  notificationService = inject(NotificationService);

  exportAllCourses() {
    const courses = this.courseService.courses();
    if (courses) {
      const dataStr = JSON.stringify(courses);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'all-courses.json';
      link.click();
      window.URL.revokeObjectURL(url);
    }
  }

  importCourses() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.courseService.importCourses(reader.result as string);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }

  deleteAllCourses() {
    this.courseService.deleteAllCourses();
    this.notificationService.showNotification(
      'All courses deleted successfully',
      'success'
    );
  }
}
