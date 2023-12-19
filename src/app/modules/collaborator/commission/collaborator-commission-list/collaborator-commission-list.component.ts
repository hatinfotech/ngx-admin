import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { filter, take } from 'rxjs/operators';
import { AppModule } from '../../../../app.module';
import { CollaboratorCommissionVoucherModel } from '../../../../models/collaborator.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorCommissionFormComponent } from '../collaborator-commission-form/collaborator-commission-form.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';
import { ColDef, IGetRowsParams } from '@ag-grid-community/core';
import { DatePipe } from '@angular/common';
import { AgDateCellRenderer } from '../../../../lib/custom-element/ag-list/cell/date.component';
import { AgTextCellRenderer } from '../../../../lib/custom-element/ag-list/cell/text.component';
import { agMakeCommandColDef } from '../../../../lib/custom-element/ag-list/column-define/command.define';
import { agMakeSelectionColDef } from '../../../../lib/custom-element/ag-list/column-define/selection.define';
import { agMakeStateColDef } from '../../../../lib/custom-element/ag-list/column-define/state.define';
import { agMakeTextColDef } from '../../../../lib/custom-element/ag-list/column-define/text.define';
import { ContactModel } from '../../../../models/contact.model';
import { PageModel } from '../../../../models/page.model';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { CollaboratorBasicStrategyListComponent } from '../../basic-strategy/basic-strategy-list/collaborator-basic-strategy-list.component';
import { CollaboratorService } from '../../collaborator.service';
import { agMakeTagsColDef } from '../../../../lib/custom-element/ag-list/column-define/tags.define';
import { agMakeCurrencyColDef } from '../../../../lib/custom-element/ag-list/column-define/currency.define';

@Component({
  selector: 'ngx-collaborator-commission-list',
  templateUrl: './collaborator-commission-list.component.html',
  styleUrls: ['./collaborator-commission-list.component.scss']
})
export class CollaboratorCommissionListComponent extends AgGridDataManagerListComponent<CollaboratorCommissionVoucherModel, CollaboratorCommissionFormComponent> implements OnInit {

  componentName: string = 'CollaboratorCommissionListComponent';
  formPath = '/collaborator/commission-voucher/form';
  apiPath = '/collaborator/commission-vouchers';
  idKey = 'Code';
  formDialog = CollaboratorCommissionFormComponent;

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
          value: this.collaboratorService.currentpage$.value,
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

      const processingMap = AppModule.processMaps['commissionVoucher'];
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
          headerName: this.cms.textTransform(this.cms.translate.instant('Common.Object.title'), 'head-title'),
          field: 'PublisherName',
          // pinned: 'left',
          width: 150,
          filter: 'agTextColumnFilter',
          cellRenderer: AgTextCellRenderer,
        },
        {
          ...agMakeTextColDef(this.cms),
          headerName: this.cms.textTransform(this.cms.translate.instant('Common.description'), 'head-title'),
          field: 'Description',
          // pinned: 'left',
          width: 250,
          filter: 'agTextColumnFilter',
          cellRenderer: AgTextCellRenderer,
        },
        {
          ...agMakeTagsColDef(this.cms, (tag) => {
            this.cms.previewVoucher(tag.type, tag.id);
          }),
          headerName: 'Chứng từ liên quan',
          field: 'RelativeVouchers',
          width: 300,
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
          headerName: this.cms.textTransform(this.cms.translate.instant('Common.fromDate'), 'head-title'),
          field: 'CommissionFrom',
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
          headerName: this.cms.textTransform(this.cms.translate.instant('Common.toDate'), 'head-title'),
          field: 'CommissionTo',
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
          ...agMakeCurrencyColDef(this.cms),
          headerName: this.cms.textTransform(this.cms.translate.instant('Common.numOfMoney'), 'head-title'),
          field: 'Amount',
          // pinned: 'right',
          width: 150,
        },
        {
          ...agMakeStateColDef(this.cms, processingMap, (data) => {
            // this.preview([data]);
            if (this.cms.getObjectId(data.State) == 'PROCESSING') {
              this.openForm([data.Code]);
            } else {
              this.preview([data]);
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
