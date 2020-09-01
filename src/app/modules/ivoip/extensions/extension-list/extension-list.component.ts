import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { ViewCell } from 'ng2-smart-table';
import { IvoipService } from '../../ivoip-service';
import { ExtensionFormComponent } from '../extension-form/extension-form.component';
import { IvoipServerBaseListComponent } from '../../ivoip-server-base-list.component';
import { IconViewComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';

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
export class ExtensionListComponent extends IvoipServerBaseListComponent<PbxExtensionModel> implements OnInit {

  componentName = 'ExtensionListComponent';
  formPath = '/ivoip/extensions/form';
  apiPath = '/ivoip/extensions';
  idKey = 'extension_uuid';
  formDialog = ExtensionFormComponent;

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  editing = {};
  rows = [];

  settings = this.configSetting({
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
    // add: {
    //   addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    // pager: {
    //   display: true,
    //   perPage: 99999,
    // },
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
        width: '10%',
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
      sip_info: {
        class: this.commonService.translateText('Ivoip.sipInfo'),
        title: 'Sip Info',
        type: 'custom',
        width: '10%',
        renderComponent: IconViewComponent,
        onComponentInitFunction: (instance: IconViewComponent) => {
          instance.renderValue = 'settings';
          instance.type = 'nb';
          instance.pack = 'eva';
          instance.status = 'danger';
          instance.click.subscribe((row: PbxExtensionModel) => {
            this.commonService.openDialog(ShowcaseDialogComponent, {
              context: {
                title: this.commonService.translateText('Ivoip.sipInfo'),
                content: '<div style="border-radius: 1rem; border: 1px solid #eee">' + row['sip_info'].replace(/\n/g, '<br>') + '</div>',
                // actions: [
                //   {
                //     label: this.commonService.translateText('Common.close'),
                //     status: 'danger',
                //     action: () => {},
                //   },
                // ],
              },
              closeOnBackdropClick: true,
            });
          });
        },
      },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  showQrCode(extensionUuid: string, extension: string, regenerate?: boolean) {
    this.apiService.get<{ extension: string, extension_uuid: string, qr_code: string }[]>('/ivoip/extensions/' + extensionUuid, { resptype: 'qrcode', regenerate: regenerate ? 1 : 0, domainId: this.ivoipService.getPbxActiveDomainUuid() }, result => {

      this.commonService.openDialog(ShowcaseDialogComponent, {
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

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: PbxExtensionModel[]) => {
      const paging = this.source.getPaging();
      data.forEach((item, index) => {
        item['No'] = (paging.page - 1) * paging.perPage + index + 1;
        // item.Start = item.Start.replace(' ', '<br>');
      });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
      params['includeSipInfo'] = true;
      return params;
    };

    return source;
  }

}
