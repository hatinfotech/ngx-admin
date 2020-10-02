import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NbAuthService } from '@nebular/auth';
import { filter, take } from 'rxjs/operators';
import { FrameSocket } from '../../lib/frame-socket/frame-socket';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'ngx-smart-bot',
  templateUrl: './smart-bot.component.html',
  styleUrls: ['./smart-bot.component.scss']
})
export class SmartBotComponent implements OnInit, AfterViewInit {

  frameSource = 'http://localhost:8100';
  frameSafeSource: SafeResourceUrl;

  @ViewChild('frameRef') frameRef: ElementRef;
  frame: HTMLIFrameElement;

  protected frameSocket: FrameSocket;

  constructor(
    public sanitizer: DomSanitizer,
    public apiService: ApiService,
    public commonService: CommonService,
    public authService: NbAuthService,
  ) { }

  ngOnInit(): void {
    this.frameSafeSource = this.sanitizer.bypassSecurityTrustResourceUrl(this.frameSource);
  }

  ngAfterViewInit(): void {
    // window.onmessage = function (e) {
    //   console.debug(e);
    // };
    // setTimeout(() => {
    //   this.frame = this.frameRef.nativeElement;
    //   this.frame.contentWindow.postMessage({ type: 'request', data: { command: 'frame-prepare' } }, '*');
    // }, 20000);

    this.frame = this.frameRef.nativeElement;
    this.frameSocket = new FrameSocket(this.frame.contentWindow);
    this.frameSocket.on<boolean>('ready').pipe(filter(request => request.data), take(1)).subscribe(request => {
      this.frameSocket.emit('set-token', { ...this.apiService.token, api_url: this.commonService.getApiUrl() }).then(rsp => {
        console.debug(rsp);
      });
    });

    this.authService.onAuthenticationChange().subscribe(status => {
      if (!status) {
        this.frameSocket.emit('remove-token', {}).then(rsp => {
          console.debug(rsp);
        });
      }
    });

  }

}
