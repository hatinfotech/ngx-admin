import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { WarehouseModel } from '../../../../models/warehouse.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss'],
})
export class WarehouseFormComponent extends DataManagerFormComponent<WarehouseModel> implements OnInit {

  componentName: string = 'WarehouseFormComponent';
  idKey = 'Code';
  baseFormUrl = '/warehouse/warehouse/form';
  apiPath = '/warehouse/warehouses';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<WarehouseFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }
  
  accountList = [
    {id: '156', text: 'Hàng hóa (156)', children: [
      {id: '1561', text: 'Giá mua hàng hóa (1561)'},
      {id: '1562', text: 'Chi phí thu mua hàng hóa (1562)'},
      {id: '1563', text: 'Hàng hóa bất động sản (1563)'},
    ]},
    {id: '152', text: 'Nguyên liệu, vật liệu (152)'},
    {id: '155', text: 'Thành phẩm nhập kho (155)', children: [
      {id: '1551', text: 'Thành phẩm nhập kho (1551)'},
      {id: '1557', text: 'Thành phẩm bất động sản (1557)'},
    ]},
    {id: '158', text: 'Hàng hoá kho bảo thuế (158)'},
    {id: '153', text: 'Công cụ, dụng cụ (153)', children: [
      {id: '1531', text: 'Công cụ, dụng cụ (1531)'},
      {id: '1532', text: 'Bao bì luân chuyển (1532)'},
      {id: '1533', text: 'Đồ dùng cho thuê (1533)'},
      {id: '1534', text: 'Thiết bị, phụ tùng thay thế (1534)'},
    ]},
    {id: '157', text: 'Hàng gửi đi bán (157)'},
  ];
  select2OptionForAccAccount = {
    placeholder: this.commonService.translateText('Chọn tài khoản kho...'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WarehouseModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WarehouseModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: { value: '', disabled: true },
      Name: ['', Validators.required],
      Description: [''],
      FindOrder: [''],
      Branch: ['MAINBRANCH'],
      AccAccount: ['156', Validators.required],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
