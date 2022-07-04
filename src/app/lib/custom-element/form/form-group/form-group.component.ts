import { Observable, Observer, Subject } from 'rxjs';
import { FormGroup, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { takeUntil } from 'rxjs/operators';

export interface CustomIcon {
  pack?: string;
  icon: string;
  title?: string;
  status: string;
  states?: {
    [key: string]: {
      pack?: string,
      icon?: string,
      title?: string,
      status?: string,
    }
  };
  action: (formGroupCompoent:FormGroupComponent, formGroup: FormGroup, array: FormArray, index: number, option: any) => void;
  onInit?: (formGroupComponent: FormGroupComponent, customIcon: CustomIcon) => void;
};
@Component({
  selector: 'ngx-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
})
export class FormGroupComponent implements OnInit, OnDestroy {

  @Input() option?: any;
  @Input() formGroup?: FormGroup;
  @Input() name?: string;
  @Input() allowCopy?: boolean;
  @Input() array?: FormArray;
  @Input() index?: number;
  @Input() label?: string;
  @Input() hideLabel?: boolean = false;
  @Input() required?: boolean;
  @Input() align = 'left';
  @Input() customIcons?: CustomIcon[];
  @Input() customIconPack?: string = 'eva';
  @Input() customIconTitle?: string;
  @Input() customIconSttaus?: string;
  // @Input() customIconAction?: string;
  @Input() touchedValidate = true;

  protected destroy$: Subject<void> = new Subject<void>();

  warningText = null;
  constructor(
    public commonService: CommonService,
  ) { }

  ngOnInit(): void {
    // console.log('Form Group Component Init');
    if (this.customIcons) {
      for (const customIcon of this.customIcons) {
        if (customIcon.states) {
          const newState = this.getState(this.formControl.value, customIcon.states);
          if (newState) {
            customIcon.pack = newState.pack || customIcon.pack;
            customIcon.icon = newState.icon || customIcon.icon;
            customIcon.status = newState.status || customIcon.status;
            customIcon.title = newState.title || customIcon.title;
          }
          this.formControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(vaule => {
            const newState = this.getState(vaule, customIcon.states);
            // if (newState) {
            customIcon.pack = newState?.pack || customIcon.pack;
            customIcon.icon = newState?.icon || customIcon.icon;
            customIcon.status = newState?.status || customIcon.status;
            customIcon.title = newState?.title || customIcon.title;
            // }
          });
        }
        if (customIcon.onInit) {
          customIcon.onInit(this, customIcon);
        }
      }
    }
  }

  getState(value: string, states: any) {
    if (states['<>'] && this.commonService.getObjectId(value)) {
      return states['<>'];
    }
    return states[this.commonService.getObjectId(value) || ''];
  }

  formControlValidate(formControl: AbstractControl, invalidText: string, valideText?: string): string {
    // console.info('Form control validate', formControl);
    try {
      if ((!this.touchedValidate || formControl.touched) && formControl.errors && formControl.errors.required) {
        if (formControl.errors?.text) {
          this.warningText = formControl.errors.text;
        }
        return invalidText;
      }
      this.warningText = null;
      return valideText ? valideText : '';
    } catch (err) {
      console.error(`Form control ${this.name} error`, err);
    }
  }

  copyFormControlValueToOthers(array: FormArray, i: number, formControlName: string) {
    const currentValue = array.controls[i].get(formControlName).value;
    array.controls.forEach((formItem, index) => {
      if (index > i) {
        formItem.get(formControlName).patchValue(currentValue);
      }
    });
  }

  get formControl() {
    return this.formGroup.get(this.name);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  customIconAction(customIcon: CustomIcon, formGroup: FormGroup, array: FormArray, index: number, option: any) {
    customIcon.action(this, formGroup, array, index, option);
  }

}
