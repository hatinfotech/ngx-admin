import { PurchaseVoucherPrintComponent } from './../purchase-voucher-print/purchase-voucher-print.component';
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
import { PromotionActionModel } from '../../../../models/promotion.model';
import { PurchaseVoucherDetailModel, PurchaseVoucherModel } from '../../../../models/purchase.model';
import { TaxModel } from '../../../../models/tax.model';
import { UnitModel } from '../../../../models/unit.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { SalesVoucherFormComponent } from '../../../sales/sales-voucher/sales-voucher-form/sales-voucher-form.component';
import { PurchaseOrderVoucherListComponent } from '../../order/purchase-order-voucher-list/purchase-order-voucher-list.component';
import { PurchaseOrderVoucherPrintComponent } from '../../order/purchase-order-voucher-print/purchase-order-voucher-print.component';

@Component({
  selector: 'ngx-purchase-voucher-form',
  templateUrl: './purchase-voucher-form.component.html',
  styleUrls: ['./purchase-voucher-form.component.scss'],
})
export class PurchaseVoucherFormComponent extends DataManagerFormComponent<PurchaseVoucherModel> implements OnInit {

  componentName: string = 'PurchaseVoucherFormComponent';
  idKey = 'Code';
  apiPath = '/purchase/vouchers';
  baseFormUrl = '/purchase/vouchers/form';

  env = environment;

  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

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
    // tags: true,
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

  uploadConfig = {

  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<PurchaseVoucherFormComponent>,
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
    placeholder: 'Chọn Hàng hoá/dịch vụ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/products', { select: "id=>Code,text=>Name,Code=>Code,Name=>Name", includeUnit: true, 'filter_Name': params['term'] });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        return {
          results: data
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

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {

    /** Load and cache tax list */
    if (!SalesVoucherFormComponent._taxList) {
      this.taxList = SalesVoucherFormComponent._taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
        tax['id'] = tax.Code;
        tax['text'] = tax.Name;
        return tax;
      });
    } else {
      this.taxList = SalesVoucherFormComponent._taxList;
    }

    /** Load and cache unit list */
    if (!SalesVoucherFormComponent._unitList) {
      this.unitList = SalesVoucherFormComponent._unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units')).map(tax => {
        tax['id'] = tax.Code;
        tax['text'] = tax.Name;
        return tax;
      });
    } else {
      this.taxList = SalesVoucherFormComponent._taxList;
    }
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
  executeGet(params: any, success: (resources: PurchaseVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeContact'] = true;
    params['includeDetails'] = true;
    params['useBaseTimezone'] = true;
    super.executeGet(params, success, error);
  }

  async formLoad(formData: PurchaseVoucherModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: PurchaseVoucherModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Details form load
      if (itemFormData.Details) {
        itemFormData.Details.forEach(detail => {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detail);
          const details = this.getDetails(newForm);
          details.push(newDetailFormGroup);
          // const comIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, newDetailFormGroup);
        });
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: PurchaseVoucherModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Object: [''],
      ObjectName: [''],
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

      DateOfReceived: [''],
      DeliveryAddress: [''],
      Title: [''],
      Note: [''],
      SubNote: [''],
      DateOfPurchase: [''],
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
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PurchaseVoucherModel): void {
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
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: PurchaseVoucherDetailModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      No: [''],
      Type: ['PRODUCT'],
      Product: [''],
      Description: [''],
      Quantity: [1],
      Price: [0],
      Unit: [''],
      Tax: ['VAT10'],
      ToMoney: [0],
      Image: [[]],
      Reason: [''],
    });

    if (data) {
      newForm.patchValue(data);
      if (!data['Type']) {
        data["Type"] = 'PRODUCT';
      }
      this.toMoney(parentFormGroup, newForm);
    }
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

  onSelectProduct(detail: FormGroup, selectedData: ProductModel) {
    console.log(selectedData);
    if (selectedData) {
      detail.get('Description').setValue(selectedData.Name);
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
    const data: PurchaseVoucherModel = formItem.value;
    // data.Details.forEach(detail => {
    //   if (typeof detail['Tax'] === 'string') {
    //     detail['Tax'] = this.taxList.filter(t => t.Code === detail['Tax'])[0] as any;
    //     if (this.unitList) {
    //       detail['Unit'] = (detail['Unit'] && detail['Unit'].Name) || this.unitList.filter(t => t.Code === detail['Unit'])[0] as any;
    //     }
    //   }
    // });
    this.commonService.openDialog(PurchaseVoucherPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        data: [data],
        idKey: ['Code'],
        onSaveAndClose: (priceReport: PurchaseVoucherModel) => {
          this.saveAndClose();
        },
        onSaveAndPrint: (priceReport: PurchaseVoucherModel) => {
          this.save();
        },
      },
    });
    return false;
  }

  getRawFormData() {
    return super.getRawFormData();
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.commonService.openDialog(PurchaseOrderVoucherListComponent, {
      context: {
        inputMode: 'dialog',
        onDialogChoose: async (chooseItems: PurchaseVoucherModel[]) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          for (let i = 0; i < chooseItems.length; i++) {
            const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
            if (index < 0) {
              const details = this.getDetails(formGroup);
              // get purchase order
              const purchaseOrder = await this.apiService.getPromise<PurchaseVoucherModel[]>('/purchase/order-vouchers/' + chooseItems[i].Code, { includeContact: true, includeDetails: true }).then(rs => rs[0]);
              if (this.commonService.getObjectId(formGroup.get('Object').value)) {
                if (this.commonService.getObjectId(purchaseOrder.Object, 'Code') != this.commonService.getObjectId(formGroup.get('Object').value)) {
                  this.commonService.toastService.show(this.commonService.translateText('Nhà cung cấp trong đơn đặt mua hàng không giống với phiếu mua hàng'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }
              } else {
                delete purchaseOrder.Id;
                formGroup.patchValue({ ...purchaseOrder, Code: null, Details: [] });
                details.clear();
              }
              if (this.commonService.getObjectId(purchaseOrder.State) != 'APPROVE') {
                this.commonService.toastService.show(this.commonService.translateText('Đơn đặt mua hàng chưa được duyệt'), this.commonService.translateText('Common.warning'), { status: 'warning' });
                continue;
              }
              insertList.push(chooseItems[i]);

              // Insert order details into voucher details
              if (purchaseOrder?.Details) {
                details.push(this.makeNewDetailFormGroup(formGroup, { Type: 'CATEGORY', Description: 'Phiếu đặt mua hàng: ' + purchaseOrder.Code + ' - ' + purchaseOrder.Title }));
                for (const orderDetail of purchaseOrder.Details) {
                  delete orderDetail.Id;
                  delete orderDetail.Voucher;
                  delete orderDetail.No;
                  const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, orderDetail);
                  details.push(newDtailFormGroup);
                }
              }

            }
          }
          relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASEORDER' }))]);
        },
        onDialogClose: () => {
        },
      }
    })
    return false;
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher && relativeVocher.type == 'PURCHASEORDER') {
      this.commonService.openDialog(PurchaseOrderVoucherPrintComponent, {
        context: {
          showLoadinng: true,
          title: 'Xem trước',
          id: [this.commonService.getObjectId(relativeVocher)],
          // data: data,
          idKey: ['Code'],
          // approvedConfirm: true,
          onClose: (data: PurchaseVoucherModel) => {
            this.refresh();
          },
        },
      });
    }
    return false;
  }

  removeRelativeVoucher(formGroup: FormGroup, relativeVocher: any) {
    const relationVoucher = formGroup.get('RelativeVouchers');
    relationVoucher.setValue(relationVoucher.value.filter(f => f?.id !== this.commonService.getObjectId(relativeVocher)));
    return false;
  }

}
