import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../services/api.service';
import { PriceReportModel } from '../../../models/sales/price-report.model';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../showcase-dialog/showcase-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  constructor(private apiService: ApiService, private dialogService: NbDialogService, private router: Router) {

  }

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
        title: 'Mã',
        type: 'string',
      },
      ObjectName: {
        title: 'Khách hàng',
        type: 'string',
      },
      Title: {
        title: 'Tiêu đề',
        type: 'string',
      },
      Note: {
        title: 'Ghi chú',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();


  ngOnInit() {
    this.apiService.get<PriceReportModel[]>('/sales/price-reports', { limit: 999999999, offset: 0 },
      priceReport => this.source.load(priceReport), e => {
        console.warn(e);
        this.dialogService.open(ShowcaseDialogComponent, {
          context: {
            title: 'Error',
            content: e.error.logs[0],
          },
        });
      });
  }

  onEditAction(event) {
    this.router.navigate(['sales/price-report/form', event.data.Code]);
  }

  onCreateAction(event) {
    this.router.navigate(['sales/price-report/form']);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
