import { DatePipe } from '@angular/common';
import { ApiService } from './../../../../services/api.service';
import { CommonService } from './../../../../services/common.service';
import { Component, Input } from '@angular/core';
import { NbMenuItem, NbPositionedContainer, NbRenderableContainer } from '@nebular/theme';
import { NotificationModel } from '../../../../models/notification.model';
import { MobileAppService } from '../../../mobile-app/mobile-app.service';
import { IHeaderNotificationContext } from './header-notification-context.directive';


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
  selector: 'my-context-menu',
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
export class HeaderNotificationContextComponent extends NbPositionedContainer implements NbRenderableContainer {

  items: NotificationModel[] = [];
  @Input() tag: string;

  @Input()
  context: IHeaderNotificationContext = { items: [] };


  /**
   * The method is empty since we don't need to do anything additionally
   * render is handled by change detection
   */
  renderContent() {}

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private mobileAppService: MobileAppService,
    private datePipe: DatePipe,
  ) {
    super();
    this.apiService.getPromise<NotificationModel[]>('/notification/notifications/byCurrentUser', { limit: 100 }).then(notifications => {
      this.items = notifications;
    }).catch(err => {
      console.error(err);
    });
  }

  onClickNotification(item: NotificationModel) {
    this.commonService.openMobileSidebar();
    this.mobileAppService.openChatRoom({ChatRoom: item.Data?.room});
    this.context.onItemClick.next(true);
  }
}