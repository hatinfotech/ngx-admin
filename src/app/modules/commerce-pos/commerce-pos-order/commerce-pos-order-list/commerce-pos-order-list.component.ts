import { Component, OnInit } from '@angular/core';
import { CommercePosOrderModel } from '../../../../models/commerce-pos.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from '@nebular/theme';
import { CommercePosOrderFormComponent } from '../commerce-pos-order-form/commerce-pos-order-form.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';

@Component({
  selector: 'ngx-commerce-pos-order-list',
  templateUrl: './commerce-pos-order-list.component.html',
  styleUrls: ['./commerce-pos-order-list.component.scss'],
})
export class CommercePosOrderListComponent extends AgGridDataManagerListComponent<CommercePosOrderModel, CommercePosOrderFormComponent> implements OnInit {

  componentName: string = 'CommercePosOrderListComponent';
  formPath = '/commerce-pos/commerce-pos-order/form';
  apiPath = '/commerce-pos/orders';
  idKey = 'Code';

  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<CommercePosOrderListComponent>,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref);

    this.columnDefs = this.configSetting([
      {
        headerName: '#',
        width: 52,
        valueGetter: 'node.data.No',
        cellRenderer: 'loadingCellRenderer',
        sortable: false,
        pinned: 'left',
      },
      {
        headerName: 'Mã',
        field: 'Code',
        width: 130,
        filter: 'agTextColumnFilter',
        pinned: 'left',
      },
      {
        headerName: 'Tiêu đề',
        field: 'Title',
        width: 300,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        autoHeight: true,
      },
      {
        headerName: 'Khách hàng',
        field: 'Object',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Người tạo',
        field: 'Creator',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Ngày tạo',
        field: 'Created',
        width: 150,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Ngày bán hàng',
        field: 'DateOfSale',
        width: 150,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Chứng từ liên quan',
        field: 'RelativeVouchers',
        width: 200,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Số tiền',
        field: 'Amount',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'right'
      },
      {
        headerName: 'Trạng thái',
        field: 'State',
        width: 130,
        filter: 'agTextColumnFilter',
        pinned: 'right'
      },
    ]);

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: CommercePosOrderModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(CommercePosOrderFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: CommercePosOrderModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
    return false;
  }
}
