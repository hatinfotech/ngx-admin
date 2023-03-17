import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { CdrModel } from '../../../models/cdr.model';
import { NbDialogService } from '@nebular/theme';
import { PlayerDialogComponent } from '../../dialog/player-dialog/player-dialog.component';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'ngx-cdr',
  templateUrl: './cdr.component.html',
  styleUrls: ['./cdr.component.scss'],
})
export class CdrComponent implements OnInit {

  constructor(
    public apiService: ApiService,
    public router: Router,
    public dialogService: NbDialogService,
    public cms: CommonService,
  ) { }

  editing = {};
  rows = [];

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
    },
    pager: {
      display: true,
      perPage: 99999,
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
      deleteButtonContent: '<i class="fas fa-play-circle"></i>',
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
    // this.apiService.get<CdrModel[]>('/ivoip/cdrs', { limit: 999999999, offset: 0 },
    //   cdrs => this.source.load(cdrs.map((item, index: number) => {
    //     item['No'] = index + 1;
    //     return item;
    //   })));

    this.loadList();


    // this.domainList = [
    //   {
    //     DomainId: 'dfsdfdsf-dsf-sdf-sdf-dsf-sd',
    //     DomainName: 'thanphat.tongdaidientoan.com',
    //   },
    //   {
    //     DomainId: 'dfsdfdsf-dsf-sdf-sdf-dsf-231223',
    //     DomainName: 'vanthangdat.tongdaidientoan.com',
    //   },
    // ].filter(item => {
    //   item['id'] = item['DomainId'];
    //   item['text'] = item['DomainName'];
    //   return true;
    // }) as [];
  }

  loadList() {
    this.apiService.get<CdrModel[]>('/ivoip/cdrs', { limit: 999999999, offset: 0 },
    cdrs => this.source.load(cdrs.map((item, index: number) => {
      item['No'] = index + 1;
      return item;
    })));
  }

  onReloadBtnClick(): false {
    this.loadList();
    return false;
  }

  onEditAction(event) {
    this.router.navigate(['sales/price-report/form', event.data.Code]);
  }

  onCreateAction(event) {
    this.router.navigate(['sales/price-report/form']);
  }

  onDeleteConfirm(event: { data: CdrModel }): void {
    // if (window.confirm('Are you sure you want to delete?')) {
    //   event.confirm.resolve();
    // } else {
    //   event.confirm.reject();
    // }

    this.cms.openDialog(PlayerDialogComponent, {
      context: {
        tracks: [
          {
            name: event.data.FromOrigin ? event.data.FromOrigin : (event.data.CallerDestination),
            artist: 'IVOIP',
            url: event.data.RecordingUrl,
            cover: 'assets/images/cover1.jpg',
          },
        ],
      },
      // context: {
      //   title: 'Xác nhận xoá dữ liệu',
      //   content: 'Dữ liệu sẽ bị xoá, bạn chắc chắn chưa ?',
      //   actions: [
      //     {
      //       label: 'Trở về',
      //       icon: 'back',
      //       status: 'info',
      //       action: () => {},
      //     },
      //     {
      //       label: 'Xoá',
      //       icon: 'delete',
      //       status: 'danger',
      //       action: () => {
      //         // this.apiService.delete(this.apiPath, this.selectedIds, result => {
      //         //   this.loadList();
      //         // });
      //       },
      //     },
      //   ],
      // },
    });

  }
}
