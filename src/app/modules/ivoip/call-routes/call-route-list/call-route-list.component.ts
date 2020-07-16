import { Component, OnInit } from '@angular/core';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { CallRouteFormComponent } from '../call-route-form/call-route-form.component';

@Component({
  selector: 'ngx-call-route-list',
  templateUrl: './call-route-list.component.html',
  styleUrls: ['./call-route-list.component.scss'],
})
export class CallRouteListComponent extends IvoipBaseListComponent<PbxExtensionModel> implements OnInit {

  componentName = 'CallRouteListComponent';
  formPath = '/ivoip/call-routes/form';
  apiPath = '/ivoip/call-routes';
  idKey = 'extension_uuid';
  formDialog = CallRouteFormComponent;

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
        width: '20%',
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
      // qr_code: {
      //   class: 'genrate-qrcode',
      //   title: 'QR Code',
      //   type: 'custom',
      //   width: '10%',
      //   renderComponent: ButtonViewComponent,
      //   onComponentInitFunction: (instance: ButtonViewComponent) => {
      //     instance.renderValue = 'fa fa-qrcode';
      //     instance.click.subscribe((row: PbxExtensionModel) => {
      //       this.showQrCode(row.extension_uuid, row.extension);
      //     });
      //   },
      // },
    },
  });

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  // showQrCode(extensionUuid: string, extension: string, regenerate?: boolean) {
  //   this.apiService.get<{ extension: string, extension_uuid: string, qr_code: string }[]>('/ivoip/extensions/' + extensionUuid, { resptype: 'qrcode', regenerate: regenerate ? 1 : 0, domainId: this.ivoipService.getPbxActiveDomainUuid() }, result => {

  //     this.dialogService.open(ShowcaseDialogComponent, {
  //       context: {
  //         title: 'QR Code',
  //         content: `<img src="${result[0].qr_code}" class="full-width">`,
  //         actions: [
  //           {
  //             label: 'Cập nhật mã',
  //             icon: 'back',
  //             status: 'danger',
  //             action: () => {
  //               this.showQrCode(extensionUuid, extension, true);
  //             },
  //           },
  //           {
  //             label: 'Trở về',
  //             icon: 'back',
  //             status: 'primary',
  //             action: () => { },
  //           },
  //           {
  //             label: 'Tải về',
  //             icon: 'download',
  //             status: 'success',
  //             action: () => {
  //               const a = document.createElement('a');
  //               a.href = result[0].qr_code;
  //               a.download = 'ext_' + extension + '.png';
  //               a.click();
  //             },
  //           },
  //         ],
  //       },
  //     });
  //   });
  // }

  onGenerateQRCodeBtnClick(): false {
    return false;
  }

}
