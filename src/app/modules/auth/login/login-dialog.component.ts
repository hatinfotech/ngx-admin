import { NbDialogRef } from '@nebular/theme';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS, NbAuthResult } from '@nebular/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent extends NbLoginComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() onSuccess?: (redirect: string) => void;
  @Input() allowBack?: boolean = true;

  protected destroy$: Subject<void> = new Subject<void>();
  static instances: LoginDialogComponent[] = [];

  constructor(
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) public options = {},
    cd: ChangeDetectorRef,
    public router: Router,
    public ref: NbDialogRef<LoginDialogComponent>,
  ) {
    super(service, options, cd, router);
    LoginDialogComponent.instances.push(this);
  }

  ngOnInit() { }

  login() {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    // this.service.onAuthenticationChange().pipe(takeUntil(this.destroy$)).subscribe(status => {
    //   if (status) {
    //     // this.close();
    //     // this.commonService.goback();

    //     this.service.isAuthenticated().pipe(take(1)).subscribe(status2 => {
    //       if (status2) {
    //         // Close all login dialog
    //         this.close();
    //       }
    //     });
    //   }
    // });

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
        const redirect = result.getRedirect();
        if (this.onSuccess) {
          setTimeout(() => {
            this.onSuccess(redirect);
          }, this.redirectDelay);
        }
        setTimeout(() => {
          this.close();
        }, this.redirectDelay);
      } else {
        this.errors = result.getErrors();
      }


      // if (redirect) {
      //   setTimeout(() => {
      //     return this.router.navigateByUrl(redirect);
      //   }, this.redirectDelay);
      // } else {
      //   setTimeout(() => {
      //     this.commonService.goToPrevious();
      //   }, this.redirectDelay);
      // }
      this.cd.detectChanges();
    });
  }

  close() {
    let loginCom = null;
    while (loginCom = LoginDialogComponent.instances.pop()) {
      this.ref.close();
    }
  }

  // login() {
  //   this.errors = [];
  //   this.messages = [];
  //   this.submitted = true;

  //   this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
  //     this.submitted = false;

  //     if (result.isSuccess()) {
  //       this.messages = result.getMessages();
  //     } else {
  //       this.errors = result.getErrors();
  //     }

  //     const redirect = result.getRedirect();
  //     if (redirect) {
  //       setTimeout(() => {
  //         return this.router.navigateByUrl(redirect);
  //       }, this.redirectDelay);
  //     } else {
  //       setTimeout(() => {
  //         this.commonService.goToPrevious();
  //       }, this.redirectDelay);
  //     }
  //     this.cd.detectChanges();
  //   });
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    // const nativeEle = this;
    // Fix dialog scroll
    if (this.ref) {
      if (this.ref.componentRef && this.ref.componentRef.location && this.ref.componentRef.location.nativeElement) {
        const nativeEle = this.ref.componentRef.location.nativeElement;
        // tslint:disable-next-line: ban
        const compoentNativeEle = $(nativeEle);
        const overlayWraper = compoentNativeEle.closest('.cdk-global-overlay-wrapper');
        const overlayBackdrop = overlayWraper.prev();

        compoentNativeEle.closest('.cdk-global-overlay-wrapper').addClass('dialog');
        console.log(compoentNativeEle);
      }
    }
  }
}
