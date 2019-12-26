import { Component, OnInit } from '@angular/core';
import { PriceReportDetail, PriceReportModel } from '../../../../models/price-report.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { UnitModel } from '../../../../models/unit.model';
import { TaxModel } from '../../../../models/tax.model';
import { ApiService } from '../../../../services/api.service';
import { ContactModel } from '../../../../models/contact.model';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-price-report-form',
  templateUrl: './price-report-form.component.html',
  styleUrls: ['./price-report-form.component.scss'],
})

export class PriceReportFormComponent extends BaseComponent implements OnInit {

  componentName: string = 'PriceReportFormComponent';

  constructor(
    private activeRoute: ActivatedRoute,
    protected router: Router,
    private formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected commonService: CommonService,
  ) {
    super(commonService, router, apiService);
  }

  provinceModel: { id: number, name: string, type: 'central' | 'province' };

  env = environment;
  id: string;
  // private sub: any;

  // priceReport = new PriceReport();
  formLoading = false;
  priceReportDetails = [];
  unitList: UnitModel[] = [];
  taxList: TaxModel[] = [];

  priceReportForm: FormGroup;
  submitted = false;
  keyword = 'Name';
  objectFormControlName = 'Object';

  // Select2
  customerList = [];
  objectSearchApiPath = '/contact/contacts?token='
    + localStorage.getItem('api_token');

  contactRemoteData(params: any, success: (list: any[]) => void, error: (error: any) => void) {
    this.apiService.get<ContactModel[]>('/contact/contacts', { limit: 20, filter_Name: params }, list => success(list.filter(item => {
      if (item['Code']) {
        item['id'] = item['Code'];
        item['text'] = item['Name'];
        return true;
      }
      return false;
    })), error);
  }

  objectValue = '';
  select2Option = {
    placeholder: 'Select option...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 1,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return environment.api.baseUrl + '/contact/contacts?token='
          + localStorage.getItem('api_token') + '&filter_Name=' + params['term'];
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  select2OptionForProduct = {
    placeholder: 'Select option...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 1,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return environment.api.baseUrl + '/admin-product/products?token='
          + localStorage.getItem('api_token') + '&filter_Name=' + params['term'];
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };


  select2OptionForUnit = {
    placeholder: 'Select option...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  select2OptionForTax = {
    placeholder: 'Select option...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  onObjectChange(item) {
    // console.info(item);

    if (!this.formLoading) {
      if (item) {

        // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if (item['Code']) {

          this.priceReportForm.get('ObjectName').setValue(item['Name']);
          this.priceReportForm.get('ObjectPhone').setValue(item['Phone']);
          this.priceReportForm.get('ObjectEmail').setValue(item['Email']);
          this.priceReportForm.get('ObjectAddress').setValue(item['Address']);
        }
      }
    }

  }



  onProductChange(item, index) {
    console.info(item);

    if (!this.formLoading) {
      if (item && item['Code']) {
        this.details.controls[index].get('Description').setValue(item['Name']);
        this.details.controls[index].get('Unit').setValue(item['Unit']);
      }
    }
  }

  ngOnInit() {
    this.restrict();
    this.apiService.get<UnitModel[]>('admin-product/units', { limit: 99999999 },
      unitList => this.unitList = unitList.map(item => {
        item['id'] = item['Code'];
        item['text'] = item['Name'];
        return item;
      }),
      e => console.warn(e.error));

    this.apiService.get<TaxModel[]>(
      '/accounting/taxes', { limit: 99999 },
      list => this.taxList = list.map(item => {
        item['id'] = item['Code'];
        item['text'] = item['Label2'];
        return item;
      }),
      error => console.warn(error),
    );


    this.activeRoute.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.

      this.priceReportForm = this.formBuilder.group({
        Code: [''],
        Object: [''],
        ObjectName: ['', Validators.required],
        ObjectPhone: [''],
        ObjectEmail: ['', Validators.email],
        ObjectAddress: [''],
        ObjectBankCode: [''],
        ObjectBankName: [''],
        ObjectTaxCode: [''],
        Recipient: [''],
        Title: ['', Validators.required],
        Note: [''],
        details: this.formBuilder.array([
        ]),
      });

      if (this.id) {
        this.formLoading = true;
        this.apiService.get<PriceReportModel>('/sales/price-reports/' + this.id, {},
          (priceReport: Object) => {
            this.priceReportForm.patchValue(priceReport);

            this.details.clear();
            priceReport['details'].forEach(detail => {
              this.details.push(this.makeNewDetailFormgroup(detail));
            });

            setTimeout(() => {
              this.formLoading = false;
            }, 1000);

          },
          e => console.warn(e),
        );
      } else {
        this.details.push(this.makeNewDetailFormgroup());
      }
    });
  }


  makeNewDetailFormgroup(data?: PriceReportDetail): FormGroup {
    const detail = this.formBuilder.group({
      Id: [''],
      Product: [''],
      Description: [''],
      Unit: [''],
      Tax: [''],
      Price: [''],
      Quantity: [''],
      ToMoney: [''],
    });

    detail.get('Quantity').valueChanges.subscribe(val => {
      this.detailCalculate(detail);
    });
    detail.get('Price').valueChanges.subscribe(val => {
      this.detailCalculate(detail);
    });
    detail.get('Tax').valueChanges.subscribe(val => {
      this.detailCalculate(detail);
    });

    if (data) {
      detail.patchValue(data);
    }
    return detail;
  }

  detailCalculate(detail: FormGroup) {

    const tax = detail.get('Tax').value;
    const price: number = +detail.get('Price').value;
    const quantity: number = +detail.get('Quantity').value;

    let taxValue = 0;
    if (tax) {
      const taxItem: TaxModel = this.taxList.find((t => {
        return t.Code === tax['Code'];
      }));
      taxValue = tax ? +taxItem.Tax : 0;
    }


    // Calculate ToMoney
    detail.get('ToMoney').patchValue((price * taxValue / 100 + price) * quantity);
  }

  get details() {
    return this.priceReportForm.get('details') as FormArray;
  }

  addDetail() {
    this.details.push(this.makeNewDetailFormgroup());
    return false;
  }

  removeDetail(index) {
    this.details.removeAt(index);
    return false;
  }

  goback() {
    this.router.navigate(['sales/price-report/list']);
  }

  get f() { return this.priceReportForm.controls; }

  onSubmit() {
    this.submitted = true;
    const data = this.priceReportForm.value;
    console.info(data);

    if (this.id) {
      // Update
      this.apiService.put<PriceReportModel>('sales/price-reports', {id: this.id}, data,
        newPriceReport => {
          console.info(newPriceReport);
          this.router.navigate(['sales/price-report/list']);
        },
        error => console.warn(error));
    } else {
      this.apiService.post<PriceReportModel>('sales/price-reports', {}, data,
        newPriceReport => {
          console.info(newPriceReport);
          this.router.navigate(['sales/price-report/list']);
        },
        error => console.warn(error));
    }

  }

  onReset() {
    this.submitted = false;
    this.priceReportForm.reset();
  }

}
