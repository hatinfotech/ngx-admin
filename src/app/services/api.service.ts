import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { NbAuthService, NbAuthOAuth2Token } from '@nebular/auth';
import { environment } from '../../environments/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, retry, catchError, switchMap } from 'rxjs/operators';
import { EmployeeModel } from '../models/employee.model';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../modules/dialog/showcase-dialog/showcase-dialog.component';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import * as url from 'url';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public baseApiUrl = environment.api.baseUrl;
  protected session = '';
  protected token = '';

  private unauthoriziedSubject: BehaviorSubject<{ previousUrl: string }> = new BehaviorSubject<{ previousUrl: string }>(null);
  public unauthorizied$: Observable<{ previousUrl: string }> = this.unauthoriziedSubject.asObservable();

  constructor(
    public _http: HttpClient,
    protected authService: NbAuthService,
    private router: Router,
    private dialogService: NbDialogService,
    // private commonService: CommonService,
    // private activatedRoute: ActivatedRouteSnapshot,
  ) {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthOAuth2Token) => {
        if (token.isValid()) {
          this.setToken(token);
        }
      });

    this.authService.getToken().subscribe((token: NbAuthOAuth2Token) => {
      if (token.isValid()) {
        this.setToken(token);
      }
    });
  }

  getBaseApiUrl() {
    return this.baseApiUrl;
  }

  setToken(token: NbAuthOAuth2Token) {
    if (token) {
      const t = JSON.parse(token.toString());
      if (t) {
        this.setAccessToken(t['access_token']);
        this.setRefreshToken(t['refresh_token']);
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
    localStorage.setItem('api_access_token', token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem('api_refresh_token', token);
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
    const token = this.getAccessToken();
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
    return `${this.baseApiUrl}${path}?${paramsStr}`;
  }

  buildParams(params: Object): string {
    let httpParams = '';
    let first = true;
    Object.entries(params).forEach(([key, value]) => {
      httpParams += `${!first ? '&' : ''}${key}=${value}`;
      first = false;
    });
    return httpParams;
  }

  refreshToken(success: () => void, error?: () => void) {
    this.authService.isAuthenticatedOrRefresh().subscribe(result => {
      console.info(result);
      success();
    });
  }

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
      this.authService.isAuthenticatedOrRefresh().subscribe(result => {
        if (result) {
          const obs = this._http.get<T>(this.buildApiUrl(enpoint, params))
            .pipe(retry(0), catchError(e => {
              reject(e);
              return this.handleError(e, params['silent']);
            }))
            .subscribe((resources: T) => {
              resolve(resources);
              obs.unsubscribe();
            });
        } else {
          this.onUnauthorizied();
        }
      });
    });

  }

  /** Restful api getting request - promise */
  getObservable<T>(enpoint: string, params?: any): Observable<HttpResponse<T>> {

    return this._http.get<T>(this.buildApiUrl(enpoint, params), { observe: 'response' }).pipe(
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
  delete(enpoint: string, id: string | string[] | { [key: string]: string }, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    // this.authService.isAuthenticatedOrRefresh().subscribe(result => {
    //   if (result) {
    let apiUrl = '';
    if (Array.isArray(id)) {
      // const _id = id.join(encodeURIComponent('-'));
      const params = {};
      id.forEach((item, index) => {
        params['id' + index] = encodeURIComponent(item);
      });
      apiUrl = this.buildApiUrl(`${enpoint}`, params);
    } else if (typeof id === 'object') {
      apiUrl = this.buildApiUrl(enpoint, id);
    }
    const obs = this._http.delete(apiUrl)
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        if (complete) complete(e);
        return this.handleError(e, id['silent']);
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

  onUnauthorizied() {
    this.unauthoriziedSubject.next({
      previousUrl: this.router.url,
    });
    this.router.navigate(['/auth/login']);
  }

  handleError(e: HttpErrorResponse, silent?: boolean) {
    if (e.status === 401) {
      console.warn('You were not logged in');
      this.router.navigate(['/auth/login']);
    }
    if (e.status === 405) {
      if (!silent) this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Yêu cầu quyền truy cập',
          content: (e.error['logs'] && e.error['logs'][0]) ? e.error['logs'][0] : e.message,
          actions: [
            {
              label: 'Trở về',
              icon: 'back',
              status: 'info',
              action: () => { },
            },
          ],
        },
      });
    }
    if (e.status === 400) {
      if (!silent) this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Yêu cầu không thể thực thi',
          content: (e.error['logs'] && e.error['logs'][0]) ? e.error['logs'][0] : e.message,
          actions: [
            {
              label: 'Trở về',
              icon: 'back',
              status: 'info',
              action: () => { },
            },
          ],
        },
      });
    }
    if (e.status === 403) {
      if (!silent) this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'Yêu cầu không có quyền',
          content: (e.error['logs'] && e.error['logs'][0]) ? e.error['logs'][0] : e.message,
          actions: [
            {
              label: 'Trở về',
              icon: 'back',
              status: 'info',
              action: () => { },
            },
          ],
        },
      });
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
}

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    protected authService: NbAuthService,
    protected apiService: ApiService,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check endpont != /user/login/refresh
    // const modified = req.clone({ setHeaders: { 'Custom-Header-1': '1' } });
    console.log('Http intercept: ', req.url);
    if (!/https?:\/\/[^\/]+\/v\d\/user\/login/.test(req.url)) {
      return this.authService.isAuthenticated().pipe(switchMap(isAuth => {
        if (!isAuth) {
          // Refresh token and continue request
          return this.authService.isAuthenticatedOrRefresh().pipe(switchMap(ok => {
            if (ok) {
              return this.authService.getToken().pipe(switchMap((token: any) => {
                // const urlParse = url.parse(req.url);
                return next.handle(req.clone({
                  // setHeaders: {
                  //   token: token.token.access_token,
                  // },
                  url: req.url.replace(/token=([^\/=\?&]+)/, `token=${token.token.access_token}`),
                }));
              }));
            }
            this.apiService.onUnauthorizied();
            return Observable.throw('Not login');

          }));
        }
        return next.handle(req);
      }));
    }
    return next.handle(req);
  }
}
