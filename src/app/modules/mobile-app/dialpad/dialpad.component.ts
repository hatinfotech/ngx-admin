import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MobileAppService } from '../mobile-app.service';
import { IPhoneContext, PhoneManager } from '../phone-manager/phone-manager';
import { CallingSession } from '../phone-manager/calling-session';
import { User } from '../phone-manager/user';
import { ApiService } from '../../../services/api.service';
import { ContactModel } from '../../../models/contact.model';
import { HelpdeskTicketModel } from '../../../models/helpdesk.model';
import { CommonService } from '../../../services/common.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ngx-dialpad',
  templateUrl: './dialpad.component.html',
  styleUrls: ['./dialpad.component.scss'],
})
export class DialpadComponent implements OnInit, AfterViewInit, IPhoneContext {

  // private userAgent: SIP.UA;
  // private inviteClientContext: SIP.InviteClientContext;
  // private inviteServerContext: SIP.InviteServerContext;
  phonenumber = '';
  digits = '';
  startTime = 0;
  duration$ = new BehaviorSubject<string>('00:00');
  callStatus = '';
  clock = null;

  partnerNumber = '';
  partnerName = '';


  callSreenActivated = false;
  incommingScreenActivated = false;
  pageCallingActivated = false;
  dialpadScreenActivated = true;
  contactScreenActivated = false;
  activeityScreenActivated = false;

  remoteVideo: any;
  localVideo: any;

  state = 'normal';

  ringer: any;
  ringbackPlayer: any;
  sipUsername: string;

  callingSessionList: {}[] = [];


  public phoneManager: PhoneManager;
  public sipPhoneUser: User;

  public hadWaitingIncomingCall = false;
  public minimized = false;
  public registerFailed = false;
  public activeAccountRegisterd = false;

  // @Input('minimized') minimized: boolean;

  constructor(
    private mobileAppService: MobileAppService,
    private apiService: ApiService,
    private commonService: CommonService,
  ) {
    this.mobileAppService.registerCallScreen(this);
    // Init sip phone
    this.phoneManager = new PhoneManager(this);
    try {
      this.commonService.loginInfo$.subscribe(loginInfo => {
        if (loginInfo) {

          // unregister
          this.phoneManager.unregister();

          // register
          const userPhoneExtList = loginInfo.phoneExtensions;
          if (userPhoneExtList) {
            userPhoneExtList.forEach(userPhoneExt => {
              this.sipPhoneUser = new User(
                userPhoneExt.Extension + '@' + userPhoneExt.Domain,
                userPhoneExt.DisplayName, userPhoneExt.Extension,
                userPhoneExt.Extension + '@' + userPhoneExt.Domain,
                userPhoneExt.Domain, userPhoneExt.Password,
                userPhoneExt.Transport + '://' + userPhoneExt.Host + ':' + userPhoneExt.Port);
              const userAgent = this.phoneManager.register(this.sipPhoneUser);
              if (userAgent) {
                userAgent.activated = true;
                this.sipUsername = userAgent.user.uri;
              }
            });
          }
        }
      });
      // const userPhoneExtList = this.commonService.loginInfo$.phoneExtensions;

    } catch (e) { console.error(e); }


    // Phone manager events
    this.phoneManager.sessionEvent.asObservable().subscribe(data => {
      switch (data.event) {
        case 'accepted':
          this.startTime = Date.now();
          this.callStatus = 'đang trong cuộc gọi...';
          this.clock = setInterval(() => {
            this.duration$.next(this.getActiveCallDuration());
          }, 1000);
          break;
        case 'progress':
          this.duration$.next('đang gọi...');
          this.callStatus = 'chờ bắt máy...';
          break;
        case 'incoming':
          this.callStatus = 'cuộc gọi đến...';
          break;
        case 'registered':
          this.activeAccountRegisterd = true;
          break;
        case 'unregistered':
          this.activeAccountRegisterd = false;
          break;
      }
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.remoteVideo = document.getElementById('remoteVideo');
    this.localVideo = document.getElementById('localVideo');
    this.ringer = document.getElementById('ringtonePlayer');
    this.ringbackPlayer = document.getElementById('ringbackPlayer');
    // this.ringer = new Audio();
  }

  getContactsByPhone(phone: string): Promise<ContactModel[]> {
    return this.apiService.getPromise<ContactModel[]>('/contact/contacts', { searchByPhone: phone });
  }

  onIncomingCall(session: CallingSession): void {
    console.info('On Incoming Call');
    this.getContactsByPhone(session.caller.phone).then(contacts => {
      const contact = contacts[0];
      this.hadWaitingIncomingCall = false;
      this.state = 'incomming';
      this.partnerName = contact ? contact.Name : session.caller.name;
      this.partnerNumber = session.caller.phone;
      this.ring();
      this.mobileAppService.updateCallState({ session: session, state: 'incomming', partnerName: contact ? contact.Name : session.caller.name, partnerNumber: session.caller.phone });
    }).catch(e => {
      console.error(e);
    });

  }
  onWaitingIncomingCall(session: CallingSession): void {
    console.info('On Waiting Incoming Call');
    this.hadWaitingIncomingCall = true;
    this.callStatus = 'có cuộc gọi đang chờ...';
    // this.state = 'incomming';
    // this.partnerName = session.caller.name;
    // this.partnerNumber = session.caller.phone;
    // this.ring();
    this.mobileAppService.updateCallState({ session: session, state: 'waiting-incomming', partnerName: session.caller.name, partnerNumber: session.caller.phone });
  }
  onHangup(session: CallingSession): void {
    console.info('On Hangup');
    if (!this.phoneManager.moreThanOneSession) {
      this.state = 'normal';
      this.switchToNormalScreen();
      this.maximizeScreen();
    }
  }
  onRingback() {
    this.ringback();
  }
  onStopRingback(session: CallingSession): void {
    this.stopRingback();
  }
  onTerminate(session: CallingSession): void {
    console.info('On Terminated');
    if (!this.phoneManager.moreThanOneSession) {
      this.state = 'normal';
      this.switchToNormalScreen();
      this.maximizeScreen();
    }
    if (this.phoneManager.callingSessionList.length - 1 === 1) {// session on terminate so it stay in queue
      this.hadWaitingIncomingCall = false;
    }
  }
  onCancel(session: CallingSession): void {
    console.info('On Cancel');
    if (!this.phoneManager.moreThanOneSession) {
      this.state = 'normal';
      this.switchToNormalScreen();
      this.maximizeScreen();
    }
    // if (this.phoneManager.callingSessionList.length - 1 === 1) {// session on terminate so it stay in queue
    //   this.hadWaitingIncomingCall = false;
    // }
    this.mobileAppService.updateCallState({ session: session, state: 'incomming-cancel' });

  }
  onCalling(session: CallingSession): void {
    console.info('On Calling');
    this.state = 'calling';
    this.partnerName = session.callee.name;
    this.partnerNumber = session.callee.phone;
  }
  onBye(session: CallingSession): void {
    console.info('On Bye');
    this.state = 'normal';
    this.switchToNormalScreen();
    this.maximizeScreen();
  }
  onRejected(session: CallingSession): void {
    console.info('On Reject');
    this.stopRingback();
  }
  onProgress(session: CallingSession): void {
    console.info('On Progress');
  }
  onFailed(session: CallingSession): void {
    console.info('On Failed');
  }

  getOutputMedia(): HTMLVideoElement {
    return this.remoteVideo;
  }

  async openRelateChatRoom() {
    const activeSession = this.phoneManager.getActiveSession();
    if (activeSession) {
      let contact: ContactModel = (await this.getContactsByPhone(activeSession.caller.phone))[0];
      if (!contact) {
        contact = {
          Phone: activeSession.caller.phone,
        };
      }
      const relativeTicket = await new Promise<HelpdeskTicketModel>((resolve, reject) => {
        this.apiService.getPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { getByCallSessionId: activeSession.id }).then(tickets => {

          if (tickets.length === 0) {
            // Create ticket
            const newTicket: HelpdeskTicketModel = {
              CallSessionId: activeSession.id,
              SupportedPerson: contact.Code,
              SupportedPersonName: contact.Name,
              SupportedPersonEmail: contact.Email,
              SupportedPersonPhone: activeSession.caller.phone,
              SupportedPersonAddress: contact.Address,
              Description: 'Yêu cầu mới từ ' + contact.Name + ' có số điện thoại ' + contact.Phone + ' vào ' + (new Date().toString()),
            };
            this.apiService.postPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', {}, [newTicket]).then(newHelpdeslTickets => {
              resolve(newHelpdeslTickets[0]);
            }).catch(e => reject(e));

          } else {
            resolve(tickets[0]);
          }
        });
      });
      if (relativeTicket) {
        this.mobileAppService.request('open-chat-room', {
          ChatRoom: relativeTicket.ChatRoom, back: () => {
            this.mobileAppService.switchScreen('phone');
          },
        });
        this.minimizeScreen();
      }
    }
  }

  keypress(key: string) {
    this.phonenumber += key;
  }

  backspacekey() {
    this.phonenumber = this.phonenumber.substr(0, this.phonenumber.length - 1);
  }

  call(phone?: string, name?: string) {

    const self = this;
    if (phone) {
      if (self.state === 'normal') {
        this.mobileAppService.switchScreen('phone');
        this.phonenumber = phone;
        this.partnerNumber = phone;
        if (name) {
          this.partnerName = name;
        } else {
          this.partnerName = phone;
        }
      } else {
        return false;
      }
    }

    if (self.state === 'normal') {
      self.state = 'calling';

      const callee = new User(this.phonenumber, this.phonenumber, this.phonenumber);

      self.partnerName = this.phonenumber;
      self.partnerNumber = this.phonenumber;

      this.phoneManager.call(callee);

    }
    // else {
    // if (self.state === 'calling') {
    //   this.hangup();
    //   // this.currentSession.terminate();
    //   // self.state = 'normal';
    // }

    // if (self.state === 'incomming-accept') {
    //   this.hangup();
    // }
    // }
  }

  onCallToggle() {
    const activeSession = this.phoneManager.getActiveSession();
    if (activeSession) {
      if (activeSession.state === 'incoming') {
        this.reject();
      } else {
        this.hangup();
      }
      this.state = 'normal';
      this.switchToNormalScreen();
    } else {
      this.call();
    }
  }

  hangup() {
    // if (this.state === 'calling') {
    //   this.inviteClientContext.terminate();
    // }
    // if (this.state === 'incomming' || this.state === 'incomming-accept') {
    //   this.inviteServerContext.terminate();
    // }

    if (this.phoneManager.hangup()) {
      this.state = 'normal';
      this.switchToNormalScreen();
      // this.mobileAppService.hadIncommingCall({ state: this.state });
    }
  }

  reject() {
    // this.inviteServerContext.reject();
    this.phoneManager.reject();
    this.state = 'normal';
    this.switchToNormalScreen();
    // this.mobileAppService.hadIncommingCall({ state: this.state });
    this.stopRing();
  }

  switchToNormalScreen() {
    this.callSreenActivated = false;
    this.incommingScreenActivated = false;
    this.dialpadScreenActivated = true;
    this.contactScreenActivated = false;
    this.activeityScreenActivated = false;
    this.showDialpadOnCalling = false;
    this.digits = '';
    this.startTime = 0;
    this.duration$.next('00:00');
    if (this.clock) {
      clearInterval(this.clock);
    }
    this.stopRing();
  }

  accept() {
    if (this.phoneManager.accept()) {
      this.stopRing();
      // this.inviteServerContext.accept();
      this.state = 'incomming-accept';
      // this.mobileAppService.hadIncommingCall({ state: this.state, partnerName: this.partnerName, partnerNumber: this.partnerNumber });
    }
  }

  switchScreen(screen: string) {
    this.mobileAppService.switchScreen(screen);
  }

  minimizeScreen() {
    this.minimized = true;
  }

  maximizeScreen() {
    this.minimized = false;
    this.mobileAppService.switchScreen('phone');
  }

  ring() {
    this.ringer.play();
    // try {
    //   if (!this.ringer) {
    //     this.ringer = new Audio();
    //   }
    //   this.ringer.src = 'assets/audio/ringing.mp3';
    //   this.ringer.load();
    //   this.ringer.loop = true;
    //   this.ringer.play();
    // } catch (e) {
    //   setTimeout(() => {
    //     this.ringer = new Audio();
    //     this.ring();
    //   }, 300);
    // }
  }

  stopRing() {
    if (this.ringer) {
      this.ringer.pause();
      // delete this.ringer;
    }
  }

  ringback() {
    this.ringbackPlayer.play();
  }

  stopRingback() {
    if (this.ringbackPlayer) {
      this.ringbackPlayer.pause();
      // delete this.ringer;
    }
  }

  showDialpadOnCalling = false;
  toggleDialpadOnCalling(event: any) {
    this.showDialpadOnCalling = !this.showDialpadOnCalling;
  }

  subDialplanKeyPress(key: string) {
    (this.digits as string) += key;
    this.sendDtmf(key);
  }
  subDialplanBacksppacePress() {
    this.digits = this.digits.substr(0, this.digits.length - 1);
  }

  sendDtmf(dtmf: string) {
    this.phoneManager.sendDtmf(dtmf);
  }

  transfer() {
    this.showDialpadOnCalling = true;
    if (this.digits.length < 3) {
      console.log('digit length < 3');
    } else {
      this.phoneManager.transfer(this.digits);
    }
  }

  toggleHold() {
    this.phoneManager.toggleHold();
  }

  toggleMute() {
    this.phoneManager.toggleMute();
  }

  getActiveCallDuration() {
    if (this.startTime === 0) {
      return '00:00';
    }
    const duration = Math.ceil((Date.now() - this.startTime) / 1000);
    return this.toHHMMSS(duration);
  }

  toHHMMSS(seconds: number) {
    // var sec_num = parseInt(this, 10); // don't forget the second param
    const hours: number | string = Math.floor(seconds / 3600);
    const minutes: number | string = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);

    return (hours > 0 ? ((hours < 10 ? '0' : '') + hours + ':') : '') + ((minutes < 10 ? '0' : '') + minutes + ':') + ((seconds < 10 ? '0' : '') + seconds);
  }

}
