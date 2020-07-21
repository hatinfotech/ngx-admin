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
    public commonService: CommonService,
  ) {
    super(service, options, router);
  }

  ngOnInit() {

    super.ngOnInit();

    // this.authService.logout();

    // this.dataService.logout(resp => {
    //   this.commonService.openDialog(ShowcaseDialogComponent, {
    //     context: {
    //       title: 'Logout',
    //       content: 'Logout success',
    //     },
    //   });
    // }, error => {
    //   this.commonService.openDialog(ShowcaseDialogComponent, {
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
    this.commonService.setPreviousUrl('/');
  }

}
