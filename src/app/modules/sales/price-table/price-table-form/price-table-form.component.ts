import { Component, OnInit, Type, TemplateRef } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { SalesPriceTableModel, SalesPriceTableDetailModel } from '../../../../models/sales.model';
import { environment } from '../../../../../environments/environment';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { SalesPriceReportFormComponent } from '../../price-report/sales-price-report-form/sales-price-report-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PriceTablePrintComponent } from '../price-table-print/price-table-print.component';
import { ProductListComponent } from '../../../admin-product/product/product-list/product-list.component';
import { PurchasePriceTableDetailModel } from '../../../../models/purchase.model';
import { BehaviorSubject } from 'rxjs';
import { IGetRowsParams, GridApi, ColumnApi, Module, AllCommunityModules, IDatasource } from '@ag-grid-community/all-modules';
import { isNumber } from 'util';
import { CurrencyPipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { PriceTablePrintAsListComponent } from '../price-table-print-as-list/price-table-print-as-list.component';
import { BaseComponent } from '../../../../lib/base-component';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { AgSelectEditorComponent } from '../../../../lib/custom-element/ag-grid/ag-grid-select-editor.component';


@Component({
  selector: 'ngx-price-table-form',
  templateUrl: './price-table-form.component.html',
  styleUrls: ['./price-table-form.component.scss'],
})
export class PriceTableFormComponent extends DataManagerFormComponent<SalesPriceTableModel> implements OnInit {

  componentName: string = 'PriceTableFormComponent';
  idKey = 'Code';
  apiPath = '/sales/price-tables';
  baseFormUrl = '/sales/price-table/form';

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = { prefix: '', suffix: ' ' + this.locale[15], thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };
  numberFormat: CurrencyMaskConfig = { prefix: '', suffix: '', thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };
  // numberFormat = getLocaleNumberFormat('vi', NumberFormatStyle.Decimal);

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: (UnitModel & { id?: string, text?: string })[];

  select2ContactOption = {
    placeholder: 'Chọn liên hệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  printTemplateList: { id: string, text: string, name: Type<DataManagerPrintComponent<SalesPriceTableModel>> }[] = [
    {
      id: 'PriceTablePrintAsListComponent',
      text: this.commonService.textTransform(this.commonService.translate.instant('Print.listTemplate'), 'head-title'),
      name: PriceTablePrintAsListComponent,
    },
    {
      id: 'PriceTablePrintComponent',
      text: this.commonService.textTransform(this.commonService.translate.instant('Print.gridTemplate'), 'head-title'),
      name: PriceTablePrintComponent,
    },
  ];

  priceTableList: (SalesPriceTableModel & { id?: string, text?: string })[] = [];
  select2OptionForParent = {
    placeholder: 'Chọn bảng giá cha...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<PriceTableFormComponent>,
    public currencyPipe: CurrencyPipe,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** AG-Grid */
    const $this = this;
    this.columnDefs = [
      {
        headerName: '#',
        width: 52,
        valueGetter: 'node.data.No',
        cellRenderer: 'loadingCellRenderer',
        // sortable: false,
        pinned: 'left',
        rowDrag: true,
      },
      {
        headerName: 'Hình',
        field: 'PictureThumbnail',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        autoHeight: true,
        cellRenderer: (params: { color: string, value: any }) => {
          // return '<img src="' + params.value + '?token=' + this.apiService.getAccessToken() + '">'
          // let pictureUrl = params.value;
          // if (!/\?token/.test(pictureUrl)) {
          // const pictureUrl = params.value + '?token=' + this.apiService.getAccessToken();
          // }
          return '<div class="image-thumb-wrap"><div class="image-thumb" style="background-image: url(\'' + params.value + '?token=' + this.apiService.getAccessToken() + '\')"></div></div>';
        },
      },
      {
        headerName: 'Tên sản phẩm',
        field: 'Name',
        width: 400,
        filter: 'agTextColumnFilter',
        pinned: 'left',
        // editable: true,
        cellStyle: { whiteSpace: 'normal' },
      },
      {
        headerName: 'Note (Ghi chú)',
        field: 'Note',
        width: 1024,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        // editable: true,
        cellStyle: { whiteSpace: 'normal' },
      },
      {
        headerName: 'ĐVT',
        field: 'Unit',
        width: 100,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        editable: true,
        cellEditor: AgSelectEditorComponent,
        cellEditorParams: {
          values: ['Porsche', 'Toyota', 'Ford', 'AAA', 'BBB', 'CCC'],
        },
      },
      {
        headerName: 'Sku',
        field: 'Sku',
        width: 150,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        autoHeight: true,
        // editable: true,
      },
      {
        headerName: 'Code',
        field: 'Product',
        width: 150,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        autoHeight: true,
      },
      {
        headerName: 'Price (Giá)',
        field: 'Price',
        width: 150,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        // type: 'rightAligned',
        editable: true,
        valueFormatter: (params: { value: number & string }) => {
          // console.log(params);
          const value = parseFloat(params.value);
          return isNumber(value) ? this.currencyPipe.transform(value, 'VND') : 0;
        },
      },
    ];

    // this.columnDefs = [
    //   {
    //     field: 'Code',
    //     rowDrag: true,
    //   },
    //   { field: 'Name' },
    //   {
    //     field: 'Note',
    //     width: 100,
    //   },
    //   { field: 'date' },
    //   { field: 'sport' },
    //   { field: 'gold' },
    //   { field: 'silver' },
    //   { field: 'bronze' },
    // ];

    this.pagination = false;
    this.maxBlocksInCache = 5;
    this.paginationPageSize = this.cacheBlockSize = 1000;
    /** End AG-Grid */
  }

  /** AG-Grid */
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public modules: Module[] = AllCommunityModules;
  public dataSource: IDatasource;
  public columnDefs: any;
  public rowSelection = 'multiple';
  public rowModelType = 'clientSide';
  // public rowModelType = null;
  public paginationPageSize: number;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = 1;
  public maxBlocksInCache: number;
  public cacheBlockSize: number;
  public rowData: PurchasePriceTableDetailModel[] = [];
  public gridParams;
  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public getRowHeight(params) {
    return 80;
  }
  public rowHeight: number;
  public hadRowsSelected = false;
  public pagination: boolean;
  // public emailAddressListDetails: EmailAddressListDetailModel[] = [];

  public defaultColDef = {
    width: 170,
    sortable: true,
    filter: true,
  };
  public getRowNodeId = (item: { Product: string }) => {
    return item.Product;
  }
  public components = {
    loadingCellRenderer: (params) => {
      if (params.value) {
        return params.value;
      } else {
        return '<img src="assets/images/loading.gif">';
      }
    },
  };

  public gridOptions = {
    enableMultiRowDragging: true,
  };

  gridReady$ = new BehaviorSubject<boolean>(false);
  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.loadList();
    this.gridReady$.next(true);

  }
  onColumnResized() {
    this.gridApi.resetRowHeights();
  }
  onRowSelected() {
    this.updateActionState();
  }
  updateActionState() {
    this.hadRowsSelected = this.getSelectedRows().length > 0;
  }
  getSelectedRows() {
    return this.gridApi.getSelectedRows();
  }
  loadList(callback?: (list: PurchasePriceTableDetailModel[]) => void) {

    // if (this.gridApi) {
    //   this.commonService.takeUntil('reload-contact-list', 500, () => this.gridApi.setDatasource(this.dataSource));
    // }

  }

  initDataSource() {
    this.dataSource = {
      rowCount: null,
      getRows: (getRowParams: IGetRowsParams) => {
        // console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);

        // const query = { limit: this.paginationPageSize, offset: getRowParams.startRow };
        // getRowParams.sortModel.forEach(sortItem => {
        //   query['sort_' + sortItem['colId']] = sortItem['sort'];
        // });
        // Object.keys(getRowParams.filterModel).forEach(key => {
        //   const condition: { filter: string, filterType: string, type: string } = getRowParams.filterModel[key];
        //   query['filter_' + key] = condition.filter;
        // });

        // query['noCount'] = true;
        // query['filter_AddressList'] = this.id[0] ? this.id[0] : 'X';

        // const contact = this.array.controls[0].get('Contact');
        // const contactGroups = this.array.controls[0].get('ContactGroups');

        // if (contact.value) {
        //   query['id'] = contact.value.id;
        // } else if (contactGroups.value && contactGroups.value.length > 0) {
        //   query['byGroups'] = contactGroups.value.map(i => i.id);
        // } else {
        //   query['byGroups'] = ['unknow'];
        // }

        new Promise<(PurchasePriceTableDetailModel & { Message?: string })[]>((resolve2, reject2) => {
          // if (this.updateMode === 'live' || this.smsSendList.length === 0) {
          // } else {
          //   resolve2(this.smsSendList);
          // }
          resolve2();
        }).then(emailAddressListDetails => {
          // smsSendList.forEach(item => {
          //   const message = this.generatePreviewByContact(item, this.array.controls[0]);
          //   item.Message = '[' + message.length + '/160] ' + message;
          // });
          let lastRow = -1;
          if (emailAddressListDetails.length < this.paginationPageSize) {
            lastRow = getRowParams.startRow + emailAddressListDetails.length;
          }
          getRowParams.successCallback(emailAddressListDetails, lastRow);
          this.gridApi.resetRowHeights();
        });



        // this.executeGet(query, contactList => {
        //   contactList.forEach((item, index) => {
        //     item['No'] = (getRowParams.startRow + index + 1);
        //     item['id'] = item[this.idKey];
        //   });

        //   let lastRow = -1;
        //   if (contactList.length < this.paginationPageSize) {
        //     lastRow = getRowParams.startRow + contactList.length;
        //   }
        //   getRowParams.successCallback(contactList, lastRow);
        //   this.gridApi.resetRowHeights();
        // });
        // this.getList(contactList => {

        // });

      },
    };
  }
  /** End AG-Grid */

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
    placeholder: 'Chọn Hàng hoá/dịch vụ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/products', { includeUnit: true, 'filter_Name': params['term'] });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  select2OptionForUnit = {
    placeholder: 'Chọn ĐVT...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    // ajax: {
    //   url: params => {
    //     return this.apiService.buildApiUrl('/admin-product/units', { 'filter_Name': params['term'] });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     // console.info(data, params);
    //     return {
    //       results: data.map(item => {
    //         item['id'] = item['Code'];
    //         item['text'] = item['Name'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
  };

  select2OptionForTax = {
    placeholder: 'Chọn thuế...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    // multiple: false,
    // ajax: {
    //   url: params => {
    //     return this.apiService.buildApiUrl('/accounting/taxes', { 'filter_Name': params['term'] });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     // console.info(data, params);
    //     return {
    //       results: data.map(item => {
    //         item['id'] = item['Code'];
    //         item['text'] = item['Name'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    /** Load and cache tax list */
    if (!SalesPriceReportFormComponent._taxList) {
      this.taxList = SalesPriceReportFormComponent._taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
        tax['id'] = tax.Code;
        tax['text'] = tax.Name;
        return tax;
      });
    } else {
      this.taxList = SalesPriceReportFormComponent._taxList;
    }

    /** Load and cache unit list */
    if (!SalesPriceReportFormComponent._unitList) {
      this.unitList = SalesPriceReportFormComponent._unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units')).map(tax => {
        tax['id'] = tax.Code;
        tax['text'] = tax.Name;
        return tax;
      });
    } else {
      this.unitList = SalesPriceReportFormComponent._unitList;
    }

    /** Load and cache sales price table list */
    this.priceTableList = (await this.apiService.getPromise<SalesPriceTableModel[]>('/sales/price-tables', { sort_Name: 'desc' })).map(item => ({ ...item, id: item.Code, text: '[' + item.Code + '] ' + item.Title }));

    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: SalesPriceTableModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeProduct'] = true;
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['useBaseTimezone'] = true;
    params['includeDetails'] = true;
    super.executeGet(params, success, error);
  }

  formLoad(formData: SalesPriceTableModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: SalesPriceTableModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Details form load
      // if (itemFormData.Details) {
      //   itemFormData.Details.forEach(condition => {
      //     const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, condition);
      //     const details = this.getDetails(newForm);
      //     details.push(newDetailFormGroup);
      //     // const comIndex = details.length - 1;
      //     this.onAddDetailFormGroup(newForm, newDetailFormGroup);
      //   });
      // }

      if (itemFormData.Details) {
        this.gridReady$.pipe(takeUntil(this.destroy$)).subscribe(ready => {
          if (ready) {
            this.gridApi.setRowData([]);
            this.gridApi.updateRowData({
              add: itemFormData.Details.map((item: any, index2: number) => ({ ...item, Product: item['Product'] && item['Product']['id'] ? item['Product']['id'] : item['Product'] })),
            });
          }
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: SalesPriceTableModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      // Object: [''],
      // ObjectName: [''],
      // ObjectEmail: [''],
      // ObjectPhone: [''],
      // ObjectAddress: [''],
      // Recipient: [''],
      // ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      // ObjectBankName: [''],
      // ObjectBankCode: [''],
      // PaymentStep: [''],
      // DeliveryAddress: [''],
      Parent: [''],
      Title: [''],
      Description: [''],
      DateOfApprove: [''],
      PrintTemplate: ['PriceTablePrintAsListComponent'],
      // _total: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      // this.addDetailFormGroup(newForm);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: SalesPriceTableModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/sales/price-table/list']);
    } else {
      this.ref.close();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: SalesPriceTableDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      No: [''],
      Type: [''],
      Product: ['', Validators.required],
      Note: ['', Validators.required],
      Quantity: [1],
      Price: [0],
      Unit: [''],
      Tax: [''],
      ToMoney: [0],
      Image: [''],
      Reason: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
      // this.toMoney(parentFormGroup, newForm);
    }
    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    this.getDetails(parentFormGroup).push(newChildFormGroup);
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) { }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) { }
  /** End Detail Form */

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        if (selectedData.Code) {
          // formGroup.get('ObjectName').setValue(selectedData.Name);
          // formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          // formGroup.get('ObjectEmail').setValue(selectedData.Email);
          // formGroup.get('ObjectAddress').setValue(selectedData.Address);
          // formGroup.get('ObjectTaxCode').setValue(selectedData.TaxCode);
          // formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          // formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }

  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel) {
    console.log(selectedData);
    if (selectedData) {
      detail.get('Description').setValue(selectedData.Name);
      if (selectedData.WarehouseUnit && selectedData.WarehouseUnit.Code) {
        detail.get('Unit').patchValue({
          id: selectedData.WarehouseUnit['Code'],
          text: selectedData.WarehouseUnit['Name'],
          Code: selectedData.WarehouseUnit['Code'],
          Name: selectedData.WarehouseUnit['Name'],
          Symbol: selectedData.WarehouseUnit['Symbol'],
        });
      }
    } else {
      detail.get('Description').setValue('');
      detail.get('Unit').setValue('');
    }
    return false;
  }

  calculatToMoney(detail: FormGroup) {
    let toMoney = detail.get('Quantity').value * detail.get('Price').value;
    let tax = detail.get('Tax').value;
    if (tax) {
      if (typeof tax === 'string') {
        tax = this.taxList.filter(t => t.Code === tax)[0];
      }
      toMoney += toMoney * tax.Tax / 100;
    }
    return toMoney;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    detail.get('ToMoney').setValue(this.calculatToMoney(detail));

    // Call culate total
    const details = this.getDetails(formItem);
    let total = 0;
    for (let i = 0; i < details.controls.length; i++) {
      total += this.calculatToMoney(details.controls[i] as FormGroup);
    }
    formItem.get('_total').setValue(total);
    return false;
  }

  preview(formItem: FormGroup) {
    const data: SalesPriceTableModel = formItem.value;
    data.Details = [];
    this.gridApi.forEachNode(node => {
      data.Details.push(node.data);
    });
    // data.Details.forEach(detail => {
    //   if (typeof detail['Tax'] === 'string') {
    //     detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
    //   }
    // });
    const printTemplate = this.printTemplateList.find((item: { id: string }) => item.id === formItem.get('PrintTemplate').value);
    if (printTemplate) {
      this.dialogService.open(printTemplate.name, {
        context: {
          title: 'Xem trước',
          data: data,
          onSaveAndClose: (priceReportCode: string) => {
            this.saveAndClose();
          },
          onSaveAndPrint: (priceReportCode: string) => {
            this.save();
          },
        },
      });
    } else {
      throw Error('Print.Error.noTemplateChoosed');
    }

    return false;
  }

  /** Implement required */
  openProductListDialplog(filter?: {}, onDialogChoose?: (newData: ProductModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(ProductListComponent, {
      context: {
        inputMode: 'dialog',
        // inputId: ids,
        onDialogChoose: (chooseItems: ProductModel[]) => {
          if (onDialogChoose) onDialogChoose(chooseItems);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
          // this.refresh();
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  chooseProducts(formItem: FormGroup) {
    this.openProductListDialplog({}, choosedProducts => {
      console.log(choosedProducts);
      this.gridReady$.pipe(takeUntil(this.destroy$)).subscribe(isReady => {
        if (isReady) {
          // choosedProducts.forEach(product => {
          // const detail = this.makeNewDetailFormGroup(formItem, {
          //   Product: product as any,
          //   Note: product.Name,
          //   Unit: product.WarehouseUnit,
          // });
          // this.getDetails(formItem).controls.push(detail);

          this.gridApi.forEachNode(node => {
            choosedProducts = choosedProducts.filter(product => product.Code !== node.data['Product']);
          });
          if (choosedProducts.length > 0) {
            const total = this.gridApi.getDisplayedRowCount();
            this.gridApi.updateRowData({
              add: choosedProducts.map((product, index) => ({
                No: total + index + 1,
                Id: product.Code,
                PictureThumbnail: (product['FeaturePictureThumbnail'] ? (product['FeaturePictureThumbnail'].replace(/\?token=[^\&]*/, '')) : ''),
                Product: product.Code,
                Name: product.Name,
                Note: product.Description,
                Unit: product.WarehouseUnit,
              })),
            });
          }
          // });
        }
      });
    });
  }

  /** Override for case : use Ag-Grid as details */
  getRawFormData() {
    const data = super.getRawFormData();
    data.array[0]['Details'] = [];
    this.gridApi.forEachNode(node => {
      data.array[0]['Details'].push(node.data);
    });
    // data['Details'] = this.rowData.map(item => ({...item, Name: item['Name'] ? item['Name'] : item['Sku']}));
    return data;
  }

  clearDetails(formItem: FormGroup) {
    this.gridApi.setRowData([]);
  }

  removeDetails(formItem: FormGroup) {
    this.gridApi.updateRowData({
      remove: this.getSelectedRows(),
    });
  }
}
