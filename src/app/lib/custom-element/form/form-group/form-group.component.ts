import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../../services/common.service';

export interface CustomIcon {
  pack?: string;
  icon: string;
  title?: string;
  status: string;
  action: (formGroup: FormGroup, array: FormArray, index: number, option: any) => void;
};
@Component({
  selector: 'ngx-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
})
export class FormGroupComponent implements OnInit {

  @Input() option?: any;
  @Input() formGroup: FormGroup;
  @Input() name: string;
  @Input() allowCopy?: boolean;
  @Input() array: FormArray;
  @Input() index: number;
  @Input() label: string;
  @Input() hideLabel: boolean = false;
  @Input() required?: boolean;
  @Input() align = 'left';
  @Input() customIcons?: CustomIcon[];
  @Input() customIconPack?: string = 'eva';
  @Input() customIconTitle?: string;
  @Input() customIconSttaus?: string;
  @Input() customIconAction?: string;
  constructor(
    public commonService: CommonService,
  ) { }

  ngOnInit(): void {
  }

  formControlValidate(formControl: AbstractControl, invalidText: string, valideText?: string): string {
    // console.info('Form control validate', formControl);
    if (formControl.touched && formControl.errors && formControl.errors.required) {
      return invalidText;
    }
    return valideText ? valideText : '';
  }

  copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
    const currentValue = array.controls[i].get(formControlName).value;
    array.controls.forEach((formItem, index) => {
      if (index > i) {
        formItem.get(formControlName).patchValue(currentValue);
      }
    });
  }

}
