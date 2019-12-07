import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  type = '';
  icon = '';
  title = '';
  content = '';
  actions: { label: string, icon?: string, status?: string, action?: () => void }[] = [];
  private sub: Subscription;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected activeRoute: ActivatedRoute,
    protected commonService: CommonService,
  ) { }

  ngOnInit() {
    this.sub = this.activeRoute.params.subscribe(params => {
      const param = this.commonService.getRouteParams(params['id']);
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
