import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CdrModel } from '../../../models/cdr.model';

@Component({
  selector: 'ngx-pbx',
  templateUrl: './pbx.component.html',
  styleUrls: ['./pbx.component.scss'],
})
export class PbxComponent implements OnInit {

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
      Direction: {
        title: 'Hướng gọi',
        type: 'string',
      },
      Extension: {
        title: 'Số nội bộ',
        type: 'string',
      },
      FromOrigin: {
        title: 'Số gọi vào',
        type: 'string',
      },
      CallerName: {
        title: 'Tên người gọi',
        type: 'string',
      },
      CallerNumber: {
        title: 'Số người gọi',
        type: 'string',
      },
      CallerDestination: {
        title: 'Số nhận cuộc gọi',
        type: 'string',
      },
      Start: {
        title: 'TG Bắt đầu',
        type: 'string',
      },
      Tta: {
        title: 'TG đỗ chuông',
        type: 'string',
      },
      Duration: {
        title: 'Thời lượng',
        type: 'string',
      },
      HangupCase: {
        title: 'Trạng thái',
        type: 'string',
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
      priceReport => this.source.load(priceReport), e => {
        console.warn(e);
        if (e.status === 401) {
          this.router.navigate(['/auth/login']);
        }
      });

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
