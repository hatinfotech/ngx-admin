import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { MobileAppService } from '../mobile-app/mobile-app.service';

@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {

  type = '';
  icon = '';
  title = '';
  content = '';
  actions: { label: string, icon?: string, status?: string, action?: () => void }[] = [];
  private sub: Subscription;

  urlParameters: any;


  constructor(
    public activeRoute: ActivatedRoute,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private mobileService: MobileAppService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.sub = this.activeRoute.params.subscribe(params => {
      const param = this.commonService.getRouteParams(params['id']);
      // this.urlParameters = window.location.search;
      this.route.queryParams.subscribe(params => {
        // this.urlParameters = JSON.stringify(params);
        const notification = this.notificationService.prepareNotificaitonInfo({ Data: params });
        this.commonService.navigate('/');
        setTimeout(() => {
          this.notificationService.openNotification(notification);
        }, 3000);
        // if (params?.type === 'CHATROOM') {
        // this.mobileService.allReady().then(rs => {
        //   setTimeout(() => {
        //     this.commonService.openMobileSidebar();
        //     this.mobileService.openChatRoom({
        //       ChatRoom: params?.room,
        //     });
        //     this.commonService.navigate('/');

        //   }, 3000);
        // });
        // }
        // if (params?.type === 'CHATROOM') {

        // }
      });
      if (param) {
        if (param.type) this.type = param.type;
        if (param.icon) this.icon = param.icon;
        this.title = param.title;
        this.content = param.content;
        if (param.actions) this.actions = param.actions;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
