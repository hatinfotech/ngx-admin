import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataManagerListComponent } from '../../../../lib/data-manager/data-manger-list.component';
import { PbxExtensionModel } from '../../../../models/pbx-extension.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService, NbIconLibraries } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { PbxModel } from '../../../../models/pbx.model';

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
export class ExtensionListComponent extends DataManagerListComponent<PbxExtensionModel> implements OnInit {

  formPath = '/ivoip/extensions/form';
  apiPath = '/ivoip/extensions';
  idKey = 'extension_uuid';

  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    iconsLibrary: NbIconLibraries,
  ) {
    super(apiService, router, commonService, dialogService, toastService);
    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
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

  domainList: { text: string, children: any[] }[] = [];
  select2OptionForDoaminList = {
    placeholder: 'Chọn domain...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'DomainId',
      text: 'DomainName',
    },
  };
  activePbxDoamin: string;

  ngOnInit() {
    this.loadDomainList(doamins => {
      super.ngOnInit();
    });

    // this.loadDomainList();
    // this.apiService.get<PbxModel[]>('/ivoip/pbxs', { limit: 999999, includeDomains: true }, list => {
    //   this.domainList = list.map(pbx => {
    //     return {
    //       text: pbx.Name,
    //       children: this.commonService.convertOptionList(pbx.Domains, 'DomainId', 'DomainName'),
    //     };
    //   });


    // });
  }

  // loadList() {
  //   this.loadDomainList(doamins => {
  //     super.loadList();
  //   });
  // }

  loadDomainList(callback?: (domains: any[]) => void) {
    this.apiService.get<PbxModel[]>('/ivoip/pbxs', { limit: 999999, includeDomains: true }, list => {
      this.domainList = list.map(pbx => {
        return {
          text: pbx.Name,
          children: this.commonService.convertOptionList(pbx.Domains, 'DomainId', 'DomainName'),
        };
      });
      setTimeout(() => {
        this.activePbxDoamin = localStorage.getItem('active_pbx_domain');
        // super.ngOnInit();
        if (callback) callback(this.domainList);
      }, 300);

    });
  }

  getList(callback: (list: PbxExtensionModel[]) => void) {
    this.commonService.takeUntil('pbx_ext_get_list', 1000, () => {
      this.apiService.get<PbxExtensionModel[]>(this.apiPath, { limit: 999999999, offset: 0, domainId: this.activePbxDoamin }, results => callback(results));
    });
  }

  showQrCode(extensionUuid: string, extension: string, regenerate?: boolean) {
    this.apiService.get<{ extension: string, extension_uuid: string, qr_code: string }[]>('/ivoip/extensions/' + extensionUuid, { resptype: 'qrcode', regenerate: regenerate ? 1 : 0, domainId: localStorage.getItem('active_pbx_domain') }, result => {

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

  executeDelete(ids: string[], callback: (result: any) => void) {
    const params = {};
    ids.forEach((item, index) => {
      params['id' + index] = encodeURIComponent(item);
    });
    params['domainId'] = localStorage.getItem('active_pbx_domain');
    this.apiService.delete(this.apiPath, params, result => {
      if (callback) callback(result);
    });
  }

  onReloadBtnClick(): false {
    this.loadDomainList(doamins => {
      super.loadList();
    });
    return false;
  }

  onGenerateQRCodeBtnClick(): false {
    return false;
  }

  onChangeDomain(event: PbxDomainModel) {
    console.info(event);
    if (event['id']) {
      // this.commonService.takeUntil('on_pbx_domain_change', 1000, () => {
      localStorage.setItem('active_pbx_domain', event['id']);
      this.activePbxDoamin = event['id'];
      this.loadList();
      // });
    }
  }

}
