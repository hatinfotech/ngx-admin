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
    placeholder: 'Chọn cha...',
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
        const option: any = { 'filter_Path': params['term'], includeIdText: true, includeWarehouse: true, select: 'Parent=>Parent,Code=>Code,Name=>Name,Warehouse=>Warehouse,Path=>Path' };
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

  select2OptionForParents: {[key: string]: Select2Option} = {};
  getSelect2OptionForParent(name: string, formItem: FormGroup) {
    if(this.select2OptionForParents[name]) return this.select2OptionForParents[name];
    return this.select2OptionForParents[name] = {...this.select2OptionForParent, formItem};
  }

  static _warehouseList: WarehouseModel[];
  get warehouseList() { return WarehouseGoodsContainerFormComponent._warehouseList; }
  select2OptionForWarehouse = {
    placeholder: this.commonService.translateText('Common.choose'),
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
    placeholder: this.commonService.translateText('Common.choose'),
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    data: [
      {id: 'SHELF', text: 'Kệ'},
      {id: 'FLOOR', text: 'Tầng'},
      {id: 'DRAWERS', text: 'Ngăn'},
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
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WarehouseGoodsContainerModel): FormGroup {
    const newForm = this.formBuilder.group({
      // Code_old: [''],
      Code: ['', Validators.required],
      Parent: [''],
      Name: ['', Validators.required],
      FindOrder: [999],
      Warehouse: ['', Validators.required],
      Description: [''],
      Type: ['', Validators.required],
      X: [''],
      Y: [''],
      Z: [''],
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

}
