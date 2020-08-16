import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WarehouseGoodsContainerModel, WarehouseModel } from '../../../../models/warehouse.model';
import { async } from '@angular/core/testing';
import { delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
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
      id: 'ProductCategory',
      text: 'ProductCategoryName',
    },
    multiple: false,
    ajax: {
      url: (params: any) => {
        const option: any = { 'filter_Name': params['term'], includeIdText: true, includeWarehouse: true, select: 'Parent=>Parent,Code=>Code,Name=>Name,Warehouse=>Warehouse,Path=>Path' };
        if (this.activeFormGroup) {
          const warehouseFormControl = this.activeFormGroup.get('Warehouse');
          if (warehouseFormControl) {
            option.filter_Warehouse = this.commonService.getObjectId(warehouseFormControl.value);
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
      Code: [{ disabled: true, value: '' }],
      Parent: [''],
      Name: ['', Validators.required],
      FindOrder: [999],
      Warehouse: [''],
      Description: [''],
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
