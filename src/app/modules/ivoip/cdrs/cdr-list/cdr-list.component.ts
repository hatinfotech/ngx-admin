import { Component, OnInit } from '@angular/core';
import { PbxCdrModel } from '../../../../models/pbx-cdr.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { PlayerDialogComponent } from '../../../dialog/player-dialog/player-dialog.component';
import { CdrModel } from '../../../../models/cdr.model';
import { SmartTableButtonComponent, SmartTableDateTimeComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { IvoipServerBaseListComponent } from '../../ivoip-server-base-list.component';
import { TranslateService } from '@ngx-translate/core';
import { SmartTableDateTimeRangeFilterComponent, SmartTableSelectFilterComponent } from '../../../../lib/custom-element/smart-table/smart-table.filter.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

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

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
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
      //   deleteButtonContent: '<i class="fas fa-play-circle"></i>',
      //   confirmDelete: true,
      // },
      columns: {
        No: {
          title: this.cms.textTransform(this.cms.translate.instant('Common.noNumber'), 'head-title'),
          type: 'html',
          width: '5%',
        },
        Direction: {
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.direction'), 'head-title'),
          type: 'html',
          filter: {
            type: 'custom',
            component: SmartTableSelectFilterComponent,
            config: {
              selectText: this.cms.textTransform(this.cms.translate.instant('Common.all'), 'head-title') + '...',
              list: [
                { value: 'local', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.Direction.local'), 'head-title') },
                { value: 'inbound', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.Direction.inbound'), 'head-title') },
                { value: 'outbound', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.Direction.outbound'), 'head-title') },
              ],
            },
          },
          width: '5%',
          valuePrepareFunction: (cell: string, row: PbxCdrModel) => {
            if (cell) {
              let icon = 'assets/icon/fusionpbx/icon_cdr_' + cell + '_' + row['CallResult'];
              if (row['leg'] === 'b') {
                icon += '_b';
              }
              icon += '.png';
              return '<img src="' + icon + '"> ' + this.cms.translateText('Ivoip.Direction.' + cell);
            }
            return '';
            // return `<span class="nowrap">${cell ? this.cms.translateText('Ivoip.Direction.' + cell) : ''}</span>`;
          },
        },
        CallResult: {
          title: this.cms.translateText('Common.state'),
          type: 'html',
          width: '5%',
          filter: {
            type: 'custom',
            component: SmartTableSelectFilterComponent,
            config: {
              selectText: this.cms.textTransform(this.cms.translate.instant('Common.all'), 'head-title') + '...',
              list: [
                { value: 'answered', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallResult.answered'), 'head-title') },
                { value: 'missed', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallResult.missed'), 'head-title') },
                { value: 'voicemail', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallResult.voicemail'), 'head-title') },
                { value: 'cancelled', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallResult.cancelled'), 'head-title') },
                { value: 'failed', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallResult.failed'), 'head-title') },
                { value: 'noanswer', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallResult.noanswer'), 'head-title') },
              ],
            },
          },
          valuePrepareFunction: (cell: string) => {
            let real = '';
            // if (cell === 'voicemail') real = this.cms.translateText('Ivoip.CallResult.cancelled');
            // if (cell === 'failed') real = this.cms.translateText('Ivoip.CallResult.cancelled');

            return this.cms.translateText('Ivoip.CallResult.' + cell) + (real ? (' (' + real + ')') : '');
          },
        },
        Extension: {
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.extension'), 'head-title'),
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
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.callerNumber'), 'head-title'),
          type: 'html',
          width: '20%',
          valuePrepareFunction: (cell: string, row: any) => {
            return `<span class="nowrap">${row['CallerNumberName'] ? (row['CallerNumberName']+'<br>') : ''}${cell ? cell : ''}</span>`;
          },
        },
        CallerDestination: {
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.receivedNumber'), 'head-title'),
          type: 'html',
          width: '15%',
          valuePrepareFunction: (cell: string, row: any) => {
            return `<span class="nowrap">${row['CallerDestinationName'] ? (row['CallerDestinationName']+'<br>') : ''}${cell ? cell : ''}</span>`;
          },
        },
        DestinationNumber: {
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.forwardTo'), 'head-title'),
          type: 'html',
          width: '15%',
          valuePrepareFunction: (cell: string, row: any) => {
            return `<span class="nowrap">${row['DestinationNumberName'] ? (row['DestinationNumberName']+'<br>') : ''}${cell ? cell : ''}</span>`;
          },
        },
        Start: {
          // title: 'TG Bắt đầu',
          // type: 'html',
          // width: '10%',
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.startedTime'), 'head-title'),
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
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.ringingTime'), 'head-title'),
          type: 'html',
          width: '5%',
        },
        Duration: {
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.duration'), 'head-title'),
          type: 'html',
          width: '5%',
        },
        HangupCase: {
          // title: 'Trạng thái',
          // type: 'string',
          width: '10%',
          title: this.cms.textTransform(this.cms.translate.instant('Lý do'), 'head-title'),
          type: 'text',
          filter: {
            type: 'custom',
            component: SmartTableSelectFilterComponent,
            config: {
              selectText: this.cms.textTransform(this.cms.translate.instant('Common.all'), 'head-title') + '...',
              list: [
                { value: 'ORIGINATOR_CANCEL', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallState.ORIGINATOR_CANCEL'), 'head-title') },
                { value: 'NORMAL_CLEARING', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallState.NORMAL_CLEARING'), 'head-title') },
                { value: 'CALL_REJECTED', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallState.CALL_REJECTED'), 'head-title') },
                { value: 'INCOMPATIBLE_DESTINATION', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallState.INCOMPATIBLE_DESTINATION'), 'head-title') },
                { value: 'USER_BUSY', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallState.USER_BUSY'), 'head-title') },
                { value: 'NO_ANSWER', title: this.cms.textTransform(this.cms.translate.instant('Ivoip.CallState.NO_ANSWER'), 'head-title') },
              ],
            },
          },
          valuePrepareFunction: (cell: string, rowData) => {
            // if (cell == 'NORMAL_CLEARING' && rowData.CallResult != 'answered') {
            //   if (rowData.CallResult == 'voicemail') return this.cms.translateText('Ivoip.CallState.NO_ANSWER')
            //   if (rowData.CallResult == 'cancelled') return this.cms.translateText('Ivoip.CallState.USER_BUSY')
            //   if (rowData.CallResult == 'failed') return this.cms.translateText('Ivoip.CallState.INCOMPATIBLE_DESTINATION')
            //   return '--';
            // }
            if (['NO_ANSWER', 'USER_BUSY'].indexOf(cell) > -1) {
              return (rowData.Direction == 'inbound' ? 'Agent ' : (rowData.Direction == 'outbound' ? 'Customer ' : '')) + this.cms.translateText('Ivoip.CallState.' + cell);
            }
            if (['ORIGINATOR_CANCEL'].indexOf(cell) > -1) {
              return (rowData.Direction == 'inbound' ? 'Customer ' : (rowData.Direction == 'outbound' ? 'Agent ' : '')) + this.cms.translateText('Ivoip.CallState.' + cell);
            }
            return this.cms.translateText('Ivoip.CallState.' + cell);
          },
        },
        RecordingFile: {
          title: this.cms.textTransform(this.cms.translate.instant('Ivoip.soundRecord'), 'head-title'),
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

              this.cms.openDialog(PlayerDialogComponent, {
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
  }

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
    public translate: TranslateService,
    // private mobileAppService: MobileAppService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ivoipService);

    this.actionButtonList = this.actionButtonList.filter(btn => !['delete', 'add', 'edit', 'preview'].some(name => name === btn.name));

  }

  async init() {
    const rs = await super.init();
    this.actionButtonList.splice(this.actionButtonList.length - 2, 0, {
      name: 'export',
      status: 'danger',
      label: this.cms.textTransform(this.cms.translate.instant('Common.export'), 'head-title'),
      icon: 'external-link',
      title: this.cms.textTransform(this.cms.translate.instant('Common.export'), 'head-title'),
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.exportCdrs();
        return false;
      },
    });
    this.actionButtonList.splice(this.actionButtonList.length - 2, 0,
      {
        name: 'reset',
        status: 'info',
        // label: 'Reset',
        icon: 'refresh',
        title: this.cms.textTransform(this.cms.translate.instant('Common.reset'), 'head-title'),
        size: 'medium',
        disabled: () => {
          return false;
        },
        click: () => {
          this.reset();
          return false;
        },
      },
    );
    return rs;
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
      this.cms.openDialog(PlayerDialogComponent, {
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
    const filters = this.source.getFilter().filters;
    const params: { [key: string]: any } = { domainId: this.ivoipService.getPbxActiveDomainUuid(), export: true };
    for (let i = 0; i < filters.length; i++) {
      params['filter_' + filters[i].field] = filters[i].search;
    }

    window.open(`${this.apiService.buildApiUrl('/ivoip/cdrs', params)}`, '_blank');
    return false;
  }

  custom(event: any) {
    console.log(event);
  }
}
