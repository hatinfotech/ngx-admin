import { ProductPictureModel } from './../models/product.model';
import { take } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Injectable, Pipe, EventEmitter } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { ShowcaseDialogComponent } from '../modules/dialog/showcase-dialog/showcase-dialog.component';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { MobileAppService } from '../modules/mobile-app/mobile-app.service';
import { NbAuthService } from '@nebular/auth';
import { ApiService } from './api.service';
import { NotificationModel } from '../models/notification.model';
import { time } from 'console';

declare const $: any;
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  currentMessage = new BehaviorSubject(null);
  notifications$ = new BehaviorSubject<NotificationModel[]>([]);
  notifications: NotificationModel[] = [];

  reloadEvent = new EventEmitter<boolean>();
  numOfUnread = new BehaviorSubject<number>(0);

  constructor(
    private angularFireMessaging: AngularFireMessaging,
    public authService: NbAuthService,
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private mobileService: MobileAppService,
    private apiService: ApiService,
  ) {
    console.log('init notification service...');
    this.angularFireMessaging.messages.subscribe(
      (_messaging: any) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );

    // let autoUpdateNotificationLoop = null;
    this.authService.onAuthenticationChange().subscribe(async state => {
      console.info('Authentication change with state ' + state);
      if (state) {

        // Request notification permission and register firebase messaging
        console.log('request notifications permission');
        this.requestPermission().then(token => {
          //Register device
          this.commonService.registerDevice({ pushRegId: token });
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
      }
    });
    // Firebase messaging event
    console.log('receive message');
    this.receiveMessage().subscribe(
      (payload: any) => {
        console.log("new message received. ", payload);
        // this.currentMessage.next(payload);

        // Update notifcation list
        // const notifications = this.notifications$.getValue();
        this.notifications.unshift({
          Title: payload?.data?.title,
          Content: payload?.data?.content ? (this.convertToPlanText(payload?.data?.content)) : payload?.data?.body,
          Picture: payload?.data?.picture,
          Data: payload?.data,
        });
        // this.notifications$.next(notifications);

        const toastr: any = this.toastrService.show(payload?.data?.body, payload?.data?.title, {
          status: 'success',
          hasIcon: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          toastClass: 'room-' + payload?.data?.room,
          icon: 'email-outline',
        });
        console.log(toastr);
        this.increamentUnreadCount();
        $(toastr.toastContainer?.containerRef?.location?.nativeElement).find('.' + 'room-' + payload?.data?.room).click(() => {
          this.commonService.openMobileSidebar();
          this.mobileService.openChatRoom({ ChatRoom: payload?.data?.room });
          this.updateReceiverState([payload?.data?.id], 'ACTIVE').then(rs => {
            this.updateUnreadCount();
          });
        });
      });


    // Listen service worker events
    navigator.serviceWorker.addEventListener('message', event => {
      console.log(event?.data?.name, event.data?.payload);
      if (event.data?.name === 'notificationclick') {
        if (event.data?.payload && event.data?.payload?.room) {
          this.commonService.openMobileSidebar();
          this.mobileService.openChatRoom({
            ChatRoom: event.data?.payload?.room,
          });
          if (event.data?.payload?.id) {
            this.updateReceiverState([event.data?.payload?.id], 'ACTIVE').then(rs => {
              this.updateUnreadCount();
            });
          }
        }
      }
    });
    console.log('register messages observer');
    this.currentMessage = this.currentMessage;
  }

  active() {
    return true;
  }

  // protected lastUpdate: number = Date.now();
  async requestNewestNotificaitons() {
    // if (this.lastUpdate + 30 * 1000 < Date.now()) {
    // this.lastUpdate = Date.now();
    if (this.notifications.length > 0) {
      return this.loadNotifications({ sort_Id: 'desc', limit: 10, offset: 0, gt_Id: this.notifications[0].Id, silent: true }).then(notifications => {
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
    return this.angularFireMessaging.requestToken.pipe(take(1)).toPromise();
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
      token = await this.getToken();
    }
    this.angularFireMessaging.deleteToken(token).pipe(take(1)).toPromise();
  }

  receiveMessage() {
    return this.angularFireMessaging.messages;
  }

  async getToken() {
    return this.angularFireMessaging.getToken.pipe(take(1)).toPromise();
  }

  async loadNotifications(params?: { limit?: number, offset?: number, silent?: boolean, gt_Id?: number, lt_Id?: number, sort_Id?: string }) {
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
        notification.Content = this.convertToPlanText(notification.Content);
        return notification;
      });
      // this.notifications.push(...notifications);
      // this.notifications$.next(currentNotifications);
      // this.items = notifications;
      return notifications;
    });
  }

  public updateReceiverState(notifcationIds: number[], state: string) {
    return this.apiService.putPromise('/notification/notifications/updateReceiverState', { state: state }, notifcationIds.map(id => ({ Id: id }))).then(rs => {
      this.updateUnreadCount();
      return rs;
    });
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
}