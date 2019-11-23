import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CdrModel } from '../../../models/cdr.model';

@Component({
  selector: 'ngx-cdr',
  templateUrl: './cdr.component.html',
  styleUrls: ['./cdr.component.scss'],
})
export class CdrComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
  ) { }



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
      No: {
        title: 'Stt',
        type: 'string',
        width: '5%',
      },
      Direction: {
        title: 'Hướng gọi',
        type: 'string',
        width: '10%',
      },
      Extension: {
        title: 'Số nội bộ',
        type: 'string',
        width: '10%',
      },
      FromOrigin: {
        title: 'Số gọi vào',
        type: 'string',
        width: '10%',
      },
      CallerName: {
        title: 'Tên người gọi',
        type: 'string',
        width: '10%',
      },
      CallerNumber: {
        title: 'Số người gọi',
        type: 'string',
        width: '10%',
      },
      CallerDestination: {
        title: 'Số nhận cuộc gọi',
        type: 'string',
        width: '10%',
      },
      Start: {
        title: 'TG Bắt đầu',
        type: 'string',
        width: '10%',
      },
      Tta: {
        title: 'TG đỗ chuông',
        type: 'string',
        width: '5%',
      },
      Duration: {
        title: 'Thời lượng',
        type: 'string',
        width: '10%',
      },
      HangupCase: {
        title: 'Trạng thái',
        type: 'string',
        width: '10%',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  select2OptionForDomain = {
    placeholder: 'Chọn tổng đài...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'DoaminId',
      text: 'DoaminName',
    },
  };
  domainList: { id: string, text: string }[];

  ngOnInit() {

    // Get data from api
    this.apiService.get<CdrModel[]>('/ivoip/cdr', { limit: 999999999, offset: 0 },
      cdrs => this.source.load(cdrs.map((item, index: number) => {
        item['No'] = index + 1;
        return item;
      })));


    this.domainList = [
      {
        DomainId: 'dfsdfdsf-dsf-sdf-sdf-dsf-sd',
        DomainName: 'thanphat.tongdaidientoan.com',
      },
      {
        DomainId: 'dfsdfdsf-dsf-sdf-sdf-dsf-231223',
        DomainName: 'vanthangdat.tongdaidientoan.com',
      },
    ].filter(item => {
      item['id'] = item['DomainId'];
      item['text'] = item['DomainName'];
      return true;
    }) as [];
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
