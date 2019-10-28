import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Employee } from '../../../models/employee.model';
import { NbDialogService } from '@nebular/theme';
import { NbAuthService } from '@nebular/auth';
import { Observable, throwError } from 'rxjs';
import { EmployeesService } from '../../../services/employees.service';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  constructor(
    private employeesService: EmployeesService,
    private dialogService: NbDialogService,
    private authService: NbAuthService,
    private router: Router) {
      console.info('construct');
    }

  employees$: Observable<Employee[]>;


  editing = {};
  rows = [];

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      Code: {
        title: 'Code',
        type: 'number',
      },
      Name: {
        title: 'Name',
        type: 'string',
      },
      Phone: {
        title: 'Phone',
        type: 'string',
      },
      Email: {
        title: 'E-mail',
        type: 'string',
      },
      Address: {
        title: 'Address',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit() {

    // this.employeesService.get().pipe(retry(0), catchError(e => this.handleError(e)))
    //   .subscribe(data => this.source.load(data));

    // return this.dataService.getEmployees(data => this.source.load(data), (error) => {
    //   this.dialogService.open(ShowcaseDialogComponent, {
    //     context: {
    //       title: 'Error',
    //       content: error.logs[0],
    //     },
    //   });
    // });
  }

  handleError(e) {
    if (e.status === 401) {
      console.warn('You were not logged in');
      // window.location.href = '/auth/login';
      // location.replace('http://localhost:4200/auth/login');
      this.router.navigate(['auth/login']);

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
