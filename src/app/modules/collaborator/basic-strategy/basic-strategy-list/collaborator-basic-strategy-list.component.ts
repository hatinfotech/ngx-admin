import { CollaboratorService } from '../../collaborator.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';
import { ServerDataManagerListComponent } from '../../../../lib/data-manager/server-data-manger-list.component';
import { ProductCategoryModel, ProductGroupModel } from '../../../../models/product.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorBasicStrategyFormComponent } from '../basic-strategy-form/collaborator-basic-strategy-form.component';
import { PageModel } from '../../../../models/page.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { SmartTableButtonComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { CollaboratorBasicStrategyModel } from '../../../../models/collaborator.model';

@Component({
  selector: 'ngx-collaborator-basic-strategy-list',
  templateUrl: './collaborator-basic-strategy-list.component.html',
  styleUrls: ['./collaborator-basic-strategy-list.component.scss'],
  providers: [CurrencyPipe, DatePipe],
})
export class CollaboratorBasicStrategyListComponent extends ServerDataManagerListComponent<CollaboratorBasicStrategyModel> implements OnInit {

  componentName: string = 'CollaboratorBasicStrategyListComponent';
  formPath = '/collaborator/product/form';
  apiPath = '/collaborator/basic-strategies';
  idKey: string | string[] = ['Code'];
  formDialog = CollaboratorBasicStrategyFormComponent;
  currentPage: PageModel;

  reuseDialog = true;
  static _dialog: NbDialogRef<CollaboratorBasicStrategyListComponent>;

  // Smart table
  static filterConfig: any;
  static sortConf: any;
  static pagingConf = { page: 1, perPage: 40 };

  // Category list for filter
  categoryList: ProductCategoryModel[] = [];
  groupList: ProductGroupModel[] = [];
  unitList: UnitModel[] = [];

  constructor(
    public apiService: ApiService,
    public router: Router,
    public commonService: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public _http: HttpClient,
    public ref: NbDialogRef<CollaboratorBasicStrategyListComponent>,
    public collaboratorService: CollaboratorService,
    public currencyPipe: CurrencyPipe,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ref);
  }


  async loadCache() {
  }

  async init() {
    await this.loadCache();
    return super.init().then(rs => {
      // Add page choosed
      this.collaboratorService.pageList$.pipe(take(1), filter(f => f && f.length > 0)).toPromise().then(pageList => {
        this.actionButtonList.unshift({
          type: 'select2',
          name: 'pbxdomain',
          status: 'success',
          label: 'Select page',
          icon: 'plus',
          title: this.commonService.textTransform(this.commonService.translate.instant('Collaborator.Page.title', { action: this.commonService.translateText('Common.choose'), definition: '' }), 'head-title'),
          size: 'medium',
          select2: {
            data: pageList, option: {
              placeholder: 'Chọn trang...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              keyMap: {
                id: 'id',
                text: 'text',
              },
            }
          },
          value: () => this.collaboratorService.currentpage$.value,
          change: (value: any, option: any) => {
            this.onChangePage(value);
          },
          disabled: () => {
            return false;
          },
          click: () => {
            return false;
          },
        });
      });
      return rs;
    });
  }

  editing = {};
  rows = [];

  runningState = {
    ...AppModule.approvedState,
    nextState: 'RUNNING',
    outlilne: true,
    status: 'danger',
    label: 'Đang chạy',
    nextStates: [
      { ...AppModule.notJustApprodedState, status: 'warning' },
    ],
  };

  processMap = {
    ...AppModule.processMaps.common,
    "APPROVED": {
      ...AppModule.approvedState,
      nextState: 'RUNNING',
      status: 'success',
      nextStates: [
        { ...AppModule.unrecordedState, status: 'warning' },
        { ...this.runningState, status: 'success' },
      ],
    },
    "RUNNING": {
      ...this.runningState,
      nextState: 'COMPLETE',
      nextStates: [
        { ...AppModule.completeState, status: 'basic' },
        { ...AppModule.unrecordedState, status: 'warning' },
      ],
    },
  };

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      add: this.configAddButton(),
      edit: this.configEditButton(),
      delete: this.configDeleteButton(),
      pager: this.configPaging(),
      columns: {
        Code: {
          title: 'Code',
          type: 'string',
          width: '10%',
        },
        Title: {
          title: 'Tên',
          type: 'string',
          width: '40%'
        },
        Page: {
          title: 'Trang',
          type: 'string',
          width: '20%',
          valuePrepareFunction: (cell, row) => {
            return row.Page || row.PageName;
          }
        },
        // DateOfStart: {
        //   title: 'Ngày bắt đầu',
        //   type: 'datetime',
        //   width: '10%',
        // },
        // DateOfEnd: {
        //   title: 'Ngày kết thúc',
        //   type: 'datetime',
        //   width: '10%',
        // },
        DateRange: {
          title: 'Phạm vi',
          type: 'string',
          width: '20%',
          valuePrepareFunction: (cell, row) => {
            return `${this.commonService.datePipe.transform(row.DateOfStart, 'short')} - ${this.commonService.datePipe.transform(row.DateOfEnd, 'short')}`;
          }
        },
        State: {
          title: this.commonService.translateText('Common.state'),
          type: 'custom',
          width: '5%',
          // class: 'align-right',
          renderComponent: SmartTableButtonComponent,
          onComponentInitFunction: (instance: SmartTableButtonComponent) => {
            instance.iconPack = 'eva';
            instance.icon = 'checkmark-circle';
            instance.display = true;
            instance.status = 'success';
            instance.outline = true;
            instance.title = this.commonService.translateText('Common.unknown');
            instance.label = this.commonService.translateText('Common.unknown');
            instance.valueChange.subscribe(value => {
              const processMap = this.processMap[value || ''];
              instance.label = this.commonService.translateText(processMap?.label);
              instance.status = processMap?.status;
              instance.title = 'Chuyển sang ' + this.commonService.translateText(processMap.nextStates.find(f => f.state == processMap.nextState)?.label);
            });
            instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorBasicStrategyModel) => {
              if (instance.rowData.State == 'NOTJUSTAPPROVED' || instance.rowData.State == 'UNRECORDED') {
                this.commonService.showDialog('Phê duyệt chiến dịch chiết khấu cơ bản', 'Bạn có muốn phê duyệt cho chiến dịch chiết khấu cơ bản "' + instance.rowData.Title + '"', [
                  {
                    label: 'Đóng',
                    status: 'basic',
                    outline: true,
                    action: () => true
                  },
                  {
                    label: 'Duyệt chiến dịch',
                    status: 'success',
                    outline: true,
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { changeState: 'APPROVED' }, [{ Code: instance.rowData.Code }]).then(rs => {
                        this.refresh();
                        this.commonService.toastService.show(instance.rowData.Title, 'Đã phê duyệt chiến dịch chiết khấu cơ bản !', { status: 'success' });
                      });
                    }
                  }
                ]);
              } else if (instance.rowData.State == 'APPROVED') {
                this.commonService.showDialog('Khởi chạy chiến dịch chiết khấu cơ bản', 'Bạn có muốn khởi chạy chiến dịch chiết khấu cơ bản "' + instance.rowData.Title + '"', [
                  {
                    label: 'Đóng',
                    status: 'basic',
                    outline: true,
                    action: () => true
                  },
                  {
                    label: 'Khởi chạy',
                    status: 'primary',
                    outline: true,
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { changeState: 'RUNNING' }, [{ Code: instance.rowData.Code }]).then(rs => {
                        this.refresh();
                        this.commonService.toastService.show(instance.rowData.Title, 'Đã khởi chạy chiến dịch chiết khấu cơ bản !', { status: 'success' });
                      });
                    }
                  },
                  {
                    label: 'Hủy chiến dịch',
                    status: 'danger',
                    outline: true,
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { changeState: 'UNRECORDED' }, [{ Code: instance.rowData.Code }]).then(rs => {
                        this.refresh();
                        this.commonService.toastService.show(instance.rowData.Title, 'Đã hủy chiến dịch chiết khấu cơ bản !', { status: 'success' });
                      });
                    }
                  },
                ]);
              } else if (instance.rowData.State == 'RUNNING') {
                this.commonService.showDialog('Dừng chiến dịch chiết khấu cơ bản', 'Bạn có muốn dừng chiến dịch chiết khấu cơ bản "' + instance.rowData.Title + '", sau khi chiến dịch hoàn tất sẽ không thể thay đổi trạng thái được nữa !', [
                  {
                    label: 'Đóng',
                    status: 'basic',
                    outline: true,
                    action: () => true
                  },
                  {
                    label: 'Hoàn tất',
                    status: 'primary',
                    outline: true,
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { changeState: 'COMPLETE' }, [{ Code: instance.rowData.Code }]).then(rs => {
                        this.refresh();
                        this.commonService.toastService.show(instance.rowData.Title, 'Đã hoàn tất chiến dịch chiết khấu cơ bản !', { status: 'success' });
                      });
                    }
                  },
                  {
                    label: 'Hủy chiến dịch',
                    status: 'danger',
                    outline: true,
                    action: () => {
                      this.apiService.putPromise(this.apiPath, { changeState: 'UNRECORDED' }, [{ Code: instance.rowData.Code }]).then(rs => {
                        this.refresh();
                        this.commonService.toastService.show(instance.rowData.Title, 'Đã hủy chiến dịch chiết khấu cơ bản !', { status: 'success' });
                      });
                    }
                  },
                ]);
              } else {
                this.commonService.toastService.show(instance.rowData.Title, 'Không thể thay đổi trạng thái của chiến dịch đã hoàn tất !', { status: 'warning' });
              }
            });
          },
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: CollaboratorBasicStrategyModel[]) => {
      // data.map((product: CollaboratorBasicStrategyModel) => {
      //   if (product.WarehouseUnit && product.WarehouseUnit.Name) {
      //     product.WarehouseUnit.text = product.WarehouseUnit.Name;
      //   }
      //   return product;
      // });
      return data;
    };

    // Set DataSource: prepareParams
    source.prepareParams = (params: any) => {
      params['sort_Id'] = 'desc';
      if (this.collaboratorService.currentpage$.value) {
        params['page'] = this.collaboratorService.currentpage$.value;
      }
      return params;
    };

    return source;
  }

  /** Api delete funciton */
  async executeDelete(ids: any, success: (resp: any) => void, error?: (e: HttpErrorResponse) => void, complete?: (resp: any | HttpErrorResponse) => void) {
    const params = { id: ids, page: this.collaboratorService.currentpage$?.value };
    return super.executeDelete(params, success, error, complete);
  }

  getList(callback: (list: CollaboratorBasicStrategyModel[]) => void) {
    super.getList((rs) => {
      if (callback) callback(rs);
    });
  }

  onChangePage(page: PageModel) {
    this.collaboratorService.currentpage$.next(this.commonService.getObjectId(page));
    this.commonService.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
      this.refresh();
    });
  }

}
