import { Component, OnInit } from '@angular/core';
import { SalesPriceReportModel } from '../../../../models/sales.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { SalesPriceReportFormComponent } from '../../../sales/price-report/sales-price-report-form/sales-price-report-form.component';


@Component({
  selector: 'ngx-sales-price-report-form',
  templateUrl: './collaborator-order-tele-commit.component.html',
  styleUrls: ['./collaborator-order-tele-commit.component.scss'],
})
export class CollaboratorOrderTeleCommitFormComponent extends SalesPriceReportFormComponent implements OnInit {

  componentName: string = 'CollaboratorOrderTeleCommitFormComponent';
  apiPath = '/collaborator/price-reports';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CollaboratorOrderTeleCommitFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ref);
  }

  makeNewFormGroup(data?: SalesPriceReportModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Object: [''],
      ObjectName: [''],
      ObjectEmail: [''],
      // ObjectPhone: [''],
      Click2Call: [],
      ObjectAddress: [''],
      ObjectIdentifiedNumber: [''],
      ObjectBankName: [''],
      ObjectBankCode: [''],
      Contact: [''],
      ContactName: [''],
      ContactPhone: [''],
      ContactEmail: [''],
      ContactAddress: [''],
      ContactIdentifiedNumber: [''],
      // ObjectTaxCode: [''],
      // DirectReceiverName: [''],
      // PaymentStep: [''],
      PriceTable: [''],
      DeliveryAddress: [''],
      Title: ['', Validators.required],
      Note: [''],
      SubNote: [''],
      Reported: [''],
      _total: [''],
      RelativeVouchers: [''],
      Details: this.formBuilder.array([]),
    });
    if (data) {
      // data['Code_old'] = data['Code'];
      // newForm.patchValue(data);
      this.patchFormGroupValue(newForm, data);
      // this.toMoney(newForm);
    } else {
      this.addDetailFormGroup(newForm);
    }
    return newForm;
  }

  click2callConnecting = false;
  click2call(formItem: FormGroup) {
    console.log(formItem.get('Object').value);
    const priceReport = formItem.get('Code').value;
    this.click2callConnecting = true;
    if (priceReport) {
      this.apiService.putPromise('/collaborator/price-reports/' + priceReport, { click2call: true }, [{ Code: priceReport }]).then(rs => {
        console.log(rs);
        this.click2callConnecting = false;
      }).catch(err => {
        this.click2callConnecting = false;
      });
    }
    return false;
  }

  saveAndClose() {
    this.commonService.showDiaplog('Chốt đơn', 'Bạn có chắc là muốn chốt đơn hàng này không ? sau khi chốt đơn, báo giá liên quan cũng sẽ được duyệt.', [
      {
        status: 'basic',
        label: 'Trở về',
      },
      {
        status: 'success',
        label: 'Chốt đơn',
        action: () => {
          // const result = super.saveAndClose();
          this.save().then(rs => {
            if (rs[0]?.Code) {
              this.apiService.putPromise('/collaborator/price-reports', { changeState: 'APPROVED' }, [{ Code: rs[0]?.Code }]).then(rs => {
                this.goback();
                // this.onDialogClose();
              });
            }
          });
        },
      }
    ])

    return false;
  }


}
