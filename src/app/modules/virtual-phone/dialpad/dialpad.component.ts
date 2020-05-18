import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as SIP from 'sip.js';
import { VirtualPhoneService } from '../virtual-phone.service';

@Component({
  selector: 'ngx-dialpad',
  templateUrl: './dialpad.component.html',
  styleUrls: ['./dialpad.component.scss'],
})
export class DialpadComponent implements OnInit, AfterViewInit {

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

  constructor(
    private virtualPhoneService: VirtualPhoneService,
  ) {

  }

  ngOnInit() {
    const self = this;
    this.userAgent = new SIP.UA({
      uri: '101@test.probox.vn',
      register: true,
      transportOptions: {
        wsServers: ['wss://s6.probox.vn:7443'],
      },
      authorizationUser: '101',
      password: 'mtsg@513733',
    });

    this.userAgent.on('invite', (callReceiveSession) => {
      self.inviteServerContext = callReceiveSession;

      // callkit.receiveCall("David Marcus");
      self.state = 'incomming';
      this.partnerName = self.inviteServerContext.remoteIdentity.displayName;
      this.partnerNumber = self.inviteServerContext.remoteIdentity.uri.user;
      this.ring();
      this.virtualPhoneService.hadIncommingCall({ state: self.state, partnerName: this.partnerName, partnerNumber: this.partnerNumber });
      self.receiveCallEventConfig(this.inviteServerContext);
      // console.info('!!! accept call manula by call fucntion : acceptcall()');
      // session.accept();
    });
  }

  ngAfterViewInit() {
    this.remoteVideo = document.getElementById('remoteVideo');
    this.localVideo = document.getElementById('localVideo');
    this.ringer = new Audio();
  }

  receiveCallEventConfig(receiveCallSession: SIP.InviteServerContext) {
    // pc = session.sessionDescriptionHandler.peerConnection;
    const self = this;
    // const session = receiveCallSession;
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
      self.partnerName = this.phonenumber;
      self.partnerNumber = this.phonenumber;

      this.virtualPhoneService.hadIncommingCall({ state: self.state, partnerName: this.partnerName, partnerNumber: this.partnerNumber });

      const isVideoCall = false;
      // const currentSession = this.inviteClientContext = this.userAgent.invite(this.phonenumber, {
      this.inviteClientContext = this.userAgent.invite(this.phonenumber, {
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
    if (this.state === 'calling') {
      this.inviteClientContext.terminate();
    }
    if (this.state === 'incomming' || this.state === 'incomming-accept') {
      this.inviteServerContext.terminate();
    }
    this.state = 'normal';
    this.switchToNormalScreen();
    this.virtualPhoneService.hadIncommingCall({ state: this.state });
  }

  reject() {
    this.inviteServerContext.reject();
    this.state = 'normal';
    this.switchToNormalScreen();
    this.virtualPhoneService.hadIncommingCall({ state: this.state });
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
    this.stopRing();
    this.inviteServerContext.accept();
    this.state = 'incomming-accept';
    this.virtualPhoneService.hadIncommingCall({ state: this.state, partnerName: this.partnerName, partnerNumber: this.partnerNumber });
  }

  switchScreen(screen: string) {

  }

  ring() {
    // this.ringer = new Audio();
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
