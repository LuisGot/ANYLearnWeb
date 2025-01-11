import { Component, inject } from '@angular/core';
import { InfoiconComponent } from '../../../public/icons/info/info-icon.component';
import { CrossIconComponent } from '../../../public/icons/cross/cross-icon.component';
import { CheckIconComponent } from '../../../public/icons/check/check-icon.component';
import { WarningIconComponent } from '../../../public/icons/warning/warning-icon.component';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-notification',
  imports: [
    InfoiconComponent,
    CrossIconComponent,
    CheckIconComponent,
    WarningIconComponent,
  ],
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
