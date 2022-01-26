import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WarehouseGoodsContainerModel, WarehouseModel } from '../../../../models/warehouse.model';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';

@Component({
  selector: 'ngx-warehouse-goods-container-form',
  templateUrl: './warehouse-goods-container-form.component.html',
  styleUrls: ['./warehouse-goods-container-form.component.scss'],
})
export class WarehouseGoodsContainerFormComponent extends DataManagerFormComponent<WarehouseGoodsContainerModel> implements OnInit {

  componentName: string = 'WarehouseGoodsContainerFormComponent';
  idKey = 'Code';
  baseFormUrl = '/warehouse/goods-container/form';
  apiPath = '/warehouse/goods-containers';

  // static _goodsContainerList: WarehouseGoodsContainerModel[];
  // get goodsContainerList() { return WarehouseGoodsContainerFormComponent._goodsContainerList; }
  activeFormGroup: FormGroup;
  select2OptionForParent: Select2Option = {
    placeholder: 'Chọn vị trí...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    multiple: false,
    ajax: {
      url: (params: any, select2Option: Select2Option) => {
        const option: any = { 'search': params['term'], includeIdText: true, includeWarehouse: true, includeFindOrder: true, select: 'Parent,Code,Name,Warehouse,Path,FindOrder' };
        if (select2Option.formItem) {
          const warehouseFormControl = select2Option.formItem.get('Warehouse');
          if (warehouseFormControl) {
            option.eq_Warehouse = this.commonService.getObjectId(warehouseFormControl.value);
          }
        }
        return this.apiService.buildApiUrl('/warehouse/goods-containers', option);
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        // console.info(data, params);
        const warehouse = this.commonService.getObjectId(this.activeFormGroup.get('Warehouse').value);
        return {
          results: data.filter((item: WarehouseGoodsContainerModel) => {
            return this.commonService.getObjectId(item.Warehouse) === warehouse;
          }),
        };
      },
    },
  };

  select2OptionForParents: { [key: string]: Select2Option } = {};
  getSelect2OptionForParent(name: string, formItem: FormGroup) {
    if (this.select2OptionForParents[name]) return this.select2OptionForParents[name];
    return this.select2OptionForParents[name] = { ...this.select2OptionForParent, formItem };
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

  static _warehouseList: WarehouseModel[];
  get warehouseList() { return WarehouseGoodsContainerFormComponent._warehouseList; }
  select2OptionForWarehouse = {
    placeholder: this.commonService.translateText('Chọn kho...'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };
  select2OptionForType = {
    placeholder: this.commonService.translateText('Chọn loại...'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      { id: 'AREA', text: 'Khu' },
      { id: 'SHELF', text: 'Kệ' },
      { id: 'SHELF', text: 'Tủ' },
      { id: 'FLOOR', text: 'Tầng' },
      { id: 'DRAWERS', text: 'Ngăn' },
      { id: 'BASKET', text: 'Rổ' },
      { id: 'UNKNOW', text: 'Chưa biết' },
    ],
  };

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<WarehouseGoodsContainerFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  async loadCache() {
    await this.clearCache();
    WarehouseGoodsContainerFormComponent._warehouseList = WarehouseGoodsContainerFormComponent._warehouseList || await this.apiService.getPromise<WarehouseModel[]>('/warehouse/warehouses', { includeIdText: true, sort_Name: 'asc' });
    // WarehouseGoodsContainerFormComponent._goodsContainerList = WarehouseGoodsContainerFormComponent._goodsContainerList || (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, includeWarehouse: true })).map(item => ({...item, 'text': item.Path})).sort((a, b) => a.Path.localeCompare(b.Path));
    return super.loadCache();
  }

  async loadGoodsContainerList(warehouseCode: string) {
    // WarehouseGoodsContainerFormComponent._goodsContainerList = (await this.apiService.getPromise<WarehouseGoodsContainerModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, filter_Warehouse: warehouseCode })).map(item => ({...item, 'text': item.Path})).sort((a, b) => a.Path.localeCompare(b.Path));

  }

  async clearCache() {
    WarehouseGoodsContainerFormComponent._warehouseList = null;
    // WarehouseGoodsContainerFormComponent._goodsContainerList = null;
    return super.clearCache();
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WarehouseGoodsContainerModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    params['includeParentPath'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WarehouseGoodsContainerModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Code_old: [''],
      Code: [{ value: '', disabled: true }],
      Parent: [''],
      Name: ['', Validators.required],
      FindOrder: [''],
      Warehouse: ['', Validators.required],
      Description: [''],
      AccAccount: [''],
      Type: ['', Validators.required],
      // X: [''],
      // Y: [''],
      // Z: [''],
      // Branch: ['MAINBRANCH'],
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseGoodsContainerModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  async save() {
    const result = super.save();
    result.then(rs => {
      this.loadCache();
    });
    return result;
  }

  onChangeWarehouse(event: WarehouseModel) {
    this.loadGoodsContainerList(event.Code);
  }

  onParentClick(event: any, formGroup: FormGroup) {
    this.activeFormGroup = formGroup;
  }

  onWarehouseChange(formGroup: FormGroup, selectedData: WarehouseModel, formIndex?: number) {
    // console.info(item);

    if (!this.isProcessing) {
      if (selectedData && !selectedData['doNotAutoFill']) {
        formGroup.get('AccAccount').setValue(selectedData.AccAccount);
      }
    }
  }
}
