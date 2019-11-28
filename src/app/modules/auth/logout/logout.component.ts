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
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    protected tokenService: NbTokenService,
    protected apiService: ApiService,
    protected commonService: CommonService,
  ) {
    super(service, options, router);
  }

  ngOnInit() {

    super.ngOnInit();

    // this.authService.logout();

    // this.dataService.logout(resp => {
    //   this.dialogService.open(ShowcaseDialogComponent, {
    //     context: {
    //       title: 'Logout',
    //       content: 'Logout success',
    //     },
    //   });
    // }, error => {
    //   this.dialogService.open(ShowcaseDialogComponent, {
    //     context: {
    //       title: 'Logout',
    //       content: 'Logout error',
    //     },
    //   });
    // });

  }

  logout(strategy: string): void {
    super.logout(strategy);
    this.tokenService.clear();
    this.apiService.clearToken();
    // this.commonService.pushLoggedIn(false);
    this.commonService.clearCache();
  }

}
