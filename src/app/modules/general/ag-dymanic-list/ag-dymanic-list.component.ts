import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { AgGridDataManagerListComponent } from "../../../lib/data-manager/ag-grid-data-manger-list.component";
import { Model } from "../../../models/model";
import { DataManagerFormComponent } from "../../../lib/data-manager/data-manager-form.component";
import { ApiService } from "../../../services/api.service";
import { NbDialogRef, NbDialogService, NbThemeService, NbToastrService } from "@nebular/theme";
import { Router } from "@angular/router";
import { CommonService } from "../../../services/common.service";
import { IGetRowsParams } from "@ag-grid-community/core";


@Component({
  selector: 'ngx-ag-dynamic-list',
  templateUrl: './ag-dymanic-list.component.html',
  styleUrls: ['./ag-dymanic-list.component.scss'],
  providers: [DatePipe, TranslatePipe]
})
export class AgDynamicListComponent<M> extends AgGridDataManagerListComponent<Model, DataManagerFormComponent<M>> implements OnInit {


  componentName: string = 'AgDynamicListComponent';
  // formPath = '/commerce-pos/commerce-pos-order/form';
  // apiPath = '/commerce-pos/orders';
  // idKey = 'Code';
  // @Input() formDialog: DataManagerFormComponent<M>;
  // printDialog = CommercePosOrderPrintComponent;

  // AG-Grid config
  // @Input() rowHeight: number = 75;

  @Input() width = '100%';
  @Input() height = '500px';
  @Input() isEmbed = false;
  @Output() onReady = new EventEmitter<any>();


  constructor(
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<AgDynamicListComponent<M>>,
    public datePipe: DatePipe,
  ) {
    super(apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
    this.rowData;
  }

  async init() {
    return super.init().then(async state => {
      if (this.onInit) {
        this.onInit(this);
      }
      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  @Input() prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeCreator'] = true;
    params['includeObject'] = true;
    params['includeRelativeVouchers'] = true;
    // params['sort_Id'] = 'desc';
    return params;
  }

  /** Implement required */
  // openFormDialplog(ids?: string[], onDialogSave?: (newData: CommercePosOrderModel[]) => void, onDialogClose?: () => void) {
  //   this.cms.openDialog(CommercePosOrderFormComponent, {
  //     context: {
  //       inputMode: 'dialog',
  //       inputId: ids,
  //       onDialogSave: (newData: CommercePosOrderModel[]) => {
  //         if (onDialogSave) onDialogSave(newData);
  //       },
  //       onDialogClose: () => {
  //         if (onDialogClose) onDialogClose();
  //       },
  //     },
  //   });
  //   return false;
  // }

  onGridReady(params) {
    super.onGridReady(params);
    this.onReady && this.onReady.next(params);
    // const columnsState = this.gridColumnApi.getColumnState();
    // const defaultFilter = columnsState.find(f => f.colId === 'Id');
    // if (defaultFilter) {
    //   defaultFilter.sort = 'desc';
    // }
    // this.gridColumnApi.applyColumnState({
    //   state: columnsState,
    //   applyOrder: true,
    // });
  }

  openFormDialplog(ids?: string[], onDialogSave?: (newData: Model[]) => void, onDialogClose?: () => void): void {
    throw new Error("Method not implemented.");
  }
}
