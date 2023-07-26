import { ProductUnitConversoinModel, ProductUnitModel } from '../../../../models/product.model';
import { filter, pairwise, startWith, take, takeUntil } from 'rxjs/operators';
import { ChatRoomModel } from '../../../../models/chat-room.model';
import { SalesMasterPriceTableModel, SalesPriceReportModel } from '../../../../models/sales.model';
import { PriceReportModel } from '../../../../models/price-report.model';
import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { environment } from '../../../../../environments/environment';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PromotionActionModel } from '../../../../models/promotion.model';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { CommercePosOrderModel, CommercePosOrderDetailModel } from '../../../../models/commerce-pos.model';
import { CommercePosOrderPrintComponent } from '../commerce-pos-order-print/commerce-pos-order-print.component';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { AccBankAccountModel, BusinessModel } from '../../../../models/accounting.model';
import { GoodsModel, WarehouseGoodsDeliveryNoteModel } from '../../../../models/warehouse.model';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ProductUnitFormComponent } from '../../../admin-product/unit/product-unit-form/product-unit-form.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';

@Component({
  selector: 'ngx-commerce-pos-order-form',
  templateUrl: './commerce-pos-order-form.component.html',
  styleUrls: ['./commerce-pos-order-form.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class CommercePosOrderFormComponent extends DataManagerFormComponent<CommercePosOrderModel> implements OnInit {

  componentName: string = 'CommercePosOrderFormComponent';
  idKey = 'Code';
  apiPath = '/commerce-pos/orders';
  baseFormUrl = '/commerce-pos/order/form';
  previewAfterCreate = true;
  printDialog = CommercePosOrderPrintComponent;

  env = environment;

  locale = this.cms.getCurrentLoaleDataset();
  priceCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0 };
  quantityFormat: CurrencyMaskConfig = { ...this.cms.getNumberMaskConfig(), precision: 2 };

  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: ProductUnitModel[];

  warehouseContainerList = [];

  objectControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline',
    title: this.cms.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.cms.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.cms.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.cms.getObjectId(formGroup.get('Object').value);
      this.cms.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          inputId: currentObject ? [currentObject] : null,
          showLoadinng: true,
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Object').patchValue(newContact);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    },
  }];

  contactControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline',
    title: this.cms.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.cms.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.cms.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.cms.getObjectId(formGroup.get('Contact').value);
      this.cms.openDialog(ContactFormComponent, {
        context: {
          inputMode: 'dialog',
          inputId: currentObject ? [currentObject] : null,
          showLoadinng: true,
          onDialogSave: (newData: ContactModel[]) => {
            console.log(newData);
            const newContact: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Contact').patchValue(newContact);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    },
  }];

  uploadConfig = {

  };

  select2OptionForPaymenntMethod = {
    placeholder: 'Chọn phương thức thanh toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
    data: [
      { id: 'CASH', text: 'Tiền mặt' },
      { id: 'BANKTRANSFER', text: 'Chuyển khoản' },
      { id: 'DEBT', text: 'Công nợ' },
      { id: 'MIXED', text: 'Hỗn hợp' },
    ]
  };

  selectPriceReportOption = {
    placeholder: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/sales/price-reports', { filter_Title: params['term'] ? params['term'] : '', sort_Created: 'desc', limit: 20, eq_State: '[ACCEPTANCE,COMPLETE]' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        this.apiService.getPromise('/sales/price-reports', { filter_Title: settings.data['term'] ? settings.data['term'] : '', sort_Created: 'desc', limit: 20, eq_State: '[ACCEPTANCE,COMPLETE]' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['id'] || item['Code'];
            item['text'] = item['Code'] + ': ' + (item['text'] || item['Title'] || item['ObjectName']) + ' (' + this.cms.datePipe.transform(item['Reported'], 'short') + ')';
            return item;
          }),
        };
      },
    },
  };

  selectEmployeeOption = {
    placeholder: this.cms.translateText('Common.employee') + '...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    // multiple: true,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/contact/contacts', { filter_Name: params['term'] ? params['term'] : '', sort_Name: 'asc', limit: 20, eq_Group: '[EMPLOYEE]' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        this.apiService.getPromise('/contact/contacts', { filter_Name: settings.data['term'] ? settings.data['term'] : '', sort_Name: 'asc', limit: 20, eq_Group: '[EMPLOYEE]' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['id'] || item['Code'];
            item['text'] = item['text'] || item['Name'];
            return item;
          }),
        };
      },
    },
  };

  accountingBusinessList: BusinessModel[] = [];
  select2OptionForAccountingBusiness = {
    placeholder: 'Nghiệp vụ kế toán...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    multiple: true,
    // maximumSelectionLength: 1,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  customIcons: { [key: string]: CustomIcon[] } = {};
  getCustomIcons(name: string): CustomIcon[] {
    if (this.customIcons[name]) return this.customIcons[name];
    return this.customIcons[name] = [{
      icon: 'plus-square-outline',
      title: this.cms.translateText('Common.addNewProduct'),
      status: 'success',
      states: {
        '<>': {
          icon: 'edit-outline',
          status: 'primary',
          title: this.cms.translateText('Common.editProduct'),
        },
        '': {
          icon: 'plus-square-outline',
          status: 'success',
          title: this.cms.translateText('Common.addNewProduct'),
        },
      },
      action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
        const currentProduct = this.cms.getObjectId(formGroup.get('Product').value);
        this.cms.openDialog(ProductFormComponent, {
          context: {
            inputMode: 'dialog',
            inputId: currentProduct ? [currentProduct] : null,
            showLoadinng: true,
            onDialogSave: (newData: ProductModel[]) => {
              console.log(newData);
              // const formItem = formGroupComponent.formGroup;
              const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.cms.getObjectId(unit?.Unit), text: this.cms.getObjectText(unit?.Unit) })) };
              formGroup.get('Product').patchValue(newProduct);
            },
            onDialogClose: () => {

            },
          },
          closeOnEsc: false,
          closeOnBackdropClick: false,
        });
      }
    }];
  }

  unitCustomIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.cms.translateText('Common.addUnit'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.cms.openDialog(ProductUnitFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          showLoadinng: true,
          onDialogSave: (newData: UnitModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newUnit: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name };
            formGroup.get('Unit').patchValue(newUnit);
          },
          onDialogClose: () => {

          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  goodsMap: { [key: string]: GoodsModel } = {};
  async bulkLoadGoodsInfo(goodsIds: string[]) {
    // Bulk load containers
    const goodsList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
      select: 'Code',
      includeUnit: true,
      includeContainers: true,
      eq_Code: '[' + goodsIds.join(',') + ']',
      limit: 'nolimit'
    });
    for (const goods of goodsList) {
      if (goods.Containers) {
        goods.Containers = goods.Containers.map(m => ({
          id: m.Container,
          text: `[${m.ContainerFindOrder}] ${m.ContainerPath}: ${m.ContainerDescription} (SL tồn: ${this.decimalPipe.transform(m.Inventory, '1.0-0')}})`,
          Unit: m.Unit
        }))
      }
      if (!this.goodsMap[goods.Code]) {
        this.goodsMap[goods.Code] = goods;
      } else {
        if (!this.goodsMap[goods.Code].Containers) {
          this.goodsMap[goods.Code].Containers = [];
        }
        for (const container of goods.Containers) {
          if (!this.goodsMap[goods.Code].Containers.some(f => this.cms.getObjectId(f) == this.cms.getObjectId(container))) {
            this.goodsMap[goods.Code].Containers.push(container);
          }
        }
      }
    }
  }

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<CommercePosOrderFormComponent>,
    public adminProductService?: AdminProductService,
    public datePipe?: DatePipe,
    public decimalPipe?: DecimalPipe,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'print',
      status: 'primary',
      label: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.cms.textTransform(this.cms.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.preview([option.form?.value], 'form');
      },
    });

  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForContainer = {
    placeholder: 'Chọn kho/ngăn/kệ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2OptionForProduct = {
    ...this.cms.makeSelect2AjaxOption('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", includeSearchResultLabel: true, includeUnits: true }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa/dịch vụ...',
      prepareReaultItem: (item) => {
        item.thumbnail = item?.FeaturePicture?.Thumbnail;
        return item;
      }
    }),
    withThumbnail: true,
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
  };

  bankAccountList: AccBankAccountModel[] = [];
  select2OptionForBankAccount: Select2Option = {
    placeholder: 'Tài khoản ngân hàng...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  }

  // Type field option
  select2OptionForType = {
    placeholder: 'Chọn loại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };
  select2DataForType = [
    { id: 'PRODUCT', text: 'Sản phẩm' },
    // { id: 'SERVICE', text: 'Dịch vụ' },
    { id: 'CATEGORY', text: 'Danh mục' },
  ];

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async loadCache() {
    await Promise.all([
      this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list),
    ]);
  }

  async init(): Promise<boolean> {
    /** Load and cache tax list */
    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise();
    // this.warehouseContainerList = await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { sort_Path: 'asc', select: 'id=>Code,text=>Path', limit: 'nolimit' });
    this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
      tax['id'] = tax.Code;
      tax['text'] = tax.Name;
      return tax;
    });
    this.bankAccountList = await this.apiService.getPromise<AccBankAccountModel[]>('/accounting/bank-accounts', { limit: 'nolimit', select: "id=>Code,text=>CONCAT(Owner;' ';AccountNumber;' ';Bank;' ';Branch)" });
    this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: '[SALES,WAREHOUSEDELIVERY]', select: 'id=>Code,text=>Name,type=>Type' });

    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            conditonFormGroup.get('Id').setValue('');
          });
        });
      }
      return status;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: CommercePosOrderModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeObject'] = true;
    params['includeDetails'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    params['includeEmployee'] = true;
    params['includeUnit'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: CommercePosOrderModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CommercePosOrderModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData?.Details) {
        const details = this.getDetails(newForm);

        // Bulk load containers
        const goodsIds = itemFormData.Details.filter(f => this.cms.getObjectId(f.Type) != 'CATEGORY').map(m => this.cms.getObjectId(m.Product));
        await this.bulkLoadGoodsInfo(goodsIds);

        details.clear();
        for (const detailData of itemFormData.Details) {
          detailData.AccessNumbers = Array.isArray(detailData.AccessNumbers) && detailData.AccessNumbers.length > 0 ? (detailData.AccessNumbers.map(ac => this.cms.getObjectId(ac)).join('\n') + '\n') : '';
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detailData);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup, details.length - 1);

          if (detailData.Product) {
            this.onSelectProduct(newDetailFormGroup, detailData.Product, true);
            if (detailData.Product.Units) {
              const seelctedUnit = detailData.Product.Units.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(detailData.Unit));
              if (seelctedUnit) {
                this.onSelectUnit(newDetailFormGroup, null, seelctedUnit);
              }
            }
          }
        }
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
      return;
    });

  }

  makeNewFormGroup(data?: CommercePosOrderModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: { disabled: true, value: '' },
      Object: ['', Validators.required],
      ObjectName: ['', Validators.required],
      ObjectEmail: [''],
      ObjectPhone: [''],
      ObjectAddress: [''],
      ObjectIdentifiedNumber: [''],
      Recipient: [''],
      ObjectTaxCode: [''],
      DirectReceiverName: [''],
      ObjectBankName: [''],
      ObjectBankCode: [''],
      Contact: [''],
      ContactName: [''],
      ContactPhone: [''],
      ContactEmail: [''],
      ContactAddress: [''],
      ContactIdentifiedNumber: [''],
      DateOfDelivery: [''],
      DeliveryAddress: [''],
      PriceTable: [''],
      IsObjectRevenue: [false],
      // PriceReportVoucher: [''],
      PriceReport: [''],
      // Employee: [''],
      Title: ['', Validators.required],
      Note: [''],
      SubNote: [''],
      DateOfSale: [null, Validators.required],
      _total: [''],
      RelativeVouchers: [''],
      RequireInvoice: [false],
      PaymentMethod: [{ id: 'CASH', text: 'Tiền mặt' }],
      ReceiptBankAccount: [],
      CashTransferAmount: [],
      CashAmount: [],
      CashBack: [],
      Thread: [],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      if (!((data.DateOfSale as any) instanceof Date)) {
        data.DateOfSale = new Date(data.DateOfSale) as any;
      }
      this.patchFormGroupValue(newForm, data);
    } else {
      this.addDetailFormGroup(newForm);
    }

    const titleControl = newForm.get('Title');
    newForm.get('ObjectName').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(objectName => {
      if (objectName && (!titleControl.touched || !titleControl.value) && (!titleControl.value || /^Bán hàng: /.test(titleControl.value))) {
        titleControl.setValue(`Bán hàng: ${objectName}`);
      }
    });

    newForm.get('DateOfSale').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(dateOfSate => {
      if (dateOfSate) {
        this.cms.lastVoucherDate = dateOfSate;
      }
    });
    return newForm;
  }

  patchFormGroupValue = (formGroup: FormGroup, data: CommercePosOrderModel) => {

    if (data) {
      formGroup.get('ObjectPhone')['placeholder'] = data['ObjectPhone'];
      formGroup.get('ObjectAddress')['placeholder'] = data['ObjectAddress'];
      data['ObjectPhone'] = null;
      data['ObjectAddress'] = null;

      formGroup.get('ContactPhone')['placeholder'] = data['ContactPhone'];
      formGroup.get('ContactAddress')['placeholder'] = data['ContactAddress'];
      data['ContactPhone'] = null;
      data['ContactAddress'] = null;

      formGroup.patchValue(data);
    }
    return true;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: CommercePosOrderModel): void {
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
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Detail Form */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: CommercePosOrderDetailModel): FormGroup {
    let newForm = null;
    newForm = this.formBuilder.group({
      SystemUuid: [''],
      No: [''],
      Type: ['PRODUCT', Validators.required],
      Product: ['', (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Description: ['', Validators.required],
      Quantity: [1, (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Price: [null],
      Unit: ['', (control: FormControl) => {
        if (newForm && this.cms.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.cms.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      ToMoney: [0],
      Image: [[]],
      Business: [this.accountingBusinessList.filter(f => f.id === 'NETREVENUE')],
      AccessNumbers: [''],
      Container: [],
    });

    if (data) {
      newForm.patchValue(data);

      if (data.Product?.Units && data.Product?.Units?.length > 0) {
        newForm['unitList'] = data.Product.Units;
      } else {
        newForm['unitList'] = this.adminProductService.unitList$.value;
      }
    } else {
      newForm['unitList'] = this.adminProductService.unitList$.value;
    }

    const imagesFormControl = newForm.get('Image');
    newForm.get('Product').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value) {
        if (value.Pictures && value.Pictures.length > 0) {
          imagesFormControl.setValue(value.Pictures);
        } else {
          imagesFormControl.setValue([]);
        }
      }
    });
    newForm['IsManageByAccessNumber'] = data?.Unit['IsManageByAccessNumber'] || false;

    newForm.get('Unit').valueChanges.pipe(takeUntil(this.destroy$), startWith(null), pairwise()).subscribe(([prev, next]) => {
      console.log(prev, next);
      this.onSelectUnit(newForm, prev, next);
    });

    return newForm;
  }
  getDetails(parentFormGroup: FormGroup) {
    return parentFormGroup.get('Details') as FormArray;
  }
  addDetailFormGroup(parentFormGroup: FormGroup) {
    const newChildFormGroup = this.makeNewDetailFormGroup(parentFormGroup);
    const detailsFormArray = this.getDetails(parentFormGroup);
    detailsFormArray.push(newChildFormGroup);
    const noFormControl = newChildFormGroup.get('No');
    if (!noFormControl.value) {
      noFormControl.setValue(detailsFormArray.length);
    }
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup, detailsFormArray.length - 1);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup, index: number) {
    this.updateInitialFormPropertiesCache(newChildFormGroup);
    this.toMoney(parentFormGroup, newChildFormGroup, null, index);
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }
  /** End Detail Form */

  /** Action Form */
  makeNewActionFormGroup(data?: PromotionActionModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Type: ['', Validators.required],
      Product: [''],
      Amount: [''],
      // Discount: [''],
    });

    if (data) {
      // data['Id_old'] = data['Id'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  getActions(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Actions') as FormArray;
  }
  addActionFormGroup(formGroupIndex: number) {
    const newFormGroup = this.makeNewActionFormGroup();
    this.getActions(formGroupIndex).push(newFormGroup);
    this.onAddActionFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
    return false;
  }
  removeActionGroup(formGroupIndex: number, index: number) {
    this.getActions(formGroupIndex).removeAt(index);
    this.onRemoveActionFormGroup(formGroupIndex, index);
    return false;
  }
  onAddActionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  }
  onRemoveActionFormGroup(mainIndex: number, index: number) {
  }
  /** End Action Form */

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ObjectName').setValue(selectedData.Name);
          formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          formGroup.get('ObjectEmail').setValue(selectedData.Email);
          formGroup.get('ObjectAddress').setValue(selectedData.Address);
          formGroup.get('ObjectTaxCode').setValue(selectedData.TaxCode);
          formGroup.get('ObjectBankName').setValue(selectedData.BankName);
          formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }
  }

  onContactChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ContactName').setValue(selectedData.Name);
          if (selectedData['Phone'] && selectedData['Phone']['restricted']) formGroup.get('ContactPhone')['placeholder'] = selectedData['Phone']['placeholder']; else formGroup.get('ContactPhone').setValue(selectedData['Phone']);
          if (selectedData['Email'] && selectedData['Email']['restricted']) formGroup.get('ContactEmail')['placeholder'] = selectedData['Email']['placeholder']; else formGroup.get('ContactEmail').setValue(selectedData['Email']);
          if (selectedData['Address'] && selectedData['Address']['restricted']) formGroup.get('ContactAddress')['placeholder'] = selectedData['Address']['placeholder']; else formGroup.get('ContactAddress').setValue(selectedData['Address']);
          formGroup.get('ContactIdentifiedNumber').setValue(selectedData.TaxCode);
        }
      }
    }
  }

  onPriceTableChange(formGroup: FormGroup, selectedData: SalesMasterPriceTableModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
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

  onPriceReportVoucherChange(formGroup: FormGroup, selectedData: PriceReportModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {

          this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + selectedData.Code, {
            includeContact: true,
            includeDetails: true,
            includeProductUnitList: true,
            includeProductPrice: true,
          }).then(rs => {

            if (rs && rs.length > 0) {
              const salesVoucher: CommercePosOrderModel = { ...rs[0] };
              salesVoucher.PriceReportVoucher = selectedData.Code;
              delete salesVoucher.Code;
              delete salesVoucher.Id;
              for (const detail of salesVoucher.Details) {
                delete detail['Id'];
                delete detail['Voucher'];
                detail.Description = detail['Description'];
              }
              this.formLoad([salesVoucher]);
            }
          });

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

  onSalectPriceReport(formGroup: FormGroup, selectedData: ChatRoomModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {

          // Get first price report => prototype
          // const firstPriceReport = selectedData['PriceReports'] && selectedData['PriceReports'][0];
          this.apiService.getPromise<PriceReportModel[]>('/sales/price-reports/' + this.cms.getObjectId(selectedData), {
            includeContact: true,
            includeDetails: true,
            includeProductUnitList: true,
            includeProductPrice: true,
          }).then(rs => {

            if (rs && rs.length > 0) {
              const salesVoucher: CommercePosOrderModel = { ...rs[0] };
              // salesVoucher.PriceReportVoucher = selectedData.Code;
              delete salesVoucher.Code;
              delete salesVoucher.Id;
              salesVoucher['SalesTask'] = { id: selectedData.Code, text: selectedData?.Description, Code: selectedData.Code, Description: selectedData.Description };
              for (const detail of salesVoucher.Details) {
                delete detail['Id'];
                delete detail['Voucher'];
                detail.Description = detail['Description'];
              }
              this.formLoad([salesVoucher]);
            }
          });
          // formGroup.get('ObjectBankCode').setValue(selectedData.BankAcc);
        }
      }
    }
  }

  onSelectProduct(detail: FormGroup, selectedData: ProductModel, doNotAutoFill?: boolean) {

    console.log(selectedData);
    const productId = this.cms.getObjectId(selectedData);
    if (productId) {
      if (!doNotAutoFill) {
        const descriptionControl = detail.get('Description');
        descriptionControl.setValue(selectedData['OriginName'] || selectedData['Name']);
      }
      detail['unitList'] = selectedData.Units;
      if (!doNotAutoFill && selectedData.Units && selectedData?.Units.length > 0) {
        const defaultUnit = selectedData.Units.find(f => f['DefaultImport'] === true);
        detail.get('Unit').setValue(defaultUnit);
      }
      // detail['IsManageByAccessNumber'] = selectedData?.IsManageByAccessNumber;
    }
    return false;
  }

  async onSelectUnit(detail: FormGroup, prevUnit: ProductUnitConversoinModel, nextUnit: ProductUnitConversoinModel, force?: boolean) {
    const unitId = this.cms.getObjectId(nextUnit);
    const productId = this.cms.getObjectId(detail.get('Product').value);
    if (typeof nextUnit?.IsManageByAccessNumber !== 'undefined') {
      detail['IsManageByAccessNumber'] = nextUnit.IsManageByAccessNumber;
      if (!this.isProcessing) {
        detail.get('AccessNumbers').setValue(null);
      }
    }
    if (unitId && productId) {

      let containerList = [];

      if (this.goodsMap[productId]) {
        containerList = (this.goodsMap[productId].Containers || []).filter(f => this.cms.getObjectId(f.Unit) == unitId);
      }
      if (containerList.length == 0) {
        containerList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
          select: 'Code',
          includeUnit: true,
          includeContainers: true,
          eq_Code: productId,
          eq_ConversionUnit: unitId
        }).then(goodsList => {
          if (goodsList && goodsList.length > 0) {
            return goodsList[0].Containers.map(m => ({
              id: m.Container,
              text: `[${m.ContainerFindOrder}] ${m.ContainerPath}: ${m.ContainerDescription} (SL tồn: ${this.decimalPipe.transform(m.Inventory, '1.0-0')}})`
            }));
          }
          return [];
        });
      }
      detail['ContainerList'] = containerList;
      if (containerList && containerList.length == 1) {
        detail.get('Container').setValue(containerList[0]);
      }

      // Convertsion quantity
      if (prevUnit && prevUnit.id && !prevUnit.ConversionRatio) {
        const product: ProductModel = detail.get('Product').value;
        if (product && (product.Units || product.UnitConversions)) {
          if (!product.Units) {
            product.Units = product.UnitConversions.map(m => ({ ...m, id: this.cms.getObjectId(m.Unit), text: m.Name }))
          }
        }
        prevUnit = product?.Units.find(f => this.cms.getObjectId(f) == this.cms.getObjectId(prevUnit))
      }
      if (prevUnit && nextUnit && this.cms.getObjectId(prevUnit) != this.cms.getObjectId(nextUnit) && prevUnit.ConversionRatio && nextUnit.ConversionRatio) {
        const currentQuantity = parseFloat(detail.get('Quantity').value);

        let baseQuantity = currentQuantity * prevUnit.ConversionRatio;
        let nextQuantity = baseQuantity / nextUnit.ConversionRatio;

        detail.get('Quantity').setValue(nextQuantity);
      }
    }
  }

  calulateTotal(formItem: FormGroup) {
    this.cms.takeUntil('calulcate_sales_voucher', 300).then(rs => {
      let total = 0;
      const details = this.getDetails(formItem);
      for (let i = 0; i < details.controls.length; i++) {
        total += this.calculatToMoney(details.controls[i] as FormGroup);
      }
      formItem.get('_total').setValue(this.cms.roundUsing(total, Math.floor, 2));
    });
  }

  calculatToMoney(detail: FormGroup, source?: string) {
    if (source === 'ToMoney') {
      const price = detail.get('ToMoney').value / detail.get('Quantity').value;
      return price;
    } else {
      const toMoney = detail.get('Quantity').value * detail.get('Price').value;
      return toMoney;
    }
  }

  toMoney(formItem: FormGroup, detail: FormGroup, source?: string, index?: number) {
    this.cms.takeUntil(this.componentName + '_ToMoney_ ' + index, 300).then(() => {
      if (source === 'ToMoney') {
        detail.get('Price').setValue(this.calculatToMoney(detail, source));
      } else {
        detail.get('ToMoney').setValue(this.calculatToMoney(detail));
      }
      // Call culate total
      const details = this.getDetails(formItem);
      let total = 0;
      for (let i = 0; i < details.controls.length; i++) {
        total += this.calculatToMoney(details.controls[i] as FormGroup);
      }
      formItem.get('_total').setValue(total);
    });
    return false;
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.cms.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'PRICEREPORT': { title: 'Phiếu báo giá' },
          'GOODSDELIVERY': { title: 'Phiếu xuất kho' },
        },
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems, type);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'GOODSDELIVERY') {
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const refVoucher = await this.apiService.getPromise<WarehouseGoodsDeliveryNoteModel[]>('/warehouse/goods-delivery-notes/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['APPROVED'].indexOf(this.cms.getObjectId(refVoucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu xuất kho chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(refVoucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Khách hàng trong phiếu mua hàng không giống với phiếu bán hàng'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete refVoucher.Id;
                  // delete refVoucher.Code;
                  formGroup.patchValue({ ...refVoucher, Code: null, Object: { id: this.cms.getObjectId(refVoucher.Object), text: refVoucher.ObjectName }, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu xuất kho: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type !== 'CATEGORY') {
                      // delete voucherDetail.Id;
                      // delete voucherDetail.Voucher;
                      // delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Voucher: null, No: null, Business: this.accountingBusinessList.filter(f => f.id === 'NETREVENUE') } as any);
                      newDtailFormGroup.get('Business').disable();
                      details.push(newDtailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type }))]);
          }
          if (type === 'PRICEREPORT') {
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const refVoucher = await this.apiService.getPromise<SalesPriceReportModel[]>('/sales/price-reports/' + chooseItems[i].Code, { includeContact: true, includeDetails: true, includeProductUnitList: true, includeProductPrice: true, includeRelativeVouchers: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.cms.getObjectId(refVoucher.State)) < 0) {
                  this.cms.toastService.show(this.cms.translateText('Phiếu báo giá chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(refVoucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.toastService.show(this.cms.translateText('Khách hàng trong phiếu báo giá không giống với phiếu bán hàng'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete refVoucher.Id;
                  // delete refVoucher.Code;
                  formGroup.patchValue({ ...refVoucher, Code: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);
                if (refVoucher.RelativeVouchers && refVoucher.RelativeVouchers.length > 0) {
                  for (const relativeVoucher of refVoucher.RelativeVouchers) {
                    insertList.push(relativeVoucher);
                  }
                }

                // Insert order details into voucher details
                if (refVoucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Báo giá: ' + refVoucher.Code + ' - ' + refVoucher.Title }));
                  for (const voucherDetail of refVoucher.Details) {
                    if (voucherDetail.Type !== 'CATEGORY') {
                      // delete voucherDetail.Id;
                      // delete voucherDetail.Voucher;
                      // delete voucherDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, Voucher: null, No: null, Business: this.accountingBusinessList.filter(f => f.id === 'NETREVENUE') } as any);
                      newDtailFormGroup.get('Business').disable();
                      newDtailFormGroup.get('Unit')['UnitList'] = voucherDetail.Product?.Units;
                      details.push(newDtailFormGroup);
                      await new Promise(resolve => setTimeout(() => resolve(true), 300));
                      this.toMoney(formGroup, newDtailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id || m?.Code, text: m?.text || m.Title, type: m?.type || type as any }))]);
          }

          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
      }
    });
    return false;
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.cms.previewVoucher(this.cms.getObjectId(relativeVocher.type), relativeVocher);
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.cms.getObjectId(relativeVocher)));
    return false;
  }

  async onSelectAccessNumbers(detail: FormGroup, selectedData: ProductModel, force?: boolean) {
    console.log(selectedData);
    if (detail['IsManageByAccessNumber']) {
      detail.get('Quantity').setValue(detail.get('AccessNumbers').value.trim().split('\n').length);
    }
  }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      for (const detail of item.Details) {
        if (typeof detail.AccessNumbers == 'string') {
          detail.AccessNumbers = detail?.AccessNumbers.trim().split('\n').filter(f => !!f).map(ac => {
            if (/^127/.test(ac)) {
              return { id: ac, text: ac };
            }
            const acd = this.cms.decompileAccessNumber(ac);
            return acd.accessNumber;
          });
        }
      }
    }
    return data;
  }
}
