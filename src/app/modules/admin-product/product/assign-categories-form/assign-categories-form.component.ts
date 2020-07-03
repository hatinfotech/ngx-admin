import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { FormControl } from '@angular/forms';
import { Select2Option } from '../../../../lib/custom-element/select2/select2.component';
import { NbDialogRef } from '@nebular/theme';
import { ProductModel } from '../../../../models/product.model';

@Component({
  selector: 'ngx-assign-categories-form',
  templateUrl: './assign-categories-form.component.html',
  styleUrls: ['./assign-categories-form.component.scss'],
})
export class AssignCategoriesFormComponent extends BaseComponent implements OnInit {

  componentName: string = 'AssignCategoriesFormComponent';
  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() inputProducts: ProductModel[];
  @Input() onDialogSave: (newData: ProductModel[]) => void;
  @Input() onDialogClose: () => void;

  categoriesFormControl = new FormControl;
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
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/admin-product/categories', { 'filter_Name': params['term'] ? params['term'] : '', select: 'id=>Code,text=>Name' });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            // item['id'] = item['Code'];
            // item['text'] = item['Name'];
            delete item['Id'];
            return item;
          }),
        };
      },
    },
  };

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<AssignCategoriesFormComponent>,
  ) {
    super(commonService, router, apiService);
  }

  ngOnInit() {
    console.log(this.inputProducts);
  }

}
