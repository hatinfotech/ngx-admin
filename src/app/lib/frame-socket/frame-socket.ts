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
    public isReady$ = new BehaviorSubject<boolean>(false);

    protected receiverSubject = new BehaviorSubject<FrameSocketData<any>>(null);
    public receiver$ = this.receiverSubject.asObservable();

    static _frameSockets: FrameSocket[] = [];

    constructor(
        protected connection: Window,
        public id: string,
    ) {
        FrameSocket._frameSockets.push(this);
        this.on<FrameSocketData<any>>('callback').subscribe((result) => {
            console.debug('On Callback : ', result);
            this.emitCallbackSubject.next(result.data);
            // this.stateSubject.next('init-event ');
        });
        window.addEventListener('message', (event) => {
            console.debug(event);
            if (event && event.data && event.data.id == this.id) {
                this.receiverSubject.next(event.data);
            }
        });
        // window.onmessage = (e: { data: any }) => {
        //     console.debug(e);
        //     this.receiverSubject.next(e.data);
        // }
        this.init();
    }

    async init() {
        this.emit('ready', true).then(rspData => {
            console.debug(rspData);
        });
        this.on('ready').subscribe(request => {
            console.log('FrameSocket ready:', request);
            this.isReady$.next(true);
        });
        return true;
    }

    async emit<T>(event: string, data: any): Promise<T> {
        const checkpointSeq = this.seq++;
        this.connection.postMessage({ type: event === 'callback' ? 'response' : 'request', seq: checkpointSeq, event: event, data }, '*');
        const result = await this.emitCallback$.pipe(filter(rs => rs && rs.seq === checkpointSeq), take(1)).toPromise();
        if (!result || result.type == 'error') {
            throw Error(result.data);
        }
        return result.data;
    }

    static async broadcast(event: string, data: any) {
        return Promise.all(FrameSocket._frameSockets.map(frameSocket => {
            return frameSocket.emit(event, data);
        }))
    }

    on<T>(event: string): Observable<IFrameSocketResult<T>> {
        return this.receiver$.pipe(filter(request => request && request.event == event), map(request => ({
            data: request.data,
            callback: (type: string, response) => {
                this.emit('callback', { type, seq: request.seq, data: response });
            }
        })));
    }

}
