import { Component, OnInit } from '@angular/core';
import { PriceReport, PriceReportDetail } from '../../../models/sales/price-report.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PriceReportService } from '../../../services/sales/price-report.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

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
  ) { }

  id: string;
  private sub: any;

  priceReport = new PriceReport();
  priceReportDetails = [];

  priceReportForm: FormGroup;
  submitted = false;

  ngOnInit() {

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
        this.priceReportService.getById(this.id,
          priceReport => {
            this.priceReport = priceReport;
            this.priceReportForm.patchValue(this.priceReport);
            // this.details.clear();
            this.priceReport.details.forEach(detail => this.details.push(this.makeNewDetailFormgroup(detail)));
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

  get f() { return this.priceReportForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.info(this.priceReportForm.value);

    if (this.id) {
      // Update
      this.priceReportService.put(this.priceReportForm.value,
        newPriceReport => {
          console.info(newPriceReport);
          this.router.navigate(['sales/price-report']);
        },
        error => console.warn(error));
    } else {
      this.priceReportService.post(this.priceReportForm.value,
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
