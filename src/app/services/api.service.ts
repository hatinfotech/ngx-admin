import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { EmployeeModel } from '../models/employee.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseApiUrl = environment.api.baseUrl;
  protected session = '';
  protected token = '';
  constructor(
    protected _http: HttpClient,
    protected authService: NbAuthService,
    private router: Router,
  ) {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.setToken(token.toString());
        }
      });

    this.authService.getToken().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.setToken(token.toString());
      }
    }).unsubscribe();
  }

  storeSession(session: string) {
    localStorage.setItem('api_session', session);
  }

  getSession(): string {
    return localStorage.getItem('api_session');
  }

  setToken(token: string) {
    localStorage.setItem('api_token', token);
  }

  getToken(): string {
    return localStorage.getItem('api_token');
  }

  clearToken() {
    this.setToken(null);
  }

  buildApiUrl(path: string, params?: Object) {
    const token = this.getToken();
    let paramsStr = '';
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

  get<T>(enpoint: string, params: any, success: (resources: T) => void, error?: (e: HttpErrorResponse) => void) {
    let id: string;
    if (Array.isArray(params['id'])) {
      id = params['id'].join('-');
      enpoint += `/${id}`;
      delete params['id'];
    } else if (params['id']) {
      id = params['id'];
      enpoint += `/${id}`;
    }
    return this._http.get<T>(this.buildApiUrl(enpoint, params))
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        return this.handleError(e);
      }))
      .subscribe((resources: T) => success(resources));
  }

  post<T>(enpoint: string, resource: T, success: (newResource: T) => void, error?: (e: HttpErrorResponse) => void) {
    return this._http.post(this.buildApiUrl(enpoint), resource)
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        return this.handleError(e);
      }))
      .subscribe((newResource: T) => success(newResource));
  }

  put<T>(enpoint: string, id: string | string[], resource: T, success: (newResource: T) => void, error?: (e: HttpErrorResponse) => void) {
    if (Array.isArray(id)) {
      id = id.join('-');
    }
    return this._http.put(this.buildApiUrl(`${enpoint}/${id}`), resource)
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        return this.handleError(e);
      }))
      .subscribe((newResource: T) => success(newResource));
  }

  delete(enpoint: string, id: string | string[] | { [key: string]: string }, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void) {
    let apiUrl = '';
    if (Array.isArray(id)) {
      id = id.join('-');
      apiUrl = this.buildApiUrl(`${enpoint}/${id}`);
    } else if (typeof id === 'object') {
      apiUrl = this.buildApiUrl(enpoint, id);
    }
    return this._http.delete(apiUrl)
      .pipe(retry(0), catchError(e => {
        if (error) error(e);
        return this.handleError(e);
      }))
      .subscribe((resp) => success(resp));
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

  handleError(e: HttpErrorResponse) {
    if (e.status === 401) {
      console.warn('You were not logged in');
      this.router.navigate(['/auth/login']);
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
