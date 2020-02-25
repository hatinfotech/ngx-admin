import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as SIP from 'sip.js';
import { MobileAppService } from '../mobile-app.service';
import { SimpleStatus } from 'sip.js/lib/Web/Simple';
import { BehaviorSubject } from 'rxjs';
import { IPhoneContext, PhoneManager } from '../phone-manager/phone-manager';
import { CallingSession } from '../phone-manager/calling-session';
import { User } from '../phone-manager/user';

@Component({
  selector: 'ngx-dialpad',
  templateUrl: './dialpad.component.html',
  styleUrls: ['./dialpad.component.scss'],
})
export class DialpadComponent implements OnInit, AfterViewInit, IPhoneContext {


  private userAgent: SIP.UA;
  private inviteClientContext: SIP.InviteClientContext;
  private inviteServerContext: SIP.InviteServerContext;
  phonenumber = '';

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

  ringer = new Audio();
  sipUsername: string;

  callingSessionList: {}[] = [];


  private phoneManager: PhoneManager;
  public sipPhoneUser: User;

  public hadWaitingIncomingCall = false;

  constructor(
    private mobileAppService: MobileAppService,
  ) {
    // Init sip phone
    this.sipPhoneUser = new User(
      '101@test.probox.vn',
      'Agent 101', '101',
      '101@test.probox.vn',
      'test.probox.vn', 'mtsg@513733',
      'wss://s6.probox.vn:7443');
    this.phoneManager = new PhoneManager(this);
    const userAgent = this.phoneManager.register(this.sipPhoneUser);
    if (userAgent) {
      userAgent.activated = true;
      this.sipUsername = userAgent.user.uri;
    }
  }

  ngOnInit() {

    // const self = this;
    // this.sipUsername = '101@test.probox.vn';
    // this.userAgent = new SIP.UA({
    //   uri: '101@test.probox.vn',
    //   register: true,
    //   transportOptions: {
    //     wsServers: ['wss://s6.probox.vn:7443'],
    //   },
    //   authorizationUser: '101',
    //   password: 'mtsg@513733',
    // });

    // this.userAgent.on('invite', async (callReceiveSession) => {


    //   // const callSession = new CallingSession(
    //   //   {
    //   //     id: self.inviteServerContext.remoteIdentity.uri.user,
    //   //     name: self.inviteServerContext.remoteIdentity.displayName,
    //   //     number: self.inviteServerContext.remoteIdentity.uri.user,
    //   //     uri: self.inviteServerContext.remoteIdentity.uri.user,
    //   //   },
    //   //   {
    //   //     id: this.sipUsername,
    //   //     name: this.sipUsername,
    //   //     number: '101',
    //   //     uri: this.sipUsername,
    //   //   },
    //   //   callReceiveSession,
    //   // );

    //   // this.callingSessionList.push(callSession);


    //   self.inviteServerContext = callReceiveSession;
    //   // callkit.receiveCall("David Marcus");
    //   if (self.state === 'normal') {
    //     self.state = 'incomming';
    //     this.partnerName = self.inviteServerContext.remoteIdentity.displayName;
    //     this.partnerNumber = self.inviteServerContext.remoteIdentity.uri.user;
    //     this.ring();
    //     this.mobileAppService.hadIncommingCall({ state: self.state, partnerName: this.partnerName, partnerNumber: this.partnerNumber });
    //     self.receiveCallEventConfig(this.inviteServerContext);
    //     // console.info('!!! accept call manula by call fucntion : acceptcall()');
    //     // session.accept();
    //   } else {
    //     this.partnerName = self.inviteServerContext.remoteIdentity.displayName;
    //     this.partnerNumber = self.inviteServerContext.remoteIdentity.uri.user;
    //     this.mobileAppService.hadIncommingCall({ state: 'waiting-incomming', partnerName: this.partnerName, partnerNumber: this.partnerNumber });
    //     while (await new Promise<boolean>(resolve => {
    //       console.info('waiting for phone state update to normal...');
    //       setTimeout(() => {
    //         if (self.state !== 'normal') {
    //           resolve(true);
    //         } else {
    //           resolve(false);
    //         }
    //       }, 1000);
    //     })) { }
    //     self.inviteServerContext = callReceiveSession;
    //     self.state = 'incomming';
    //     // self.inviteServerContext.accept();
    //     this.partnerName = self.inviteServerContext.remoteIdentity.displayName;
    //     this.partnerNumber = self.inviteServerContext.remoteIdentity.uri.user;
    //     this.ring();
    //     self.receiveCallEventConfig(self.inviteServerContext);

    //   }
    // });
  }

  ngAfterViewInit() {
    this.remoteVideo = document.getElementById('remoteVideo');
    this.localVideo = document.getElementById('localVideo');
    // this.ringer = new Audio();
  }

  onIncomingCall(session: CallingSession): void {
    this.hadWaitingIncomingCall = false;
    this.state = 'incomming';
    this.partnerName = session.caller.name;
    this.partnerNumber = session.caller.phone;
    this.ring();
    this.mobileAppService.hadIncommingCall({ session: session, state: 'incomming', partnerName: this.partnerName, partnerNumber: this.partnerNumber });
  }
  onWaitingIncomingCall(session: CallingSession): void {
    this.hadWaitingIncomingCall = true;
    // this.state = 'incomming';
    // this.partnerName = session.caller.name;
    // this.partnerNumber = session.caller.phone;
    // this.ring();
    this.mobileAppService.hadIncommingCall({ session: session, state: 'waiting-incomming', partnerName: this.partnerName, partnerNumber: this.partnerNumber });
  }
  onHangup(session: CallingSession): void {
    if (!this.phoneManager.moreThanOneSession) {
      this.state = 'normal';
      this.switchToNormalScreen();
    }
  }
  onTerminate(session: CallingSession): void {
    if (!this.phoneManager.moreThanOneSession) {
      this.state = 'normal';
      this.switchToNormalScreen();
    }
    if (this.phoneManager.callingSessionList.length - 1 === 1) {// session on terminate so it stay in queue
      this.hadWaitingIncomingCall = false;
    }
  }
  onCalling(session: CallingSession): void {
    this.state = 'calling';
    this.partnerName = session.callee.name;
    this.partnerNumber = session.callee.phone;
  }
  getOutputMedia(): HTMLVideoElement {
    return this.remoteVideo;
  }

  receiveCallEventConfig(receiveCallSession: SIP.InviteServerContext) {
    // pc = session.sessionDescriptionHandler.peerConnection;
    const self = this;
    const session = receiveCallSession;
    // const isVideoCall = false;

    receiveCallSession.on('trackAdded', () => {
      console.info('trackAdded');
    });

    receiveCallSession.on('progress', () => {
      // cleanmedia();
      console.info('progress');
    });
    receiveCallSession.on('accepted', () => {
      // // Gets local tracks
      // preparemedia();

      console.info('accepted');
      const pc = receiveCallSession.sessionDescriptionHandler['peerConnection'];

      const isVideoCall = false;

      // if (isVideoCall) {
      //   const localStream = new MediaStream();
      //   const senderPeers = pc.getSenders();
      //   if (senderPeers.length > 0) {
      //     senderPeers.forEach(function (receiver) {
      //       const track = receiver['track'] ? receiver['track'] : receiver;
      //       if (track.kind === 'video') {
      //         localStream.addTrack(track);
      //       }
      //     });
      //     self.localVideo.srcObject = localStream;
      //     self.localVideo.play();
      //   }
      // }

      const remoteStream = new MediaStream();
      if (pc.getReceivers().length > 0) {
        pc.getReceivers().forEach(function (receiver) {
          const track = receiver['track'] ? receiver['track'] : receiver;
          if (track.kind === 'audio') {
            remoteStream.addTrack(track);
          }
        });
        self.remoteVideo.srcObject = remoteStream;
        self.remoteVideo.play();
        if (isVideoCall) {
          // speakeron();
        } else {
          // speakeroff();
        }
      }
    });
    receiveCallSession.on('rejected', () => {
      // callkit.endCall();
      // self.reject();
      console.info('rejected');
    });
    receiveCallSession.on('failed', () => {
      // cleanmedia();
      // callkit.endCall();
      self.state = 'normal';
      self.switchToNormalScreen();
      console.info('failed');
    });
    receiveCallSession.on('terminated', () => {
      // callkit.endCall();
      self.state = 'normal';
      self.switchToNormalScreen();
      console.info('terminated');
    });
    receiveCallSession.on('cancel', () => {
      // callkit.endCall();
      self.state = 'normal';
      self.switchToNormalScreen();
      console.info('cancel');
    });
    receiveCallSession.on('reinvite', () => {
      // cleanmedia();
      console.info('reinvite');
    });
    receiveCallSession.on('referRequested', () => {
      // cleanmedia();
      console.info('referRequested');
    });
    receiveCallSession.on('replaced', () => {
      // cleanmedia();
      console.info('replaced');
    });
    receiveCallSession.on('dtmf', () => {
      // cleanmedia();
      console.info('dtmf');
    });
    receiveCallSession.on('SessionDescriptionHandler-created', () => {
      // cleanmedia();
      console.info('SessionDescriptionHandler-created');
    });
    receiveCallSession.on('directionChanged', () => {
      // cleanmedia();
      console.info('directionChanged');
    });
    receiveCallSession.on('trackAdded', () => {
      // cleanmedia();
      console.info('trackAdded');
    });
    receiveCallSession.on('bye', () => {
      // callkit.endCall();
      // cleanmedia();
      self.state = 'normal';
      self.switchToNormalScreen();
      console.info('bye');
    });
  }

  keypress(key: string) {
    this.phonenumber += key;
  }

  backspacekey() {
    this.phonenumber = this.phonenumber.substr(0, this.phonenumber.length - 1);
  }

  call() {
    const self = this;
    if (self.state === 'normal') {
      self.state = 'calling';

      const callee = new User(this.phonenumber, this.phonenumber, this.phonenumber);

      self.partnerName = this.phonenumber;
      self.partnerNumber = this.phonenumber;

      this.phoneManager.call(callee);

      return;

      this.mobileAppService.hadIncommingCall({ state: self.state, partnerName: this.partnerName, partnerNumber: this.partnerNumber });

      const isVideoCall = false;
      const currentSession = this.inviteClientContext = this.userAgent.invite(this.phonenumber, {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: false,
          },
        },
        // rtcConfiguration: {
        //   sdpSemantics: 'plan-b',
        //   bundlePolicy: 'max-compat',
        //   rtcpMuxPolicy: 'negotiate',
        // }
      });
      this.callSreenActivated = true;
      this.incommingScreenActivated = false;
      this.dialpadScreenActivated = false;
      this.contactScreenActivated = false;
      this.activeityScreenActivated = false;

      this.inviteClientContext.on('trackAdded', () => {

      });

      this.inviteClientContext.on('progress', () => {
        // cleanmedia();
        console.info('progress');
      });
      this.inviteClientContext.on('accepted', () => {
        // // Gets local tracks
        const pc = self.inviteClientContext.sessionDescriptionHandler['peerConnection'];

        if (isVideoCall) {
          const localStream = new MediaStream();
          const senderPeers = pc.getSenders();
          if (senderPeers.length > 0) {
            senderPeers.forEach(function (receiver) {
              const track = receiver['track'] ? receiver['track'] : receiver;
              if (track.kind === 'video') {
                localStream.addTrack(track);
              }
            });
            self.localVideo.srcObject = localStream;
            self.localVideo.play();
          }
        }

        const remoteStream = new MediaStream();
        if (pc.getReceivers().length > 0) {
          pc.getReceivers().forEach(function (receiver) {
            const track = receiver['track'] ? receiver['track'] : receiver;
            if (track.kind === 'audio') {
              remoteStream.addTrack(track);
            }
          });
          self.remoteVideo.srcObject = remoteStream;
          self.remoteVideo.play();
          if (isVideoCall) {
            // speakeron();
          } else {
            // speakeroff();
          }
        }
      });
      this.inviteClientContext.on('rejected', () => {
        // callkit.endCall();
        // cleanmedia();
        console.info('rejected');
        // self.state = 'normal';
        self.switchToNormalScreen();
      });
      this.inviteClientContext.on('failed', () => {
        // callkit.endCall();
        // cleanmedia();
        console.info('failed');
        self.state = 'normal';
        self.switchToNormalScreen();
      });
      this.inviteClientContext.on('terminated', () => {
        // callkit.endCall();
        // cleanmedia();
        console.info('terminated');
        self.state = 'normal';
        self.switchToNormalScreen();
      });
      this.inviteClientContext.on('cancel', () => {
        // callkit.endCall();
        // cleanmedia();
        console.info('cancel');
        self.state = 'normal';
        self.switchToNormalScreen();
      });
      this.inviteClientContext.on('reinvite', () => {
        // cleanmedia();
        console.info('reinvite');
      });
      this.inviteClientContext.on('referRequested', () => {
        // cleanmedia();
        console.info('referRequested');
      });
      this.inviteClientContext.on('replaced', () => {
        // cleanmedia();
        console.info('replaced');
      });
      this.inviteClientContext.on('dtmf', () => {
        // cleanmedia();
        console.info('dtmf');
      });
      this.inviteClientContext.on('SessionDescriptionHandler-created', () => {
        // cleanmedia();
        console.info('SessionDescriptionHandler-created');
      });
      this.inviteClientContext.on('directionChanged', () => {
        // cleanmedia();
        console.info('directionChanged');
      });
      this.inviteClientContext.on('trackAdded', () => {
        // cleanmedia();
        console.info('trackAdded');
      });
      this.inviteClientContext.on('bye', () => {
        // callkit.endCall();
        // cleanmedia();
        console.info('bye');
        self.state = 'normal';
        self.switchToNormalScreen();
      });
    } else {
      if (self.state === 'calling') {
        this.hangup();
        // this.currentSession.terminate();
        // self.state = 'normal';
      }

      if (self.state === 'incomming-accept') {
        this.hangup();
      }
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

  ring() {
    if (!this.ringer) {
      this.ringer = new Audio();
    }
    this.ringer.src = 'assets/audio/ringing.mp3';
    this.ringer.load();
    this.ringer.loop = true;
    this.ringer.play();
  }

  stopRing() {
    if (this.ringer) {
      this.ringer.pause();
      // delete this.ringer;
    }
  }
}
