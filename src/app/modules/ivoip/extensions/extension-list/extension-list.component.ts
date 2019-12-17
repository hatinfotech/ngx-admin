import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbIconLibraries } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { PbxModel } from '../../../../models/pbx.model';
import { ViewCell } from 'ng2-smart-table';
import { IvoipService } from '../../ivoip-service';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table-checkbox.component';
import { PbxCdrModel } from '../../../../models/pbx-cdr.model';

@Component({
  selector: 'ngx-custom-view',
  template: `
    <div style="text-align: center">
      <i style="font-size: 1.5rem; cursor: pointer; color: #42aaff;" (click)="onClick()" [class]="renderValue"></i>
    </div>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.click.emit(this.rowData);
  }
}

@Component({
  selector: 'ngx-extension-list',
  templateUrl: './extension-list.component.html',
  styleUrls: ['./extension-list.component.scss'],
})
export class ExtensionListComponent extends IvoipBaseListComponent<PbxExtensionModel> implements OnInit {

  formPath = '/ivoip/extensions/form';
  apiPath = '/ivoip/extensions';
  idKey = 'extension_uuid';

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    protected ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  editing = {};
  rows = [];

  settings = {
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
      // edit: false,
      // custom: [
      //   {
      //     name: 'edit',
      //     title: '<i class="fa fa-qr-code"></i>',
      //   },
      // ],
    },
    add: {
      addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
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
      perPage: 99999,
    },
    columns: {
      extension: {
        title: 'Extension',
        type: 'string',
        width: '10%',
      },
      description: {
        title: 'Diễn giải',
        type: 'string',
        width: '30%',
        filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
      },
      // number_alias: {
      //   title: 'Alias',
      //   type: 'string',
      // },
      // accountcode: {
      //   title: 'Số Public',
      //   type: 'string',
      // },
      call_group: {
        title: 'Nhóm',
        type: 'string',
        width: '10%',
      },
      user_record: {
        title: 'Ghi âm',
        type: 'string',
        width: '10%',
      },
      status: {
        title: 'Trạng thái',
        type: 'string',
        width: '20%',
      },
      enabled: {
        title: 'Kích hoạt',
        type: 'string',
        width: '10%',
      },
      qr_code: {
        class: 'genrate-qrcode',
        title: 'QR Code',
        type: 'custom',
        width: '10%',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: ButtonViewComponent) => {
          instance.renderValue = 'fa fa-qrcode';
          instance.click.subscribe((row: PbxExtensionModel) => {
            this.showQrCode(row.extension_uuid, row.extension);
          });
        },
      },
    },
  };

  ngOnInit() {
    super.ngOnInit();
  }

  showQrCode(extensionUuid: string, extension: string, regenerate?: boolean) {
    this.apiService.get<{ extension: string, extension_uuid: string, qr_code: string }[]>('/ivoip/extensions/' + extensionUuid, { resptype: 'qrcode', regenerate: regenerate ? 1 : 0, domainId: this.ivoipService.getPbxActiveDomainUuid() }, result => {

      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: 'QR Code',
          content: `<img src="${result[0].qr_code}" class="full-width">`,
          actions: [
            {
              label: 'Cập nhật mã',
              icon: 'back',
              status: 'danger',
              action: () => {
                this.showQrCode(extensionUuid, extension, true);
              },
            },
            {
              label: 'Trở về',
              icon: 'back',
              status: 'primary',
              action: () => { },
            },
            {
              label: 'Tải về',
              icon: 'download',
              status: 'success',
              action: () => {
                const a = document.createElement('a');
                a.href = result[0].qr_code;
                a.download = 'ext_' + extension + '.png';
                a.click();
              },
            },
          ],
        },
      });
    });
  }

  onGenerateQRCodeBtnClick(): false {
    return false;
  }

}
