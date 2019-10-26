import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  apiUrl = 'https://local.namsoftware.com/v1/hr/employees';
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

  makeApiUrl() {
    return this.apiUrl + (this.getToken() ? ('?token=' + this.getToken()) : '');
  }

  getEmployees(callback, errorCallback) {

    this._http.get<HttpResponse<any>>(this.makeApiUrl(), { observe: 'response' })
      .subscribe((resp: HttpResponse<any>) => {
        const session = resp.headers.get('session');
        if (session) {
          this.storeSession(session);
        }
        callback(resp.body);
      }, (e) => {
        errorCallback(e.error);
      });
  }
}
