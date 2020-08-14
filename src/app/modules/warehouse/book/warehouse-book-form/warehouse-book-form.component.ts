import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { WarehouseBookModel, WarehouseModel } from '../../../../models/warehouse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-warehouse-book-form',
  templateUrl: './warehouse-book-form.component.html',
  styleUrls: ['./warehouse-book-form.component.scss'],
})
export class WarehouseBookFormComponent extends DataManagerFormComponent<WarehouseBookModel> implements OnInit {

  componentName: string = 'WarehouseBookFormComponent';
  idKey = 'Code';
  baseFormUrl = '/warehouse/book/form';
  apiPath = '/warehouse/books';

  static _warehouseList: WarehouseModel[];
  get warehouseList() { return WarehouseBookFormComponent._warehouseList; }
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
    public ref: NbDialogRef<WarehouseBookFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  async loadCache() {
    await this.clearCache();
    WarehouseBookFormComponent._warehouseList = WarehouseBookFormComponent._warehouseList || await this.apiService.getPromise<WarehouseModel[]>('/warehouse/warehouses', { includeIdText: true, sort_Name: 'asc' });
    // WarehouseBookFormComponent._goodsContainerList = WarehouseBookFormComponent._goodsContainerList || (await this.apiService.getPromise<WarehouseBookModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, includeWarehouse: true })).map(item => ({...item, 'text': item.Path})).sort((a, b) => a.Path.localeCompare(b.Path));
    return super.loadCache();
  }

  async loadGoodsContainerList(warehouseCode: string) {
    // WarehouseBookFormComponent._goodsContainerList = (await this.apiService.getPromise<WarehouseBookModel[]>('/warehouse/goods-containers', { includePath: true, includeIdText: true, filter_Warehouse: warehouseCode })).map(item => ({...item, 'text': item.Path})).sort((a, b) => a.Path.localeCompare(b.Path));

  }

  async clearCache() {
    WarehouseBookFormComponent._warehouseList = null;
    // WarehouseBookFormComponent._goodsContainerList = null;
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
  executeGet(params: any, success: (resources: WarehouseBookModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WarehouseBookModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [{ disabled: true, value: '' }],
      PreviousBook: [''],
      Warehouse: [''],
      Note: [''],
      Branch: ['MAINBRANCH'],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WarehouseBookModel): void {
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
}
