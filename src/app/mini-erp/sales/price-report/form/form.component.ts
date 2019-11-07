import { Component, OnInit } from '@angular/core';
import { PriceReportDetail } from '../../../models/sales/price-report.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceReportService } from '../../../services/sales/price-report.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContactService } from '../../../services/crm/contact.service';
import { environment } from '../../../../../environments/environment';
import { UnitService } from '../../../services/product/unit.service';
import { Unit } from '../../../models/product/unit.model';

@Component({
  selector: 'ngx-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})

export class FormComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private priceReportService: PriceReportService,
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private unitService: UnitService,
  ) { }

  provinceModel: { id: number, name: string, type: 'central' | 'province' };

  id: string;
  // private sub: any;

  // priceReport = new PriceReport();
  formLoading = false;
  priceReportDetails = [];
  unitList: Unit[] = [];

  priceReportForm: FormGroup;
  submitted = false;
  keyword = 'Name';
  objectFormControlName = 'Object';

  // Select2
  customerList = [];
  objectSearchApiPath = '/contact/contacts?token='
    + localStorage.getItem('api_token');

  contactRemoteData(params: any, success: (list: any[]) => void, error: (error: any) => void) {
    this.contactService.get({ limit: 20, filter_Name: params }, list => success(list.filter(item => {
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
    ajax: {
      url: params => {
        return environment.api.baseUrl + '/admin-product/units?token='
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

  onObjectChange(item) {
    console.info(item);

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

    // $(document).ready(function () {
    //   $('.js-example-basic-single').select2({
    //     ajax: {
    //       delay: 300,
    //       url: environment.api.baseUrl + '/contact/contacts?token=' + localStorage.getItem('api_token'),
    //       data: function (params) {
    //         const query = {
    //           search: params.term,
    //         };

    //         // Query parameters will be ?search=[term]&type=public
    //         return query;
    //       },
    //       processResults: function (data) {
    //         // Transforms the top-level key of the response object from 'items' to 'results'

    //         for (var i in data) {
    //           data[i]['id'] = data[i]['Code'];
    //           data[i]['text'] = data[i]['Name'];
    //         }

    //         return {
    //           results: data,
    //         };
    //       },
    //     },
    //   });
    // });

    // this.customerList.push({
    //   id: '',
    //   text: 'Select option',
    // });

    this.contactService.get({ limit: 100 }, list => {
      this.customerList = list.map(item => {
        item['id'] = item['Code'];
        item['text'] = item['Name'];
        return item;
      });
    }, e => console.warn(e));

    this.unitService.get({ limit: 99999999 },
      unitList => this.unitList = unitList.map(item => {
        item['id'] = item['Code'];
        item['text'] = item['Name'];
        return item;
      }),
      e => console.warn(e.error));

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
          // this.makeNewDetailFormgroup(),
        ]),
      });

      if (this.id) {
        this.formLoading = true;
        this.priceReportService.getById(this.id,
          (priceReport: Object) => {
            // let priceReport = priceReport;
            // priceReport['Object'] = {
            //   id: priceReport['Object'],
            //   text: priceReport['ObjectName'],
            //   selected: true,
            // };


            // this.customerList = [
            //   {
            //     id: '',
            //     text: 'Select option',
            //   },
            //   {
            //     id: priceReport['Object'],
            //     text: '[' + priceReport['Object'] + '] ' + priceReport['ObjectName'],
            //     Code: priceReport['Object'],
            //     Name: priceReport['ObjectName'],
            //     Email: priceReport['ObjectEmail'],
            //     Phone: priceReport['ObjectPhone'],
            //     Address: priceReport['ObjectAddress'],
            //   },
            // ];

            // priceReport['Object'] = {
            //   id: priceReport['Object'],
            //   text: priceReport['ObjectName'],
            // };
            this.priceReportForm.patchValue(priceReport);
            // this.objectValue = priceReport['Object'];

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

  // selectEvent(item: Contact) {
  //   // do something with selected item
  //   this.priceReportForm.get('ObjectName').setValue(item.Name);
  //   this.priceReportForm.get('ObjectPhone').setValue(item.Phone);
  //   this.priceReportForm.get('ObjectEmail').setValue(item.Email);
  //   this.priceReportForm.get('ObjectAddress').setValue(item.Address);
  // }

  // onChangeSearch(val: string) {
  //   // fetch remote data from here
  //   // And reassign the 'data' which is binded to 'data' property.
  //   // if (this.customerLlist.length === 0) {
  //   //   this.contactService.get({ limit: 999999999 },
  //   //     contacts => this.customerLlist = contacts,
  //   //     e => console.warn(e.error));
  //   // }

  //   // return this.customerLlist.filter((customer) => new RegExp(val).test(customer.Name));

  //   this.contactService.get({ limit: 20, filter_Name: val },
  //     contacts => this.customerLlist = contacts.filter(contact => contact.Name && contact.Code),
  //     e => console.warn(e.error));
  // }

  // onFocused(e) {
  //   // do something when input is focused
  // }

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
    if (data) {
      detail.patchValue(data);
    }
    return detail;
  }

  get details() {
    return this.priceReportForm.get('details') as FormArray;
  }

  addDetail() {
    this.details.push(this.makeNewDetailFormgroup());

    // let formGroup = new FormGroup();
    // formGroup.controls.
    return false;
  }

  removeDetail(index) {
    this.details.removeAt(index);
    return false;
  }

  get f() { return this.priceReportForm.controls; }

  onSubmit() {
    this.submitted = true;
    const data = this.priceReportForm.value;
    console.info(data);
    // if (data['Object']) {
    //   data['Object'] = data['Object']['Code'];
    // }

    if (this.id) {
      // Update
      this.priceReportService.put(data,
        newPriceReport => {
          console.info(newPriceReport);
          this.router.navigate(['sales/price-report']);
        },
        error => console.warn(error));
    } else {
      this.priceReportService.post(data,
        newPriceReport => {
          console.info(newPriceReport);
          this.router.navigate(['sales/price-report']);
        },
        error => console.warn(error));
    }

    // stop here if form is invalid
    // if (this.priceReportForm.invalid) {
    //   return;
    // }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.priceReportForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.priceReportForm.reset();
  }

}
