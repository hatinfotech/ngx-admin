import { CallingSession } from './calling-session';
import { UserAgent } from './user-agent';
import * as SIP from 'sip.js';
import { User } from './user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface IPhoneContext {

  onIncomingCall(session: CallingSession): void;
  onWaitingIncomingCall(session: CallingSession): void;
  onHangup(session: CallingSession): void;
  onTerminate(session: CallingSession): void;
  onCalling(session: CallingSession): void;
  getOutputMedia(): HTMLVideoElement;

}

export class PhoneManager {

  userAgentList: UserAgent[] = [];
  callingSessionList: CallingSession[] = [];
  ringer: HTMLAudioElement;

  protected destroy$: Subject<void> = new Subject<void>();
  state = 'normal';

  constructor(
    public context: IPhoneContext,
  ) {
    this.ringer = new Audio();
  }

  get outputMedia(): HTMLElement | any {
    return this.context.getOutputMedia();
  }

  get moreThanOneSession() {
    return this.callingSessionList.length > 1;
  }

  register(user: User): UserAgent {
    const ua = this.userAgentList.filter(u => u.user.id === user.id);
    if (ua.length > 0) {
      ua[0].register();
      return ua[0];
    } else {
      const newUA = new UserAgent(user, this);
      if (!newUA.register()) {
        return null;
      }
      this.userAgentList.push(newUA);
      newUA.stateChanged$.subscribe(stateInfo => {
        if (stateInfo.state === 'invited') {
          this.state = 'incoming';
          this.callingSessionList.push(stateInfo.session);
          this.onInvite(stateInfo.session);
          stateInfo.session.onStateUpdate(state => {
            if (state === 'terminated') {
              this.state = 'normal';
              this.onTerminate(stateInfo.session);
              this.destroySession(stateInfo.session);
            }
          });
        }
      });
      return newUA;
    }
  }

  unregister(user: User): boolean {
    const ua = this.userAgentList.filter(u => u.user.id === user.id);
    if (ua.length > 0) {
      ua[0].unregister();
      return true;
    }
    return false;
  }

  call(callee: User, userAgent?: UserAgent) {
    if (!userAgent) {
      userAgent = this.userAgentList.filter(f => f.activated)[0];
    }
    if (!userAgent) {
      throw Error('No registered agent or agents not free');
    }
    this.state = 'calling';
    const inviteSession = userAgent.agent.invite(callee.phone, {
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
    const session = new CallingSession(this, userAgent.user, callee, inviteSession);
    this.callingSessionList.push(session);

    session.onStateUpdate(state => {
      if (state === 'terminated') {
        this.state = 'normal';
        this.onTerminate(session);
      }
    });

    this.context.onCalling(session);
    return session;
  }

  accept(session?: CallingSession): boolean {
    if (!session) {
      const incomingSessions = this.callingSessionList.filter(f => f.state === 'incoming');
      session = incomingSessions[0];
    }
    if (session) {
      this.state = 'accepted';
      session.accept();
      return true;
    }
    return false;
  }

  reject(session?: CallingSession): boolean {
    if (!session) {
      const incomingSessions = this.callingSessionList.filter(f => f.state === 'incoming');
      session = incomingSessions[0];
    }
    if (session) {
      session.reject();
      this.destroySession(session);
      this.state = 'normal';
      return true;
    }
    return false;
  }

  hangup(session?: CallingSession): boolean {
    if (!session) {
      const incomingSessions = this.callingSessionList.filter(f => f.state === 'accepted' || f.state === 'progress');
      session = incomingSessions[0];
    }
    if (session) {
      session.hangup();
      this.destroySession(session);
      this.state = 'normal';
      return true;
    }
    return false;
  }

  destroySession(session: CallingSession) {
    session.destroy();
    this.callingSessionList = this.callingSessionList.filter(f => f.session.id !== session.session.id);
  }

  onInvite(session: CallingSession): void {
    if (this.moreThanOneSession) {
      this.context.onWaitingIncomingCall(session);
      this.waitForProgressed().then(rs => {
        if (rs && session.state === 'incoming') {
          this.context.onIncomingCall(session);
        } else {
          this.destroySession(session);
        }
      });
    } else {
      this.context.onIncomingCall(session);
    }
  }

  onTerminate(session: CallingSession): void {
    this.context.onTerminate(session);
  }

  async waitForProgressed(): Promise<boolean> {
    for (let i = 0; i < 40; i++) {
      if (await new Promise<boolean>(resolve => {
        setTimeout(() => {
          if (this.moreThanOneSession) resolve(false); else resolve(true);
        }, 1000);
      })) return true;
    }
    return false;
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
