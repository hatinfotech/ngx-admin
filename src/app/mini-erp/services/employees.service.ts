import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Employee } from '../models/employee.model';
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {

  constructor(private apiService: ApiService) { }

  get() {
    return this.apiService.get<Employee[]>('/hr/employees');
  }

  handleError(e) {
    if (e.status === 401) {
      console.warn('You were not logged in');
      // window.location.href = '/auth/login';
      // location.replace('http://localhost:4200/auth/login');
    }
    let errorMessage = '';
    if (e.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${e.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${e.status}\nMessage: ${e.message}`;
    }
    // tslint:disable-next-line: no-console
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
