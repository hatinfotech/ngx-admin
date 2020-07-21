import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { LoginDialogComponent } from './login-dialog.component';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {

  showBackground = true;

  constructor(
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public router: Router,
  ) { }

  ngAfterViewInit(): void {
    if (window['particlesAction']) window['particlesAction']();
  }

  ngOnInit() {
    if (LoginDialogComponent.instances.length === 0) {
      this.commonService.openDialog(LoginDialogComponent, {
        context: {
          onSuccess: (redirect: string) => {
            this.showBackground = false;
            this.goback(redirect);
          },
          allowBack: false,
        },
        hasBackdrop: false,
      });
    }
  }

  goback(redirect?: string) {
    // const redirect = result.getRedirect();
    if (redirect) {
      setTimeout(() => {
        return this.router.navigateByUrl(redirect);
      }, 500);
    } else {
      setTimeout(() => {
        this.commonService.goToPrevious();
      }, 500);
    }
  }
}
