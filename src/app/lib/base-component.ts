import { OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ReuseComponent } from './reuse-component';
import { Subscription } from 'rxjs';

export abstract class BaseComponent implements OnInit, OnDestroy, ReuseComponent {

  abstract componentName: string = '';
  requiredPermissions: string[] = ['ACCESS'];

  protected subcriptions: Subscription[] = [];

  constructor(
    protected commonService: CommonService,
    protected router: Router,
    protected apiService: ApiService,
  ) { }

  // init() {
  //   this.restrict();
  // }

  restrict() {
    this.commonService.checkPermission(this.componentName, 'ACCESS', result => {
      if (!result) {
        this.commonService.gotoNotification({
          title: 'Quyền truy cập',
          content: 'Bạn không có quyền trên chức năng vừa truy cập !',
          actions: [
            {
              label: 'OK', status: 'success', action: () => {
                this.router.navigate(['/']);
              },
            },
          ],
        });
      }
    });
  }

  ngOnInit(): void {
    this.commonService.updateHeaderActionControlList([]);
  }

  onResume() {
    this.commonService.updateHeaderActionControlList([]);
    this.restrict();
  }

  ngOnDestroy(): void {
    this.commonService.updateHeaderActionControlList([]);
    if (this.subcriptions) {
      this.subcriptions.forEach(subciption => {
        subciption.unsubscribe();
      });
    }
  }

}
