import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  apiUrl = 'https://local.namsoftware.com/v1/hr/employees';
  session = '';
  constructor(private _http: HttpClient) { }

  storeSession(session) {
    localStorage.setItem('api_session', session);
  }

  getSession() {
    return localStorage.getItem('api_session');
  }

  makeApiUrl() {
    const session = this.getSession();
    return this.apiUrl + (session ? ('?session=' + session) : '');
  }

  getEmployees(callback) {

    this._http.get<HttpResponse<any>>(this.makeApiUrl(), { observe: 'response' })
      .subscribe((resp: HttpResponse<any>) => {
        const session = resp.headers.get('session');
        if (session) {
          this.storeSession(session);
        }
        callback(resp.body);
      });
  }
}
