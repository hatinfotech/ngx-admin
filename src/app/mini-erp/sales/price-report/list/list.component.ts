import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../services/api.service';
import { PriceReport } from '../../../models/sales/price-report.model';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ShowcaseDialogComponent } from '../../../showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private apiService: ApiService, private dialogService: NbDialogService, private router: Router) { }

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

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit() {
    this.apiService.get<PriceReport[]>('/sales/price-reports', { limit: 100, offset: 0 },
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

}
