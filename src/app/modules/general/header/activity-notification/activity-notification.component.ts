import { Event } from './../../../../lib/nam-socket/model/event';
import { CommonService } from './../../../../services/common.service';
import { NotificationModel } from './../../../../models/notification.model';
import { filter } from 'rxjs/operators';
import { NotificationService } from './../../../../services/notification.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-activity-notification',
  templateUrl: './activity-notification.component.html',
  styleUrls: ['./activity-notification.component.scss']
})
export class ActivityNotificationComponent implements OnInit {

  activity: NotificationModel = null;

  constructor(
    private notificationService: NotificationService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    let timeout = null;

    // Load last new activity notification

    // this.notificationService.activityNotifications$.subscribe(newestActivityNotifications => {
    //   if (newestActivityNotifications.length > 0) {
    //     this.activity = newestActivityNotifications[0];
    //   }
    // });

    this.notificationService.activityUpdate$.pipe(filter(f => f?.Type === 'ACTIVITY')).subscribe(newNotification => {

      console.log('Activity notificaiton: had new notification ', newNotification);
      if (this.activity && this.activity?.Time && this.activity?.Time >= newNotification?.Time) {
        console.log(' new notification was lated');
        return;
      }
      if (newNotification?.Action == 'OPENTICKET') {
        this.activity = newNotification;
        if (newNotification && timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          this.activity = null;
        }, 5 * 60000);

      } else if (newNotification?.Action == 'UPDATEACTIVITY') {
        this.activity.Status = newNotification.Status;
        this.activity.Icon = newNotification.Icon;
        this.activity.Content = newNotification.Content;
        //   clearTimeout(timeout);
        //   timeout = setTimeout(() => {
        //     this.activity = null;
        //   }, 10000);
      }

    })
  }

  onActivityClick(event: any) {
    if (this.activity) {
      this.notificationService.openNotification(this.activity).then(rs => {
        this.activity = null;
      });
    }
  }

}
