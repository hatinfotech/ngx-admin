import { NotificationService } from './../../../services/notification.service';
import { Component, OnInit, Inject } from '@angular/core';
import { NbAuthService, NbLogoutComponent, NbTokenService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent extends NbLogoutComponent implements OnInit {

  // constructor(
  //   private dialogService: NbDialogService,
  //   private dataService: DataServiceService,
  //   private authService: NbAuthService,
  // ) { }

  constructor(
    public service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) public options = {},
    public router: Router,
    public tokenService: NbTokenService,
    public apiService: ApiService,
    public cms: CommonService,
    public notificationService: NotificationService,
  ) {
    super(service, options, router);
  }

  ngOnInit() {

    super.ngOnInit();
    // this.logout('email');
    // this.authService.logout();

    // this.dataService.logout(resp => {
    //   this.cms.openDialog(ShowcaseDialogComponent, {
    //     context: {
    //       title: 'Logout',
    //       content: 'Logout success',
    //     },
    //   });
    // }, error => {
    //   this.cms.openDialog(ShowcaseDialogComponent, {
    //     context: {
    //       title: 'Logout',
    //       content: 'Logout error',
    //     },
    //   });
    // });

  }

  logout(strategy: string): void {
    // super.logout(strategy);
    try {
      this.cms.unregisterDevice().then(async rs => {
        await this.notificationService.deleteToken();
        this.apiService.deletePromise('/user/login', null).then(status => {
          this.tokenService.clear();
          this.apiService.clearToken();
          // this.cms.pushLoggedIn(false);
          this.cms.clearCache();
          this.cms.setPreviousUrl('/');
          return true;
        }).finally(() => {
          this.cms.router.navigate(['/auth/login']);
        }).catch(err => {
          console.error(err);
          this.cms.router.navigate(['/auth/login']);
        });
      });
    } catch (err) {
      console.error(err);
      this.cms.router.navigate(['/auth/login']);
    }
  }

}
