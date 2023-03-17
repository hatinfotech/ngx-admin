import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { EmployeeModel } from '../../../../models/employee.model';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  constructor(
    public apiService: ApiService,
    public dialogService: NbDialogService,
    public router: Router,
    public cms: CommonService,
    ) {
    console.info('construct');
  }

  employees$: Observable<EmployeeModel[]>;


  editing = {};
  rows = [];

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
    },
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

    this.apiService.get<EmployeeModel[]>('/hr/employees', { limit: 1000000, ofset: 0 },
      empployees => this.source.load(empployees), e => {
        this.cms.openDialog(ShowcaseDialogComponent, {
          context: {
            title: 'Error',
            content: e.error.logs[0],
          },
        });
      });

    // this.employeesService.get().pipe(retry(0), catchError(e => this.handleError(e)))
    //   .subscribe(data => this.source.load(data));

    // return this.dataService.getEmployees(data => this.source.load(data), (error) => {
    //   this.cms.openDialog(ShowcaseDialogComponent, {
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
