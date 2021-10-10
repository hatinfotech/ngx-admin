import { filter, map, takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { NbMenuItem, NbPositionedContainerComponent, NbRenderableContainer, NbThemeService } from '@nebular/theme';
// import { NotificationModel } from '../../../../models/notification.model';
// import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { IHeaderNotificationContext } from './header-notification-context.directive';
import { NotificationModel } from '../../../../../models/notification.model';
import { ApiService } from '../../../../../services/api.service';
import { CommonService } from '../../../../../services/common.service';
import { NotificationService } from '../../../../../services/notification.service';
import { Subject } from 'rxjs';


/**
 * Context menu component used as content within NbContextMenuDirective.
 *
 * @styles
 *
 * context-menu-background-color:
 * context-menu-border-color:
 * context-menu-border-style:
 * context-menu-border-width:
 * context-menu-border-radius:
 * context-menu-text-align:
 * context-menu-min-width:
 * context-menu-max-width:
 * context-menu-shadow:
 * */
@Component({
    selector: 'ngx-notification-menu',
    styleUrls: ['./header-notification-context.component.scss'],
    templateUrl: './header-notification-context.component.html',
    // template: `
    //   <!-- <nb-menu class="context-menu" [items]="context.items" [tag]="context.tag"></nb-menu> -->
    //   <nb-card class="list-card" size="small">
    //     <nb-list>
    //       <nb-list-item *ngFor="let item of context.items">
    //         <nb-user [name]="item.name" [title]="item.title" [picture]="item.picture" [onlyPicture]="false"></nb-user>
    //       </nb-list-item>
    //     </nb-list>
    //   </nb-card>
    // `,
})
export class HeaderNotificationContextComponent extends NbPositionedContainerComponent implements NbRenderableContainer, OnDestroy {

    items: NotificationModel[] = [];
    numOfUnread = 0;

    @Input() tag: string;

    @Input()
    context: IHeaderNotificationContext = { items: [] };

    public currentTheme: string;
    private destroy$: Subject<void> = new Subject<void>();

    /**
     * The method is empty since we don't need to do anything additionally
     * render is handled by change detection
     */
    renderContent() { }

    placeholders = [];
    pageSize = 10;
    static _pageToLoadNext = 1;
    get pageToLoadNext() { return HeaderNotificationContextComponent._pageToLoadNext; }
    set pageToLoadNext(number: number) { HeaderNotificationContextComponent._pageToLoadNext = number; }
    loading = false;
    static _isEnd = false;
    get isEnd() {
        return HeaderNotificationContextComponent._isEnd;
    }
    set isEnd(status: boolean) {
        HeaderNotificationContextComponent._isEnd = status;
    }

    constructor(
        private apiService: ApiService,
        private commonService: CommonService,
        // private mobileAppService: MobileAppService,
        private notificationService: NotificationService,
        private datePipe: DatePipe,
        private themeService: NbThemeService,
    ) {
        super();

        this.themeService.onThemeChange()
            .pipe(
                map(({ name }) => name),
                takeUntil(this.destroy$),
            )
            .subscribe(themeName => this.currentTheme = themeName);

        // this.apiService.getPromise<NotificationModel[]>('/notification/notifications/byCurrentUser', { limit: 100 }).then(notifications => {
        //   this.items = notifications;
        // }).catch(err => {
        //   console.error(err);
        // });
        // this.notificationService.notifications$.subscribe(notifications => {
        //   this.items = notifications;
        // });

        this.items = this.notificationService.notifications.map(item => {
            if(!item.Picture) {
                item.Picture = 'assets/images/no-image-available.png';
            }
            return item;
        });
        this.placeholders = new Array(1);
        // this.numOfUnread = this.notificationService.numOfUnread;
        // this.notificationService.reloadEvent.subscribe(status => {
        //   this.isEnd = false;
        // });

        this.notificationService.requestNewestNotificaitons().then(newNotifications => {
            if (newNotifications && newNotifications.length > 0) {
                this.prepareForUpdateNotificaitonState(newNotifications);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onClickNotification(notification: NotificationModel) {
        this.notificationService.openNotification(notification).then(rs => {
            this.context.onItemClick.next(true);
        });
        // this.commonService.openMobileSidebar();
        // if (notification.Type === 'CHATROOM') {
        //   this.mobileAppService.openChatRoom({ ChatRoom: notification.Data?.room });
        //   this.context.onItemClick.next(true);
        // }

        // if (notification.Type === 'ACTIVITY') {

        // }

        // this.notificationService.updateReceiverState([notification.Id], 'ACTIVE').then(rs => {
        //   console.log('update notifications state to active');

        //   // this.items.find(f => f.Id == notification.Id).State = 'ACTIVE';
        //   // this.items = [...this.items];

        //   // this.prepareForUpdateNotificaitonState();
        //   // this.notificationService.updateReceiverState([...this.notificaitonUpdateQueue].map(item => item.Id), 'ACTIVE').then(rs => {
        //   //   console.log('update notifications state to read');
        //   //   for (const notification of this.notificaitonUpdateQueue) {
        //   //     notification.State = 'READ';
        //   //   }
        //   //   this.items = [...this.items];
        //   // });
        // });
    }



    loadNext() {
        if (this.isEnd || this.loading) { return }

        this.loading = true;
        this.placeholders = new Array(5);
        this.notificationService.loadNotifications({ limit: this.pageSize, offset: (this.pageToLoadNext - 1) * this.pageSize, sort_Id: 'desc', silent: true })
            .then(async notifications => {
                this.placeholders = [];
                this.items.push(...notifications.map(item => {
                    if(!item.Picture) {
                        item.Picture = 'assets/images/no-image-available.png';
                    }
                    return item;
                }));
                this.pageToLoadNext++;

                // Update to read
                // setTimeout(() => {
                const updateNotifications = notifications.filter(f => f.State === 'NEW' || !f.State);
                if (updateNotifications.length > 0) {

                    this.prepareForUpdateNotificaitonState(updateNotifications);

                }
                // }, 10000);
                this.loading = false;
            }).catch(err => {
                this.placeholders = [];
                this.isEnd = true;
            });
    }

    notificaitonUpdateQueue = [];
    prepareForUpdateNotificaitonState(notifications: NotificationModel[]) {
        // for(let n of notifications) {
        //   this.notificaitonUpdateQueue.push(n);
        // }
        this.notificaitonUpdateQueue.push(...notifications);
        this.commonService.takeUntil('update_notifications_state', 10000).then(rs => {
            this.notificationService.updateReceiverState(this.notificaitonUpdateQueue.map(item => item.Id), 'READ').then(rs => {
                console.log('update notifications state to read');
                for (const notification of this.notificaitonUpdateQueue) {
                    if (notification.State == 'NEW' || !notification.State) {
                        notification.State = 'READ';
                    }
                }
                this.items = [...this.items];
                this.notificaitonUpdateQueue = [];
            });
        });
    }
}