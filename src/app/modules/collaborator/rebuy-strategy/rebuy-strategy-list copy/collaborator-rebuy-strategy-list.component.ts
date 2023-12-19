import { CollaboratorService } from '../../collaborator.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { PageModel } from '../../../../models/page.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { filter, take } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { CollaboratorBasicStrategyListComponent } from '../../basic-strategy/basic-strategy-list/collaborator-basic-strategy-list.component';
import { IGetRowsParams } from 'ag-grid-community';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeTextColDef } from '../../../../lib/custom-element/ag-list/column-define/text.define';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { CollaboratorBasicStrategyModel } from '../../../../models/collaborator.model';
import { ContactModel } from '../../../../models/contact.model';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { CollaboratorBasicStrategyFormComponent } from '../../basic-strategy/basic-strategy-form/collaborator-basic-strategy-form.component';
import { ColDef } from '@ag-grid-community/core';

@Component({
  selector: 'ngx-collaborator-rebuy-strategy-list',
  templateUrl: './collaborator-rebuy-strategy-list.component.html',
  styleUrls: ['./collaborator-rebuy-strategy-list.component.scss'],
  providers: [CurrencyPipe, DatePipe],
})
export class CollaboratorRebuyStrategyListComponent extends AgGridDataManagerListComponent<CollaboratorBasicStrategyModel, CollaboratorBasicStrategyFormComponent> implements OnInit {

  componentName: string = 'CollaboratorBasicStrategyListComponent';
  formPath = '/collaborator/product/form';
  apiPath = '/collaborator/basic-strategies';
  idKey: string | string[] = ['Code'];
  formDialog = CollaboratorBasicStrategyFormComponent;
  currentPage: PageModel;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;
  // @Input() gridHeight = 'calc(100vh - 230px)';

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CollaboratorBasicStrategyListComponent>,
    public datePipe: DatePipe,
    public collaboratorService: CollaboratorService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    // this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

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

  async init() {
    return super.init().then(async state => {
      // Add page choosed
      this.collaboratorService.pageList$.pipe(filter(f => f && f.length > 0), take(1)).toPromise().then(pageList => {
        this.actionButtonList.unshift({
          type: 'select2',
          name: 'pbxdomain',
          status: 'success',
          label: 'Select page',
          icon: 'plus',
          title: this.cms.textTransform(this.cms.translate.instant('Collaborator.Page.title', { action: this.cms.translateText('Common.choose'), definition: '' }), 'head-title'),
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
          asyncValue: this.collaboratorService.currentpage$,
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

      await this.cms.waitForLanguageLoaded();

      const processingMap = {
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

      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'ID',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Code',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
          headerCheckboxSelection: true,
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Page',
          field: 'Page',
          // pinned: 'left',
          width: 150,
          filter: 'agTextColumnFilter',
          cellRenderer: AgTextCellRenderer,
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Mã',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          // pinned: 'left',
        },
        {
          headerName: 'Bắt đầu',
          field: 'DateOfStart',
          width: 150,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
          cellRendererParams: {
            format: 'shortDate'
          },
        },
        {
          headerName: 'Bắt đầu',
          field: 'DateOfStart',
          width: 150,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
          cellRendererParams: {
            format: 'shortDate'
          },
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: 'Tên',
          field: 'Title',
          // pinned: 'left',
          width: 900,
          filter: 'agTextColumnFilter',
        },
        {
          ...agMakeStateColDef(this.cms, processingMap, (data) => {
            const stateId = this.cms.getObjectId(data.State);
            if (stateId == 'NOTJUSTAPPROVED' || stateId == 'UNRECORDED') {
              this.cms.showDialog('Phê duyệt chiến dịch chiết khấu cơ bản', 'Bạn có muốn phê duyệt cho chiến dịch chiết khấu cơ bản "' + data.Title + '"', [
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
                    this.apiService.putPromise(this.apiPath, { changeState: 'APPROVED' }, [{ Code: data.Code }]).then(rs => {
                      this.refresh();
                      this.cms.toastService.show(data.Title, 'Đã phê duyệt chiến dịch chiết khấu cơ bản !', { status: 'success' });
                    });
                  }
                }
              ]);
            } else if (stateId == 'APPROVED') {
              this.cms.showDialog('Khởi chạy chiến dịch chiết khấu cơ bản', 'Bạn có muốn khởi chạy chiến dịch chiết khấu cơ bản "' + data.Title + '"', [
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
                    this.apiService.putPromise(this.apiPath, { changeState: 'RUNNING' }, [{ Code: data.Code }]).then(rs => {
                      this.refresh();
                      this.cms.toastService.show(data.Title, 'Đã khởi chạy chiến dịch chiết khấu cơ bản !', { status: 'success' });
                    });
                  }
                },
                {
                  label: 'Hủy chiến dịch',
                  status: 'danger',
                  outline: true,
                  action: () => {
                    this.apiService.putPromise(this.apiPath, { changeState: 'UNRECORDED' }, [{ Code: data.Code }]).then(rs => {
                      this.refresh();
                      this.cms.toastService.show(data.Title, 'Đã hủy chiến dịch chiết khấu cơ bản !', { status: 'success' });
                    });
                  }
                },
              ]);
            } else if (stateId == 'RUNNING') {
              this.cms.showDialog('Dừng chiến dịch chiết khấu cơ bản', 'Bạn có muốn dừng chiến dịch chiết khấu cơ bản "' + data.Title + '", sau khi chiến dịch hoàn tất sẽ không thể thay đổi trạng thái được nữa !', [
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
                    this.apiService.putPromise(this.apiPath, { changeState: 'COMPLETE' }, [{ Code: data.Code }]).then(rs => {
                      this.refresh();
                      this.cms.toastService.show(data.Title, 'Đã hoàn tất chiến dịch chiết khấu cơ bản !', { status: 'success' });
                    });
                  }
                },
                {
                  label: 'Hủy chiến dịch',
                  status: 'danger',
                  outline: true,
                  action: () => {
                    this.apiService.putPromise(this.apiPath, { changeState: 'UNRECORDED' }, [{ Code: data.Code }]).then(rs => {
                      this.refresh();
                      this.cms.toastService.show(data.Title, 'Đã hủy chiến dịch chiết khấu cơ bản !', { status: 'success' });
                    });
                  }
                },
              ]);
            } else {
              this.cms.toastService.show(data.Title, 'Không thể thay đổi trạng thái của chiến dịch đã hoàn tất !', { status: 'warning' });
            }
          }),
          headerName: 'Trạng thái',
          field: 'State',
          width: 155,
        },
        {
          ...agMakeCommandColDef(this, this.cms, true, (data) => {
            this.deleteConfirm([data.Code]);
          }, false, [
          ]),
          headerName: 'Sửa/Xóa',
        },
      ] as ColDef[]);

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['page'] = this.collaboratorService?.currentpage$?.value;
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ContactModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(ContactFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ContactModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
    return false;
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  onChangePage(page: PageModel) {
    if (page !== null) {
      this.collaboratorService.currentpage$.next(this.cms.getObjectId(page));
      this.cms.takeOnce(this.componentName + '_on_domain_changed', 1000).then(() => {
        this.refresh();
      });
    }
  }
}
