import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  baseApiUrl = 'https://local.namsoftware.com/v1';
  session = '';
  token = '';
  constructor(private _http: HttpClient, private authService: NbAuthService) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.setToken(token.toString());
        }

      });
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

  buildApiUrl(path: string) {
    return this.baseApiUrl + path + (this.getToken() ? ('?token=' + this.getToken()) : '');
  }

  getEmployees(sucess, error) {

    this._http.get<HttpResponse<any>>(this.buildApiUrl('/hr/employees'), { observe: 'response' })
      .subscribe((resp: HttpResponse<any>) => {
        const session = resp.headers.get('session');
        if (session) {
          this.storeSession(session);
        }
        sucess(resp.body);
      }, (e) => {
        error(e.error);
      });
  }

  logout(sucess, error) {
    this._http.get<HttpResponse<any>>(this.buildApiUrl('/user/logout'), { observe: 'response' })
      .subscribe((resp: HttpResponse<any>) => {
        const session = resp.headers.get('session');
        if (session) {
          this.storeSession(session);
        }
        sucess(resp.body);
      }, (e) => {
        error(e.error);
      });
  }
}
