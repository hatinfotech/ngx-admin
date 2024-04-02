import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { RootServices } from '../../../../services/root.services';
import { Model } from '../../../../models/model';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { CashVoucherModel } from '../../../../models/accounting.model';
import { ContactModel } from '../../../../models/contact.model';
import { PurchaseVoucherModel, PurchaseOrderVoucherModel } from '../../../../models/purchase.model';
import { TaxModel } from '../../../../models/tax.model';
import { ReferenceChoosingDialogComponent } from '../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component';
import { PurchaseVoucherListComponent } from '../../../purchase/voucher/purchase-voucher-list/purchase-voucher-list.component';
@Component({
  selector: 'ngx-mkt-promotion-program-form',
  templateUrl: './promotion-program-form.component.html',
  styleUrls: ['./promotion-program-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class MktPromotionProgramFormComponent extends DataManagerFormComponent<Model> implements OnInit {

  // Base variables
  componentName = 'MktPromotionProgramFormComponent';
  idKey = 'Code';
  apiPath = '/marketing/promotion-programs';
  baseFormUrl = '/marketing/promotion-program/form';

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<MktPromotionProgramFormComponent>,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  towDigitsInputMask = this.cms.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  select2OptionForType = {
    placeholder: 'Loại khuyến mại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'ORDER', text: 'Đơn hàng' },
      { id: 'PRODUCT', text: 'Hàng hóa' },
    ]
  };
  select2OptionForPromotionalForm = {
    placeholder: 'Hình thức khuyến mại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'ORDERDISCOUNT', text: 'Giảm giá đơn hàng' },
      { id: 'GIFT', text: 'Tặng quà' },
      { id: 'SCORE', text: 'Tặng điểm' },
    ]
  };
  select2OptionForPromoUnit = {
    placeholder: 'Đơn vị KM...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'CASH', text: 'VND' },
      { id: 'PERCENT', text: '%' },
      { id: 'SCORE', text: 'Điểm' },
    ]
  };
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

  select2OptionForOperator = {
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
  select2OptionForCustomerGroup = {
    ...this.cms.makeSelect2AjaxOption('/contact/groups', { }, {
      placeholder: 'Tất cả nhóm khách hàng...', limit: 10, prepareReaultItem: (item) => {
        item['id'] = item.Code;
        item['text'] = item.Name;
        return item;
      },
    }),
    multiple: true,
  };
  select2OptionForBranchs = {
    placeholder: 'Tất cả chi nhánh...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'MAIN', text: 'Chính' },
    ],
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

  select2OptionForProduct = {
    placeholder: 'Chọn sản phẩm...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/admin-product/products', { 'filter_Name': params['term'] });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/admin-product/products', { 'filter_Name': params['term'] }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  } as any;

  select2OptionForProductGroup = {
    placeholder: 'Chọn nhóm sản phẩm...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'ProductGroup',
      text: 'ProductGroupName',
    },
    multiple: true,
    ajax: {
      // url: params => {
      //   return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'], select: 'ProductGroup=>Code,ProductGroupName=>Name' });
      // },
      transport: (settings: JQueryAjaxSettings, success?: (data: any) => null, failure?: () => null) => {
        console.log(settings);
        const params = settings.data;
        this.apiService.getPromise('/admin-product/groups', { 'filter_Name': params['term'], select: 'ProductGroup=>Code,ProductGroupName=>Name' }).then(rs => {
          success(rs);
        }).catch(err => {
          console.error(err);
          failure();
        });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['ProductGroup'];
            item['text'] = item['ProductGroupName'];
            return item;
          }),
        };
      },
    },
  };

  select2OptionForEmployeeGroups: Select2Option = {
    ...this.cms.makeSelect2AjaxOption('/collaborator/employee-groups', {}, {
      placeholder: 'Chọn nhóm nhân viên...', limit: 10, prepareReaultItem: (item) => ({ id: item.Code, text: item.Name }),
    }),
    // multiple: true,
  };

  select2OptionForCondition = {
    placeholder: 'Chọn loại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'QUANTITY', text: 'Số lượng' },
      { id: 'TOTALPAYMENT', text: 'Tổng giá trị đơn hàng' },
      // { id: 'ORDERDATE', text: 'Ngày đặt hàng' },
      // { id: 'PRODUCTGROUP', text: 'Nhóm sản phẩm' },
      // { id: 'CUSTOMERGROUP', text: 'Nhóm khách hàng' },
    ],
  };
  onConditionChange(formItem: FormGroup, conditionForm: FormGroup, changedValue: any) {
    console.log(changedValue);
    conditionForm.get('TextValue').setValue(null);
  }

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

      // Condition form groups
      if (itemFormData?.Conditions) {
        const details = this.getConditions(newForm);
        details.clear();
        for (const detailData of itemFormData.Conditions) {
          const newConditionFormGroup = this.makeNewConditionFormGroup(newForm, detailData);
          details.push(newConditionFormGroup);
          const detailIndex = details.length - 1;
          this.onAddConditionFormGroup(newForm, detailIndex, newConditionFormGroup);
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
          this.getConditions(formItem as FormGroup).controls.forEach(conditonFormGroup => {
            // Clear id
          });
        });
      }
      return rs;
    });
  }

  /** Get form data by id from api */
  getFormData(callback: (data: CashVoucherModel[]) => void) {
    this.apiService.get<CashVoucherModel[]>(this.apiPath, { id: this.id, eq_Type: 'PAYMENT', multi: true, includeConditions: true, includeContact: true, includeRelativeVouchers: true },
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
      Code: [],
      Type: ['ORDER', Validators.required],
      PromotionalForm: ['ORDERDISCOUNT', Validators.required],
      Name: ['', Validators.required],
      CustomerGroups: [],
      Branchs: [['ALL']],
      Description: [],
      Content: [],
      DateOfStart: [null, Validators.required],
      DateOfEnd: [null, Validators.required],
      Conditions: this.formBuilder.array([]),
    });

    newForm['_Conditions'] = newForm.get('Conditions');
    newForm['_Type'] = newForm.get('Type');
    newForm['_PromotionalForm'] = newForm.get('PromotionalForm');
    if (data) {
      newForm.patchValue(data);
    } else {
      const newConditionFormItem = this.addConditionFormGroup(newForm);
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

  /** Conditions form behavior */
  makeNewConditionFormGroup(parentFormGroup: FormGroup, data?: any): FormGroup {
    const newForm = this.formBuilder.group({
      SystemUuid: [],
      Type: [],
      Cond: [],
      CondProduct: [],
      CondValue: [],
      PromoValue: [],
      PromoUnit: [],
      PromoProduct: [],
    });

    if (data) {
      // data.Name = '$' + this.cms.getObjectId(data.Indicator)
      newForm.patchValue(data);
    }
    return newForm;
  }

  getConditions(formGroup: FormGroup) {
    return formGroup.get('Conditions') as FormArray;
  }

  addConditionFormGroup(formGroup: FormGroup, data?: any) {
    const newFormGroup = this.makeNewConditionFormGroup(formGroup, data);
    const details = this.getConditions(formGroup);
    details.push(newFormGroup);
    this.onAddConditionFormGroup(formGroup, details.length - 1, newFormGroup);
    return newFormGroup;
  }

  onAddConditionFormGroup(parentFormGroup: FormGroup, index: number, newFormGroup: FormGroup) {
  }

  removeCondition(formGroup: FormGroup, index: number) {
    this.getConditions(formGroup).removeAt(index);
    this.onRemoveConditionFormGroup(formGroup, index);
    return false;
  }

  onRemoveConditionFormGroup(formGroup: FormGroup, index: number) {
  }
  /** End Conditions form behavior */

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
            const details = this.getConditions(formGroup);
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
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Conditions: [] });
                }
                insertList.push({ id: chooseItems[i].Code, text: chooseItems[i].Title, type: 'PURCHASEORDER' });

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id, text: m.text, type: m.type, typeMap: this.cms.voucherTypeMap[m.type] }))]);
          }
          if (type === 'PURCHASE') {
            const details = this.getConditions(formGroup);
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
                  formGroup.patchValue({ ...voucher, Code: null, Id: null, Conditions: [] });
                }
                insertList.push({ id: chooseItems[i].Code, text: chooseItems[i].Title, type: 'PURCHASE' });

              }
            }
            relationVoucher.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.id, text: m.text, type: m.type, typeMap: this.cms.voucherTypeMap[m.type] }))]);
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
      const details = this.getConditions(formGroup);
      // get purchase order
      let purchaseVoucher;
      switch (relativeVoucherType) {
        case 'PURCHASE':
          purchaseVoucher = await this.apiService.getPromise<PurchaseVoucherModel[]>('/purchase/vouchers/' + relativeVoucher.Code, { includeContact: true, includeObject: true, includeConditions: true }).then(rs => rs[0]);
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
        formGroup.patchValue({ ...purchaseVoucher, Id: null, Conditions: [] });
        formGroup.get('Description').patchValue('Chi tiền cho ' + purchaseVoucher.Title);
        details.clear();
      }

      // Insert order details into voucher details
      if (purchaseVoucher?.Conditions) {
        let totalMoney = 0;
        const taxList = await this.apiService.getPromise<TaxModel[]>('/accounting/taxes', { select: 'id=>Code,text=>Name,Tax=>Tax' })
        for (const voucherCondition of purchaseVoucher.Conditions) {
          if (voucherCondition.Type !== 'CATEGORY') {
            const tax = this.cms.getObjectId(voucherCondition.Tax) ? taxList.find(f => f.id == this.cms.getObjectId(voucherCondition.Tax))['Tax'] : null;
            totalMoney += voucherCondition.Price * voucherCondition.Quantity + (tax ? ((voucherCondition.Price * tax / 100) * voucherCondition.Quantity) : 0);
          }
        }
        const newDtailFormGroup = this.makeNewConditionFormGroup(formGroup, {
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
    relativeVouchers.setValue([...relationVoucherValue, ...insertList.map(m => ({ id: m?.Code, text: m.Title, type: 'PURCHASE', typeMap: this.cms.voucherTypeMap['PURCHASE'] }))]);
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
      for (const rawCondition of rawItem['Conditions']) {
        for (const prop in rawCondition) {
          // if(prop == 'Strategy') {
          //   rawCondition['StrategyName'] = this.cms.getObjectText(rawCondition['Strategy']);
          // }
          // rawCondition[prop] = this.cms.getObjectId(rawCondition[prop]);
        }
      }
    }
    return rawData;
  }
  /** Override: Auto update SystemUuid for detail form item */
  onItemAfterSaveSubmit(formItemData: Model, index: number, method: string) {
    const result = super.onItemAfterSaveSubmit(formItemData, index, method);
    if (result && formItemData.Conditions) {
      for (const d in formItemData.Conditions) {
        (this.array.controls[index].get('Conditions')['controls'][d] as FormGroup).get('SystemUuid').setValue(formItemData.Conditions[d]['SystemUuid']);
      }
    }
    return result;
  }
  /** End Hight performance config */
}
