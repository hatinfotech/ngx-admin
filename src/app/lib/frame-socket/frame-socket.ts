import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';

export interface FrameSocketData<T> {
    seq: number;
    status: number;
    type: string;
    event: string;
    data: T;
}

export interface IFrameSocketResult<T> {
    data: T;
    callback?: (type: string, response: any) => void;
}

export class FrameSocket {

    protected seq = 0;
    protected emitCallbackSubject = new BehaviorSubject<FrameSocketData<any>>(null);
    public emitCallback$ = this.emitCallbackSubject.asObservable();

    protected receiverSubject = new BehaviorSubject<FrameSocketData<any>>(null);
    public receiver$ = this.receiverSubject.asObservable();

    constructor(
        protected connection: Window
    ) {
        this.on('callback').subscribe((result: IFrameSocketResult<any>) => {
            console.debug('On Callback : ', result);
            this.emitCallbackSubject.next(result.data);
            // this.stateSubject.next('init-event ');
        });
        window.onmessage = (e: { data: any }) => {
            console.debug(e);
            this.receiverSubject.next(e.data);
        }
        this.init();
    }

    async init() {
        this.emit('ready', true).then(rspData => {
            console.debug(rspData);
        });
        return true;
    }

    async emit<T>(event: string, data: T): Promise<T> {
        const checkpointSeq = this.seq++;
        this.connection.postMessage({ type: event === 'callback' ? 'response' : 'request', seq: checkpointSeq, event: event, data }, '*');
        return this.emitCallback$.pipe(filter(rs => rs && rs.seq === checkpointSeq), map(rs => rs.data), take(1)).toPromise<T>();
    }

    on<T>(event: string): Observable<IFrameSocketResult<T>> {
        return this.receiver$.pipe(filter(request => request && request.event == event), map(request => ({
            data: request.data, callback: (type: string, response) => {
                this.emit('callback', { type, seq: request.seq, data: response });
            }
        })));
    }

}
