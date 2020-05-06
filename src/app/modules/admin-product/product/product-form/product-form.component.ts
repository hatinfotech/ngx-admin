import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { ProductModel, ProductUnitModel } from '../../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import '../../../../lib/ckeditor.loader';
import 'ckeditor';
import { ProductUnitListComponent } from '../../unit/product-unit-list/product-unit-list.component';

@Component({
  selector: 'ngx-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent extends DataManagerFormComponent<ProductModel> implements OnInit {

  componentName: string = 'ProductFormComponent';
  idKey = 'Code';
  apiPath = '/admin-product/products';
  baseFormUrl = '/admin-product/product/form';

  unitList: ProductUnitModel[] = [];

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    protected ref: NbDialogRef<ProductFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  // select2OptionForProduct = {
  //   placeholder: 'Chọn sản phẩm...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'Code',
  //     text: 'Name',
  //   },
  //   ajax: {
  //     url: params => {
  //       return this.apiService.buildApiUrl('/admin-product/products', { 'filter_Name': params['term'] });
  //     },
  //     delay: 300,
  //     processResults: (data: any, params: any) => {
  //       console.info(data, params);
  //       return {
  //         results: data.map(item => {
  //           item['id'] = item['Code'];
  //           item['text'] = item['Name'];
  //           return item;
  //         }),
  //       };
  //     },
  //   },
  // };

  select2OptionForCategories = {
    placeholder: 'Chọn danh mục...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    multiple: true,
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'] ? params['term'] : '', select: 'id=>Code,text=>Name' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            // item['id'] = item['ProductCategory'];
            // item['text'] = item['ProductCategoryName'];
            return item;
          }),
        };
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    this.unitList = await this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units');
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: ProductModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeConditions'] = true;
    // params['includeActions'] = true;
    // params['forNgPickDateTime'] = true;
    params['includeCategories'] = true;
    // params['includeUnit'] = true;
    super.executeGet(params, success, error);
  }

  formLoad(formData: ProductModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: ProductModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Conditions form load
      // if (itemFormData.Conditions) {
      //   itemFormData.Conditions.forEach(condition => {
      //     const newConditionFormGroup = this.makeNewConditionFormGroup(condition);
      //     this.getConditions(index).push(newConditionFormGroup);
      //     const comIndex = this.getConditions(index).length - 1;
      //     this.onAddConditionFormGroup(index, comIndex, newConditionFormGroup);
      //   });
      // }

      // // Actions form load
      // if (itemFormData.Actions) {
      //   itemFormData.Actions.forEach(action => {
      //     const newActionFormGroup = this.makeNewActionFormGroup(action);
      //     this.getActions(index).push(newActionFormGroup);
      //     const comIndex = this.getActions(index).length - 1;
      //     this.onAddActionFormGroup(index, comIndex, newActionFormGroup);
      //   });
      // }

      // Direct callback
      if (formItemLoadCallback) {
        formItemLoadCallback(index, newForm, itemFormData);
      }
    });

  }

  makeNewFormGroup(data?: ProductModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: [''],
      WarehouseUnit: ['CAI'],
      Name: ['', Validators.required],
      Description: [''],
      Technical: [''],
      Categories: [''],
    });
    if (data) {
      data['Code_old'] = data['Code'];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: ProductModel): void {
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

  /** Condition Form */
  // makeNewConditionFormGroup(data?: PromotionConditionModel): FormGroup {
  //   const newForm = this.formBuilder.group({
  //     // Id_old: [''],
  //     Id: [''],
  //     Type: ['INTEGER', Validators.required],
  //     Cond: ['', Validators.required],
  //     Operator: ['GT', Validators.required],
  //     DateValue: [''],
  //     DoubleValue: [''],
  //     IntegerValue: [''],
  //     TextValue: [''],
  //     BreakOnFalse: [''],
  //   });

  //   if (data) {
  //     // data['Id_old'] = data['Id'];
  //     newForm.patchValue(data);
  //   }
  //   return newForm;
  // }
  // getConditions(formGroupIndex: number) {
  //   return this.array.controls[formGroupIndex].get('Conditions') as FormArray;
  // }
  // addConditionFormGroup(formGroupIndex: number) {
  //   // this.componentList[formGroupIndex].push([]);
  //   const newFormGroup = this.makeNewConditionFormGroup();
  //   this.getConditions(formGroupIndex).push(newFormGroup);
  //   this.onAddConditionFormGroup(formGroupIndex, this.getConditions(formGroupIndex).length - 1, newFormGroup);
  //   return false;
  // }
  // removeConditionGroup(formGroupIndex: number, index: number) {
  //   this.getConditions(formGroupIndex).removeAt(index);
  //   // this.componentList[formGroupIndex].splice(index, 1);
  //   this.onRemoveConditionFormGroup(formGroupIndex, index);
  //   return false;
  // }
  // onAddConditionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  //   // this.componentList[mainIndex].push([]);
  // }
  // onRemoveConditionFormGroup(mainIndex: number, index: number) {
  //   // this.componentList[mainIndex].splice(index, 1);
  // }
  /** End Condition Form */

  /** Action Form */
  // makeNewActionFormGroup(data?: PromotionActionModel): FormGroup {
  //   const newForm = this.formBuilder.group({
  //     Id: [''],
  //     Type: ['', Validators.required],
  //     Product: [''],
  //     Amount: [''],
  //     // Discount: [''],
  //   });

  //   if (data) {
  //     // data['Id_old'] = data['Id'];
  //     newForm.patchValue(data);
  //   }
  //   return newForm;
  // }
  // getActions(formGroupIndex: number) {
  //   return this.array.controls[formGroupIndex].get('Actions') as FormArray;
  // }
  // addActionFormGroup(formGroupIndex: number) {
  //   // this.componentList[formGroupIndex].push([]);
  //   const newFormGroup = this.makeNewActionFormGroup();
  //   this.getActions(formGroupIndex).push(newFormGroup);
  //   this.onAddActionFormGroup(formGroupIndex, this.getActions(formGroupIndex).length - 1, newFormGroup);
  //   return false;
  // }
  // removeActionGroup(formGroupIndex: number, index: number) {
  //   this.getActions(formGroupIndex).removeAt(index);
  //   // this.componentList[formGroupIndex].splice(index, 1);
  //   this.onRemoveActionFormGroup(formGroupIndex, index);
  //   return false;
  // }
  // onAddActionFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
  //   // this.componentList[mainIndex].push([]);
  // }
  // onRemoveActionFormGroup(mainIndex: number, index: number) {
  //   // this.componentList[mainIndex].splice(index, 1);
  // }
  /** End Action Form */

}
