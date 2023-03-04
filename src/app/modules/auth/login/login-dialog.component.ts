import { take } from 'rxjs/operators';
import { NbDialogRef, NbToastRef } from '@nebular/theme';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS, NbAuthResult } from '@nebular/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { QRCode, ErrorCorrectLevel, QRNumber, QRAlphaNum, QR8BitByte, QRKanji } from 'qrcode-generator-ts/js';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent extends NbLoginComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() onSuccess?: (redirect?: string) => void;
  @Input() onAfterInit?: () => void;
  @Input() allowBack?: boolean = true;

  protected destroy$: Subject<void> = new Subject<void>();
  static instances: LoginDialogComponent[] = [];

  qrCodeImgData: string;
  qrCodeExpried: boolean = null;
  isLoginByApp: boolean = false
  env = environment;
  countdown = 0;

  constructor(
    service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) public options = {},
    cd: ChangeDetectorRef,
    public router: Router,
    public ref: NbDialogRef<LoginDialogComponent>,
    public commonService: CommonService,
    public apiService: ApiService,
    public authService: NbAuthService,
  ) {
    super(service, options, cd, router);
    LoginDialogComponent.instances.push(this);
    this.commonService.getMainSocket().then(mainSocket => {
      mainSocket.socketServerId$.subscribe(async socketServerId => {
        if (socketServerId) {
          try {
            const qr = new QRCode();
            qr.setTypeNumber(3);
            qr.setErrorCorrectLevel(ErrorCorrectLevel.M);
            qr.addData('SCAN2LOGIN|' + socketServerId); // Alphabet and Number
            qr.make();
            this.qrCodeImgData = qr.toDataURL(20, 0);
            await new Promise(resolve => setTimeout(() => resolve(true), 1000));
          } catch (err) {
            console.error(err);
          }
        }
      });

      // console.log('main socket service id : ' + mainSocket.socketServerId$.getValue());
      mainSocket.on<{ secondLoginToken: string }>('login-by-other-device').subscribe((request) => {
        // Set token to local store
        console.log(request);
        // const redirect = result.getRedirect();
        const secondLoginToken = request.data && request.data.secondLoginToken;
        if (secondLoginToken) {


          this.user.secondLoginToken = secondLoginToken;
          this.login();

          // localStorage.setItem('auth_app_token', JSON.stringify({
          //   name: "nb:auth:oauth2:jwt:token",
          //   ownerStrategyName: "email",
          //   createdAt: Date.now(),
          //   value: '{"access_token":"' + accessToken + '","refresh_token":"' + refreshToken + '"}',
          // }));
          // localStorage.setItem('api_access_token', accessToken);
          // localStorage.setItem('api_refresh_token', refreshToken);
          // this.apiService.refreshToken(() => {
          //   console.log('refresh token success');
          //   // if (this.onSuccess) {
          //   //   setTimeout(() => {
          //   //     this.onSuccess(null);
          //   //   }, this.redirectDelay);
          //   // }
          //   // setTimeout(() => {
          //   //   this.close();
          //   // }, this.redirectDelay);
          //   window.location.href = '/probox-one';
          // });

          // reply response
          request.callback(true);
        } else {
          request.callback(false);
        }
      });
    });
  }

  ngOnInit() {
    this.onAfterInit && this.onAfterInit();
  }

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

    return this.service.authenticate(this.strategy, this.user).pipe(take(1)).toPromise().then((result: NbAuthResult) => {
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
      return true;
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

  switchToLoginByApp() {
    let toastDialog: NbToastRef = null;
    if (this.qrCodeExpried === false) {
      toastDialog = this.commonService.toastService.show('Bạn chỉ được gửi yêu cầu scan2login mỗi lần trong vòng 30 giây, hãy thủ lại sau khi token hết hạn !', 'Scan2Login', { status: 'warning' })
      return false;
    }
    this.apiService.postPromise<any>('/user/login/requestAuthByQrCode', {}, []).then(rs => {
      this.qrCodeImgData = rs.QrCode;
      // const expired = new Date(rs.Expried);
      this.isLoginByApp = true;
      this.qrCodeExpried = false;
      this.countdown = parseInt((new Date(rs.Expried).getTime() - new Date().getTime()) / 1000 as any);

      const loop = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(loop);
        }
      }, 1000);


      // Listen second login token
      this.apiService.getPromise<any>('/user/login/listenSecondLoginToken', { uuid: rs.Uuid }).then(rs => {
        toastDialog && toastDialog.close();
        toastDialog = this.commonService.toastService.show('Đang đăng nhập bằng Scan2Login... !', 'Scan2Login', { status: 'info' })
        this.user.secondLoginToken = rs.SecondLoginToken;
        this.login().then(status => {
          if (status) {
            toastDialog && toastDialog.close();
            toastDialog = this.commonService.toastService.show('Đăng nhập bằng Scan2Login thành công!', 'Scan2Login', { status: 'success' })
          }
        });
        this.qrCodeExpried = null;
      }).catch(err => {
        console.log(err);
        toastDialog && toastDialog.close();
        toastDialog = this.commonService.toastService.show('Không thể đăng nhập bằng Scan2Login', 'Scan2Login', { status: 'danger' });
        this.qrCodeExpried = true;
      });

      return rs;
    });
  }
  switchToLoginByCredential() {
    this.isLoginByApp = false;
  }
}
