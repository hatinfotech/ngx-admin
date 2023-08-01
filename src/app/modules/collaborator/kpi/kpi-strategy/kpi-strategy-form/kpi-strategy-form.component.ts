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
import { PurchaseVoucherModel, PurchaseOrderVoucherModel } from "../../../../../models/purchase.model";
import { TaxModel } from "../../../../../models/tax.model";
import { ReferenceChoosingDialogComponent } from "../../../../dialog/reference-choosing-dialog/reference-choosing-dialog.component";
import { PurchaseVoucherListComponent } from "../../../../purchase/voucher/purchase-voucher-list/purchase-voucher-list.component";
import { Select2Option } from "../../../../../lib/custom-element/select2/select2.component";
import { ColDef, ColumnApi, GridApi, IRowNode } from "@ag-grid-community/core";
import { AgTextCellRenderer } from "../../../../../lib/custom-element/ag-list/cell/text.component";
import { agMakeCommandColDef } from "../../../../../lib/custom-element/ag-list/column-define/command.define";
import { agMakeImageColDef } from "../../../../../lib/custom-element/ag-list/column-define/image.define";
import { agMakeSelectionColDef } from "../../../../../lib/custom-element/ag-list/column-define/selection.define";
import { CollaboratorProductListComponent } from "../../../product/collaborator-product-list/collaborator-product-list.component";
import { AgDynamicListComponent } from "../../../../general/ag-dymanic-list/ag-dymanic-list.component";
import { CollaboratorKpiStrategyListComponent } from "../kpi-strategy-list/kpi-strategy-list.component";

@Component({
  selector: 'ngx-collaborator-kpi-strategy-form',
  templateUrl: './kpi-strategy-form.component.html',
  styleUrls: ['./kpi-strategy-form.component.scss'],
  providers: [
    CurrencyPipe
  ]
})
export class CollaboratorKpiStrategyFormComponent extends DataManagerFormComponent<Model> implements OnInit {

  // Base variables
  componentName = 'CollaboratorKpiStrategyFormComponent';
  idKey = 'Code';
  apiPath = '/collaborator/kpi-strategies';
  baseFormUrl = '/collaborator/kpi-strategy/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<CollaboratorKpiStrategyFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
    this.prepareProductList();
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
    data: CollaboratorKpiStrategyListComponent.indicatorList
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
    data: CollaboratorKpiStrategyListComponent.conditionList.map(m => ({ id: m.id, text: m.symbol }))
  };
  select2OptionForDetailType = {
    placeholder: 'Chọn loại...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: false,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: CollaboratorKpiStrategyListComponent.groupTypeList
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

          // Condition form groups
          if (detailData.Conditions) {
            const conditions = this.getConditions(newDetailFormGroup);
            conditions.clear();
            for (const conditionData of detailData.Conditions) {
              const newConditionFormGroup = this.makeNewConditionFormGroup(newDetailFormGroup, conditionData);
              conditions.push(newConditionFormGroup);
              const conditionIndex = conditions.length - 1;
              this.onAddConditionFormGroup(newDetailFormGroup, conditionIndex, newConditionFormGroup);
            }
          }
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
  getFormData(callback: (data: Model[]) => void) {
    this.apiService.get<Model[]>(this.apiPath, {
      id: this.id,
      includeDetails: true,
      includeProducts: true,
      includeContact: true,
      includeRelativeVouchers: true,
    },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: Model): FormGroup {
    const newForm = this.formBuilder.group({
      Code: { disabled: true, value: '' },
      Name: ['', Validators.required],
      Description: [''],
      LevelDistributedIndicator: [''],
      Cycle: [this.select2OptionForCycle.data.find(f => f.id = 'MONTH'), Validators.required],
      // Formular: [''],
      Products: [[]],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      newForm.patchValue(data);
    } else {
      const newDetailFormItem = this.addDetailFormGroup(newForm, {
        Type: this.select2OptionForDetailType.data.find(f => f.id == 'REQUIRE'),
      });

      this.addConditionFormGroup(newDetailFormItem);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: Model): void {
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
  executeGet(params: any, success: (resources: Model[]) => void, error?: (e: HttpErrorResponse) => void) {
    return super.executeGet(params, success, error);
  }

  /** Details form behavior */
  makeNewDetailFormGroup(parentFormGroup: FormGroup, data?: any): FormGroup {
    const newForm = this.formBuilder.group({
      SystemUuid: [''],
      Type: ['', Validators.required],
      Description: ['', Validators.required],
      AwardRatio: ['', Validators.required],
      LevelDistributedValue: [],
      Conditions: this.formBuilder.array([]),
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

  /** Conditions form behavior */
  makeNewConditionFormGroup(parentFormGroup: FormGroup, data?: any): FormGroup {
    const newForm = this.formBuilder.group({
      SystemUuid: [''],
      Indicator: ['', Validators.required],
      Condition: ['', Validators.required],
      Kpi: [null, Validators.required],
      Weight: [100, Validators.required],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  getConditions(formGroup: FormGroup) {
    return formGroup.get('Conditions') as FormArray;
  }

  addConditionFormGroup(formGroup: FormGroup) {
    const newFormGroup = this.makeNewConditionFormGroup(formGroup);
    const conditions = this.getConditions(formGroup);
    conditions.push(newFormGroup);
    this.onAddConditionFormGroup(formGroup, conditions.length - 1, newFormGroup);
    return false;
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
          rawDetail[prop] = this.cms.getObjectId(rawDetail[prop]);
        }
      }

      // Get details data from ag-grid
      rawItem.Products = [];
      this.gridApi.forEachNode((rowNode, index) => {
        console.log(rowNode, index);
        const rawDetail = {};
        for (const prop in rowNode.data) {
          rawDetail[prop] = this.cms.getObjectId(rowNode.data[prop]);
        }
        rawItem.Products.push(rawDetail);
      });
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
      for (const product of formItemData.Products) {
        this.gridApi.getRowNode(product.Product + '-' + this.cms.getObjectId(product.Unit))?.setDataValue('SystemUuid', product['SystemUuid']);
      }
    }
    return result;
  }
  /** End Hight performance config */


  /** AG-Grid: Product list */
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public columnDefs: ColDef[];
  public gridParams;

  onGridInit(component: AgDynamicListComponent<any>) {
    const $this = this;
    let actionButtonList = component.actionButtonList;
    // actionButtonList = actionButtonList.filter(f => f.name != 'choose');
    actionButtonList = [];
    actionButtonList.unshift({
      type: 'button',
      name: 'delete',
      title: 'Gở sản phẩm',
      status: 'danger',
      label: 'Gở',
      iconPack: 'eva',
      icon: 'minus-square-outline',
      size: 'medium',
      click: (event) => {
        const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();
        $this.gridApi.applyTransaction({ remove: selectedNodes.map(m => m.data) });

        return true;
      }
    });
    actionButtonList.unshift({
      type: 'button',
      name: 'add',
      title: 'Thêm sản phẩm',
      status: 'success',
      label: 'Thêm sản phẩm',
      iconPack: 'eva',
      icon: 'plus-square-outline',
      size: 'medium',
      click: (event) => {
        // const selectedNodes: IRowNode[] = this.gridApi.getSelectedNodes();

        this.cms.openDialog(CollaboratorProductListComponent, {
          context: {
            onDialogChoose(chooseItems) {
              console.log(chooseItems);
              chooseItems = chooseItems.filter(f => {
                return !$this.gridApi.getRowNode(f.Code + '-' + $this.cms.getObjectId(f.Unit));
              });
              const newRowNodeTrans = $this.gridApi.applyTransaction({
                add: chooseItems.map(m => ({
                  id: m.Code,
                  text: m.Name,
                  Product: m.Code,
                  // ProductName: m.Name,
                  Sku: m.Sku,
                  Unit: m.Unit,
                  Pictures: m.Pictures,
                  FeaturePicture: m.FeaturePicture,
                }))
              });
              console.log('New Row Node Trans: ', newRowNodeTrans);
            },
          }
        });

        return true;
      }
    });

    component.actionButtonList = actionButtonList;
  }

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.loadList();
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 3000);
  }

  loadList(callback?: (list: Model[]) => void) {
    if (this.gridApi) {
      let products: Model[] = (this.array.controls[0].get('Products').value || []).map((detail: Model) => {
        return detail;
      });
      this.gridApi.setRowData(products);
    }
  }
  prepareProductList() {
    const $this = this;
    /** AG-Grid */
    this.columnDefs = [
      {
        ...agMakeSelectionColDef(this.cms),
        headerName: 'STT',
        field: 'Id',
        valueGetter: 'node.data.Product',
        width: 100,
        suppressSizeToFit: true,
      },
      {
        ...agMakeImageColDef(this.cms),
        headerName: 'Hình',
        field: 'FeaturePicture',
        width: 100,
        suppressSizeToFit: true,
      },
      {
        headerName: 'Sku',
        field: 'Sku',
        width: 100,
        suppressSizeToFit: true,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        pinned: 'left',
      },
      {
        headerName: 'Sản phẩm',
        field: 'Product',
        width: 400,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'left',
      },
      {
        headerName: 'ĐVT',
        field: 'Unit',
        width: 110,
        suppressSizeToFit: true,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'right',
      },
      {
        headerName: 'SystemUuid',
        field: 'SystemUuid',
        width: 100,
        hide: true,
        suppressSizeToFit: true,
        filter: 'agTextColumnFilter',
        cellRenderer: AgTextCellRenderer,
        // pinned: 'right',
      },
      // {
      //   headerName: 'CKCB',
      //   field: 'Level1CommissionRatio',
      //   width: 1024,
      //   filter: 'agTextColumnFilter',
      //   cellRenderer: AgTextCellRenderer,
      //   // pinned: 'right',
      // },
      {
        ...agMakeCommandColDef(null, this.cms, false, (params) => {
          this.gridApi.applyTransaction({ remove: [params] });
        }, false, [
          // {
          //   name: 'setting',
          //   title: 'Cài đặt',
          //   icon: 'settings-2-outline',
          //   status: 'primary',
          //   outline: false,
          //   action: async (params) => {
          //     this.cms.openDialog(CollaboratorBasicStrategyProductFormComponent, {
          //       context: {
          //         data: [
          //           params.node.data,
          //         ],
          //         onDialogSave(newData) {
          //           console.log(newData);
          //           let currentNode: IRowNode = $this.gridApi.getRowNode($this.cms.getObjectId(params.data.Product) + '-' + $this.cms.getObjectId(params.data.Unit));
          //           currentNode.setData(newData[0]);
          //         },
          //       }
          //     });
          //     return true;
          //   }
          // },
        ]),
        // width: 123,
        headerName: 'Lệnh',
      },
    ];
    /** End AG-Grid */
  }
  /** End AG-Grid: Product list */
}
