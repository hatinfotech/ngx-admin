// import { Icon } from '../../../lib/custom-element/card-header/card-header.component';
import { NotificationModel } from './../models/notification.model';
import { take } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Injectable, EventEmitter } from '@angular/core';
// import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MobileAppService } from '../modules/mobile-app/mobile-app.service';
import { NbAuthService } from '@nebular/auth';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

declare const $: any;
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  currentMessage = new BehaviorSubject(null);
  notifications$ = new BehaviorSubject<NotificationModel[]>([]);
  notifications: NotificationModel[] = [];
  activityNotifications$ = new BehaviorSubject<NotificationModel[]>([]);

  reloadEvent = new EventEmitter<boolean>();
  numOfUnread = new BehaviorSubject<number>(0);

  activityUpdate$ = new BehaviorSubject<NotificationModel>(null);

  constructor(
    // private angularFireMessaging: AngularFireMessaging,
    public authService: NbAuthService,
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private mobileAppService: MobileAppService,
    private apiService: ApiService,
    public router: Router,
  ) {
    console.log('init notification service...');
    // this.angularFireMessaging.messages.subscribe(
    //   (_messaging: any) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // );

    // let autoUpdateNotificationLoop = null;
    this.authService.onAuthenticationChange().subscribe(async state => {
      console.info('Authentication change with state ' + state);
      if (state) {

        // Request notification permission and register firebase messaging
        console.log('request notifications permission');
        this.requestPermission().then(token => {
          //Register device
          // this.commonService.registerDevice({ pushRegId: token });
        });

        // Load new user notificaitons at first time
        // this.loadNotifications({order_Id: 'desc', limit: 10, offset: 0}).then(notifications => {
        //   this.notifications = notifications;
        // });

        // if (!autoUpdateNotificationLoop) {
        //   autoUpdateNotificationLoop = setInterval(() => {
        //     this.loadNotifications().then(notifications => {
        //       this.notifications = notifications;
        //       this.reloadEvent.emit(true);
        //     });
        //   }, 10000);
        // }

        this.updateUnreadCount();
        this.requestNewestActivityNotifications();

        // Debug
        if (false) setTimeout(() => {
          console.log('debug: pust virtual activity');
          const payload1 = {
            "data": {
              "d": "MINIERP1012177",
              "ticket": "HEDKT0762146",
              "icon": "phone-call",
              "type": "ACTIVITY",
              "title": "Cuộc gọi đến",
              "body": "...",
              "content": "Có 1 cuộc gọi đến từ Công Ty TNHH MTV Thượng Đế",
              "call_uuild": "5bdf9330-295c-43d7-8fbf-42a722bab806",
              "action": "OPENTICKET",
              "id": "3066",
              "event": "call_init",
              "status": "danger",
              "picture": ""
            },
            "from": "316262946834",
            "priority": "normal",
            "collapse_key": "do_not_collapse"
          };
          const newNotification = {
            Action: payload1?.data?.action,
            Type: payload1?.data?.type,
            Status: payload1?.data?.status || 'warning',
            Icon: payload1?.data?.icon || 'email',
            Title: payload1?.data?.title,
            Content: payload1?.data?.content ? (this.convertToPlanText(payload1?.data?.content)) : payload1?.data?.body,
            Picture: payload1?.data?.picture,
            Data: payload1?.data,
          };
          this.activityUpdate$.next(newNotification);
          this.notifications.unshift(newNotification);

          setTimeout(() => {
            const payload1 = {
              "data": {
                "d": "MINIERP1012177",
                "call_uuild": "5bdf9330-295c-43d7-8fbf-42a722bab806",
                "icon": "phone",
                "action": "OPENTICKET",
                "id": "3067",
                "type": "ACTIVITY",
                "event": "call_end",
                "title": "Kết thúc cuộc gọi",
                "body": "...",
                "content": "Công Ty TNHH MTV Thượng Đếđã kết thúc cuộc gọi",
                "status": "success",
                "picture": ""
              },
              "from": "316262946834",
              "priority": "normal",
              "collapse_key": "do_not_collapse"
            };
            const newNotification = {
              Action: payload1?.data?.action,
              Type: payload1?.data?.type,
              Status: payload1?.data?.status || 'warning',
              Icon: payload1?.data?.icon || 'email',
              Title: payload1?.data?.title,
              Content: payload1?.data?.content ? (this.convertToPlanText(payload1?.data?.content)) : payload1?.data?.body,
              Picture: payload1?.data?.picture,
              Data: payload1?.data,
            };
            this.activityUpdate$.next(newNotification);
            this.notifications.unshift(newNotification);
          }, 5000);
        }, 10000);

      }
    });
    // Firebase messaging event
    console.log('receive message');
    // this.receiveMessage().subscribe(
    //   (payload: any) => {
    //     console.log("new message received. ", payload);
    //     // this.currentMessage.next(payload);

    //     // Update notifcation list
    //     // const notifications = this.notifications$.getValue();
    //     const newNotification: NotificationModel = {
    //       Id: parseInt(payload?.data?.id),
    //       Time: parseInt(payload?.data?.time),
    //       Action: payload?.data?.action,
    //       Status: payload?.data?.status || 'warning',
    //       Icon: payload?.data?.icon || 'email',
    //       Type: payload?.data?.type,
    //       Title: payload?.data?.title,
    //       Content: payload?.data?.content ? (this.convertToPlanText(payload?.data?.content)) : payload?.data?.body,
    //       Picture: payload?.data?.picture,
    //       Data: payload?.data,
    //     };
    //     if(newNotification.Type === 'ACTIVITY') this.activityUpdate$.next(newNotification);
    //     this.notifications.unshift(newNotification);
    //     // this.notifications$.next(notifications);

    //     if (newNotification?.Type !== 'ACTIVITY') {
    //       const toastr: any = this.toastrService.show(payload?.data?.body, payload?.data?.title, {
    //         status: 'success',
    //         hasIcon: true,
    //         position: NbGlobalPhysicalPosition.TOP_RIGHT,
    //         toastClass: 'room-' + payload?.data?.room,
    //         icon: 'email-outline',
    //       });
    //       console.log(toastr);
    //       this.increamentUnreadCount();
    //       $(toastr.toastContainer?.containerRef?.location?.nativeElement).find('.' + 'room-' + payload?.data?.room).click(() => {
    //         // this.commonService.openMobileSidebar();
    //         // this.mobileAppService.openChatRoom({ ChatRoom: payload?.data?.room });
    //         // this.updateReceiverState([payload?.data?.id], 'ACTIVE').then(rs => {
    //         //   this.updateUnreadCount();
    //         // });
    //         this.openNotification(this.prepareNotificaitonInfo(newNotification));
    //       });
    //     } else {
    //       // this.activityNotifications$.next([newNotification]);
    //     }
    //   });


    // Listen service worker events
    navigator.serviceWorker.addEventListener('message', event => {
      console.log(event?.data?.name, event.data?.payload);
      if (event.data?.name === 'notificationclick') {
        const notification = this.prepareNotificaitonInfo({
          Data: event.data?.payload,
        });
        console.log(notification);
        this.openNotification(notification);
        // if (event.data?.payload?.type === 'CHATROOM') {
        //   if (event.data?.payload && event.data?.payload?.room) {
        //     this.commonService.openMobileSidebar();
        //     this.mobileAppService.openChatRoom({
        //       ChatRoom: event.data?.payload?.room,
        //     });
        //     if (event.data?.payload?.id) {
        //       this.updateReceiverState([event.data?.payload?.id], 'ACTIVE').then(rs => {
        //         this.updateUnreadCount();
        //       });
        //     }
        //   }
        // }
      }
    });
    console.log('register messages observer');
    this.currentMessage = this.currentMessage;


    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        //do whatever you want
        console.log("application invisabled");
      }
      else {
        //do whatever you want
        console.log("application visabled");
        this.requestNewestActivityNotifications();
      }
    });
  }

  active() {
    return true;
  }

  async requestNewestActivityNotifications() {
    // Update activity notifications
    return this.loadNotifications({ sort_Id: 'desc', limit: 1, offset: 0, silent: true, eq_Type: 'ACTIVITY', eq_ReceiverState: 'NEW' }).then(notifications => {
      // this.activityNotifications$.next(notifications);
      if (notifications && notifications.length > 0) {
        if (this.activityUpdate$.value && this.activityUpdate$.value.Id != notifications[0].Id) {
          this.activityUpdate$.next(notifications[0]);
        }
      }
      return notifications;
    });
  }

  // protected lastUpdate: number = Date.now();
  async requestNewestNotificaitons() {
    // if (this.lastUpdate + 30 * 1000 < Date.now()) {
    // this.lastUpdate = Date.now();

    if (this.notifications.length > 0) {
      return this.loadNotifications({ sort_Id: 'desc', limit: 10, offset: 0, gt_Id: this.notifications[0].Id, silent: true }).then(notifications => {
        // for(const notification of notifications) {
        //   this.prepareNotificaitonInfo(notification);
        // }
        this.notifications.unshift(...notifications);
        this.updateUnreadCount();
        // this.reloadEvent.emit(true);
        return notifications;
      });
    }
    // } else {
    //   console.info('no need reload');
    //   return false;
    // }
  }

  async requestPermission() {
    // return this.angularFireMessaging.requestToken.pipe(take(1)).toPromise();
    // .then(
    //   (token) => {
    //     console.log(token);
    //   },
    //   (err) => {
    //     console.error('Unable to get permission to notify.', err);
    //   }
    // );
  }

  async deleteToken(token?: string) {
    if (!token) {
      // token = await this.getToken();
    }
    // this.angularFireMessaging.deleteToken(token).pipe(take(1)).toPromise();
  }

  receiveMessage() {
    // return this.angularFireMessaging.messages;
  }

  async getToken() {
    // return this.angularFireMessaging.getToken.pipe(take(1)).toPromise();
  }

  async loadNotifications(params?: { limit?: number, offset?: number, silent?: boolean, gt_Id?: number, lt_Id?: number, sort_Id?: string, eq_Type?: string, eq_ReceiverState?: string }) {
    // const params: any = { silent: true, limit: limit || 10, offset: offset || 0 };
    if (!params) {
      params = { silent: true, limit: 10, offset: 0 };
    }
    // if (typeof limit === 'undefined' && typeof offset === 'undefined' && this.notifications.length > 0) {
    //   params.fromId = this.notifications[0].Id;
    // }
    return this.apiService.getPromise<NotificationModel[]>('/notification/notifications/byCurrentUser', params).then(notifications => {
      // const currentNotifications = this.notifications$.getValue();
      notifications = notifications.map(notification => {
        // notification.Content = this.convertToPlanText(notification.Content);
        this.prepareNotificaitonInfo(notification);
        return notification;
      });
      // this.notifications.push(...notifications);
      // this.notifications$.next(currentNotifications);
      // this.items = notifications;
      return notifications;
    });
  }

  public async updateReceiverState(notifcationIds: number[], state: string) {
    const rs = await this.apiService.putPromise('/notification/notifications/updateReceiverState', { state: state }, notifcationIds.map(id => ({ Id: id })));
    this.updateUnreadCount();
    if (this.notifications) {
      const notificaiton = this.notifications.find(f => notifcationIds.some(s => s === f.Id));
      if (notificaiton) {
        notificaiton.State = state;
      }
      this.notifications = [...this.notifications];
    }
    return rs;
  }

  public convertToPlanText(text: string) {
    return text.replace(/([\@\#]\[)([^\[\]]+)(\]\(\w+\:\w+\))/g, '<b>$2</b>');
  }

  updateUnreadCount() {
    this.apiService.getPromise<{ data: number }>('/notification/notifications/unreadCount').then(rs => {
      console.log(rs);
      this.numOfUnread.next(rs.data);
    });
  }

  increamentUnreadCount() {
    this.numOfUnread.next(this.numOfUnread.getValue() + 1);
  }

  async openNotification(notification: NotificationModel) {


    const rs = this.updateReceiverState([notification.Id], 'ACTIVE').then(rs => {
      console.log('update notifications state to active');

      // this.items.find(f => f.Id == notification.Id).State = 'ACTIVE';
      // this.items = [...this.items];

      // this.prepareForUpdateNotificaitonState();
      // this.notificationService.updateReceiverState([...this.notificaitonUpdateQueue].map(item => item.Id), 'ACTIVE').then(rs => {
      //   console.log('update notifications state to read');
      //   for (const notification of this.notificaitonUpdateQueue) {
      //     notification.State = 'READ';
      //   }
      //   this.items = [...this.items];
      // });

      if (notification.Type === 'ACTIVITY') {
        this.requestNewestActivityNotifications();
      }

      return rs;
    });

    // Chat room case
    if (notification.Type === 'CHATROOM') {

      this.mobileAppService.allReady().then(rs => {
        if (/^\/dashboard/.test(this.router.url)) {
          // home page
          this.mobileAppService.openChatRoom({ ChatRoom: notification.Data?.room }, 'large-smart-bot');
        } else {
          this.commonService.openMobileSidebar();
          this.mobileAppService.openChatRoom({ ChatRoom: notification.Data?.room }, 'small-smart-bot');
        }
      });

      // this.mobileAppService.allReady().then(rs => {
      //   // setTimeout(() => {
      //     this.commonService.openMobileSidebar();
      //     this.mobileAppService.openChatRoom({ ChatRoom: notification.Data?.room });
      //   // }, 3000);
      // });
    }

    // Activity case
    if (notification.Type === 'ACTIVITY') {
      if (notification?.Action === 'OPENTICKET') {
        this.commonService.openTicketForm({ Code: notification?.Data?.ticket, UuidIndex: notification?.Data?.uuid });
      }
    }

    return rs
  }

  prepareNotificaitonInfo(notification: NotificationModel) {
    if (!notification.Id && notification?.Data?.id) notification.Id = notification?.Data?.id;
    if (!notification.Title && notification?.Data?.title) notification.Title = notification?.Data?.title;
    if (!notification.Content && notification?.Data?.content) notification.Content = notification?.Data?.content;
    if (!notification.Type && notification?.Data?.type) notification.Type = notification?.Data?.type;
    if (!notification.Action && notification?.Data?.action) notification.Action = notification?.Data?.action;
    if (notification?.Data?.time) notification.Time = notification?.Data?.time;
    if (notification?.Data?.action) notification.Action = notification?.Data?.action;
    if (notification?.Data?.status) notification.Status = notification?.Data?.status;
    if (notification?.Data?.icon) notification.Icon = notification?.Data?.icon;
    notification.Content = this.convertToPlanText(notification.Content);
    return notification;
  }
}