import { AccAccountFormComponent } from './../../../accounting/acc-account/acc-account-form/acc-account-form.component';
import { ProductUnitModel } from './../../../../models/product.model';
import { WarehouseGoodsContainerModel, WarehouseGoodsDeliveryNoteModel } from './../../../../models/warehouse.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../../../../environments/environment';
import { ActionControlListOption } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ContactModel } from '../../../../models/contact.model';
import { ProductModel } from '../../../../models/product.model';
import { PurchaseVoucherModel } from '../../../../models/purchase.model';
import { SalesReturnsVoucherModel, SalesVoucherModel } from '../../../../models/sales.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { WarehouseGoodsReceiptNoteModel, WarehouseGoodsReceiptNoteDetailModel } from '../../../../models/warehouse.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { PurchaseVoucherListComponent } from '../../../purchase/voucher/purchase-voucher-list/purchase-voucher-list.component';
import { WarehouseGoodsReceiptNotePrintComponent } from '../warehouse-goods-receipt-note-print/warehouse-goods-receipt-note-print.component';
import { BusinessModel } from '../../../../models/accounting.model';
import { CustomIcon, FormGroupComponent } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { Select2Component } from '../../../../lib/custom-element/select2/select2.component';
import { AssignNewContainerFormComponent } from '../../goods/assign-new-containers-form/assign-new-containers-form.component';

@Component({
  selector: 'ngx-warehouse-goods-receipt-note-form',
  templateUrl: './warehouse-goods-receipt-note-form.component.html',
  styleUrls: ['./warehouse-goods-receipt-note-form.component.scss'],
})
export class WarehouseGoodsReceiptNoteFormComponent extends DataManagerFormComponent<WarehouseGoodsReceiptNoteModel> implements OnInit {

  componentName: string = 'WarehouseGoodsReceiptNoteFormComponent';
  idKey = 'Code';
  apiPath = '/warehouse/goods-receipt-notes';
  baseFormUrl = '/warehouse/goods-receipt-note/form';

  previewAfterCreate = true;
  printDialog = WarehouseGoodsReceiptNotePrintComponent;

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();
  // sortableInstance: any;

  /** Tax list */
  static _taxList: (TaxModel & { id?: string, text?: string })[];
  taxList: (TaxModel & { id?: string, text?: string })[];

  /** Unit list */
  static _unitList: (UnitModel & { id?: string, text?: string })[];
  unitList: ProductUnitModel[];

  towDigitsInputMask = this.commonService.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  warehouseContainerList = [];

  uploadConfig = {

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
    maximumSelectionLength: 1,
    // tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  customIcons: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewProduct'), status: 'success', action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      this.commonService.openDialog(ProductFormComponent, {
        context: {
          inputMode: 'dialog',
          // inputId: ids,
          onDialogSave: (newData: ProductModel[]) => {
            console.log(newData);
            // const formItem = formGroupComponent.formGroup;
            const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.commonService.getObjectId(unit?.Unit), text: this.commonService.getObjectText(unit?.Unit) })) };
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

  customIconsForContainer: CustomIcon[] = [{
    icon: 'plus-square-outline', title: this.commonService.translateText('Gán vị trí'),
    status: 'danger',
    states: {
      '<>': {
        icon: 'plus-square-outline',
        status: 'danger',
        title: this.commonService.translateText('Thêm vị trí mới'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.commonService.translateText('Thêm vị trí mới'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentProduct = this.commonService.getObjectId(formGroup.get('Product').value);
      const currentUnit = this.commonService.getObjectId(formGroup.get('Unit').value);
      this.commonService.openDialog(AssignNewContainerFormComponent, {
        context: {
          inputMode: 'dialog',
          inputGoodsList: [{ Code: currentProduct, WarehouseUnit: currentUnit }],
          onDialogSave: (newData: ProductModel[]) => {
            this.onSelectUnit(formGroup, formGroup.get('Unit').value, true).then(rs => {
              formGroup.get('Container').patchValue({
                id: newData[0].Code, text: newData[0].Path + newData[0].Name,
              })
            });
          },
          onDialogClose: () => {
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }];

  customIconsForProduct: { [key: string]: CustomIcon[] } = {};
  getCustomIconsForProduct(name: string): CustomIcon[] {
    if (this.customIconsForProduct[name]) return this.customIconsForProduct[name];
    return this.customIconsForProduct[name] = [{
      icon: 'plus-square-outline',
      title: this.commonService.translateText('Common.addNewProduct'),
      status: 'success',
      states: {
        '<>': {
          icon: 'edit-outline',
          status: 'primary',
          title: this.commonService.translateText('Common.editProduct'),
        },
        '': {
          icon: 'plus-square-outline',
          status: 'success',
          title: this.commonService.translateText('Common.addNewProduct'),
        },
      },
      action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
        const currentProduct = this.commonService.getObjectId(formGroup.get('Product').value);
        this.commonService.openDialog(ProductFormComponent, {
          context: {
            inputMode: 'dialog',
            inputId: currentProduct ? [currentProduct] : null,
            showLoadinng: true,
            onDialogSave: (newData: ProductModel[]) => {
              console.log(newData);
              // const formItem = formGroupComponent.formGroup;
              const newProduct: any = { ...newData[0], id: newData[0].Code, text: newData[0].Name, Units: newData[0].UnitConversions?.map(unit => ({ ...unit, id: this.commonService.getObjectId(unit?.Unit), text: this.commonService.getObjectText(unit?.Unit) })) };
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

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<WarehouseGoodsReceiptNoteFormComponent>,
    public adminProductService: AdminProductService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);

    /** Append print button to head card */
    this.actionButtonList.splice(this.actionButtonList.length - 1, 0, {
      name: 'print',
      status: 'primary',
      label: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      icon: 'printer',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.print'), 'head-title'),
      size: 'medium',
      disabled: () => this.isProcessing,
      hidden: () => false,
      click: (event: any, option: ActionControlListOption) => {
        this.preview(option.form);
      },
    });
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2OptionForProduct = {
    ...this.commonService.makeSelect2AjaxOption('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures", includeSearchResultLabel: true, includeUnits: true }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa...',
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

  select2OptionForAccessNumbers = {
    placeholder: 'Số truy xuất, tự động phát sinh khi lưu phiếu...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    dropdownCssClass: 'is_tags',
    multiple: true,
    // maximumSelectionLength: 1,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

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
    { id: 'CATEGORY', text: 'Danh mục' },
  ];

  objectControlIcons: CustomIcon[] = [{
    icon: 'plus-square-outline',
    title: this.commonService.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.commonService.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.commonService.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.commonService.getObjectId(formGroup.get('Object').value);
      this.commonService.openDialog(ContactFormComponent, {
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
    title: this.commonService.translateText('Common.addNewContact'),
    status: 'success',
    states: {
      '<>': {
        icon: 'edit-outline',
        status: 'primary',
        title: this.commonService.translateText('Common.editContact'),
      },
      '': {
        icon: 'plus-square-outline',
        status: 'success',
        title: this.commonService.translateText('Common.addNewContact'),
      },
    },
    action: (formGroupCompoent: FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
      const currentObject = this.commonService.getObjectId(formGroup.get('Contact').value);
      this.commonService.openDialog(ContactFormComponent, {
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list);

    this.warehouseContainerList = await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { sort_Path: 'asc', select: 'id=>Code,text=>Path' });
    this.accountingBusinessList = await this.apiService.getPromise<BusinessModel[]>('/accounting/business', { eq_Type: 'WAREHOUSERECEIPT', select: 'id=>Code,text=>Name,type' });

    return super.init().then(status => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Title').setValue('Copy of: ' + formItem.get('Title').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
            // conditonFormGroup.get('Id').setValue('');
          });
        });
      }

      return status;
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WarehouseGoodsReceiptNoteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['includeRelativeVouchers'] = true;
    params['useBaseTimezone'] = true;
    params['includeUnit'] = true;
    params['includeAccessNumbers'] = true;
    super.executeGet(params, (resources: WarehouseGoodsReceiptNoteModel[]) => {
      success(resources);
    }, error);
  }

  async formLoad(formData: WarehouseGoodsReceiptNoteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: WarehouseGoodsReceiptNoteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        itemFormData.Details.forEach(detail => {
          detail.AccessNumbers = (Array.isArray(detail.AccessNumbers) && detail.AccessNumbers.length > 0 ? (detail.AccessNumbers.map(ac => this.commonService.getObjectId(ac)).join('\n')) : '') as any;
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
          if (detail.Product) {
            this.onSelectProduct(newDetailFormGroup, detail.Product, true);
            const seelctedUnit = detail.Product.Units.find(f => f.id == detail.Unit.id);
            this.onSelectUnit(newDetailFormGroup, seelctedUnit);
          }
        });
        this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }

    });

  }

  makeNewFormGroup(data?: WarehouseGoodsReceiptNoteModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Object: ['', Validators.required],
      ObjectName: ['', Validators.required],
      ObjectEmail: [''],
      ObjectPhone: [''],
      ObjectAddress: [''],
      ObjectIdentifiedNumber: [''],
      Recipient: [''],
      ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      ObjectBankName: [''],
      ObjectBankCode: [''],

      Contact: [],
      ContactName: [],
      ContactPhone: [],
      ContactEmail: [],
      ContactAddress: [],
      ContactIdentifiedNumber: [],

      DateOfReceipted: [null, Validators.required],
      ReceiptAddress: [''],
      Title: [''],
      Note: [''],
      SubNote: [''],
      RelativeVouchers: [],
      _total: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    } else {
      this.addDetailFormGroup(newForm);
    }

    const titleControl = newForm.get('Title');
    newForm.get('ObjectName').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(objectName => {
      if (objectName && (!titleControl.touched || !titleControl.value) && (!titleControl.value || /^Nhập kho: /.test(titleControl.value))) {
        titleControl.setValue(`Nhập kho: ${objectName}`);
      }
    });

    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseGoodsReceiptNoteModel): void {
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
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: WarehouseGoodsReceiptNoteDetailModel): FormGroup {
    let newForm = null;
    newForm = this.formBuilder.group({
      // Id: [''],
      SystemUuid: [''],
      No: [''],
      Type: ['PRODUCT', Validators.required],
      Product: ['', (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      Description: ['', Validators.required],
      Quantity: [1],
      // Price: [0],
      Unit: [''],
      // Tax: ['VAT10'],
      // ToMoney: [0],
      Image: [[]],
      Container: ['', (control: FormControl) => {
        if (newForm && this.commonService.getObjectId(newForm.get('Type').value) === 'PRODUCT' && !this.commonService.getObjectId(control.value)) {
          return { invalidName: true, required: true, text: 'trường bắt buộc' };
        }
        return null;
      }],
      RelateDetail: [''],
      Business: [this.accountingBusinessList.filter(f => f.id === 'GOODSRECEIPT')],
      AccessNumbers: [[]],
      DateOfManufacture: [null],
      ExpiryDate: [null],
    });

    if (data) {
      if (data?.AccessNumbers && this.commonService.getObjectId(data?.Product)) {
        for (const accessNumber of data?.AccessNumbers) {
          if (accessNumber?.id && accessNumber.id == accessNumber?.text) {
            accessNumber.text += ' (' + this.commonService.compileAccessNumber(accessNumber.id, this.commonService.getObjectId(data?.Product)) + ')';
          }
        }
      }
      newForm.patchValue(data);
      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }
      this.toMoney(parentFormGroup, newForm);
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
    this.onAddDetailFormGroup(parentFormGroup, newChildFormGroup);
    return false;
  }
  removeDetailGroup(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    this.getDetails(parentFormGroup).removeAt(index);
    this.onRemoveDetailFormGroup(parentFormGroup, detail);
    return false;
  }
  onAddDetailFormGroup(parentFormGroup: FormGroup, newChildFormGroup: FormGroup) {
  }
  onRemoveDetailFormGroup(parentFormGroup: FormGroup, detailFormGroup: FormGroup) {
  }
  /** End Detail Form */

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
          formGroup.get('ContactPhone').setValue(selectedData.Phone);
          formGroup.get('ContactEmail').setValue(selectedData.Email);
          formGroup.get('ContactAddress').setValue(selectedData.Address);
        }
      }
    }
  }



  onSelectProduct(detail: FormGroup, selectedData: ProductModel, doNotAutoFill?: boolean) {

    console.log(selectedData);
    const productId = this.commonService.getObjectId(selectedData);
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

  async onSelectUnit(detail: FormGroup, selectedData: ProductModel, force?: boolean) {
    const unitId = this.commonService.getObjectId(selectedData);
    const productId = this.commonService.getObjectId(detail.get('Product').value);
    if (typeof selectedData?.IsManageByAccessNumber !== 'undefined') {
      detail['IsManageByAccessNumber'] = selectedData.IsManageByAccessNumber;
      if (!this.isProcessing) {
        detail.get('AccessNumbers').setValue(null);
      }
    }
    if (unitId && productId) {
      const containerList = await this.apiService.getPromise<any[]>('/warehouse/goods', {
        select: 'Code',
        includeUnit: true,
        includeContainers: true,
        eq_Code: productId,
        eq_ConversionUnit: unitId
      }).then(goodsList => {
        // const results = [];
        if (goodsList && goodsList.length > 0) {
          return goodsList[0].Containers.map(m => ({
            id: m.Container,
            text: `[${m.ContainerFindOrder}] ${m.ContainerPath}: ${m.ContainerDescription}`
          }));
        }
        return [];
      });
      detail['ContainerList'] = containerList;
      if (containerList && containerList.length == 1) {
        detail.get('Container').setValue(containerList[0]);
      }

      if (selectedData && selectedData['ConversionQuantity']) {
        if (!this.isProcessing) {
          detail.get('Quantity').setValue(selectedData['ConversionQuantity']);
        }
      }
    }
  }

  calculatToMoney(detail: FormGroup) {
    return 0;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    return false;
  }

  getRawFormData() {
    const data = super.getRawFormData();
    for (const item of data.array) {
      for (const detail of item.Details) {
        if (typeof detail.AccessNumbers == 'string') {
          detail.AccessNumbers = detail?.AccessNumbers.trim().split('\n').filter(ac => !!ac).map(ac => {
            if (/^127/.test(ac)) {
              return { id: ac, text: ac };
            }
            const acd = this.commonService.decompileAccessNumber(ac);
            return { id: acd.accessNumber, text: acd.accessNumber };
          });
        }
      }
    }
    return data;
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.commonService.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'PURCHASE': { title: 'Phiếu mua hàng' },
          'GOODSDELIVERY': { title: 'Phiếu xuất kho' },
          'SALESRETURNS': { title: 'Phiếu hàng bán trả lại' },
        },
        // inputMode: 'dialog',
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'PURCHASE') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<PurchaseVoucherModel[]>('/purchase/vouchers/' + chooseItems[i].Code, { includeObject: true, includeContact: true, includeDetails: true, dIncludeUnitConversionCalculate: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.showToast(this.commonService.translateText('Phiếu mua hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.showToast(this.commonService.translateText('Nhà cung cấp trong phiếu mua hàng không giống với phiếu nhập kho'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu mua hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;
                      const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, Id: null, No: null, Voucher: null, Business: null, RelateDetail: `PURCHASE/${voucher.Code}/${voucherDetail.SystemUuid}` });
                      newDetailFormGroup.get('Business').disable();
                      details.push(newDetailFormGroup);
                      this.onSelectProduct(newDetailFormGroup, voucherDetail.Product, true);
                      const selectedUnit = voucherDetail.Product.Units.find(f => f.id == voucherDetail.Unit.id);
                      if (selectedUnit) {
                        this.onSelectUnit(newDetailFormGroup, selectedUnit);
                      }
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASE' }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'SALESRETURNS') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<SalesReturnsVoucherModel[]>('/sales/sales-returns-vouchers/' + chooseItems[i].Code, { includeRelativeVouchers: true, includeContact: true, includeDetails: true, includeUnit: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.showToast(this.commonService.translateText('Phiếu bán hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.showToast(this.commonService.translateText('Nhà cung cấp trong phiếu mua hàng không giống với phiếu nhập kho'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);
                if (voucher.RelativeVouchers) {
                  for (const relativeVoucher of voucher.RelativeVouchers) {
                    if (relativeVoucher.type == 'GOODSDELIVERY') {
                      insertList.push(relativeVoucher);
                      const goodsDeliveryVoucher = await this.apiService.getPromise<WarehouseGoodsDeliveryNoteModel[]>('/warehouse/goods-delivery-notes/' + relativeVoucher.id, { includeContact: true, includeDetails: true, includeUnit: true }).then(rs => rs[0]);
                      if (goodsDeliveryVoucher && goodsDeliveryVoucher.Details && goodsDeliveryVoucher.Details.length > 0) {
                        details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu xuất kho: ' + goodsDeliveryVoucher.Code + ' - ' + goodsDeliveryVoucher.Title }));
                        for (const goodsDeliveryDetail of goodsDeliveryVoucher.Details) {
                          if (goodsDeliveryDetail.Type === 'PRODUCT') {
                            const quantity = voucher.Details.find(f => this.commonService.getObjectId(f.Product) == this.commonService.getObjectId(goodsDeliveryDetail.Product))?.Quantity;
                            const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...goodsDeliveryDetail, Id: null, No: null, Voucher: null, Business: [this.accountingBusinessList.find(f => f.id == 'GOODSRECEIPTFORRETURNS')], RelateDetail: `GOODSDELIVERY/${goodsDeliveryVoucher.Code}/${goodsDeliveryDetail.Id}`, Quantity: quantity });
                            newDtailFormGroup.get('Business').disable();
                            details.push(newDtailFormGroup);
                            this.onSelectUnit(newDtailFormGroup, goodsDeliveryDetail.Unit, true);
                          }
                        }
                      }
                    }
                  }
                }

                // Insert order details into voucher details
                // if (voucher?.Details) {
                //   details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu trả hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                //   for (const voucherDetail of voucher.Details) {
                //     if (voucherDetail.Type === 'PRODUCT') {
                //       // delete orderDetail.Id;
                //       // delete orderDetail.Voucher;
                //       // delete orderDetail.No;
                //       const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, No: null, Voucher: null, Business: [this.accountingBusinessList.find(f => f.id == 'GOODSRECEIPTFORRETURNS')], RelateDetail: `SALESRETURNS/${voucher.Code}/${voucherDetail.Id}` });
                //       newDtailFormGroup.get('Business').disable();
                //       details.push(newDtailFormGroup);
                //       this.onSelectUnit(newDtailFormGroup, voucherDetail.Unit, true);
                //     }
                //   }
                // }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id || m?.Code, text: m?.text || m.Title, type: m?.type || type }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          if (type === 'GOODSDELIVERY') {
            // Qui trình tqmj xuất tái nhập
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<SalesVoucherModel[]>('/warehouse/goods-delivery-notes/' + chooseItems[i].Code, { includeContact: true, includeDetails: true, dIncludeUnitConversionCalculate: true, includeAccessNumbers: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.showToast(this.commonService.translateText('Phiếu xuất kho chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.showToast(this.commonService.translateText('Đối tượng theo dõi trong phiếu nhập không giống với phiếu nhập xuất'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Id: null, Description: 'Phiếu xuất: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;

                      // check duplicate
                      const existsDetail = details.controls.find(fDetail => this.commonService.getObjectId(fDetail.get('Product').value) == this.commonService.getObjectId(voucherDetail.Product) && this.commonService.getObjectId(fDetail.get('Unit').value) == this.commonService.getObjectId(voucherDetail.Unit));
                      if (!existsDetail) {

                        const accessNumbers = voucherDetail.AccessNumbers && Array.isArray(voucherDetail.AccessNumbers) && voucherDetail.AccessNumbers.length > 0 ? (voucherDetail.AccessNumbers.map(ac => this.commonService.getObjectId(ac)).join('\n')) : '';
                        const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, AccessNumbers: accessNumbers as any, No: null, Voucher: null, Business: null, RelateDetail: `GOODSDELIVERY/${voucher.Code}/${voucherDetail.Id}` });
                        // newDetailFormGroup.get('Business').disable();
                        newDetailFormGroup['case'] = 'REIMPORT';

                        let business = [...voucherDetail.Business];
                        if (business) {
                          const busunessItemIndex = business.findIndex(f => this.commonService.getObjectId(f) == 'WAREHOUSETEMPORARYEXPORT')
                          if (busunessItemIndex > -1) {
                            business[busunessItemIndex] = { id: 'WAREHOUSEREIMPORT', text: 'Tái nhập hàng hóa' };
                          }
                          newDetailFormGroup.get('Business').setValue(business);
                        }

                        details.push(newDetailFormGroup);

                        if (voucherDetail.Product?.Units) {
                          newDetailFormGroup['unitList'] = voucherDetail.Product?.Units;
                        }

                        const chooseUnit = voucherDetail.Product?.Units.find(f => this.commonService.getObjectId(f) == this.commonService.getObjectId(voucherDetail.Unit));
                        this.onSelectUnit(newDetailFormGroup, chooseUnit, true);
                      } else {
                        // Duplicate
                        existsDetail.get('Quantity').setValue(parseFloat(existsDetail.get('Quantity').value) + parseFloat(voucherDetail.Quantity));
                        if (voucherDetail.AccessNumbers && voucherDetail.AccessNumbers.length > 0) {
                          existsDetail.get('AccessNumbers').setValue(existsDetail.get('AccessNumbers').value + '\n' + voucherDetail.AccessNumbers.map(m => this.commonService.getObjectId(m)).join('\n'));
                        }

                      }


                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: type }))]);
            this.setNoForArray(details.controls as FormGroup[], (detail: FormGroup) => detail.get('Type').value === 'PRODUCT');
          }
          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
      }
    })
    return false;
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.commonService.getObjectId(relativeVocher)));
    return false;
  }

  extractToOtherUnits(parentFormGroup: FormGroup, detail: FormGroup, index: number) {
    const formDetails = this.getDetails(parentFormGroup);
    const newDetailFormGroup = this.makeNewDetailFormGroup(parentFormGroup, { ...detail.value, Id: null });
    newDetailFormGroup['unitList'] = detail['unitList'];
    newDetailFormGroup['case'] = detail['case'];
    newDetailFormGroup['IsManageByAccessNumber'] = detail['IsManageByAccessNumber'];
    formDetails.controls.splice(index + 1, 0, newDetailFormGroup);
    this.onSelectUnit(newDetailFormGroup, newDetailFormGroup.get('Unit').value);
  }

  onSelectAccessNumbers(detail: FormGroup, event: any, force?: boolean, element?: any) {

    if (event.key == 'Enter' || force) {
      detail.get('Quantity').setValue(element.value.trim().split('\n').filter(ac => !!ac).length);
    }

    // // const { accessNumber, goodsId } = this.commonService.decompileAccessNumber(this.commonService.getObjectId(an));
    // let hadChanged = false;
    // for (const an of selectedData) {
    //   if (an.id == an.text) {
    //     const { accessNumber, goodsId } = this.commonService.decompileAccessNumber(this.commonService.getObjectId(an));
    //     console.log(accessNumber, goodsId);
    //     // an.text = an.text + ' (' + accessNumber + ')';
    //     an.text = accessNumber + ' (' + this.commonService.getObjectId(an) + ')';
    //     an.id = accessNumber;
    //     hadChanged = true;
    //   }
    // }
    // if (hadChanged) {// Todo: nếu có thay đổi (quét thêm mã vào) thì giao điện không thể scroll được
    //   detail.get('AccessNumbers').setValue(selectedData);
    //   // const accessNumbersControl = detail.get('AccessNumbers');
    //   // accessNumbersControl.setValue(selectedData);
    //   setTimeout(() => {
    //     $(select2Conponent['controls']['element'][0])['select2']('open');
    //   }, 500);
    // }

    // // Update quantity by number access numbers
    // detail.get('Quantity').setValue(selectedData.length);
  }

}
