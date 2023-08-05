import { CurrencyPipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService, NbDialogService, NbDialogRef } from "@nebular/theme";
import { DataManagerFormComponent } from "../../../../../lib/data-manager/data-manager-form.component";
import { ApiService } from "../../../../../services/api.service";
import { CommonService } from "../../../../../services/common.service";
import { Model } from "../../../../../models/model";
import { CashVoucherModel } from "../../../../../models/accounting.model";
import { PurchaseVoucherModel, PurchaseOrderVoucherModel } from "../../../../../models/purchase.model";
import { TaxModel } from "../../../../../models/tax.model";
import { ReferenceChoosingDialogComponent } from "../../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component";
import { PurchaseVoucherListComponent } from "../../../../purchase/voucher/purchase-voucher-list/purchase-voucher-list.component";
import { Select2Option } from "../../../../../lib/custom-element/select2/select2.component";
import { ContactModel } from "../../../../../models/contact.model";

@Component({
  selector: 'ngx-collaborator-kpi-distributed-contract-form',
  templateUrl: './kpi-distributed-contract-form.component.html',
  styleUrls: ['./kpi-distributed-contract-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class CollaboratorKpiDistributedContractFormComponent extends DataManagerFormComponent<Model> implements OnInit {

  // Base variables
  componentName = 'CollaboratorKpiDistributedContractFormComponent';
  idKey = 'Code';
  apiPath = '/collaborator/kpi-distributed-contracts';
  baseFormUrl = '/collaborator/kpi-distributed-contract/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<CollaboratorKpiDistributedContractFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  select2OptionForIndicator = {
    placeholder: 'Chỉ số...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'doanhThu', text: 'Doanh thu trên mỗi nhân viên chăm sóc CTV' },
      { id: 'doanhThuVuotCap', text: 'Doanh thu vuot cap trên mỗi nhân viên chăm sóc CTV' },
      { id: 'soLuongDon', text: 'Số đơn hoàn tất trên mỗi nhân viên chăm sóc CTV' },
      { id: 'tyLeChotDon', text: 'Tỷ lệ chốt đơn trên mỗi nhân viên chăm sóc CTV' },
    ]
  };

  select2OptionForCondition = {
    placeholder: 'Điều kiện...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'GE', text: 'Lớn hơn/bằng (>=)' },
      { id: 'GT', text: 'Lớn hơn (>)' },
      { id: 'LE', text: 'Nhỏ hơn/bằng (<=)' },
      { id: 'LT', text: 'Nhỏ hơn (<)' },
      { id: 'EQ', text: 'Bằng (=)' },
    ]
  };
  select2OptionForStrategy = {
    ...this.cms.makeSelect2AjaxOption('/collaborator/kpi-strategies', { eq_State: 'APPROVED' }, {
      placeholder: 'Chọn nhóm KPI...', limit: 10, prepareReaultItem: (item) => {
        item['id'] = item.Code;
        item['text'] = item.Name;
        return item;
      }
    }),
  };
  select2OptionForContact = {
    ...this.cms.makeSelect2AjaxOption('/contact/contacts', { eq_Groups: '[PUBLISHERSUPPORTER]' }, {
      placeholder: 'Chọn nhân viên chăm sóc CTV...', limit: 10, prepareReaultItem: (item) => {
        item['id'] = item.Code;
        item['text'] = item.Name;
        return item;
      }
    }),
  };

  select2OptionForCycle = {
    placeholder: 'Chu kỳ...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'MONTH', text: 'Tháng' },
      { id: 'YEAR', text: 'Năm' },
      { id: 'WEEK', text: 'Tuần' },
      { id: 'DAY', text: 'Ngày' },
      { id: 'HOUR', text: 'Giờ' },
    ]
  };

  select2OptionForEmployeeGroups: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/collaborator/employee-groups', {}, {
      placeholder: 'Chọn nhóm nhân viên...', limit: 10, prepareReaultItem: (item) => ({ id: item.Code, text: item.Name }),
    }),
    // multiple: true,
  };

  mentionConfig = {
    items: [
      'doanhThu',
      'soLuongDon',
      'tyLeChotDon',
    ],
    triggerChar: '$',
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async formLoad(formData: Model[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: Model) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Detail form groups
      if (itemFormData?.Details) {
        const details = this.getDetails(newForm);
        details.clear();
        for (const detailData of itemFormData.Details) {
          const newDetailFormGroup = this.makeNewDetailFormGroup(newForm, detailData);
          details.push(newDetailFormGroup);
          const detailIndex = details.length - 1;
          this.onAddDetailFormGroup(newForm, detailIndex, newDetailFormGroup);
        };
      }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  async init() {
    return super.init().then(rs => {
      if (this.isDuplicate) {
        // Clear id
        this.id = [];
        this.array.controls.forEach((formItem, index) => {
          formItem.get('Code').setValue('');
          formItem.get('Description').setValue('Copy of: ' + formItem.get('Description').value);
          this.getDetails(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
          });
        });
      }
      return rs;
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: CashVoucherModel[]) => void) {
    this.apiService.get<CashVoucherModel[]>(this.apiPath, { id: this.id, eq_Type: 'PAYMENT', multi: true, includeDetails: true, includeContact: true, includeRelativeVouchers: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: CashVoucherModel): FormGroup {
    const today = new Date();
    const nextMonth = today.clone();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const newForm = this.formBuilder.group({
      Code: { disabled: true, value: '' },
      Title: ['', Validators.required],
      Object: ['', Validators.required],
      ObjectName: [''],
      ObjectPhone: [''],
      ObjectEmail: [''],
      ObjectAddress: [''],
      // Description: [''],
      // LevelDistributedIndicator: [''],
      Cycle: [this.select2OptionForCycle.data.find(f => f.id = 'MONTH'), Validators.required],
      DateOfStart: [today],
      DateOfEnd: [nextMonth],
      // Formular: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    } else {
      const newDetailFormItem = this.addDetailFormGroup(newForm);
    }
    return newForm;
  }

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (selectedData.Code) {
          formGroup.get('ObjectName').setValue(selectedData.Name);
          if (selectedData['Phone']) formGroup.get('ObjectPhone').setValue(selectedData['Phone']);
          if (selectedData['Email']) formGroup.get('ObjectEmail').setValue(selectedData['Email']);
          if (selectedData['Address']) formGroup.get('ObjectAddress').setValue(selectedData['Address']);
        }
      }
    }
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: CashVoucherModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {
  }
  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/accounting/cash-receipt-voucher/list']);
    } else {
      this.ref.close();
    }
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  /** Execute api get */
  executeGet(params: any, success: (resources: CashVoucherModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    return super.executeGet(params, success, error);
  }

  /** Details form behavior */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: any): FormGroup {
    const newForm = this.formBuilder.group({
      SystemUuid: [''],
      Strategy: ['', Validators.required],
      // Description: ['', Validators.required],
      Weight: ['', Validators.required],
      // LevelDistributedValue: [],
    });

    if (data) {
      // data.Name = '$' + this.cms.getObjectId(data.Indicator)
      newForm.patchValue(data);
    }
    return newForm;
  }

  getDetails(formGroup: FormGroup) {
    return formGroup.get('Details') as FormArray;
  }

  addDetailFormGroup(formGroup: FormGroup, data?: any) {
    const newFormGroup = this.makeNewDetailFormGroup(formGroup, data);
    const details = this.getDetails(formGroup);
    details.push(newFormGroup);
    this.onAddDetailFormGroup(formGroup, details.length - 1, newFormGroup);
    return newFormGroup;
  }

  onAddDetailFormGroup(parentFormGroup: FormGroup, index: number, newFormGroup: FormGroup) {
  }

  removeDetail(formGroup: FormGroup, index: number) {
    this.getDetails(formGroup).removeAt(index);
    this.onRemoveDetailFormGroup(formGroup, index);
    return false;
  }

  onRemoveDetailFormGroup(formGroup: FormGroup, index: number) {
  }
  /** End Details form behavior */

  openRelativeVoucherChoosedDialogx(formGroup: FormGroup) {
    this.cms.openDialog(PurchaseVoucherListComponent, {
      context: {
        inputMode: 'dialog',
        onDialogChoose: async (chooseItems: PurchaseVoucherModel[]) => {
          console.log(chooseItems);
          this.onProcessing();
          for (let i = 0; i < chooseItems.length; i++) {
            this.addRelativeVoucher(chooseItems[0], 'PURCHASE', formGroup);
          }

          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
        onDialogClose: () => {
        },
      }
    })
    return false;
  }

  openRelativeVoucherChoosedDialog(formGroup: FormGroup) {
    this.cms.openDialog(ReferenceChoosingDialogComponent, {
      context: {
        components: {
          'PURCHASEORDER': { title: 'Đơn đặt mua hàng' },
          'PURCHASE': { title: 'Phiếu mua hàng' },
        },
        // inputMode: 'dialog',
        onDialogChoose: async (chooseItems: any[], type?: string) => {
          console.log(chooseItems);
          const relationVoucher = formGroup.get('RelativeVouchers');
          const relationVoucherValue: any[] = (relationVoucher.value || []);
          const insertList = [];
          this.onProcessing();
          if (type === 'PURCHASEORDER') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<PurchaseOrderVoucherModel[]>('/purchase/order-vouchers/' + chooseItems[i].Code, { includeContact: true, includeRelativeVouchers: true, includeIdText: true }).then(rs => rs[0]);

                // Check purchase order state
                if (['APPROVED'].indexOf(this.cms.getObjectId(voucher.State)) < 0) {
                  this.cms.showToast(this.cms.translateText('Phiếu đặt mua hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }

                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(voucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.showToast(this.cms.translateText('Nhà cung cấp trong phiếu đặt mua hàng không giống với phiếu chi'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                }
                insertList.push({ id: chooseItems[i].Code, text: chooseItems[i].Title, type: 'PURCHASEORDER' });

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id, text: m.text, type: m.type }))]);
          }
          if (type === 'PURCHASE') {
            const details = this.getDetails(formGroup);
            for (let i = 0; i < chooseItems.length; i++) {
              const index = relationVoucherValue.findIndex(f => f?.id === chooseItems[i]?.Code);
              if (index < 0) {
                // get purchase order
                const voucher = await this.apiService.getPromise<PurchaseOrderVoucherModel[]>('/purchase/vouchers/' + chooseItems[i].Code, { includeContact: true, includeRelativeVouchers: true, includeIdText: true }).then(rs => rs[0]);

                // Check purchase order state
                if (['APPROVED'].indexOf(this.cms.getObjectId(voucher.State)) < 0) {
                  this.cms.showToast(this.cms.translateText('Phiếu mua hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
                  continue;
                }

                if (this.cms.getObjectId(formGroup.get('Object').value)) {
                  if (this.cms.getObjectId(voucher.Object, 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
                    this.cms.showToast(this.cms.translateText('Nhà cung cấp trong phiếu mua hàng không giống với phiếu chi'), this.cms.translateText('Common.warning'), { status: 'warning' });
                    continue;
                  }
                } else {
                  delete voucher.Id;
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Details: [] });
                }
                insertList.push({ id: chooseItems[i].Code, text: chooseItems[i].Title, type: 'PURCHASE' });

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id, text: m.text, type: m.type }))]);
          }
          setTimeout(() => {
            this.onProcessed();
          }, 1000);
        },
      }
    })
    return false;
  }


  async addRelativeVoucher(relativeVoucher: any, relativeVoucherType: string, formGroup?: FormGroup) {
    if (!formGroup) {
      formGroup = this.array.controls[0] as FormGroup;
    }
    const insertList = [];
    const relativeVouchers = formGroup.get('RelativeVouchers');
    const relationVoucherValue: any[] = (relativeVouchers.value || []);
    if (relationVoucherValue.some(s => s.id == relativeVoucher.Code)) {
      this.cms.toastService.show('Chứng từ liên quan đã được thêm vào trước đó', 'Thông báo', { status: 'warning' });
      return;
    }
    const index = Array.isArray(relationVoucherValue) ? relationVoucherValue.findIndex(f => f?.id === relativeVoucher?.Code) : -1;
    if (index < 0) {
      const details = this.getDetails(formGroup);
      // get purchase order
      let purchaseVoucher;
      switch (relativeVoucherType) {
        case 'PURCHASE':
          purchaseVoucher = await this.apiService.getPromise<PurchaseVoucherModel[]>('/purchase/vouchers/' + relativeVoucher.Code, { includeContact: true, includeObject: true, includeDetails: true }).then(rs => rs[0]);
          break;
        default:
          return false;
      }

      if (this.cms.getObjectId(purchaseVoucher.State) != 'APPROVED') {
        this.cms.toastService.show(this.cms.translateText('Phiếu mua hàng chưa được duyệt'), this.cms.translateText('Common.warning'), { status: 'warning' });
        return false;
      }
      if (this.cms.getObjectId(formGroup.get('Object').value)) {
        if (this.cms.getObjectId(this.cms.getObjectId(purchaseVoucher.Object), 'Code') != this.cms.getObjectId(formGroup.get('Object').value)) {
          this.cms.toastService.show(this.cms.translateText('Liên hệ trong phiếu thanh toán không giống với phiếu mua hàng'), this.cms.translateText('Common.warning'), { status: 'warning' });
          return false;
        }
      } else {
        delete purchaseVoucher.Id;
        delete purchaseVoucher.Code;
        formGroup.patchValue({ ...purchaseVoucher, Id: null, Details: [] });
        formGroup.get('Description').patchValue('Chi tiền cho ' + purchaseVoucher.Title);
        details.clear();
      }

      // Insert order details into voucher details
      if (purchaseVoucher?.Details) {
        let totalMoney = 0;
        const taxList = await this.apiService.getPromise<TaxModel[]>('/accounting/taxes', { select: 'id=>Code,text=>Name,Tax=>Tax' })
        for (const voucherDetail of purchaseVoucher.Details) {
          if (voucherDetail.Type !== 'CATEGORY') {
            const tax = this.cms.getObjectId(voucherDetail.Tax) ? taxList.find(f => f.id == this.cms.getObjectId(voucherDetail.Tax))['Tax'] : null;
            totalMoney += voucherDetail.Price * voucherDetail.Quantity + (tax ? ((voucherDetail.Price * tax / 100) * voucherDetail.Quantity) : 0);
          }
        }
        const newDtailFormGroup = this.makeNewDetailFormGroup(formGroup, {
          AccountingBusiness: 'PAYMENTSUPPPLIER',
          Description: purchaseVoucher.Title,
          DebitAccount: '331',
          CreditAccount: '1111',
          Amount: totalMoney,
        });
        details.push(newDtailFormGroup);
      }
    }
    insertList.push(relativeVoucher);
    relativeVouchers.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASE' }))]);
    return relativeVoucher;
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


  /** Hight performance config */
  patchedDataAfterSave = false;
  cleanedDataBeforeSave = true;
  /**
   * Override: Clean data for detail form items
   */
  getRawFormData() {
    const rawData = super.getRawFormData();
    for (const rawItem of rawData.array) {
      for (const rawDetail of rawItem['Details']) {
        for (const prop in rawDetail) {
          // if(prop == 'Strategy') {
          //   rawDetail['StrategyName'] = this.cms.getObjectText(rawDetail['Strategy']);
          // }
          rawDetail[prop] = this.cms.getObjectId(rawDetail[prop]);
        }
      }
    }
    return rawData;
  }
  /** Override: Auto update SystemUuid for detail form item */
  onItemAfterSaveSubmit(formItemData: Model, index: number, method: string) {
    const result = super.onItemAfterSaveSubmit(formItemData, index, method);
    if (result && formItemData.Details) {
      for (const d in formItemData.Details) {
        (this.array.controls[index].get('Details')['controls'][d] as FormGroup).get('SystemUuid').setValue(formItemData.Details[d]['SystemUuid']);
      }
    }
    return result;
  }
  /** End Hight performance config */
}
