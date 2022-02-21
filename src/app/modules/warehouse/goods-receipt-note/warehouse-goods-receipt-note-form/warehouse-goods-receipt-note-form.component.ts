import { ProductUnitModel } from './../../../../models/product.model';
import { WarehouseGoodsContainerModel, WarehouseGoodsDeliveryNoteModel } from './../../../../models/warehouse.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
import { CustomIcon } from '../../../../lib/custom-element/form/form-group/form-group.component';
import { ProductFormComponent } from '../../../admin-product/product/product-form/product-form.component';
import { ContactFormComponent } from '../../../contact/contact/contact-form/contact-form.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';

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

  warehouseContainerList = [];

  // select2ContactOption = {
  //   placeholder: 'Chọn liên hệ...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   // multiple: true,
  //   // tags: true,
  //   keyMap: {
  //     id: 'id',
  //     text: 'text',
  //   },
  //   ajax: {
  //     transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
  //       console.log(settings);
  //       const params = settings.data;
  //       this.apiService.getPromise('/contact/contacts', { includeIdText: true, includeGroups: true, filter_Name: params['term'] }).then(rs => {
  //         success(rs);
  //       }).catch(err => {
  //         console.error(err);
  //         failure();
  //       });
  //     },
  //     delay: 300,
  //     processResults: (data: any, params: any) => {
  //       console.info(data, params);
  //       return {
  //         results: data.map(item => {
  //           item['id'] = item['Code'];
  //           item['text'] = item['Code'] + ' - ' + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
  //           return item;
  //         }),
  //       };
  //     },
  //   },
  // };

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
    icon: 'plus-square-outline', title: this.commonService.translateText('Common.addNewProduct'), status: 'success', action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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
    ...this.commonService.makeSelect2AjaxOption('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name,OriginName=>Name,Sku,FeaturePicture,Pictures,IsManageByAccessNumber", includeSearchResultLabel: true, includeUnits: true }, {
      limit: 10,
      placeholder: 'Chọn hàng hóa...',
      prepareReaultItem: (item) => {
        item.thumbnail = item?.FeaturePicture?.Thumbnail;
        return item;
      }
    }),
    withThumbnail: true,

    // placeholder: 'Chọn Hàng hoá/dịch vụ...',
    // allowClear: true,
    // width: '100%',
    // dropdownAutoWidth: true,
    // minimumInputLength: 0,
    // withThumbnail: true,
    // keyMap: {
    //   id: 'Code',
    //   text: 'Name',
    // },
    // ajax: {
    //   transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
    //     console.log(settings);
    //     this.apiService.getPromise('/admin-product/products', { select: "id=>Code,text=>Name,Code,Sku,Name,OriginName=>Name,FeaturePicture,Pictures", limit: 40, includeUnit: true, includeUnits: true, 'search': settings.data['term'] }).then(rs => {
    //       success(rs);
    //     }).catch(err => {
    //       console.error(err);
    //       failure();
    //     });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     return {
    //       results: data.map(product => {
    //         product.thumbnail = product?.FeaturePicture?.Thumbnail;
    //         // product.id = product.id + '/' + this.commonService.getObjectId(product.WarehouseUnit);
    //         product.text = `${product.id} - ` + (product.Sku && `${product.Sku} - ` || '') + `${product.text}`;
    //         return product;
    //       })
    //     };
    //   },
    // },
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
    action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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
    action: (formGroup: FormGroup, array: FormArray, index: number, option: { parentForm: FormGroup }) => {
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

    /** Load and cache tax list */
    // if (!PurchaseOrderVoucherFormComponent._taxList) {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
    //     tax['id'] = tax.Code;
    //     tax['text'] = tax.Name;
    //     return tax;
    //   });
    // } else {
    //   this.taxList = PurchaseOrderVoucherFormComponent._taxList;
    // }

    /** Load and cache unit list */
    // this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', {limit: 'nolimit'})).map(tax => {
    //   tax['id'] = tax.Code;
    //   tax['text'] = tax.Name;
    //   return tax;
    // });

    await this.adminProductService.unitList$.pipe(filter(f => !!f), take(1)).toPromise().then(list => this.unitList = list);

    // if (!PurchaseOrderVoucherFormComponent._unitList) {
    // } else {
    //   this.unitList = PurchaseOrderVoucherFormComponent._unitList;
    // }

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
            conditonFormGroup.get('Id').setValue('');
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
    super.executeGet(params, success, error);
  }

  async formLoad(formData: WarehouseGoodsReceiptNoteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: WarehouseGoodsReceiptNoteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        const details = this.getDetails(newForm);
        itemFormData.Details.forEach(detail => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
          this.onSelectUnit(newDetailFormGroup, detail.Unit);
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
    const newForm = this.formBuilder.group({
      Id: [''],
      No: [''],
      Type: ['PRODUCT', Validators.required],
      Product: [''],
      Description: ['', Validators.required],
      Quantity: [1],
      // Price: [0],
      Unit: [''],
      // Tax: ['VAT10'],
      // ToMoney: [0],
      Image: [[]],
      Container: [''],
      RelateDetail: [''],
      Business: [this.accountingBusinessList.filter(f => f.id === 'GOODSRECEIPT')],
      AccessNumbers: [[]],
    });

    if (data) {
      newForm.patchValue(data);
      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }
      this.toMoney(parentFormGroup, newForm);
      // if(Array.isArray(data['AccessNumbers']) && data['AccessNumbers'].length > 0) {
      newForm['IsManageByAccessNumber'] = data.Product?.IsManageByAccessNumber || false;
      // newForm['AccessNumberList'] = data['AccessNumbers'];
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



  onSelectProduct(detail: FormGroup, selectedData: ProductModel) {

    console.log(selectedData);
    const productId = this.commonService.getObjectId(selectedData);
    if (productId) {
      const descriptionControl = detail.get('Description');
      descriptionControl.setValue(selectedData['OriginName']);
      if (selectedData.Units && selectedData?.Units.length > 0) {
        const defaultUnit = selectedData.Units.find(f => f['DefaultImport'] === true);
        detail['unitList'] = selectedData.Units;
        detail.get('Unit').setValue(defaultUnit);
      }
      detail['IsManageByAccessNumber'] = selectedData?.IsManageByAccessNumber;
    }
    return false;
  }

  async onSelectUnit(detail: FormGroup, selectedData: ProductModel, force?: boolean) {
    const unitId = this.commonService.getObjectId(selectedData);
    const productId = this.commonService.getObjectId(detail.get('Product').value);
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
            text: `${m.ContainerPath}: ${m.ContainerDescription}`
          }));
        }
        return [];
      });
      detail['ContainerList'] = containerList;
      if (containerList && containerList.length == 1) {
        detail.get('Container').setValue(containerList[0]);
      }
    }
  }

  calculatToMoney(detail: FormGroup) {
    // let toMoney = detail.get('Quantity').value * detail.get('Price').value;
    // let tax = detail.get('Tax').value;
    // if (tax) {
    //   if (typeof tax === 'string') {
    //     tax = this.taxList.filter(t => t.Code === tax)[0];
    //   }
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    // return toMoney;
    return 0;
  }

  toMoney(formItem: FormGroup, detail: FormGroup) {
    // detail.get('ToMoney').setValue(this.calculatToMoney(detail));

    // // Call culate total
    // const details = this.getDetails(formItem);
    // let total = 0;
    // for (let i = 0; i < details.controls.length; i++) {
    //   total += this.calculatToMoney(details.controls[i] as FormGroup);
    // }
    // formItem.get('_total').setValue(total);
    return false;
  }


  // async preview(formItem: FormGroup) {
  //   const data: WarehouseGoodsReceiptNoteModel = formItem.value;
  //   // data.Details.forEach(detail => {
  //   //   if (typeof detail['Tax'] === 'string') {
  //   //     detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
  //   //     if (this.unitList) {
  //   //       detail['Unit'] = (detail['Unit'] && detail['Unit'].Name) || this.unitList.filter(t => t.Code === detail['Unit'])[0] as any;
  //   //     }
  //   //   }
  //   // });
  //   this.commonService.openDialog(WarehouseGoodsReceiptNotePrintComponent, {
  //     context: {
  //       showLoadinng: true,
  //       title: 'Xem trước',
  //       data: [data],
  //       idKey: ['Code'],
  //       onSaveAndClose: (priceReport: WarehouseGoodsReceiptNoteModel) => {
  //         this.saveAndClose();
  //       },
  //       onSaveAndPrint: (priceReport: WarehouseGoodsReceiptNoteModel) => {
  //         this.save();
  //       },
  //     },
  //   });
  //   return false;
  // }

  getRawFormData() {
    return super.getRawFormData();
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
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const voucher = await this.apiService.getPromise<PurchaseVoucherModel[]>('/purchase/vouchers/' + chooseItems[i].Code, { includeObject: true, includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Phiếu bán hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.toastService.show(this.commonService.translateText('Nhà cung cấp trong phiếu mua hàng không giống với phiếu nhập kho'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu bán hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;
                      const newDetailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, No: null, Voucher: null, Business: null, RelateDetail: `PURCHASE/${voucher.Code}/${voucherDetail.Id}` });
                      newDetailFormGroup.get('Business').disable();
                      details.push(newDetailFormGroup);
                      this.onSelectUnit(newDetailFormGroup, voucherDetail.Unit);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASE' }))]);
          }
          if (type === 'SALESRETURNS') {
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const voucher = await this.apiService.getPromise<SalesReturnsVoucherModel[]>('/sales/sales-returns-vouchers/' + chooseItems[i].Code, { includeRelativeVouchers: true, includeContact: true, includeDetails: true, includeUnit: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Phiếu bán hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.toastService.show(this.commonService.translateText('Nhà cung cấp trong phiếu mua hàng không giống với phiếu nhập kho'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Details: [] });
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
                            const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...goodsDeliveryDetail, No: null, Voucher: null, Business: [this.accountingBusinessList.find(f => f.id == 'GOODSRECEIPTFORRETURNS')], RelateDetail: `GOODSDELIVERY/${goodsDeliveryVoucher.Code}/${goodsDeliveryDetail.Id}`, Quantity: quantity });
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
          }
          if (type === 'GOODSDELIVERY') {
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                const details = this.getDetails(formGroup);
                // get purchase order
                const voucher = await this.apiService.getPromise<SalesVoucherModel[]>('/warehouse/goods-delivery-notes/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);

                if (['APPROVED', 'COMPLETE'].indexOf(this.commonService.getObjectId(voucher.State)) < 0) {
                  this.commonService.toastService.show(this.commonService.translateText('Phiếu bán hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
                if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                  if (this.commonService.getObjectId(voucher.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                    this.commonService.toastService.show(this.commonService.translateText('Đối tượng theo dõi trong phiếu nhập không giống với phiếu nhập xuất'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  // delete voucher.Code;
                  formGroup.patchValue({ ...voucher, Code: null, Details: [] });
                  details.clear();
                }
                insertList.push(chooseItems[i]);

                // Insert order details into voucher details
                if (voucher?.Details) {
                  details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu bán hàng: ' + voucher.Code + ' - ' + voucher.Title }));
                  for (const voucherDetail of voucher.Details) {
                    if (voucherDetail.Type === 'PRODUCT') {
                      // delete orderDetail.Id;
                      // delete orderDetail.Voucher;
                      // delete orderDetail.No;
                      const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, { ...voucherDetail, No: null, Voucher: null, Business: null, RelateDetail: `GOODSDELIVERY/${voucher.Code}/${voucherDetail.Id}` });
                      newDtailFormGroup.get('Business').disable();
                      details.push(newDtailFormGroup);
                    }
                  }
                }

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASE' }))]);
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
    // if (relativeVocher && relativeVocher.type == 'PURCHASE') {
    //   this.commonService.openDialog(PurchaseVoucherPrintComponent, {
    //     context: {
    //       showLoadinng: true,
    //       title: 'Xem trước',
    //       id: [this.commonService.getObjectId(relativeVocher)],
    //       // data: data,
    //       idKey: ['Code'],
    //       // approvedConfirm: true,
    //       onClose: (data: SalesVoucherModel) => {
    //         this.refresh();
    //       },
    //     },
    //   });
    // }
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.commonService.getObjectId(relativeVocher)));
    return false;
  }

}
