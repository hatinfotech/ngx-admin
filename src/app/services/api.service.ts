import { Injectable } from '@angular/core';
import {
  HttpClient, HttpResponse, HttpErrorResponse,
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent,
} from '@angular/common/http';
import { NbAuthService, NbAuthToken } from '@nebular/auth';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, retry, catchError, switchMap, take, filter, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../modules/dialog/showcase-dialog/showcase-dialog.component';
import { environment } from '../../environments/environment';
import { EmployeeModel } from '../models/employee.model';
import { LoginDialogComponent } from '../modules/auth/login/login-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ToasterService } from 'angular2-toaster';
export class ApiToken {
  access_token?: string;
  refresh_token?: string;
}

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
    // private commonService: CommonService,
    // private activatedRoute: ActivatedRouteSnapshot,
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

    // this.autoRefeshToken();
    // setInterval(() => {
    //   this.autoRefeshToken();
    // }, 60000);
  }

  // public tokenExpired(token: string) {
  //   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
  //   return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  // }

  // async refreshToken() {
  //   return this.authService.refreshToken('email', { token: this.token }).pipe(take(1)).toPromise().then(authResult => {

  //     // this.refreshTokenInProgress = false;
  //     if (authResult.isSuccess) {
  //       this.setToken(authResult.getToken());
  //       // this.refreshTokenSubject.next(true);
  //       console.log('Refresh token success');
  //       return authResult;
  //       // return this.continueRequest(req, next, this.apiService.token && this.apiService.token.access_token);
  //     }
  //     this.onUnauthorizied();
  //     return false;

  //   }, catchError((error2: HttpErrorResponse) => {
  //     // this.refreshTokenInProgress = false;
  //     console.log(error2);
  //     return throwError(error2);
  //   }));
  // }

  // async autoRefeshToken() {
  //   const expiry = (JSON.parse(atob(this.getAccessToken().split('.')[1]))).exp;
  //   if ((Math.floor((new Date).getTime() / 1000)) >= expiry - 10) {
  //     return this.refreshToken();
  //   }
  //   return true;
  // }

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
    // this.refreshToken(() => { });
    const token = (params && params['token']) || this.getAccessToken();
    let paramsStr = '';

    if (typeof params === 'undefined') params = {};
    // const _idParams = {};
    if (Array.isArray(params['id'])) {
      // const idParam = {};
      params['id'].forEach((item, index) => {
        params['id' + index] = encodeURIComponent(item);
      });
      delete params['id'];
      // url = this.buildApiUrl(`${enpoint}`, params);
    } else if (params['id']) {
      // enpoint += `/${params['id']}`;
      // url = this.buildApiUrl(enpoint, params);
      params['id0'] = params['id'];
      delete params['id'];
    }
    //  else {
    //   // url = this.buildApiUrl(enpoint, params);
    // }

    if (params) {
      paramsStr += this.buildParams(params);
    }
    if (token) {
      paramsStr += (paramsStr ? '&' : '') + 'token=' + token;
    }
    if (/^http/i.test(path)) {
      return `${path}?${paramsStr}`;
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

  // refreshToken(success: () => void, error?: () => void) {
  //   this.authService.isAuthenticatedOrRefresh().subscribe(result => {
  //     console.info(result);
  //     success();
  //   });
  // }

  /** Restful api getting request */
  get<T>(enpoint: string, params: any, success: (resources: T) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: T | HttpErrorResponse) => void) {
    // this.authService.isAuthenticatedOrRefresh().subscribe(result => {
    //   if (result) {
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
    // } else {
    //   this.onUnauthorizied();
    // }
    // });
  }

  /** Restful api getting request - promise */
  async getPromise<T>(enpoint: string, params?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // this.authService.isAuthenticatedOrRefresh().subscribe(result => {
      //   if (result) {
      const obs = this._http.get<T>(this.buildApiUrl(enpoint, params))
        .pipe(retry(0), catchError(e => {
          reject(e);
          return this.handleError(e, params['silent']);
        }))
        .subscribe((resources: T) => {
          resolve(resources);
          obs.unsubscribe();
        });
      // } else {
      //   this.onUnauthorizied();
      // }
      // });
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




    // try {
    //   this.authService.isAuthenticatedOrRefresh().toPromise().then().catch();
    //   return this._http.get<T>(this.buildApiUrl(enpoint, params), { observe: 'response' })
    //     .pipe(
    //       retry(0),
    //       catchError(e => {
    //         return this.handleError(e, params['silent']);
    //       }));
    // } catch (e) {
    //   this.handleError(e, params['silent']);
    // }
    // return await new Promise<Observable<HttpResponse<T>>>((resolve, reject) => {
    //   this.authService.isAuthenticatedOrRefresh().subscribe(result => {
    //     if (result) {
    //       const obs = this._http.get<T>(this.buildApiUrl(enpoint, params), { observe: 'response' })
    //         .pipe(
    //           retry(0),
    //           catchError(e => {
    //           reject(e);
    //           return this.handleError(e, params['silent']);
    //         }));
    //         resolve(obs);
    //     } else {
    //       this.onUnauthorizied();
    //     }
    //   });
    // });

  }

  // getAsObservable<T>(enpoint: string, params: any, error?: (e: HttpErrorResponse) => void): Observable<T> {
  //   let id: string;
  //   if (Array.isArray(params['id'])) {
  //     id = params['id'].join('-');
  //     enpoint += `/${id}`;
  //     delete params['id'];
  //   } else if (params['id']) {
  //     id = params['id'];
  //     enpoint += `/${id}`;
  //   }
  //   return this._http.get<T>(this.buildApiUrl(enpoint, params))
  //     .pipe(retry(0), catchError(e => {
  //       if (error) error(e);
  //       return this.handleError(e);
  //     }));
  // }

  /** Restful api post request */
  post<T>(enpoint: string, params: any, resource: T, success: (newResource: T) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: T | HttpErrorResponse) => void) {
    // this.authService.isAuthenticatedOrRefresh().subscribe(result => {
    //   if (result) {
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
    //   } else {
    //     this.onUnauthorizied();
    //   }
    // });
  }

  /** Restful api post request */
  postPromise<T>(enpoint: string, params: any, resource: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // this.authService.isAuthenticatedOrRefresh().subscribe(result => {
      //   if (result) {
      const obs = this._http.post(this.buildApiUrl(enpoint, params), resource)
        .pipe(retry(0), catchError(e => {
          reject(e);
          return this.handleError(e, params['silent']);
        }))
        .subscribe((newResource: T) => {
          resolve(newResource);
          obs.unsubscribe();
        });
      //   } else {
      //     this.onUnauthorizied();
      //   }
      // });
    });
  }

  /** Restful api put request */
  put<T>(enpoint: string, params: any, resource: T, success: (newResource: T) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: T | HttpErrorResponse) => void) {
    // this.authService.isAuthenticatedOrRefresh().subscribe(result => {
    //   if (result) {
    // let url = '';
    // if (Array.isArray(params)) {
    //   const _params = {};
    //   params.forEach((item, index) => {
    //     _params['id' + index] = encodeURIComponent(item);
    //   });
    //   url = this.buildApiUrl(`${enpoint}`, _params);
    // } else {
    //   this.buildApiUrl(`${enpoint}/${params}`);
    // }
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
    //   } else {
    //     this.onUnauthorizied();
    //   }
    // });
  }

  /** Restful api put request */
  putPromise<T>(enpoint: string, params: any, resource: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // this.authService.isAuthenticatedOrRefresh().subscribe(result => {
      //   if (result) {
      const obs = this._http.put(this.buildApiUrl(enpoint, params), resource)
        .pipe(retry(0), catchError(e => {
          reject(e);
          return this.handleError(e, params['silent']);
        }))
        .subscribe((newResource: T) => {
          resolve(newResource);
          obs.unsubscribe();
        });
      //   } else {
      //     this.onUnauthorizied();
      //   }
      // });
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
    // this.authService.isAuthenticatedOrRefresh().subscribe(result => {
    //   if (result) {
    let apiUrl = '';
    if (Array.isArray(idsOrParams)) {
      // const _id = id.join(encodeURIComponent('-'));
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
    //   } else {
    //     this.onUnauthorizied();
    //   }
    // });
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
        // const session = resp.headers.get('session');
        // if (session) {
        //   this.storeSession(session);
        // }
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
        // if (callback) callback(); else return;
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
          // callback();
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
      // resolve(true);
      // if (delay === 0) {
      //   resolve(true);
      //   return;
      // }
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
          // resolve(true);
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
      // this.authService.isAuthenticated().subscribe(isAuth => {
      // if (!isAuth) {
      // this.router.navigate(['/auth/login']);
      // }
      // });
    });
  }

  handleError(e: HttpErrorResponse, silent?: boolean) {
    if (e.status === 401 && !silent) {
      console.warn('API: Bạn chưa đăng nhập');
      // this.router.navigate(['/auth/login']);
      // this.onUnauthorizied();
    }
    if (e.status === 405) {
      // if (!silent) this.dialogService.open(ShowcaseDialogComponent, {
      //   context: {
      //     title: 'Yêu cầu quyền truy cập',
      //     content: this.joinLogs(e),
      //     actions: [
      //       {
      //         label: 'Trở về',
      //         icon: 'back',
      //         status: 'info',
      //         action: () => { },
      //       },
      //     ],
      //   },
      // });
      if (!silent) {
        this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu quyền truy cập', {
          status: 'danger',
          // duration: 10000,
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
    // if (e.status === 400) {
    //   // if (!silent) this.dialogService.open(ShowcaseDialogComponent, {
    //   //   context: {
    //   //     title: 'Yêu cầu không thể thực thi',
    //   //     content: this.joinLogs(e),
    //   //     actions: [
    //   //       {
    //   //         label: 'Trở về',
    //   //         icon: 'back',
    //   //         status: 'info',
    //   //         action: () => { },
    //   //       },
    //   //     ],
    //   //   },
    //   // });
    //   if (!silent) {
    //     this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu không thể thực thi', {
    //       status: 'danger',
    //       duration: 10000,
    //     });
    //   }
    // }
    if (e.status === 403) {
      // if (!silent) this.dialogService.open(ShowcaseDialogComponent, {
      //   context: {
      //     title: 'Yêu cầu không có quyền',
      //     content: this.joinLogs(e),
      //     actions: [
      //       {
      //         label: 'Trở về',
      //         icon: 'back',
      //         status: 'info',
      //         action: () => { },
      //       },
      //     ],
      //   },
      // });
      if (!silent) {
        this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu không có quyền', {
          status: 'danger',
          // duration: 5000,
        });
      }
    }
    // if (e.status === 404) {
    if ([601, 404, 400].indexOf(e.status) > -1) {
      if (!silent) {
        this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu không thể thực thi', {
          status: 'danger',
          // duration: 30000,
        });
      }
    }
    if ([422].indexOf(e.status) > -1) {
      if (!silent) {
        this.toastService.show(this.joinLogs(e, 'toast'), 'API: Yêu cầu chưa được xử lý', {
          status: 'danger',
          // duration: 30000,
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
