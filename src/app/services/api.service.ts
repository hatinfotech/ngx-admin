import { Injectable } from '@angular/core';
import {
  HttpClient, HttpResponse, HttpErrorResponse,
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType,
} from '@angular/common/http';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map, retry, catchError, switchMap, take, filter, delay, concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../modules/dialog/showcase-dialog/showcase-dialog.component';
import { environment } from '../../environments/environment';
import { EmployeeModel } from '../models/employee.model';
import { LoginDialogComponent } from '../modules/auth/login/login-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from 'angular2-toaster';
import { FileModel, FileStoreModel } from '../models/file.model';
export class ApiToken {
  access_token?: string;
  refresh_token?: string;
}

declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public baseApiUrl = environment.api.baseUrl;
  protected session = '';
  public get token(): ApiToken {
    const tokenString = localStorage.getItem('auth_app_token');
    if (tokenString) {
      const tokenParse: { createdAt: string, name: string, ownerStrategyName: string, value: string } = JSON.parse(tokenString);
      return JSON.parse(tokenParse.value);
    }
    return null;
  }
  public nbToken: NbAuthToken;

  private unauthoriziedSubject: BehaviorSubject<{ previousUrl: string }>
    = new BehaviorSubject<{ previousUrl: string }>(null);
  public unauthorizied$: Observable<{ previousUrl: string }> = this.unauthoriziedSubject.asObservable();

  constructor(
    public _http: HttpClient,
    public authService: NbAuthService,
    public router: Router,
    public dialogService: NbDialogService,
    public translate: TranslateService,
    public toastService: NbToastrService,
  ) {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthToken) => {
        if (token.isValid()) {
          this.setToken(token);
        }
      });

    this.authService.getToken().subscribe((token: NbAuthToken) => {
      if (token.isValid()) {
        this.setToken(token);
      }
    });
  }

  getBaseApiUrl() {
    return this.baseApiUrl;
  }

  setToken(token: NbAuthToken) {
    if (token) {
      this.nbToken = token;
      // this.token = JSON.parse(token.toString());
      if (this.token) {
        this.setAccessToken(this.token['access_token']);
        this.setRefreshToken(this.token['refresh_token']);
      }
    }
  }

  storeSession(session: string) {
    localStorage.setItem('api_session', session);
  }

  getSession(): string {
    return localStorage.getItem('api_session');
  }

  setAccessToken(token: string) {
    localStorage.setItem('api_access_token', token || '');
  }

  setRefreshToken(token: string) {
    localStorage.setItem('api_refresh_token', token || '');
  }

  getAccessToken(): string {
    return localStorage.getItem('api_access_token');
  }

  getRefreshToken(): string {
    return localStorage.getItem('api_refresh_token');
  }

  clearToken() {
    this.setAccessToken(null);
  }

  buildApiUrl(path: string, params?: Object) {
    const token = (params && params['token']) || this.getAccessToken();
    let paramsStr = '';

    if (typeof params === 'undefined') params = {};
    if (Array.isArray(params['id'])) {
      params['id'].forEach((item, index) => {
        params['id' + index] = encodeURIComponent(item);
      });
      delete params['id'];
    } else if (params['id']) {
      params['id0'] = params['id'];
      delete params['id'];
    }

    if (params) {
      paramsStr += this.buildParams(params);
    }
    if (token) {
      paramsStr += (paramsStr ? '&' : '') + 'token=' + token;
    }
    if (/^http/i.test(path)) {
      return `${path}?${paramsStr}`;
    }
    if (/^\/v\d+/i.test(path)) {
      const baseUrl = this.baseApiUrl.replace(/\/v\d+.*/, '');
      return `${baseUrl}${path}?${paramsStr}`;
    }
    return `${this.baseApiUrl}${path}?${paramsStr}`;
  }

  buildParams(params: Object): string {
    let httpParams = '';
    let first = true;
    Object.entries(params).forEach(([key, value]) => {
      httpParams += `${!first ? '&' : ''}${key}=${typeof value !== 'undefined' ? encodeURIComponent(value) : ''}`;
      first = false;
    });
    return httpParams;
  }

  /** Restful api getting request */
  get<T>(enpoint: string, params: any, success: (resources: T) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: T | HttpErrorResponse) => void) {
    const obs = this._http.get<T>(this.buildApiUrl(enpoint, params))
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        if (complete) complete(e);
        return this.handleError(e, params['silent']);
      }))
      .subscribe((resources: T) => {
        success(resources);
        if (complete) complete(resources);
        obs.unsubscribe();
      });
  }

  /** Restful api getting request - promise */
  async getPromise<T>(enpoint: string, params?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const obs = this._http.get<T>(this.buildApiUrl(enpoint, params))
        .pipe(retry(0), catchError(e => {
          reject(e);
          return this.handleError(e, params['silent']);
        }))
        .subscribe((resources: T) => {
          resolve(resources);
          obs.unsubscribe();
        });
    });

  }

  /** Restful api getting request - promise */
  async getProgress<T>(enpoint: string, params: any, progress: (loaded: number, total: number) => void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const obs = this._http.get<T>(this.buildApiUrl(enpoint, params), { reportProgress: true, observe: "events" })
        .pipe(
        // map(event2 => {
        //   // console.log(event);
        //   // if (event2 instanceof ProgressEvent) {
        //   //   console.log("download progress");
        //   // }
        //   return event2;
        // }),
        // retry(0),
        // catchError(e => {
        //   // reject(e);
        //   return this.handleError(e, params['silent']);
        // }),
        // take(1)
      )
        // .toPromise().catch(e => {
        //   this.handleError(e, params['silent']);
        //   return Promise.reject(e);
        // });
        .subscribe((event: any) => {
          if (event.type == HttpEventType.DownloadProgress) {
            console.log('Download: ' + event.loaded / event.total * 100 + '%');
            progress(event.loaded, event.total);
          }
          if (event instanceof HttpResponse) {
            resolve(event.body);
            obs.unsubscribe();
          }
        }, err => {
          this.handleError(err, params['silent']);
          reject(err);
        });
    });

  }

  /** Restful api getting request - promise */
  getObservable<T>(enpoint: string, params?: any): Observable<HttpResponse<T>> {

    return this._http.get<T>(this.buildApiUrl(enpoint, params), { observe: 'response' })
      .pipe(
        retry(0),
        catchError(e => {
          return this.handleError(e, params['silent']);
        }));
  }

  /** Restful api post request */
  post<T>(enpoint: string, params: any, resource: T, success: (newResource: T) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: T | HttpErrorResponse) => void) {
    const obs = this._http.post(this.buildApiUrl(enpoint, params), resource)
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        if (complete) complete(e);
        return this.handleError(e, params['silent']);
      }))
      .subscribe((newResource: T) => {
        success(newResource);
        if (complete) complete(newResource);
        obs.unsubscribe();
      });
  }

  /** Restful api post request */
  postPromise<T>(enpoint: string, params: any, resource: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const obs = this._http.post(this.buildApiUrl(enpoint, params), resource)
        .pipe(retry(0), catchError(e => {
          reject(e);
          return this.handleError(e, params['silent']);
        }))
        .subscribe((newResource: T) => {
          resolve(newResource);
          obs.unsubscribe();
        });
    });
  }

  /** Restful api put request */
  put<T>(enpoint: string, params: any, resource: T, success: (newResource: T) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: T | HttpErrorResponse) => void) {
    const obs = this._http.put(this.buildApiUrl(enpoint, params), resource)
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        if (complete) complete(e);
        return this.handleError(e, params['silent']);
      }))
      .subscribe((newResource: T) => {
        success(newResource);
        if (complete) complete(newResource);
        obs.unsubscribe();
      });
  }

  /** Restful api put request */
  putPromise<T>(enpoint: string, params: any, resource: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const obs = this._http.put(this.buildApiUrl(enpoint, params), resource)
        .pipe(retry(0), catchError(e => {
          reject(e);
          return this.handleError(e, params['silent']);
        }))
        .subscribe((newResource: T) => {
          resolve(newResource);
          obs.unsubscribe();
        });
    });
  }

  putProgress<T>(enpoint: string, params: any, resource: T, progress: (progressInfo: { progress: number, loaded: number, total: number }) => void): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // const obs = this._http.put(this.buildApiUrl(enpoint, params), resource, { reportProgress: true, responseType: 'text', observe: 'response' })
      //   .pipe(
      //     concatMap((event) => {
      //       console.log(event);
      //       return of(event);
      //     })
      //   )
      //   .subscribe({
      //     next(chunck) { console.log('got chunck', chunck); },
      //     error(err) { console.error('something wrong occurred: ' + err); },
      //     complete() { console.log('done'); }
      //   });
      params.reportProgress = true;
      var jsonResponse: any = '', lastResponseLen = false;
      $.ajax({
        type: 'PUT',
        url: this.buildApiUrl(enpoint, params),
        data: JSON.stringify(resource),
        xhrFields: {
          onprogress: function (e) {
            var thisResponse, response = e.currentTarget.response;
            if (lastResponseLen === false) {
              thisResponse = response;
              lastResponseLen = response.length;
            } else {
              thisResponse = response.substring(lastResponseLen);
              lastResponseLen = response.length;
            }

            const thisResponses = thisResponse.split('\n');
            for (const chunkReponse of thisResponses) {
              if (chunkReponse) {
                try {
                  jsonResponse = JSON.parse(chunkReponse);
                } catch (err) {
                  console.log('json fail: ', chunkReponse);
                  console.error(err);
                }
                if (!Array.isArray(jsonResponse)) {
                  progress(jsonResponse);
                }
              }
            }

            // console.log('Processed ' + jsonResponse.count + ' of ' + jsonResponse.total);
            // console.log('width', jsonResponse.progress + '%')
            // console.log(jsonResponse.progress + '%');
          }
        },
        success: (text) => {
          console.log('done!');
          console.log('Process completed successfully');
          // $(".progress-bar").css({
          //   width: '100%',
          //   backgroundColor: 'green'
          // });
          resolve(text);
        },
        complete: (text) => {
          // console.log(text);
          resolve(jsonResponse);
        }
      });

    });
  }

  postPut<T>(method: string, enpoint: string, params: any, resource: T, success: (newResource: T) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: T | HttpErrorResponse) => void) {
    if (method === 'POST') {
      this.post<T>(enpoint, params, resource, success, error, complete);
    } else if (method === 'PUT') {
      this.put<T>(enpoint, params, resource, success, error, complete);
    }
  }

  /** Restful api delete request */
  delete(enpoint: string, idsOrParams: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    let apiUrl = '';
    if (Array.isArray(idsOrParams)) {
      const params = {};
      (idsOrParams as Array<any>).forEach((item, index) => {
        params['id' + index] = encodeURIComponent(item);
      });
      apiUrl = this.buildApiUrl(`${enpoint}`, params);
    } else if (typeof idsOrParams === 'object') {
      apiUrl = this.buildApiUrl(enpoint, idsOrParams);
    }
    const obs = this._http.delete(apiUrl)
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        if (complete) complete(e);
        return this.handleError(e, idsOrParams['silent']);
      }))
      .subscribe((resp) => {
        success(resp);
        if (complete) complete(resp);
        obs.unsubscribe();
      });
  }

  deletePromise(enpoint: string, id: string | string[] | { [key: string]: string }) {
    let apiUrl = '';
    if (id === null) {
      id = [];
    }
    if (Array.isArray(id)) {
      const params = {};
      id.forEach((item, index) => {
        params['id' + index] = encodeURIComponent(item);
      });
      apiUrl = this.buildApiUrl(`${enpoint}`, params);
    } else if (typeof id === 'object') {
      apiUrl = this.buildApiUrl(enpoint, id);
    }
    return this._http.delete(apiUrl)
      .pipe(retry(0), take(1), catchError(e => {
        return this.handleError(e, id['silent']);
      })).toPromise();
  }

  getEmployees(): Observable<EmployeeModel[]> {
    return this._http.get(this.buildApiUrl('/hr/employees'))
      .pipe(map((data: any[]) => data.map(item => new EmployeeModel(item))));
  }

  logout(sucess, error) {
    this._http.get<HttpResponse<any>>(this.buildApiUrl('/user/logout'), { observe: 'response' })
      .subscribe((resp: HttpResponse<any>) => {
        sucess(resp.body);
      }, (e: HttpErrorResponse) => {
        if (error) error(e);
      });
  }

  private takeUltilCount = {};
  private takeUltilPastCount = {};
  async takeUntil(context: string, delay: number, callback?: () => void): Promise<boolean> {
    const result = new Promise<boolean>(resolve => {
      if (delay === 0) {
        resolve(true);
        return;
      }
      if (!this.takeUltilCount[context]) this.takeUltilCount[context] = 0;
      this.takeUltilCount[context]++;
      ((takeCount) => {
        setTimeout(() => {
          this.takeUltilPastCount[context] = takeCount;
        }, delay);
      })(this.takeUltilCount[context]);
      setTimeout(() => {
        if (this.takeUltilPastCount[context] === this.takeUltilCount[context]) {
          resolve(true);
        }
      }, delay);
    });
    if (callback) {
      callback();
    }
    return result;
  }

  /** Anti duplicate action */
  private takeOncePastCount = {};
  private takeOnceCount = {};
  async takeOnce(context: string, delay: number): Promise<boolean> {
    const result = new Promise<boolean>(resolve => {
      if (this.takeOncePastCount[context] === this.takeOnceCount[context]) {
        resolve(true);
      }
      if (!this.takeOnceCount[context]) { this.takeOnceCount[context] = 0; }
      this.takeOnceCount[context]++;
      ((takeCount) => {
        setTimeout(() => {
          this.takeOncePastCount[context] = takeCount;
        }, delay);
      })(this.takeOnceCount[context]);
      setTimeout(() => {
        if (this.takeOncePastCount[context] === this.takeOnceCount[context]) {
          this.takeOncePastCount[context] = null;
          this.takeOnceCount[context] = null;
        }
      }, delay);
    });
    return result;
  }

  onUnauthorizied() {
    this.takeUntil('ultil_unauthorize', 5000).then(() => {
      // Fix stress requests
      this.getPromise('/user/login/info', {}).then(rs => {
        console.log('refresh token success');
      }).catch(err => {
        console.log('refresh token no success');
        this.unauthoriziedSubject.next({
          previousUrl: this.router.url,
        });
        if (LoginDialogComponent.instances.length === 0) {
          this.dialogService.open(LoginDialogComponent);
        }
      });
    });
  }

  handleError(e: HttpErrorResponse, silent?: boolean) {
    if (e.status === 401 && !silent) {
      console.warn('API: Bạn chưa đăng nhập');
    }
    if (e.status === 405) {
      if (!silent) {
        this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu quyền truy cập', {
          status: 'danger',
          duration: 15000,
        });
      }
    }
    if (e.status === 406) {
      if (!silent) this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'API: Truy cập không tin cậy',
          content: this.joinLogs(e),
          actions: [
            {
              label: 'Đăng nhập lại',
              icon: 'back',
              status: 'info',
              action: () => {
                this.unauthoriziedSubject.next({
                  previousUrl: this.router.url,
                });
                // this.router.navigate(['/auth/login']);
                if (LoginDialogComponent.instances.length === 0) {
                  this.dialogService.open(LoginDialogComponent);
                }
              },
            },
          ],
        },
      });
    }
    if (e.status === 403) {
      if (!silent) {
        this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu không có quyền', {
          status: 'danger',
          duration: 15000,
        });
      }
    }
    // if (e.status === 404) {
    if ([601, 404, 400].indexOf(e.status) > -1) {
      if (!silent) {
        this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu không thể thực thi', {
          status: 'danger',
          duration: 15000,
        });
      }
    }
    if ([422].indexOf(e.status) > -1) {
      if (!silent) {
        this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu chưa được xử lý', {
          status: 'danger',
          duration: 15000,
        });
      }
    }
    let errorMessage = '';
    if (e.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${e.error.message}`;
    } else {
      if (e.error && e.error.logs) {
        const errorLogs = e.error.logs[0];
        errorMessage = `Error Code: ${e.status}\nMessage: ${errorLogs}`;
      } else {
        // server-side error
        errorMessage = `Error Code: ${e.status}\nMessage: ${e.message}`;
      }
    }
    console.info(errorMessage);
    return throwError(errorMessage);
  }

  joinLogs(e: HttpErrorResponse, mode?: string): string {
    if (e.error['logs']) {
      if (e.error['logs'].length > 1) {
        if (!mode || mode === 'dialog') {
          return e.error['logs']?.length > 1 ? ('<ol><li>' + e.error['logs'].map((log: string) => this.textTransform(log, 'head-title')).join('</li><li>') + '</li></ol>') : e.error['logs'][0];
        } else {
          return e.error['logs']?.length > 1 ? (e.error['logs'].map((log: string) => this.textTransform(log, 'head-title')).join(", ")) : e.error['logs'][0];
        }
      }
      if (e.error['logs'].length === 1) {
        return e.error['logs'].map((log: string) => this.textTransform(log, 'head-title'))[0];
      }
      return e.message;
    }
    return '';
  }

  textTitleCase(text: string) {
    const sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    document.write(sentence.join(' '));
    return sentence.join(' ');
  }

  textTransform(text: string, transform: 'title' | 'upper' | 'lower' | 'head-title') {
    switch (transform) {
      case 'title':
        return this.textTitleCase(text);
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'head-title':
        return text.replace(/^./, text.charAt(0).toUpperCase());
      default: return text;
    }
  }

  async getAvailableFileStores(option?: { weight?: number, limit?: number }) {
    return this.getPromise<FileStoreModel[]>('/file/file-stores', { filter_Type: 'REMOTE', sort_Weight: 'asc', eq_IsAvailable: true, eq_IsUpload: true, requestUploadToken: true, weight: option?.weight, limit: option?.limit || 1 });
  }

  uploadPromise(enpoint: string, params: any, resource: FormData): Observable<HttpEvent<any>> {

    const req = new HttpRequest('POST', this.buildApiUrl(enpoint, params), resource, {
      reportProgress: true,
      responseType: 'json'
    });

    return this._http.request(req).pipe(catchError(e => {
      return this.handleError(e, params.silent);
    }));
  }

  async uploadFileByLink(link: string, fileName?: string, tag?: string, option?: { weight: number }): Promise<FileModel> {
    return this.getAvailableFileStores({ weight: option?.weight || 0 }).then(rs => rs[0]).then(fileStore => {
      return this.postPromise(fileStore.Path + '/v3/file/files', { token: fileStore.UploadToken, createFromLink: true }, [
        {
          RemoteLink: link,
          FileName: fileName,
          Tag: tag,
        }
      ]).then(rs => rs[0]);
    });
  };

  async uploadFileData(formData: FormData, progress?: (event: HttpEvent<any>) => void, option?: { weight: number }): Promise<FileModel> {
    return new Promise<FileModel>((resolve, reject) => {
      this.getAvailableFileStores({ weight: option?.weight || 0 }).then(rs => rs[0]).then(fileStore => {

        this.uploadPromise(fileStore.Path + '/v3/file/files', { token: fileStore.UploadToken }, formData).subscribe(
          event => {
            console.log('Upload prgress', event);
            if (progress) progress(event);
            if (event.type === HttpEventType.UploadProgress) {
            } else if (event instanceof HttpResponse) {
              resolve(new FileModel(event.body[0]));
            }
          },
          err => {
            console.log('Upload error', err);
          },
        );
      });

    });
  }
}

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  constructor(
    protected authService: NbAuthService,
    protected apiService: ApiService,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log('Http intercept: ', req.url);

    if (!/\/v\d+\//i.test(req.url) || /\/v\d+\/user\/login|register/i.test(req.url)) {
      return next.handle(req);
    }

    return this.authService.isAuthenticated().pipe(switchMap(isAuth => {
      if (!isAuth) {
        // console.log(`Live check authtication status: ${isAuth}`);
        return this.refreshToken(req, next);
      } else {

        return next.handle(req).pipe(catchError(error2 => {
          if (/\/v\d+\/user\/login|register/i.test(req.url)) {
            this.apiService.onUnauthorizied();
            return next.handle(error2);
          }
          if (error2.status !== 401) {
            // return next.handle(error2);
            return throwError(error2);
          }
          return this.refreshToken(req, next);
        }));

      }
    }));

  }

  refreshToken(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Refresh token...');
    if (this.refreshTokenInProgress) {
      console.log('Refresh token in progress');
      return this.refreshTokenSubject
        .pipe(filter(result => result === true),
          take(1), switchMap(() => this.continueRequest(req, next, this.apiService.token && this.apiService.token.access_token)));
    }

    this.refreshTokenInProgress = true;
    // console.log('Refresh token start');

    return this.authService.refreshToken('email', { token: this.apiService.token }).pipe(switchMap(authResult => {

      this.refreshTokenInProgress = false;
      if (authResult.isSuccess) {
        this.apiService.setToken(authResult.getToken());
        this.refreshTokenSubject.next(true);
        console.log('Refresh token success');
        return this.continueRequest(req, next, this.apiService.token && this.apiService.token.access_token);
      }
      this.apiService.onUnauthorizied();
      return throwError({ status: 401, error: 'AutRefresh token fail' });

    }), catchError((error2: HttpErrorResponse) => {
      this.refreshTokenInProgress = false;
      console.log(error2);
      return throwError(error2);
    }));
  }

  continueRequest(req: HttpRequest<any>, next: HttpHandler, accessToken: string) {
    return next.handle(req.clone({
      url: accessToken ? req.url.replace(/token=([^\/=\?&]+)/, `token=${accessToken}`) : req.url,
    }));
  }
}
