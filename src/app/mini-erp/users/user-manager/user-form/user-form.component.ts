import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceReportService } from '../../../services/sales/price-report.service';
import { ContactService } from '../../../services/crm/contact.service';
import { UnitService } from '../../../services/product/unit.service';
import { ApiService } from '../../../services/api.service';
import { UserModel } from '../../../models/users/user.model';
import { ModuleModel } from '../../../models/modules/module.model';
import { PermissionModel } from '../../../models/users/permission.model';

@Component({
  selector: 'ngx-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  formLoading = false;
  id: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private priceReportService: PriceReportService,
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private unitService: UnitService,
    private apiService: ApiService,
  ) { }

  moduleList: ModuleModel[];
  select2OptionForModule = {
    placeholder: 'Select module...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },

    // matcher: (term, text, option) => {
    //   return true;
    // },
    // ajax: {
    //   url: params => {
    //     return environment.api.baseUrl + '/module/modules?includePermissions=1&token='
    //       + localStorage.getItem('api_token') + '&filter_Name=' + params['term'];
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     console.info(data, params);
    //     return {
    //       results: data.map((item: any) => {
    //         item['id'] = item['Name'];
    //         item['text'] = item['Description'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
  };

  permissionList: PermissionModel[];
  select2OptionForPermissions = {
    placeholder: 'Select module...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    keyMap: {
      id: 'Name',
      text: 'Description',
    },
    // ajax: {
    //   url: params => {
    //     return environment.api.baseUrl + '/users/permssions?token='
    //       + localStorage.getItem('api_token') + '&filter_Name=' + params['term'];
    //   },
    //   delay: 300,
    //   processResults: (data: any, params: any) => {
    //     console.info(data, params);
    //     return {
    //       results: data.map((item: any) => {
    //         item['id'] = item['Name'];
    //         item['text'] = item['Description'];
    //         return item;
    //       }),
    //     };
    //   },
    // },
  };

  ngOnInit() {

    // this.unitService.get({ limit: 99999999 },
    //   unitList => this.unitList = unitList.map(item => {
    //     item['id'] = item['Code'];
    //     item['text'] = item['Name'];
    //     return item;
    //   }),
    //   e => console.warn(e.error));

    // this.apiService.get<ModuleModel[]>(
    //   '/module/modules', { limit: 99999 },
    //   list => this.moduleList = list.map(item => {
    //     item['id'] = item['Name'];
    //     item['text'] = item['Description'];
    //     return item;
    //   }),
    //   error => console.warn(error),
    // );

    // this.apiService.get<PermissionModel[]>(
    //   '/module/permissions', { limit: 99999 },
    //   list => this.permissionList = list.map(item => {
    //     item['id'] = item['Module'];
    //     item['text'] = item['Description'];
    //     return item;
    //   }),
    //   error => console.warn(error),
    // );


    this.activeRoute.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.

      this.form = this.formBuilder.group({
        Name: ['', Validators.required],
        Description: [''],
        Permissions: this.formBuilder.array([
        ]),
      });

      if (this.id) {
        this.formLoading = true;
        this.apiService.get<ModuleModel>('/module/modules', { id: this.id },
          (data: ModuleModel) => {
            this.form.patchValue(data);

            this.modulePermissions.clear();
            data['Permissions'].forEach((modulePermission: PermissionModel) => {
              this.modulePermissions.push(this.makeNewModulePermissions(modulePermission));
            });

            setTimeout(() => {
              this.formLoading = false;
            }, 1000);

          },
          e => console.warn(e),
        );
      } else {
        this.modulePermissions.push(this.makeNewModulePermissions());
      }
    });

  }

  // onObjectChange(item) {
  //   // console.info(item);

  //   if (!this.formLoading) {
  //     if (item) {

  //       // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
  //       if (item['Code']) {

  //         this.form.get('ObjectName').setValue(item['Name']);
  //         this.form.get('ObjectPhone').setValue(item['Phone']);
  //         this.form.get('ObjectEmail').setValue(item['Email']);
  //         this.form.get('ObjectAddress').setValue(item['Address']);
  //       }
  //     }
  //   }

  // }



  onModuleChange(item: any, index: number) {
    console.info(item);

    if (!this.formLoading) {
      // if (item && item['Code']) {
      // this.modulePermissions.controls[index].get('Description').setValue(item['Name']);
      // this.modulePermissions.controls[index].get('Unit').setValue(item['Unit']);
      // }
    }
  }


  makeNewModulePermissions(data?: PermissionModel): FormGroup {
    const permission = this.formBuilder.group({
      Module: [''],
      Permissions: [''],
      Description: [''],
    });

    // detail.get('Quantity').valueChanges.subscribe(val => {
    //   this.detailCalculate(detail);
    // });
    // detail.get('Price').valueChanges.subscribe(val => {
    //   this.detailCalculate(detail);
    // });
    // detail.get('Tax').valueChanges.subscribe(val => {
    //   this.detailCalculate(detail);
    // });

    if (data) {
      permission.patchValue(data);
    }
    return permission;
  }

  // detailCalculate(detail: FormGroup) {

  //   // const tax = detail.get('Tax').value;
  //   // const price: number = +detail.get('Price').value;
  //   // const quantity: number = +detail.get('Quantity').value;

  //   // let taxValue = 0;
  //   // if (tax) {
  //   //   const taxItem: TaxModel = this.taxList.find((t => {
  //   //     return t.Code === tax['Code'];
  //   //   }));
  //   //   taxValue = tax ? +taxItem.Tax : 0;
  //   // }


  //   // Calculate ToMoney
  //   detail.get('ToMoney').patchValue((price * taxValue / 100 + price) * quantity);
  // }

  get modulePermissions() {
    return this.form.get('modulePermissions') as FormArray;
  }

  addModulePermissions() {
    this.modulePermissions.push(this.makeNewModulePermissions());
    return false;
  }

  removeDetail(index) {
    this.modulePermissions.removeAt(index);
    return false;
  }

  goback() {
    this.router.navigate(['users/user-manager/list']);
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    const data = this.form.value;
    console.info(data);

    if (this.id) {
      // Update
      this.priceReportService.put(data,
        newPriceReport => {
          console.info(newPriceReport);
          this.router.navigate(['users/user']);
        },
        error => console.warn(error));
    } else {
      // Create
      this.priceReportService.post(data,
        newPriceReport => {
          console.info(newPriceReport);
          this.router.navigate(['users/user']);
        },
        error => console.warn(error));
    }

  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }
}
