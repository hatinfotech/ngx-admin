import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NbAuthService } from '@nebular/auth';
import { filter, take } from 'rxjs/operators';
import { FrameSocket } from '../../lib/frame-socket/frame-socket';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { MobileAppService } from '../mobile-app/mobile-app.service';

@Component({
  selector: 'ngx-smart-bot',
  templateUrl: './smart-bot.component.html',
  styleUrls: ['./smart-bot.component.scss']
})
export class SmartBotComponent implements OnInit, AfterViewInit {

  frameSource = this.commonService.env.localApp.url;
  frameSafeSource: SafeResourceUrl;

  @ViewChild('frameRef') frameRef: ElementRef;
  @Input() id: string;
  frame: HTMLIFrameElement;

  protected frameSocket: FrameSocket;

  constructor(
    public sanitizer: DomSanitizer,
    public apiService: ApiService,
    public commonService: CommonService,
    public authService: NbAuthService,
    public mobileService: MobileAppService,
  ) { }

  ngOnInit(): void {
    this.commonService.theme$.pipe(filter(f => !!f), take(1)).toPromise().then(config => {
      this.frameSafeSource = this.sanitizer.bypassSecurityTrustResourceUrl(this.frameSource + '?id=' + this.id + '&theme=' + config.theme);
    });
  }

  ngAfterViewInit(): void {

    /** Prepare mobile app */
    this.frame = this.frameRef.nativeElement;
    this.frameSocket = new FrameSocket(this.frame.contentWindow, this.id);
    this.frameSocket.on<boolean>('ready').pipe(filter(request => request.data), take(1)).subscribe(request => {
      this.frameSocket.emit('set-token', { ...this.apiService.token, api_url: this.commonService.getApiUrl() }).then(rsp => {
        console.debug(rsp);
      });

      setTimeout(() => {
        this.commonService.theme$.pipe(filter(f => !!f)).subscribe(config => {
          this.frameSocket.emit('change-theme', { theme: config.theme }).then(rsp => {
            console.debug(rsp);
          });
        });

        this.authService.onAuthenticationChange().subscribe(status => {
          if (status === false) {
            this.frameSocket.emit('remove-token', {}).then(rsp => {
              console.debug(rsp);
            });
          }
        });

        this.authService.onTokenChange().subscribe(token => {
          this.frameSocket.emit('set-token', { ...token.getPayload(), api_url: this.commonService.getApiUrl() }).then(rsp => {
            console.debug(rsp);
          });
        });
      }, 5000);
    });
    this.mobileService.frameSocket = this.frameSocket;

    this.frameSocket.on('refresh-token').subscribe(request => {
      console.log('smart-bot send request refresh token');
      this.authService.refreshToken('email', { token: this.apiService.token }).subscribe((authResult) => {
        console.log('smart-bot callback  refresh token');
        request.callback('callback', authResult && authResult.getToken().getPayload());
      });
    });

    this.frameSocket.on<{ id: string, type: string, text: string }>('request-open-voucher').subscribe(request => {
      console.log('smart-bot send request open voucher', request);
      this.commonService.previewVoucher(request.data?.type, request.data?.id);
      request.callback('callback', true);
    });

  }

}
