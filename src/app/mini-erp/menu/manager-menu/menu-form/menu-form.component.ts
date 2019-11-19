import { Component, OnInit } from '@angular/core';
import { MenuItemModel } from '../../../models/menu/menu-item.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceReportService } from '../../../services/sales/price-report.service';
import { ApiService } from '../../../services/api.service';
import { ModuleModel } from '../../../models/modules/module.model';
import { MenuModule } from '../../menu.module';

@Component({
  selector: 'ngx-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  formLoading = false;
  id: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private priceReportService: PriceReportService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
  ) { }

  parentList: MenuItemModel[];
  select2OptionForParent = {
    placeholder: 'Chọn Menu cha...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Title',
    },
  };

  ngOnInit() {



    // Form load
    this.activeRoute.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
      this.form = this.formBuilder.group({
        array: this.formBuilder.array([
          this.makeNewFormItem(),
        ]),
      });
      this.form.get('array')

      // this.form = ;

      // Form prepare
      this.apiService.get<MenuItemModel[]>(
        '/menu/menu-items', { limit: 99999 },
        list => {
          list.unshift({
            Code: '',
            Title: 'Chọn Menu cha...',
          });
          this.parentList = list.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Title'];
            return item;
          });

          if (this.id) {
            this.formLoading = true;
            this.apiService.get<MenuItemModel[]>('/menu/menu-items', { id: this.id, multi: true },
              data => {

                this.array.clear();
                data.forEach(formData => {
                  const newForm = this.makeNewFormItem(formData);
                  this.array.push(newForm);
                });

                // this.form.patchValue({array: data});

                setTimeout(() => {
                  this.formLoading = false;
                }, 1000);

              },
            );
          }
        });

    },
    );

  }

  makeNewFormItem(data?: MenuItemModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code_old: [''],
      Code: ['', Validators.required],
      Title: ['', Validators.required],
      Link: [''],
      Icon: [''],
      Group: [''],
      Parent: [''],
    });

    if (data) {
      data['Code_old'] = data.Code;
      newForm.patchValue(data);
    }
    return newForm;
  }

  get array() {
    return this.form.get('array') as FormArray;
  }

  copyFormControlValueToOthers(i: number, formControlName: string) {
    const currentFormControl = this.array.controls[i].get(formControlName);
    this.array.controls.forEach((formItem, index) => {
      if (index !== i) {
        formItem.get(formControlName).patchValue(currentFormControl.value);
      }
    });
  }

  addFormItem() {
    this.array.push(this.makeNewFormItem());
    return false;
  }

  removeFormItem(index: number) {
    this.array.removeAt(index);
    return false;
  }

  onModuleChange(item: any, index: number) {
    console.info(item);

    if (!this.formLoading) {
    }
  }

  goback() {
    this.router.navigate(['menu/manager/list']);
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    const data: { array: any } = this.form.value;
    console.info(data);

    if (this.id) {
      // Update
      this.apiService.put<MenuItemModel>('/menu/menu-items', this.id, data.array,
        newFormData => {
          console.info(newFormData);
          this.router.navigate(['menu/manager/list']);
        });
    } else {
      // Create
      this.apiService.post<MenuItemModel>('/menu/menu-items', data.array,
        newFormData => {
          console.info(newFormData);
          this.router.navigate(['menu/manager/list']);
        });
    }

  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }

}
