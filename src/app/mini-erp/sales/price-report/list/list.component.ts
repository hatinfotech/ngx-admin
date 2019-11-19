import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService } from '../../../services/api.service';
import { PriceReportModel } from '../../../models/sales/price-report.model';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private dialogService: NbDialogService,
    private router: Router,
    private common: CommonService,
  ) {

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
    pager: {
      display: true,
      perPage: 40,
    },
    columns: {
      No: {
        title: 'Stt',
        type: 'number',
        filter: false,
        width: '5%',
      },
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      ObjectName: {
        title: 'Khách hàng',
        type: 'string',
        width: '25%',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
      Title: {
        title: 'Tiêu đề',
        type: 'string',
        width: '30%',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
      Note: {
        title: 'Ghi chú',
        type: 'string',
        windth: '30%',
        filterFunction: (value: string, query: string) => this.common.smartTableFilter(value, query),
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();


  ngOnInit() {
    // this.source.setFilter([
    //   {
    //     field: 'id',
    //     search: query
    //   }
    // ]);
    this.apiService.get<PriceReportModel[]>('/sales/price-reports', { limit: 999999999, offset: 0 },
      list => this.source.load(list.map((item, index) => {
        item['No'] = index + 1;
        return item;
      })));
  }

  // onSearch(query: string = '') {
  //   this.source.setFilter([
  //     // fields we want to include in the search
  //     {
  //       field: 'Code',
  //       search: query,
  //     },
  //     {
  //       field: 'ObjectName',
  //       search: query,
  //     },
  //     {
  //       field: 'Title',
  //       search: query,
  //     },
  //     {
  //       field: 'Note',
  //       search: query,
  //     }
  //   ], false);
  //   // second parameter specifying whether to perform 'AND' or 'OR' search
  //   // (meaning all columns should contain search query or at least one)
  //   // 'AND' by default, so changing to 'OR' by setting false here
  // }

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
