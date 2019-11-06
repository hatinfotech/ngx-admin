import { Component, OnInit } from '@angular/core';
import { PriceReport, PriceReportDetail } from '../../../models/sales/price-report.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceReportService } from '../../../services/sales/price-report.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContactService } from '../../../services/crm/contact.service';
import { Contact } from '../../../models/crm/contact';
import { environment } from '../../../../../environments/environment';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Observable, BehaviorSubject } from 'rxjs';
import { UnitService } from '../../../services/product/unit.service copy';
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

  id: string;
  private sub: any;

  priceReport = new PriceReport();
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

  objectValue = '';
  select2Option = {
    placeholder: 'Select option...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 1,
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
            item['text'] = '[' + item['Code'] + '] ' + item['Name'];
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
            item['text'] = '[' + item['Code'] + '] ' + item['Name'];
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
  };

  onObjectChange($event) {
    console.info($event);

    if (!this.formLoading) {
      if ($event['data'] && $event['data'][0]) {

        this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
        if ($event['data'][0]['Code']) {

          this.priceReportForm.get('ObjectName').setValue($event['data'] && $event['data'][0]['Name']);
          this.priceReportForm.get('ObjectPhone').setValue($event['data'] && $event['data'][0]['Phone']);
          this.priceReportForm.get('ObjectEmail').setValue($event['data'] && $event['data'][0]['Email']);
          this.priceReportForm.get('ObjectAddress').setValue($event['data'] && $event['data'][0]['Address']);
        }
      }
    }

  }

  ngOnInit() {

    this.customerList.push({
      id: '',
      text: 'Select option',
    });

    this.unitService.get({ limit: 99999999 },
      unitList => this.unitList = unitList.map(item => {
        item['id'] = item['Code'];
        item['text'] = item['Name'];
        return item;
      }),
      e => console.warn(e.error));

    this.sub = this.activeRoute.params.subscribe(params => {
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


            this.customerList = [
              {
                id: '',
                text: 'Select option',
              },
              {
                id: priceReport['Object'],
                text: '[' + priceReport['Object'] + '] ' + priceReport['ObjectName'],
                Code: priceReport['Object'],
                Name: priceReport['ObjectName'],
                Email: priceReport['ObjectEmail'],
                Phone: priceReport['ObjectPhone'],
                Address: priceReport['ObjectAddress'],
              },
            ];

            this.priceReportForm.patchValue(priceReport);
            this.objectValue = priceReport['Object'];

            setTimeout(() => {
              this.formLoading = false;
            }, 300);

            this.details.clear();
            priceReport['details'].forEach(detail => {
              this.details.push(this.makeNewDetailFormgroup(detail));
            });
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
