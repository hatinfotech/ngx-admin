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
  loading = false;
  notificationCache: {[key: string]: NotificationModel} = {};

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

    this.notificationService.activityUpdate$.subscribe(newNotification => {

      console.log('Activity notificaiton: had new notification ', newNotification);


      this.onReceiveNotification(newNotification);

      // if (this.activity && this.activity?.Time && this.activity?.Time >= newNotification?.Time) {
      //   console.log('new notification was lated');
      //   return;
      // }
      // if(this.activity && this.activity.Id === newNotification.Id) {
      //   console.log('new notification was loaded');
      //   return;
      // }
      // if (newNotification?.Action == 'OPENTICKET') {
      //   this.activity = newNotification;
      //   if (newNotification && timeout) {
      //     clearTimeout(timeout);
      //   }
      //   timeout = setTimeout(() => {
      //     this.activity = null;
      //   }, 5 * 60000);

      // } else if (newNotification?.Action == 'UPDATEACTIVITY') {
      //   this.activity.Status = newNotification.Status;
      //   this.activity.Icon = newNotification.Icon;
      //   this.activity.Content = newNotification.Content;
      // }

    });

    this.commonService.getMainSocket().then(mainSocket => {
      mainSocket.on<NotificationModel>('notify').subscribe((request) => {
        console.log('receive socket notification: ', request.data);
        request?.callback();
        const newNotification = request.data;
        this.notificationService.prepareNotificaitonInfo(newNotification);
        if(newNotification?.Type === 'ACTIVITY') this.onReceiveNotification(newNotification);
        // console.log('Activity notificaiton: had new notification ', newNotification);
        // if (this.activity && this.activity?.Time && this.activity?.Time >= newNotification?.Time) {
        //   console.log('new notification was lated');
        //   return;
        // }
        // if(this.activity && this.activity.Id !== newNotification.Id) {
        //   // console.log('new notification was loaded');
        //   // return;
        //   this.activity = newNotification;
        //   if (newNotification && timeout) {
        //     clearTimeout(timeout);
        //   }
        //   timeout = setTimeout(() => {
        //     this.activity = null;
        //   }, 5 * 60000);
        // } else {
        //   this.activity.Status = newNotification.Status;
        //   this.activity.Icon = newNotification.Icon;
        //   this.activity.Content = newNotification.Content;
        // }
        












        // if (newNotification?.Action == 'OPENTICKET') {
        //   this.activity = newNotification;
        //   if (newNotification && timeout) {
        //     clearTimeout(timeout);
        //   }
        //   timeout = setTimeout(() => {
        //     this.activity = null;
        //   }, 5 * 60000);

        // } else if (newNotification?.Action == 'UPDATEACTIVITY') {
        //   this.activity.Status = newNotification.Status;
        //   this.activity.Icon = newNotification.Icon;
        //   this.activity.Content = newNotification.Content;
        // }
      });
    });

  }

  onReceiveNotification(newNotification: NotificationModel) {
    let timeout = null;

    if (this.activity && this.activity?.Time && this.activity?.Time >= newNotification?.Time) {
      console.log('new notification was lated', newNotification);
      return;
    }

    if(this.notificationCache[newNotification.Id] && this.notificationCache[newNotification.Id].State === 'ACTIVE') {
      console.log('new notification was activated', newNotification);
      return;
    }

    if(!this.activity || this.activity.Id !== newNotification.Id) {
      // console.log('new notification was loaded');
      // return;
      this.activity = newNotification;
      if (newNotification && timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        this.activity = null;
      }, 5 * 60000);
    } else {
      this.activity.Status = newNotification.Status;
      this.activity.Icon = newNotification.Icon;
      this.activity.Content = newNotification.Content;
    }
    this.notificationCache[this.activity.Id] = this.activity;
  }

  onActivityClick(event: any) {
    if (this.activity) {
      this.notificationService.openNotification(this.activity).then(rs => {
        this.notificationCache[this.activity.Id].State = 'ACTIVE';
        this.activity = null;
      });
    }
  }

}
