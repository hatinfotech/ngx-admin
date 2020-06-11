import { Component, OnInit } from '@angular/core';
import { PbxCdrModel } from '../../../../models/pbx-cdr.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { PlayerDialogComponent } from '../../../dialog/player-dialog/player-dialog.component';
import { CdrModel } from '../../../../models/cdr.model';
import { SmartTableButtonComponent, SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { IvoipServerBaseListComponent } from '../../ivoip-server-base-list.component';
import { TranslateService } from '@ngx-translate/core';
import { SmartTableDateTimeRangeFilterComponent, SmartTableClearingFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';

@Component({
  selector: 'ngx-cdr-list',
  templateUrl: './cdr-list.component.html',
  styleUrls: ['./cdr-list.component.scss'],
})
export class CdrListComponent extends IvoipServerBaseListComponent<any> implements OnInit {

  componentName = 'CdrListComponent';
  formPath: string;
  apiPath: string = '/ivoip/cdrs';
  idKey = 'cdr_uuid';

  settings = this.configSetting({
    mode: 'external',
    // selectMode: 'multi',
    // actions: {
    //   position: 'right',
    // },
    actions: false,
    pager: {
      display: true,
      perPage: 40,
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
      deleteButtonContent: '<i class="fas fa-play-circle"></i>',
      confirmDelete: true,
    },
    columns: {
      No: {
        title: 'Stt',
        type: 'html',
        width: '5%',
      },
      Direction: {
        title: this.commonService.textTransform(this.commonService.translate.instant('Common.choose'), 'head-title'),
        type: 'html',
        filter: {
          type: 'list',
          config: {
            selectText: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.direction'), 'head-title'),
            list: [
              { value: 'local', title: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.local'), 'head-title') },
              { value: 'inbound', title: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.inbound'), 'head-title') },
              { value: 'outbound', title: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.outbound'), 'head-title') },
            ],
          },
        },
        width: '10%',
        valuePrepareFunction: (cell: string) => {
          return `<span class="nowrap">${cell ? cell : ''}</span>`;
        },
      },
      Extension: {
        title: 'Số nội bộ',
        type: 'html',
        width: '5%',
      },
      // FromOrigin: {
      //   title: 'Số gọi vào',
      //   type: 'html',
      //   width: '10%',
      //   filter: false,
      //   valuePrepareFunction: (cell: string) => {
      //     return `<span class="nowrap">${cell ? cell : ''}</span>`;
      //   },
      // },
      // CallerName: {
      //   title: 'Tên người gọi',
      //   type: 'html',
      //   valuePrepareFunction: (cell: string) => {
      //     return `<span class="nowrap">${cell ? cell : ''}</span>`;
      //   },
      //   width: '10%',
      // },
      CallerNumber: {
        title: 'Số người gọi',
        type: 'html',
        width: '20%',
        valuePrepareFunction: (cell: string) => {
          return `<span class="nowrap">${cell ? cell : ''}</span>`;
        },
      },
      CallerDestination: {
        title: 'Số nhận cuộc gọi',
        type: 'html',
        width: '15%',
        valuePrepareFunction: (cell: string) => {
          return `<span class="nowrap">${cell ? cell : ''}</span>`;
        },
      },
      DestinationNumber: {
        title: 'Chuyển đến',
        type: 'html',
        width: '15%',
        valuePrepareFunction: (cell: string) => {
          return `<span class="nowrap">${cell ? cell : ''}</span>`;
        },
      },
      Start: {
        // title: 'TG Bắt đầu',
        // type: 'html',
        // width: '10%',
        title: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.startTime'), 'head-title'),
        type: 'custom',
        width: '10%',
        filter: {
          type: 'custom',
          component: SmartTableDateTimeRangeFilterComponent,
        },
        renderComponent: SmartTableDateTimeComponent,
        onComponentInitFunction: (instance: SmartTableDateTimeComponent) => {
          // instance.format$.next('medium');
        },
      },
      Tta: {
        title: 'TG đỗ chuông',
        type: 'html',
        width: '5%',
      },
      Duration: {
        title: 'Thời lượng',
        type: 'html',
        width: '5%',
      },
      HangupCase: {
        // title: 'Trạng thái',
        // type: 'string',
        width: '10%',

        title: this.commonService.textTransform(this.commonService.translate.instant('Common.state'), 'head-title'),
        type: 'text',
        filter: {
          type: 'list',
          config: {
            selectText: this.commonService.textTransform(this.commonService.translate.instant('Common.choose'), 'head-title'),
            list: [
              { value: 'ORIGINATOR_CANCEL', title: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.CallState.ORIGINATOR_CANCEL'), 'head-title') },
              { value: 'NORMAL_CLEARING', title: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.CallState.NORMAL_CLEARING'), 'head-title') },
              { value: 'CALL_REJECTED', title: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.CallState.CALL_REJECTED'), 'head-title') },
              { value: 'INCOMPATIBLE_DESTINATION', title: this.commonService.textTransform(this.commonService.translate.instant('Ivoip.CallState.INCOMPATIBLE_DESTINATION'), 'head-title') },
            ],
          },
        },
      },
      RecordingFile: {
        title: 'Ghi âm',
        type: 'custom',
        width: '5%',
        // filter: {
        //   type: 'custom',
        //   component: SmartTableClearingFilterComponent,
        // },
        renderComponent: SmartTableButtonComponent,
        onComponentInitFunction: (instance: SmartTableButtonComponent) => {
          instance.iconPack = 'eva';
          instance.icon = 'play-circle-outline';
          instance.label = 'Play';
          instance.display = true;
          instance.status = 'warning';
          instance.valueChange.subscribe(value => {
            if (value) {
              instance.disabled = false;
            } else {
              instance.disabled = true;
            }
          });
          instance.click.subscribe((row: PbxCdrModel) => {

            // this.mobileAppService.playMedia([
            //   {
            //     name: row.FromOrigin ? row.FromOrigin : (row.CallerDestination),
            //     artist: 'IVOIP',
            //     url: this.apiService.buildApiUrl('/ivoip/recordings', { id: row.Id, play_audio: 1, domainId: row.DomainUuid + '@' + row.Pbx }),
            //     cover: 'assets/images/cover1.jpg',
            //   },
            // ]);

            this.dialogService.open(PlayerDialogComponent, {
              context: {
                tracks: [
                  {
                    name: row.FromOrigin ? row.FromOrigin : (row.CallerDestination),
                    artist: 'IVOIP',
                    url: this.apiService.buildApiUrl('/ivoip/recordings', { id: row.Id, play_audio: 1, domainId: row.DomainUuid + '@' + row.Pbx }),
                    cover: 'assets/images/cover1.jpg',
                  },
                ],
              },

            });

          });
        },
      },
    },
  });

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
    public translate: TranslateService,
    // private mobileAppService: MobileAppService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: CdrModel[]) => {
      const paging = this.source.getPaging();
      data.forEach((item, index) => {
        item['No'] = (paging.page - 1) * paging.perPage + index + 1;
        // item.Start = item.Start.replace(' ', '<br>');
      });
      return data;
    };

    // Set DataSource: prepareParams
    // source.prepareParams = (params: any) => {
    //   params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    //   return params;
    // };

    return source;
  }

  getList(callback: (list: PbxCdrModel[]) => void) {
    super.getList((list: PbxCdrModel[]) => {
      callback(list.map((item, index) => {
        item['No'] = index + 1;
        item.Start = item.Start.replace(' ', '<br>');
        return item;
      }));
    });
  }

  onDeleteConfirm(event: { data: CdrModel }): void {
    // if (window.confirm('Are you sure you want to delete?')) {
    //   event.confirm.resolve();
    // } else {
    //   event.confirm.reject();
    // }

    if (event.data.RecordingFile) {
      this.dialogService.open(PlayerDialogComponent, {
        context: {
          tracks: [
            {
              name: event.data.FromOrigin ? event.data.FromOrigin : (event.data.CallerDestination),
              artist: 'IVOIP',
              url: this.apiService.buildApiUrl('/ivoip/recordings', { id: event.data['Id'], play_audio: 1, domainId: event.data['DomainUuid'] + '@' + event.data['Pbx'] }),
              cover: 'assets/images/cover1.jpg',
            },
          ],
        },
      });
    }

  }

  exportCdrs() {
    window.open(`${this.apiService.buildApiUrl('/ivoip/cdrs', { domainId: this.ivoipService.getPbxActiveDomainUuid(), export: true })}`, '_blank');
    return false;
  }

  custom(event: any) {
    console.log(event);
  }
}
