import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { PurchasePriceTableModel, PurchasePriceTableDetailModel } from '../../../../models/purchase.model';
import { environment } from '../../../../../environments/environment';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef, NbGlobalPhysicalPosition } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { SalesPriceReportFormComponent } from '../../../sales/price-report/sales-price-report-form/sales-price-report-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PurchasePriceTablePrintComponent } from '../purchase-price-table-print/purchase-price-table-print.component';
import * as XLSX from 'xlsx';
import { GridApi, ColumnApi, Module, AllCommunityModules, IDatasource, IGetRowsParams } from '@ag-grid-community/all-modules';
import { SmsReceipientModel } from '../../../../models/sms.model';
import { EmailAddressListDetailModel } from '../../../../models/email.model';
import { CurrencyPipe } from '@angular/common';
import { param } from 'jquery';
import { isNumber } from 'util';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ngx-purchase-price-table-import',
  templateUrl: './purchase-price-table-import.component.html',
  styleUrls: ['./purchase-price-table-import.component.scss'],
})
export class PurchasePriceTableImportComponent extends DataManagerFormComponent<PurchasePriceTableModel> implements OnInit {

  componentName: string = 'PurchasePriceTableImportComponent';
  idKey = 'Code';
  apiPath = '/purchase/price-tables';
  baseFormUrl = '/purchase/price-table/form';

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

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<PurchasePriceTableImportComponent>,
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
        sortable: false,
        pinned: 'left',
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
          return '<div class="image-thumb-wrap"><div class="image-thumb" style="background-image: url(\'' + params.value + '?token=' + this.apiService.getAccessToken() + '\')"></div></div>';
        },
      },
      {
        headerName: 'Sku',
        field: 'Sku',
        width: 150,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        autoHeight: true,
        editable: true,
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
        headerName: 'Tên sản phẩm',
        field: 'Name',
        width: 400,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        editable: true,
        cellStyle: { whiteSpace: 'normal' },
      },
      {
        headerName: 'Description (Mô tả)',
        field: 'Description',
        width: 1024,
        filter: 'agTextColumnFilter',
        // pinned: 'left',
        editable: true,
        cellStyle: { whiteSpace: 'normal' },
      },
      {
        headerName: 'Giá mua (Price)',
        field: 'Price',
        width: 100,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        type: 'rightAligned',
        editable: true,
        valueFormatter: (params: { value: number & string }) => {
          // console.log(params);
          const value = parseFloat(params.value);
          return isNumber(value) ? this.currencyPipe.transform(value, 'VND') : 0;
        },
      },
      {
        headerName: 'Giá bán đề xuất (SalesPrice)',
        field: 'SalesPrice',
        width: 150,
        filter: 'agTextColumnFilter',
        pinned: 'right',
        type: 'rightAligned',
        editable: true,
        valueFormatter: (params: { value: number & string }) => {
          // console.log(params);
          const value = parseFloat(params.value);
          return isNumber(value) ? this.currencyPipe.transform(value, 'VND') : 0;
        },
      },
    ];

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
  // public rowModelType = 'infinite';
  public rowModelType = null;
  public paginationPageSize: number;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = 1;
  public maxBlocksInCache: number;
  public cacheBlockSize: number;
  public rowData: PurchasePriceTableDetailModel[];
  public gridParams;
  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public getRowHeight(params) {
    return 80;
  }
  public rowHeight: number;
  public hadRowsSelected = false;
  public pagination: boolean;
  public emailAddressListDetails: EmailAddressListDetailModel[] = [];

  public defaultColDef = {
    sortable: true,
    resizable: true,
    // suppressSizeToFit: true,
  };
  public getRowNodeId = (item: { id: string }) => {
    return item.id;
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
  loadList(callback?: (list: SmsReceipientModel[]) => void) {

    // if (this.gridApi) {
    //   this.commonService.takeUntil('reload-contact-list', 500, () => this.gridApi.setDatasource(this.dataSource));
    // }

  }

  initDataSource() {
    this.dataSource = {
      rowCount: null,
      getRows: (getRowParams: IGetRowsParams) => {
        console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);

        const query = { limit: this.paginationPageSize, offset: getRowParams.startRow };
        getRowParams.sortModel.forEach(sortItem => {
          query['sort_' + sortItem['colId']] = sortItem['sort'];
        });
        Object.keys(getRowParams.filterModel).forEach(key => {
          const condition: { filter: string, filterType: string, type: string } = getRowParams.filterModel[key];
          query['filter_' + key] = condition.filter;
        });

        query['noCount'] = true;
        query['filter_AddressList'] = this.id[0] ? this.id[0] : 'X';

        // const contact = this.array.controls[0].get('Contact');
        // const contactGroups = this.array.controls[0].get('ContactGroups');

        // if (contact.value) {
        //   query['id'] = contact.value.id;
        // } else if (contactGroups.value && contactGroups.value.length > 0) {
        //   query['byGroups'] = contactGroups.value.map(i => i.id);
        // } else {
        //   query['byGroups'] = ['unknow'];
        // }

        new Promise<(EmailAddressListDetailModel & { Message?: string })[]>((resolve2, reject2) => {
          // if (this.updateMode === 'live' || this.smsSendList.length === 0) {
          this.apiService.getPromise<EmailAddressListDetailModel[]>('/email-marketing/address-list-details', query).then(emailAddressListDetails => {
            emailAddressListDetails.forEach((item, index) => {
              item['No'] = (getRowParams.startRow + index + 1);
              item['id'] = item[this.idKey];
            });

            this.emailAddressListDetails = emailAddressListDetails;
            resolve2(emailAddressListDetails);

          }).catch(e => reject2(e));
          // } else {
          //   resolve2(this.smsSendList);
          // }
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
      this.taxList = SalesPriceReportFormComponent._taxList;
    }
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PurchasePriceTableModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeDetails'] = true;
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  formLoad(formData: PurchasePriceTableModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PurchasePriceTableModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        // itemFormData.Details.forEach(condition => {
        //   // const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, condition);
        //   // const details = this.getDetails(newForm);
        //   // details.push(newDetailFormGroup);
        //   // // const comIndex = details.length - 1;
        //   // this.onAddDetailFormGroup(newForm, newDetailFormGroup);

        // });
        this.gridReady$.subscribe(ready => {
          if (ready) {
            this.gridApi.setRowData([]);
            this.gridApi.updateRowData({
              add: itemFormData.Details.map((item: any, index2: number) => ({ ...item, id: item['Sku'], No: index2 + 1, Product: item['Product'] && item['Product']['id'] ? item['Product']['id'] : item['Product'] })),
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

  makeNewFormGroup(data?: PurchasePriceTableModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Supplier: [''],
      SupplierName: [''],
      SupplierEmail: [''],
      SupplierPhone: [''],
      SupplierAddress: [''],
      // Recipient: [''],
      // SupplierTaxCode: [''],
      // DirectReceiverName: [''],
      // SupplierBankName: [''],
      // SupplierBankCode: [''],
      // PaymentStep: [''],
      // DeliveryAddress: [''],
      // Title: [''],
      Description: [''],
      DateOfApprove: [''],
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
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PurchasePriceTableModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/promotion/promotion/list']);
    } else {
      this.ref.close();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: PurchasePriceTableDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      No: [''],
      Type: [''],
      Product: [''],
      Description: ['', Validators.required],
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

  onSupplierChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        if (selectedData.Code) {
          formGroup.get('SupplierName').setValue(selectedData.Name);
          formGroup.get('SupplierPhone').setValue(selectedData.Phone);
          formGroup.get('SupplierEmail').setValue(selectedData.Email);
          formGroup.get('SupplierAddress').setValue(selectedData.Address);
          // formGroup.get('SupplierTaxCode').setValue(selectedData.TaxCode);
          // formGroup.get('SupplierBankName').setValue(selectedData.BankName);
          // formGroup.get('SupplierBankCode').setValue(selectedData.BankAcc);
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
    const data: PurchasePriceTableModel = formItem.value;
    data.Details.forEach(detail => {
      if (typeof detail['Tax'] === 'string') {
        detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
      }
    });
    this.dialogService.open(PurchasePriceTablePrintComponent, {
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
    return false;
  }

  willDownload = false;
  onFileChange(ev: any, formItem: FormGroup) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const objectCode = formItem.get('Supplier').value.id;
      if (!objectCode) {
        this.toastrService.show('Bạn cần chọn nhà cung cấp trước để xác định chính xác SKU', 'Chưa đủ thông tin', {
          status: 'warning',
          hasIcon: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 0,
        });
        return false;
      }
      const priceTableSheet: any[] = jsonData['PurchasePriceTable'];
      let productSkus = [];
      for (let i = 0; i < priceTableSheet.length; i++) {
        if (typeof priceTableSheet[i]['Sku'] !== 'undefined') {
          priceTableSheet[i]['Sku'] = priceTableSheet[i]['Sku'].replace(/^[ |\n]+/, '').replace(/[ |\n]+$/, '').replace(/\n.*/, '');
        }
        productSkus.push(priceTableSheet[i]['Sku']);
        if (productSkus.length > 50 || i === priceTableSheet.length - 1) {
          const products = await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { filterBySku: productSkus.join(',') });
          for (let j = 0; j < products.length; j++) {
            const row = priceTableSheet.filter(item => item.Sku === products[j]['Sku'])[0];
            row['Product'] = products[j].Code;
            if (products[j].Name) {
              row['Name'] = products[j].Name;
            }
          }
          productSkus = [];
        }
        priceTableSheet[i]['id'] = priceTableSheet[i]['Sku'];
        priceTableSheet[i]['No'] = i + 1;

      }
      if (priceTableSheet[0] && priceTableSheet[0]['Description'] && priceTableSheet[0]['Sku'] && typeof priceTableSheet[0]['Price'] !== 'undefined') {
        this.gridApi.updateRowData({
          add: priceTableSheet,
        });
      } else {
        this.toastrService.show('Bảng giá phải chứa các cột: Sku, Description và Price', 'Định dạng bảng giá không khớp', {
          status: 'warning',
          hasIcon: true,
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 0,
        });
      }
    };
    reader.readAsBinaryString(file);
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector('#download');
      el.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute('download', 'xlsxtojson.json');
    }, 1000);
  }

  getRawFormData() {
    const data = super.getRawFormData();
    data.array[0]['Details'] = [];
    this.gridApi.forEachNode(node => {
      data.array[0]['Details'].push(node.data);
    });
    // data['Details'] = this.rowData.map(item => ({...item, Name: item['Name'] ? item['Name'] : item['Sku']}));
    return data;
  }

}
