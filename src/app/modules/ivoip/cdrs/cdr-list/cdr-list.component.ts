import { Component, OnInit } from '@angular/core';
import { PbxCdrModel } from '../../../../models/pbx-cdr.model';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';
import { PlayerDialogComponent } from '../../../dialog/player-dialog/player-dialog.component';
import { CdrModel } from '../../../../models/cdr.model';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table-checkbox.component';

@Component({
  selector: 'ngx-cdr-list',
  templateUrl: './cdr-list.component.html',
  styleUrls: ['./cdr-list.component.scss'],
})
export class CdrListComponent extends IvoipBaseListComponent<any> implements OnInit {

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
      perPage: 100,
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
        title: 'Hướng gọi',
        type: 'html',
        width: '5%', valuePrepareFunction: (cell: string) => {
          return `<span class="nowrap">${cell ? cell : ''}</span>`;
        },
      },
      Extension: {
        title: 'Số nội bộ',
        type: 'html',
        width: '5%',
      },
      FromOrigin: {
        title: 'Số gọi vào',
        type: 'html',
        width: '10%',
        valuePrepareFunction: (cell: string) => {
          return `<span class="nowrap">${cell ? cell : ''}</span>`;
        },
      },
      CallerName: {
        title: 'Tên người gọi',
        type: 'html',
        valuePrepareFunction: (cell: string) => {
          return `<span class="nowrap">${cell ? cell : ''}</span>`;
        },
        width: '10%',
      },
      CallerNumber: {
        title: 'Số người gọi',
        type: 'html',
        width: '10%',
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
        title: 'TG Bắt đầu',
        type: 'html',
        width: '10%',
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
        title: 'Trạng thái',
        type: 'string',
        width: '10%',
      },
      RecordingFile: {
        title: 'Ghi âm',
        type: 'custom',
        width: '5%',
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
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  getList(callback: (list: PbxCdrModel[]) => void) {
    super.getList((list: PbxCdrModel[]) => {
      callback(list.map(item => {
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
}
