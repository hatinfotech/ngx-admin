import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { FormControl } from '@angular/forms';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { NbDialogRef } from '@nebular/theme';
import { ProductModel, ProductCategoryModel } from '../../../../models/product.model';

@Component({
  selector: 'ngx-assign-categories-form',
  templateUrl: './assign-categories-form.component.html',
  styleUrls: ['./assign-categories-form.component.scss'],
})
export class AssignCategoriesFormComponent extends BaseComponent implements OnInit {

  componentName: string = 'ProductListComponent';
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputProducts: ProductModel[];
  @Input() onDialogSave: (newData: ProductModel[]) => void;
  @Input() onDialogClose: () => void;

  categoriesFormControl = new FormControl();

  categoryList: (ProductCategoryModel & { id?: string, text?: string })[] = [];
  select2OptionForCategories: Select2Option = {
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
    tags: true,
    // ajax: {
    //   url: params => {
    //     return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'] ? params['term'] : '', select: 'id=>Code,text=>Name' });
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     console.info(data, params);
    //     return {
    //       results: data.map(item => {
    //         // item['id'] = item['Code'];
    //         // item['text'] = item['Name'];
    //         delete item['Id'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
  };

  processing = false;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<AssignCategoriesFormComponent>,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  async init() {
    this.categoryList = (await this.apiService.getPromise<ProductCategoryModel[]>('/admin-product/categories', {})).map(cate => ({ ...cate, id: cate.Code, text: cate.Name })) as any;
    return super.init();
  }

  assignCategories() {
    const choosedCategories: (ProductCategoryModel & { id?: string, text?: string })[] = this.categoriesFormControl.value;

    if (choosedCategories && choosedCategories.length > 0) {
      this.processing = true;
      const ids = [];
      for (let p = 0; p < this.inputProducts.length; p++) {
        const product = this.inputProducts[p];
        ids.push(product.Code);
        for (let c = 0; c < choosedCategories.length; c++) {
          const choosed = choosedCategories[c];
          if (!product.Categories.some(cate => choosed['id'] == cate['id'])) {
            product.Categories.push({ id: choosed.id, text: choosed.text, Category: choosed.Code, Product: product.Code } as any);
          }
        }
      }
      this.apiService.putPromise<ProductModel[]>('/admin-product/products', { id: ids }, this.inputProducts).then(rs => {
        this.onDialogSave(rs);
        this.processing = false;
        this.close();
      });
    }
  }

  revokeCategories() {
    const choosedCategories: (ProductCategoryModel & { id?: string, text?: string })[] = this.categoriesFormControl.value;
    if (choosedCategories && choosedCategories.length > 0) {
      this.processing = true;
      const ids = [];
      for (let p = 0; p < this.inputProducts.length; p++) {
        const product = this.inputProducts[p];
        ids.push(product.Code);
        product.Categories = product.Categories.filter(cate => !choosedCategories.some(choosed => choosed.id == cate['id']));
      }
      this.apiService.putPromise<ProductModel[]>('/admin-product/products', { id: ids }, this.inputProducts).then(rs => {
        this.onDialogSave(rs);
        this.processing = false;
        this.close();
      });
    }
  }

  close() {
    this.ref.close();
  }

}
