import { ColDef, IGetRowsParams, IRowNode } from "@ag-grid-community/core";
import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogRef, NbDialogService, NbToastrService, NbThemeService } from "@nebular/theme";
import { AppModule } from "../../../../app.module";
import { AgDateCellRenderer } from "../../../../lib/custom-element/ag-list/cell/date.component";
import { AgTextCellRenderer } from "../../../../lib/custom-element/ag-list/cell/text.component";
import { agMakeCommandColDef } from "../../../../lib/custom-element/ag-list/column-define/command.define";
import { agMakeCurrencyColDef } from "../../../../lib/custom-element/ag-list/column-define/currency.define";
import { agMakeSelectionColDef } from "../../../../lib/custom-element/ag-list/column-define/selection.define";
import { agMakeStateColDef } from "../../../../lib/custom-element/ag-list/column-define/state.define";
import { agMakeTagsColDef } from "../../../../lib/custom-element/ag-list/column-define/tags.define";
import { AgSelect2Filter } from "../../../../lib/custom-element/ag-list/filter/select2.component.filter";
import { AgGridDataManagerListComponent } from "../../../../lib/data-manager/ag-grid-data-manger-list.component";
import { CashVoucherModel } from "../../../../models/accounting.model";
import { ApiService } from "../../../../services/api.service";
import { CommonService } from "../../../../services/common.service";
import { RootServices } from "../../../../services/root.services";
import { CashReceiptVoucherFormComponent } from "../../../accounting/cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component";
import { CashReceiptVoucherPrintComponent } from "../../../accounting/cash/receipt/cash-receipt-voucher-print/cash-receipt-voucher-print.component";
import { agMakeButtonsColDef } from "../../../../lib/custom-element/ag-list/column-define/buttons.define";
import { agMakeImageColDef } from "../../../../lib/custom-element/ag-list/column-define/image.define";
import { agMakeNumberColDef } from "../../../../lib/custom-element/ag-list/column-define/number.define";
import { ProductModel } from "../../../../models/product.model";
import { AgDynamicListComponent } from "../../../general/ag-dymanic-list/ag-dymanic-list.component";
import { WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent } from "../../goods-receipt-note/warehouse-goods-access-number-print/warehouse-goods-access-number-print.component";
import { AssignNewContainerFormComponent } from "../../goods/assign-new-containers-form/assign-new-containers-form.component";
import { WarehouseGoodsFindOrderTempPrintComponent } from "../../goods/warehouse-goods-find-order-temp-print/warehouse-goods-find-order-temp-print.component";
import { AgNumberCellInput } from "../../../../lib/custom-element/ag-list/cell/input/number.component";
import { Model } from "../../../../models/model";
import { SalesMasterPriceTableDetailModel } from "../../../../models/sales.model";
import { AgCurrencyCellInput } from "../../../../lib/custom-element/ag-list/cell/input/curency.component";


@Component({
  selector: 'ngx-warehouse-book-head-amount',
  templateUrl: './warehouse-book-head-amount.component.html',
  styleUrls: ['./warehouse-book-head-amount.component.scss']
})
export class WarehouseBookHeadAmountComponent extends AgGridDataManagerListComponent<ProductModel, CashReceiptVoucherFormComponent> implements OnInit {

  componentName: string = 'WarehouseBookHeadAmountComponent';
  formPath = '/accounting/cash-receipt-voucher/form';
  apiPath = '/warehouse/goods';
  idKey = ['Code', 'Unit', 'Container'];
  // formDialog = CashReceiptVoucherFormComponent;
  // printDialog = CashReceiptVoucherPrintComponent;

  reuseDialog = true;
  static _dialog: NbDialogRef<WarehouseBookHeadAmountComponent>;

  // AG-Grid config
  public rowHeight: number = 50;
  // @Input() suppressRowClickSelection = false;

  @Input() gridHeight = '100%';
  @Input() warehouseBook: Model;
  hideChooseButton = true;

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public themeService: NbThemeService,
    public ref: NbDialogRef<WarehouseBookHeadAmountComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, themeService, ref);

    this.defaultColDef = {
      ...this.defaultColDef,
      cellClass: 'ag-cell-items-center',
    }

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = 100;
    this.cacheBlockSize = 100;
  }

  async init() {
    return super.init().then(async state => {
      // this.actionButtonList.unshift({
      //   type: 'button',
      //   name: 'unrecord',
      //   status: 'warning',
      //   label: 'Bỏ ghi',
      //   title: 'Bỏ ghi các phiếu đã chọn',
      //   size: 'medium',
      //   icon: 'slash-outline',
      //   disabled: () => {
      //     return this.selectedIds.length == 0;
      //   },
      //   click: () => {
      //     this.cms.showDialog('Phiếu mua hàng', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
      //       {
      //         label: 'Trở về',
      //         status: 'basic',
      //         action: () => {
      //         }
      //       },
      //       {
      //         label: 'Bỏ ghi',
      //         status: 'warning',
      //         focus: true,
      //         action: () => {
      //           this.apiService.putPromise(this.apiPath, { changeState: 'UNRECORDED' }, this.selectedIds.map(id => ({ Code: id }))).then(rs => {
      //             this.cms.toastService.show('Bỏ ghi thành công !', 'Phiếu mua hàng', { status: 'success' });
      //             this.refresh();
      //           });
      //         }
      //       },
      //     ]);
      //   }
      // });
      // this.actionButtonList.unshift({
      //   type: 'button',
      //   name: 'writetobook',
      //   status: 'primary',
      //   label: 'Duyệt',
      //   title: 'Duyệt các phiếu đã chọn',
      //   size: 'medium',
      //   icon: 'checkmark-square-outline',
      //   disabled: () => {
      //     return this.selectedIds.length == 0;
      //   },
      //   click: () => {
      //     this.cms.showDialog('Phiếu mua hàng', 'Bạn có chắc muốn bỏ ghi các đơn hàng đã chọn ?', [
      //       {
      //         label: 'Trở về',
      //         status: 'basic',
      //         action: () => {
      //         }
      //       },
      //       {
      //         label: 'Duyệt',
      //         status: 'primary',
      //         focus: true,
      //         action: () => {
      //           this.apiService.putPromise(this.apiPath, { changeState: 'APPROVED' }, this.selectedIds.map(id => ({ Code: id }))).then(rs => {
      //             this.cms.toastService.show('Duyệt thành công !', 'Phiếu mua hàng', { status: 'success' });
      //             this.refresh();
      //           });
      //         }
      //       },
      //     ]);
      //   }
      // });
      // this.actionButtonList.unshift({
      //   type: 'button',
      //   name: 'writetobook',
      //   status: 'danger',
      //   label: 'Ghi sổ lại',
      //   title: 'Ghi sổ lại',
      //   size: 'medium',
      //   icon: 'npm-outline',
      //   disabled: () => {
      //     return this.selectedIds.length == 0;
      //   },
      //   click: () => {
      //     this.cms.openDialog(DialogFormComponent, {
      //       context: {
      //         title: 'ID phiếu cần ghi sổ lại',
      //         width: '600px',
      //         onInit: async (form, dialog) => {
      //           return true;
      //         },
      //         controls: [
      //           {
      //             name: 'Ids',
      //             label: 'Link hình',
      //             placeholder: 'Mỗi ID trên 1 dòng',
      //             type: 'textarea',
      //             initValue: this.selectedIds.join('\n'),
      //           },
      //         ],
      //         actions: [
      //           {
      //             label: 'Trở về',
      //             icon: 'back',
      //             status: 'basic',
      //             action: async () => { return true; },
      //           },
      //           {
      //             label: 'Ghi sổ lại',
      //             icon: 'npm-outline',
      //             status: 'danger',
      //             action: async (form: FormGroup) => {

      //               let ids: string[] = form.get('Ids').value.trim()?.split('\n');

      //               if (ids && ids.length > 0) {
      //                 let toastRef = this.cms.showToast('Các đơn hàng đang được ghi sổ lại', 'Đang ghi sổ lại', { status: 'info', duration: 60000 });
      //                 try {
      //                   ids = [...new Set(ids)];
      //                   this.loading = true;
      //                   await this.apiService.putPromise(this.apiPath, { reChangeState: 'UNRECORDED,APPROVED' }, ids.map(id => ({ Code: id.trim() })));
      //                   toastRef.close();
      //                   toastRef = this.cms.showToast('Các đơn hàng đã được ghi sổ lại', 'Hoàn tất ghi sổ lại', { status: 'success', duration: 10000 });
      //                   this.loading = false;
      //                 } catch (err) {
      //                   console.error(err);
      //                   this.loading = false;
      //                   toastRef.close();
      //                   toastRef = this.cms.showToast('Các đơn hàng chưa đượ ghi sổ lại do có lỗi xảy ra trong quá trình thực thi', 'Lỗi ghi sổ lại', { status: 'danger', duration: 30000 });
      //                 }
      //               }

      //               return true;
      //             },
      //           },
      //         ],
      //       },
      //     });
      //   }
      // });

      const processingMap = AppModule.processMaps['cashVoucher'];
      await this.cms.waitForLanguageLoaded();
      this.columnDefs = this.configSetting([
        {
          ...agMakeSelectionColDef(this.cms),
          headerName: 'STT',
          field: 'Id',
          width: 100,
          valueGetter: 'node.data.Id',
          // sortingOrder: ['desc', 'asc'],
          initialSort: 'desc',
          headerCheckboxSelection: true,
        },
        {
          ...agMakeImageColDef(this.cms, null, (rowData) => {
            return rowData.Pictures?.map(m => m['LargeImage']);
          }),
          headerName: 'Hình',
          pinned: 'left',
          field: 'FeaturePicture',
          width: 100,
        },
        {
          headerName: 'ID',
          field: 'Code',
          width: 140,
          filter: 'agTextColumnFilter',
          pinned: 'left',
          // initialSort: 'desc',
        },
        {
          headerName: 'Sku',
          field: 'Sku',
          pinned: 'left',
          width: 120,
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Tên',
          field: 'Name',
          pinned: 'left',
          width: 350,
          filter: 'agTextColumnFilter',
          cellRenderer: AgTextCellRenderer,
        },
        // {
        //   headerName: 'DS ',
        //   field: 'Units',
        //   // pinned: 'left',
        //   width: 200,
        //   cellRenderer: AgTextCellRenderer,
        //   filter: AgSelect2Filter,
        //   filterParams: {
        //     select2Option: {
        //       ...this.cms.makeSelect2AjaxOption('/admin-product/units', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
        //         placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
        //           item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        //           return item;
        //         }
        //       }),
        //       multiple: true,
        //       logic: 'OR',
        //       allowClear: true,
        //     }
        //   },
        // },
        {
          headerName: 'Vị trí',
          field: 'Container',
          // pinned: 'left',
          width: 300,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/warehouse/goods-containers', { onlyIdText: true }, {
                placeholder: 'Chọn vị trí...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = '[' + item['FindOrder'] + ']' + item['text'] + ' (' + item['id'] + ')';
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Kho',
          field: 'Warehouse',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/warehouse/warehouses', { onlyIdText: true }, {
                placeholder: 'Chọn kho...', limit: 10, prepareReaultItem: (item) => {
                  // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Kệ',
          field: 'ContainerShelf',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/warehouse/goods-containers', { onlyIdText: true, eq_Type: 'SHELF' }, {
                placeholder: 'Chọn kệ...', limit: 10, prepareReaultItem: (item) => {
                  // item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Danh mục',
          field: 'Categories',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/categories', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn danh mục...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Nhóm',
          field: 'Groups',
          // pinned: 'left',
          width: 200,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              ...this.cms.makeSelect2AjaxOption('/admin-product/groups', { includeIdText: true, includeGroups: true, sort_Name: 'asc' }, {
                placeholder: 'Chọn nhóm...', limit: 10, prepareReaultItem: (item) => {
                  item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
                  return item;
                }
              }),
              multiple: true,
              logic: 'OR',
              allowClear: true,
            }
          },
        },
        {
          headerName: 'Ngày tạo',
          field: 'Created',
          width: 180,
          filter: 'agDateColumnFilter',
          filterParams: {
            inRangeFloatingFilterDateFormat: 'DD/MM/YY',
          },
          cellRenderer: AgDateCellRenderer,
        },
        {
          headerName: 'Giá tồn kho',
          field: 'UnitPrice',
          width: 150,
          filter: 'agTextColumnFilter',
          pinned: 'right',
          type: 'rightAligned',
          cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
          cellRenderer: AgCurrencyCellInput,
          cellStyle: { border: "none" },
          keyup: (value, params?: { [key: string]: any, node: IRowNode<ProductModel> }) => {
            params.status = 'warning';
          },
          cellRendererParams: {
            xxx: (value, params) => {
              // this.apiService.putPromise<any[]>('/wordpress/products/' + params.node.data.Id, {}, [{
              //   Id: params.node.data.Id,
              //   SalePrice: value,
              // }]).then(rs => {
              //   params.status = 'success';
              // });
              this.loading = true;
              this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/warehouse/books', {
                id: [this.cms.getObjectId(this.warehouseBook)],
                updateHeadInventory: true,
                goods: params.node.data.Code,
                unit: this.cms.getObjectId(params.node.data.Unit),
                container: this.cms.getObjectId(params.node.data.Container),
                // inventory: newAcList.length,
                // unitPrice: row.UnitPrice,
                currency: this.cms.loginInfo.configuration.defaultCurrency,
              }, [{
                AccessNumbers: params.node.data.HeadAccessNumbers,
                Inventory: params.node.data.HeadInventory,
                UnitPrice: parseFloat(value),
              }]).then(async rs => {
                console.log(rs);
                this.loading = false;
                // component.close();
                this.refresh();
              }).catch(err => {
                this.loading = false;
                return Promise.reject(err);
              });
            }
          }
        },
        {
          // ...agMakeNumberColDef(this.cms),
          headerName: 'Tồn đầu',
          field: 'HeadInventory',
          width: 150,
          type: 'rightAligned',
          cellClass: ['ag-cell-items-center', 'ag-cell-justify-end'],
          filter: 'agNumberColumnFilter',
          cellRenderer: AgNumberCellInput,
          pinned: 'right',
          cellRendererParams: {
            digits: 2,
            // changed: (value, params?: { node: IRowNode<ProductionOrderFinishedGoodsModel> }) => {
            //   // const distributePercent = parseFloat(value);
            //   // const balance = parseFloat(params.node.data.Balance);
            //   // params.node.updateData({ ...params.node.data, DistributedValue: balance * (distributePercent / 100) });
            // },
            keyup: (value, params?: { [key: string]: any, node: IRowNode<ProductModel> }) => {
              params.status = 'warning';
            },
            xxx: (value, params?: { node: IRowNode<ProductModel> }) => {
              const headAmount = parseFloat(value);
              console.log(headAmount);

              this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/warehouse/books', {
                id: [this.cms.getObjectId(this.warehouseBook)],
                updateHeadInventory: true,
                goods: params.node.data.Code,
                unit: this.cms.getObjectId(params.node.data.Unit),
                container: this.cms.getObjectId(params.node.data.Container),
                // inventory: newAcList.length,
                // unitPrice: row.UnitPrice,
                // currency: this.cms.loginInfo.configuration.defaultCurrency,
              }, [{
                AccessNumbers: params.node.data.HeadAccessNumbers,
                Inventory: headAmount,
                UnitPrice: params.node.data.UnitPrice,
              }]).then(async rs => {
                console.log(rs);
                this.loading = false;
                // component.close();
                this.refresh();
              }).catch(err => {
                this.loading = false;
                return Promise.reject(err);
              });
            },
          },
        },
        {
          ...agMakeNumberColDef(this.cms),
          headerName: 'Tồn kho',
          field: 'Inventory',
          pinned: 'right',
          width: 120,
        },
        {
          headerName: 'ĐVT',
          field: 'Unit',
          pinned: 'right',
          width: 100,
          cellRenderer: AgTextCellRenderer,
          filter: AgSelect2Filter,
          filterParams: {
            select2Option: {
              placeholder: 'Chọn ĐVT...',
              allowClear: true,
              width: '100%',
              dropdownAutoWidth: true,
              minimumInputLength: 0,
              withThumbnail: false,
              keyMap: {
                id: 'id',
                text: 'text',
              },
              multiple: true,
              logic: 'OR',
              data: this.rsv.adminProductService.unitList$.value,
            }
          },
        },
        // {
        //   ...agMakeNumberColDef(this.cms),
        //   headerName: 'Giá trị tồn',
        //   field: 'InventoryCost',
        //   pinned: 'right',
        //   width: 120,
        // },
        {
          ...agMakeButtonsColDef(this.cms, [{
            name: 'update',
            // label: '',
            status: 'success',
            outline: false,
            icon: 'save-outline',
            // disabled: (data: any) => !data.IsManageByAccessNumber,
            action: async (nodeParams: any, buttonConfig: ProductModel) => {
              // const headAmount = parseFloat(value);
              // console.log(headAmount);
              this.loading = true;
              this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/warehouse/books', {
                id: [this.cms.getObjectId(this.warehouseBook)],
                updateHeadInventory: true,
                goods: nodeParams.node.data.Code,
                unit: this.cms.getObjectId(nodeParams.node.data.Unit),
                container: this.cms.getObjectId(nodeParams.node.data.Container),
                // inventory: newAcList.length,
                // unitPrice: row.UnitPrice,
                // currency: this.cms.loginInfo.configuration.defaultCurrency,
              }, [{
                AccessNumbers: nodeParams.node.data.HeadAccessNumbers || [],
                Inventory: parseFloat(nodeParams.node.data.HeadInventory),
                UnitPrice: parseFloat(nodeParams.node.data.UnitPrice),
              }]).then(async rs => {
                console.log(rs);
                this.loading = false;
                // component.close();
                const node = this.gridApi.getRowNode(this.makeId(nodeParams.node.data));
                if (node) node.setData({ ...nodeParams.node.data, HeadAccessNumbers: rs[0].AccessNumbers, HeadInventory: rs[0].Inventory, UnitPrice: rs[0].UnitPrice });

              }).catch(err => {
                this.loading = false;
                return Promise.reject(err);
              });
              return true;
            }
          },
          {
            name: 'showDetails',
            // label: '',
            status: 'danger',
            outline: false,
            icon: 'external-link-outline',
            // disabled: (data: any) => !data.IsManageByAccessNumber,
            action: async (nodeParams: any, buttonConfig: ProductModel) => {
              if (!nodeParams.data.Container) {
                this.cms.showToast('Bạn chỉ có thể in tem nhận thức cho các hàng hóa đã cài đặt vị trí.', 'Hàng hóa chưa được cài đặt vị trí !', { status: 'warning' });
                return;
              }
              if (!nodeParams.data.IsManageByAccessNumber) {

                return false;
              }

              //   this.cms.openDialog(AgDynamicListComponent, {
              //     context: {
              //       title: 'Lịch sử nhập hàng',
              //       width: '90%',
              //       height: '95vh',
              //       apiPath: '/accounting/reports',
              //       idKey: ['Voucher', 'WriteNo'],
              //       getRowNodeId: (item) => {
              //         return item.Voucher + '-' + item.WriteNo;
              //       },
              //       // rowMultiSelectWithClick: true,
              //       // suppressRowClickSelection: false,
              //       prepareApiParams: (exParams, getRowParams) => {
              //         exParams['eq_VoucherType'] = 'PURCHASE';
              //         exParams['eq_Accounts'] = [632, 151, 152, 153, 154, 155, 156, 157, 158];
              //         exParams['reportDetailByAccountAndObject'] = true;
              //         exParams['groupBy'] = 'Voucher,WriteNo';
              //         exParams['eq_Product'] = `[${nodeParams.node.data.Code}]`;
              //         return exParams;
              //       },
              //       onDialogChoose: (chooseItems) => {

              //       },
              //       columnDefs: [
              //         {
              //           ...agMakeSelectionColDef(this.cms),
              //           headerName: 'STT',
              //           // width: 52,
              //           field: 'Id',
              //           valueGetter: 'node.data.Voucher',
              //         },
              //         {
              //           headerName: 'Ngày nhập',
              //           field: 'VoucherDate',
              //           width: 180,
              //           filter: 'agDateColumnFilter',
              //           filterParams: {
              //             inRangeFloatingFilterDateFormat: 'DD/MM/YY',
              //           },
              //           cellRenderer: AgDateCellRenderer,
              //           // initialSort: 'desc'
              //         },
              //         {
              //           headerName: 'Voucher',
              //           field: 'Voucher',
              //           width: 200,
              //           filter: 'agTextColumnFilter',
              //           headerComponentParams: { enableMenu: true, menuIcon: 'fa-external-link-alt' },
              //           filterParams: {
              //             filterOptions: ['contains'],
              //             textMatcher: ({ value, filterText }) => {
              //               var literalMatch = this.cms.smartFilter(value, filterText);
              //               return literalMatch;
              //             },
              //             trimInput: true,
              //             debounceMs: 1000,
              //           },
              //           cellRenderer: AgTextCellRenderer,
              //           pinned: 'left',
              //         },
              //         {
              //           headerName: this.cms.textTransform(this.cms.translate.instant('Common.supplier'), 'head-title'),
              //           field: 'Object',
              //           pinned: 'left',
              //           width: 250,
              //           cellRenderer: AgTextCellRenderer,
              //           valueGetter: 'node.data.ObjectName',
              //           filter: AgSelect2Filter,
              //           filterParams: {
              //             select2Option: {
              //               ...this.cms.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true, sort_SearchRank: 'desc' }, {
              //                 placeholder: 'Chọn liên hệ...', limit: 10, prepareReaultItem: (item) => {
              //                   item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
              //                   return item;
              //                 }
              //               }),
              //               multiple: true,
              //               logic: 'OR',
              //               allowClear: true,
              //             }
              //           },
              //         },
              //         {
              //           headerName: 'Tiêu đề',
              //           field: 'VoucherDescription',
              //           width: 400,
              //           filter: 'agTextColumnFilter',
              //           headerComponentParams: { enableMenu: true, menuIcon: 'fa-external-link-alt' },
              //           filterParams: {
              //             filterOptions: ['contains'],
              //             textMatcher: ({ value, filterText }) => {
              //               var literalMatch = this.cms.smartFilter(value, filterText);
              //               return literalMatch;
              //             },
              //             trimInput: true,
              //             debounceMs: 1000,
              //           }
              //         },
              //         {
              //           headerName: 'Tên sản phẩm',
              //           field: 'Product',
              //           width: 400,
              //           valueGetter: 'node.data.Description',
              //           filter: 'agTextColumnFilter',
              //           headerComponentParams: { enableMenu: true, menuIcon: 'fa-external-link-alt' },
              //           filterParams: {
              //             filterOptions: ['contains'],
              //             textMatcher: ({ value, filterText }) => {
              //               var literalMatch = this.cms.smartFilter(value, filterText);
              //               return literalMatch;
              //             },
              //             trimInput: true,
              //             debounceMs: 1000,
              //           }
              //         },
              //         {
              //           ...agMakeNumberColDef(this.cms),
              //           headerName: 'Số lượng',
              //           field: 'Quantity',
              //           pinned: 'right',
              //           width: 120,
              //         },
              //         {
              //           headerName: 'ĐVT',
              //           field: 'ProductUnit',
              //           width: 100,
              //           pinned: 'right',
              //           // cellRenderer: AgTextCellRenderer,
              //           valueFormatter: 'node.data.ProductUnitLabel',
              //           filter: AgSelect2Filter,
              //           filterParams: {
              //             select2Option: {
              //               placeholder: 'Chọn...',
              //               allowClear: true,
              //               width: '100%',
              //               dropdownAutoWidth: true,
              //               minimumInputLength: 0,
              //               withThumbnail: false,
              //               keyMap: {
              //                 id: 'id',
              //                 text: 'text',
              //               },
              //               data: this.rsv.adminProductService.unitList$.value,
              //               multiple: true,
              //               logic: 'OR',
              //             }
              //           },
              //         },
              //       ],
              //       onInit: (component) => {
              //         component.actionButtonList = component.actionButtonList.filter(f => ['close', 'choose', 'preview', 'refresh'].indexOf(f.name) > -1);
              //       }
              //     }
              //   });

              //   return true;
              // }

              let acListComponent: AgDynamicListComponent<Model> = null;
              this.cms.openDialog(AgDynamicListComponent, {
                context: {
                  title: 'Số truy xuất',
                  width: '500px',
                  height: '95vh',
                  // apiPath: '/warehouse/goods-receipt-note-detail-access-numbers',
                  hideChooseButton: true,
                  rowModelType: 'clientSide',
                  idKey: ['AccessNumber'],
                  rowData: (nodeParams.data.HeadAccessNumbers || []).map(ac => ({ AccessNumber: ac })),
                  // rowMultiSelectWithClick: true,
                  // suppressRowClickSelection: false,
                  // rowModelType: 'clientSide',
                  // rowData: data.AccessNumbers?.map(accessNumber => ({
                  //   ...data,
                  //   AccessNumber: accessNumber,
                  // })),
                  getRowNodeId: (item: any) => {
                    return item.AccessNumber
                  },
                  // prepareApiParams: (params, getRowParams) => {
                  //   // const sites = formGroup.get('Sites').value;
                  //   params['id'] = nodeParams.data.AccessNumbers && nodeParams.data.AccessNumbers.length > 0 ? nodeParams.data.AccessNumbers : '-1';
                  //   params['includeVoucherInfo'] = true;
                  //   return params;
                  // },
                  onDialogChoose: (chooseItems) => {
                    console.log(chooseItems);
                    if (chooseItems && chooseItems.length > 0) {
                      // this.loading = true;
                      this.cms.openDialog(WarehouseGoodsReceiptNoteDetailAccessNumberPrintComponent, {
                        context: {
                          id: chooseItems.map(m => this.cms.getObjectId(m['AccessNumber']))
                        }
                      });
                    }

                  },
                  columnDefs: [
                    {
                      ...agMakeSelectionColDef(this.cms),
                      headerName: 'STT',
                      // width: 52,
                      field: 'Id',
                      valueGetter: 'node.data.AccessNumber',
                      // cellRenderer: 'loadingCellRenderer',
                      // sortable: true,
                      // pinned: 'left',
                    },
                    {
                      headerName: 'Số truy xuất',
                      field: 'AccessNumber',
                      width: 450,
                      // pinned: 'right',
                      filter: 'agTextColumnFilter',
                      autoHeight: true,
                    },
                    {
                      ...agMakeCommandColDef(this, this.cms, false, (data) => {
                        acListComponent.gridApi.applyTransaction({ remove: [data] });
                      }, false),
                      headerName: 'Lệnh',
                    },
                  ],
                  onInit: (component) => {
                    acListComponent = component as any;
                    component.actionButtonList.unshift(
                      {
                        name: 'save',
                        status: 'primary',
                        label: this.cms.textTransform(this.cms.translate.instant('Lưu thay đổi'), 'head-title'),
                        icon: 'checkmark-square',
                        title: this.cms.textTransform(this.cms.translate.instant('Lưu danh sách số truy xuất hiện tại'), 'head-title'),
                        size: 'medium',
                        disabled: () => false,
                        hidden: () => false,
                        click: () => {
                          const newAcList = [];
                          component.loading = true;
                          component.gridApi.forEachNode(node => {
                            console.log(node.data);
                            newAcList.push(node.data.AccessNumber);
                          });
                          // this.gridApi.applyTransaction({update: [{...nodeParams.data, HeadAccessNumbers: newAcList}]});

                          this.apiService.putPromise<SalesMasterPriceTableDetailModel[]>('/warehouse/books', {
                            id: [this.cms.getObjectId(this.warehouseBook)],
                            updateHeadInventory: true,
                            goods: nodeParams.data.Code,
                            unit: this.cms.getObjectId(nodeParams.data.Unit),
                            container: this.cms.getObjectId(nodeParams.data.Container),
                            // inventory: newAcList.length,
                            // unitPrice: row.UnitPrice,
                            currency: this.cms.loginInfo.configuration.defaultCurrency,
                          }, [{
                            AccessNumbers: newAcList,
                            Inventory: newAcList.length,
                            UnitPrice: parseFloat(nodeParams.data.UnitPrice),
                          }]).then(async rs => {
                            console.log(rs);
                            component.loading = false;
                            component.close();
                            const node = this.gridApi.getRowNode(this.makeId(nodeParams.node.data));
                            if (node) node.setData({ ...nodeParams.node.data, HeadAccessNumbers: rs[0].AccessNumbers, HeadInventory: rs[0].Inventory, UnitPrice: rs[0].UnitPrice });
                          }).catch(err => {
                            component.loading = false;
                            return Promise.reject(err);
                          });
                          return false;
                        },
                      },
                    );
                  }
                }
              });
              return true;
            }
          },
          ]),
          headerName: 'Action',
          width: 100,
        },
      ] as ColDef[]);

      return state;
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // @Input() getRowHeight = (params: RowHeightParams<CommercePosOrderModel>) => {
  //   return 123;
  // }

  prepareApiParams(params: any, getRowParams: IGetRowsParams) {
    params['includeCategories'] = true;
    params['includeFeaturePicture'] = true;
    params['includeUnit'] = true;
    params['includeContainer'] = true;
    params['includeInventory'] = true;
    params['includeLastInventoryAdjust'] = true;
    params['includeAccessNumbers'] = true;

    params['masterPriceTable'] = this.cms.getObjectId(this.warehouseBook);
    params['includeGroups'] = true;
    params['includeHeadBookEntry'] = true;
    return params;
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: CashVoucherModel[]) => void, onDialogClose?: () => void) {
    this.cms.openDialog(CashReceiptVoucherFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: CashVoucherModel[]) => {
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
}
