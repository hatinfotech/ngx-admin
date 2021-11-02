import { CommonService } from './../../../services/common.service';
import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../showcase-dialog/showcase-dialog.component';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { CurrencyMaskConfig } from 'ng2-currency-mask';

@Component({
  selector: 'ngx-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss'],
})
export class DialogFormComponent implements OnInit {


  @Input() title: string;
  @Input() controls: {
    name: string,
    type?: string,
    dataList?: { id: string, text: string }[],
    label: string,
    placeholder: string,
    initValue?: any;
    disabled?: boolean,
  }[];
  @Input() actions: { label: string, icon?: string, status?: string, action?: (form: FormGroup) => void }[];
  @Input() onInit: (form: FormGroup, dialog: DialogFormComponent) => void;

  curencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0, allowNegative: true };
  formGroup: FormGroup;

  constructor(
    public ref: NbDialogRef<ShowcaseDialogComponent>,
    public commonService: CommonService,
  ) {

    this.formGroup = new FormGroup({});

    if (this.actions) {
      this.actions.forEach(element => {
        if (!element.action) {
          element.action = () => {

          };
        }
        if (!element.status) {
          element.status = 'info';
        }
      });
    }
  }

  ngOnInit(): void {
    const fcs: { [key: string]: AbstractControl } = {};
    this.controls.forEach(control => {
      fcs[control.name] = new FormControl();
      fcs[control.name].setValue(control.initValue);
      if (control.disabled) {
        fcs[control.name].disable();
      }
    });
    this.formGroup = new FormGroup(fcs);
    if (this.onInit) {
      this.onInit(this.formGroup, this);
    }
  }

  dismiss() {
    this.ref.close();
  }
}
