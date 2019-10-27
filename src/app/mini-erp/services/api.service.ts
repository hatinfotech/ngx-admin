import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseApiUrl = environment.api.baseUrl;
  protected session = '';
  protected token = '';
  constructor(protected _http: HttpClient,
    protected authService: NbAuthService) {
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

  buildApiUrl(path: string) {
    return this.baseApiUrl + path + (this.getToken() ? ('?token=' + this.getToken()) : '');
  }

  get<T>(enpoint: string) {
    return this._http.get<T>(this.buildApiUrl(enpoint));
  }

  getEmployees(): Observable<Employee[]> {
    return this._http.get(this.buildApiUrl('/hr/employees'))
      .pipe(map((data: any[]) => data.map(item => new Employee(item))));
  }

  logout(sucess, error) {
    this._http.get<HttpResponse<any>>(this.buildApiUrl('/user/logout'), { observe: 'response' })
      .subscribe((resp: HttpResponse<any>) => {
        // const session = resp.headers.get('session');
        // if (session) {
        //   this.storeSession(session);
        // }
        sucess(resp.body);
      }, (e) => {
        error(e.error);
      });
  }
}
