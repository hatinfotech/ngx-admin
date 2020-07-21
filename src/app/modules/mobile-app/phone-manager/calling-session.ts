import { PhoneManager } from './phone-manager';
import * as SIP from 'sip.js';
import { Subscription, Subject } from 'rxjs';
import { User } from './user';
import { IncomingResponseMessage } from 'sip.js/lib/core';

export class CallingSession {

  public state = 'normal';
  // private stateChangedSubject = new BehaviorSubject<string>('normal');
  // stateChanged$ = this.stateChangedSubject.asObservable();
  stateChanged$ = new Subject<string>();
  private receivedSession: SIP.InviteServerContext;
  private callingSession: SIP.InviteClientContext;

  private subscriptions: Subscription[] = [];

  constructor(
    public manager: PhoneManager,
    public caller: User,
    public callee: User,
    public session: SIP.InviteServerContext | SIP.InviteClientContext,
  ) {
    this.init();
  }

  get id() {
    return this.session.id;
  }

  init() {
    if (this.session instanceof SIP.InviteServerContext) {
      this.receivedSession = this.session;
      this.initReceivedSession();
    } else if (this.session instanceof SIP.InviteClientContext) {
      this.callingSession = this.session;
      this.initCaller();
    } else {
      throw Error('Sssion type "' + typeof (this.session) + '" was not support');
    }
  }

  accept() {
    this.receivedSession.accept({sessionDescriptionHandlerOptions: {
      constraints: { audio: true, video: false },
    }});
  }

  hangup() {
    if (this.callingSession) {
      this.callingSession.terminate();
    }
    if (this.receivedSession) {
      this.receivedSession.terminate();
    }
  }

  reject() {
    if (this.receivedSession) {
      this.receivedSession.reject();
    }
  }

  destroy() {
    // try {
    //   this.hangup();
    //   this.reject();
    // } catch (e) { console.error(e); }
    setTimeout(() => {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }, 15000);
  }

  transfer() {

  }

  sendMessage() {

  }

  onNewMessage() {

  }

  onStateUpdate(callback: (state: string) => void) {
    this.subscriptions.push(this.stateChanged$.subscribe(state => {
      callback(state);
    }));
  }

  initReceivedSession() {
    // pc = session.sessionDescriptionHandler.peerConnection;
    const $this = this;
    // const session = this.session;
    // const isVideoCall = false;

    this.state = 'incoming';

    $this.session.on('trackAdded', () => {
      console.info('trackAdded');
    });

    $this.session.on('progress', () => {
      // cleanmedia();
      console.info('progress');
      this.state = 'progress';
    });
    $this.session.on('accepted', () => {
      // // Gets local tracks
      // preparemedia();

      console.info('accepted');
      this.state = 'accepted';
      const pc = $this.session.sessionDescriptionHandler['peerConnection'];

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
        $this.manager.outputMedia.srcObject = remoteStream;
        $this.manager.outputMedia.play();
        if (isVideoCall) {
          // speakeron();
        } else {
          // speakeroff();
        }
      }

      // $this.manager.onSessionStateUpdate($this, 'accepted');
      this.stateChanged$.next('accepted');
    });
    $this.session.on('rejected', () => {
      // callkit.endCall();
      // self.reject();
      console.info('rejected');
      // $this.manager.onSessionStateUpdate($this, 'rejected');
      this.state = 'rejected';
      this.stateChanged$.next('rejected');
    });
    $this.session.on('failed', () => {
      // cleanmedia();
      // callkit.endCall();
      $this.state = 'normal';
      // $this.switchToNormalScreen();
      // $this.manager.onSessionStateUpdate($this, 'failed');
      this.state = 'failed';
      this.stateChanged$.next('failed');
      console.info('failed');

    });
    $this.session.on('terminated', () => {
      // callkit.endCall();
      $this.state = 'normal';
      // $this.switchToNormalScreen();
      console.info('terminated');
      // $this.manager.onSessionStateUpdate($this, 'terminated');
      this.state = 'terminated';
      this.stateChanged$.next('terminated');
    });
    $this.session.on('cancel', () => {
      // callkit.endCall();
      $this.state = 'normal';
      // $this.switchToNormalScreen();
      console.info('cancel');
      // $this.manager.onSessionStateUpdate($this, 'cancel');
      this.state = 'cancel';
      this.stateChanged$.next('cancel');
    });
    $this.session.on('reinvite', () => {
      // cleanmedia();
      console.info('reinvite');
      // $this.manager.onSessionStateUpdate($this, 'reinvite');
    });
    $this.session.on('referRequested', () => {
      // cleanmedia();
      console.info('referRequested');
      // $this.manager.onSessionStateUpdate($this, 'referRequested');
    });
    $this.session.on('replaced', () => {
      // cleanmedia();
      console.info('replaced');
      // $this.manager.onSessionStateUpdate($this, 'replaced');
    });
    $this.session.on('dtmf', () => {
      // cleanmedia();
      console.info('dtmf');
      // $this.manager.onSessionStateUpdate($this, 'dtmf');
    });
    $this.session.on('SessionDescriptionHandler-created', () => {
      // cleanmedia();
      console.info('SessionDescriptionHandler-created');
    });
    $this.session.on('directionChanged', () => {
      // cleanmedia();
      console.info('directionChanged');
    });
    $this.session.on('trackAdded', () => {
      // cleanmedia();
      console.info('trackAdded');
    });
    $this.session.on('bye', () => {
      // callkit.endCall();
      // cleanmedia();
      $this.state = 'normal';
      // $this.switchToNormalScreen();
      // $this.manager.onSessionStateUpdate($this, 'bye');
      this.state = 'bye';
      this.stateChanged$.next('bye');
      console.info('bye');
    });
  }

  initCaller() {
    this.state = 'calling';
    const $this = this;
    this.session.on('trackAdded', () => {

    });
    const isVideoCall = false;


    this.session.on('progress', (response: IncomingResponseMessage) => {
      // cleanmedia();
      console.info('progress');
      $this.state = 'progress';


      const pc = $this.session.sessionDescriptionHandler['peerConnection'];

      const remoteStream = new MediaStream();
      if (pc.getReceivers().length > 0) {
        pc.getReceivers().forEach(function (receiver) {
          const track = receiver['track'] ? receiver['track'] : receiver;
          if (track.kind === 'audio') {
            remoteStream.addTrack(track);
          }
        });
        $this.manager.outputMedia.srcObject = remoteStream;
        $this.manager.outputMedia.play();
      }



      this.stateChanged$.next('progress');
    });
    this.session.on('accepted', () => {
      $this.state = 'accepted';
      // // Gets local tracks
      const pc = $this.session.sessionDescriptionHandler['peerConnection'];

      // // if (isVideoCall) {
      // //   const localStream = new MediaStream();
      // //   const senderPeers = pc.getSenders();
      // //   if (senderPeers.length > 0) {
      // //     senderPeers.forEach(function (receiver) {
      // //       const track = receiver['track'] ? receiver['track'] : receiver;
      // //       if (track.kind === 'video') {
      // //         localStream.addTrack(track);
      // //       }
      // //     });
      // //     $this.manager.outputMedia.srcObject = localStream;
      // //     $this.manager.outputMedia.play();
      // //   }
      // // }

      const remoteStream = new MediaStream();
      if (pc.getReceivers().length > 0) {
        pc.getReceivers().forEach(function (receiver) {
          const track = receiver['track'] ? receiver['track'] : receiver;
          if (track.kind === 'audio') {
            remoteStream.addTrack(track);
          }
        });
        $this.manager.outputMedia.srcObject = remoteStream;
        $this.manager.outputMedia.play();
        if (isVideoCall) {
          // speakeron();
        } else {
          // speakeroff();
        }
      }

      this.stateChanged$.next('accepted');
    });
    this.session.on('rejected', () => {
      $this.state = 'rejected';
      // callkit.endCall();
      // cleanmedia();
      console.info('rejected');
      this.stateChanged$.next('rejected');
      // self.state = 'normal';
      // $this.switchToNormalScreen();
    });
    this.session.on('failed', () => {
      // callkit.endCall();
      // cleanmedia();
      console.info('failed');
      $this.state = 'failed';
      this.stateChanged$.next('failed');
      // $this.switchToNormalScreen();
    });
    this.session.on('terminated', () => {
      // callkit.endCall();
      // cleanmedia();
      console.info('terminated');
      $this.state = 'normal';
      this.stateChanged$.next('terminated');
      // $this.switchToNormalScreen();
    });
    this.session.on('cancel', () => {
      // callkit.endCall();
      // cleanmedia();
      console.info('cancel');
      $this.state = 'normal';
      this.stateChanged$.next('cancel');
      // $this.switchToNormalScreen();
    });
    this.session.on('reinvite', () => {
      // cleanmedia();
      console.info('reinvite');
      this.stateChanged$.next('reinvite');
    });
    this.session.on('referRequested', () => {
      // cleanmedia();
      console.info('referRequested');
    });
    this.session.on('replaced', () => {
      // cleanmedia();
      console.info('replaced');
    });
    this.session.on('dtmf', () => {
      // cleanmedia();
      console.info('dtmf');
    });
    this.session.on('SessionDescriptionHandler-created', () => {
      // cleanmedia();
      console.info('SessionDescriptionHandler-created');
    });
    this.session.on('directionChanged', () => {
      // cleanmedia();
      console.info('directionChanged');
    });
    this.session.on('trackAdded', () => {
      // cleanmedia();
      console.info('trackAdded');


      const pc = $this.session.sessionDescriptionHandler['peerConnection'];

      const remoteStream = new MediaStream();
      if (pc.getReceivers().length > 0) {
        pc.getReceivers().forEach(function (receiver) {
          const track = receiver['track'] ? receiver['track'] : receiver;
          if (track.kind === 'audio') {
            remoteStream.addTrack(track);
          }
        });
        $this.manager.outputMedia.srcObject = remoteStream;
        $this.manager.outputMedia.play();
      }

    });
    this.session.on('bye', () => {
      // callkit.endCall();
      // cleanmedia();
      console.info('bye');
      $this.state = 'bye';
      this.stateChanged$.next('bye');
      // $this.switchToNormalScreen();
    });
  }

}
