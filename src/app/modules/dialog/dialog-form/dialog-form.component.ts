import { Select2Option } from './../../../lib/custom-element/select2/select2.component';
import { filter, take } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonService } from './../../../services/common.service';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../showcase-dialog/showcase-dialog.component';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { BaseComponent } from '../../../lib/base-component';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

/**
this.commonService.openDialog(DialogFormComponent, {
  context: {
    title: 'Cập nhật phiên bản phát hành',
    controls: [
      {
        name: 'Version',
        label: 'Phiên bản sẽ được cập nhật',
        initValue: this.moduleSettings['MINIERP_RELEASE_VERSION'],
        placeholder: 'Phiên bản sẽ được cập nhật tự động',
        type: 'text',
      },
    ],
    actions: [
      {
        label: 'Trở về',
        icon: 'back',
        status: 'info',
        action: () => { },
      },
      {
        label: 'Cập nhật',
        icon: 'generate',
        status: 'success',
        action: (form: FormGroup) => {
          this.apiService.putPromise(this.apiPath + '/settings', {}, [{
            Name: 'MINIERP_RELEASE_VERSION',
            Value: form.value['Version'],
          }]).then(rs => {
            this.refresh();
          });

        },
      },
    ],
  },
});
 */

export interface DialogFormControl {
  name: string,
  type?: string,
  dataList?: { id: string, text: string }[],
  label: string,
  placeholder: string,
  initValue?: any;
  disabled?: boolean,
  focus?: boolean,
  option?: any,
  value?: any,
  class?: string,
}
export interface DialogFormAction {
  label: string,
  icon?: string,
  status?: string,
  keyShortcut?: string,
  disabled?: (actionParamrs: DialogFormAction, form: FormGroup, dialog?: DialogFormComponent) => boolean,
  action?: (form: FormGroup, dialog?: DialogFormComponent) => Promise<boolean>
}
@Component({
  selector: 'ngx-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss'],
})
export class DialogFormComponent extends BaseComponent implements OnInit, AfterViewInit {

  componentName: string = 'DialogFormComponent';

  @Input() title: string;
  @Input() cardStyle?: any;
  @Input() width?: string;

  @Input() controls: DialogFormControl[];
  @Input() actions: DialogFormAction[];
  @Input() onInit: (form: FormGroup, dialog: DialogFormComponent) => Promise<boolean>;
  @Input() onClose: (form: FormGroup, dialog: DialogFormComponent) => Promise<boolean>;
  @ViewChild('formEle', { static: true }) formEle: ElementRef;
  // @Input() onKeyboardEvent?: (event: KeyboardEvent, component: DialogFormComponent) => void;

  public destroy$: Subject<void> = new Subject<void>();
  curencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0, allowNegative: true };
  numberFormat = this.commonService.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });
  formGroup: FormGroup;
  processing = false;
  processingProcess = null;

  inited = new BehaviorSubject<boolean>(false);

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<DialogFormComponent>,
  ) {
    super(commonService, router, apiService, ref);
    this.formGroup = new FormGroup({});

    if (this.actions) {
      this.actions.forEach(element => {
        if (!element.action) {
          element.action = () => {
            return Promise.resolve(true);
          };
        }
        if (!element.status) {
          element.status = 'info';
        }
      });
    }
  }

  startProcessing(timeout?: number) {
    this.processing = true;
    if (this.processingProcess) {
      clearTimeout(this.processingProcess);
    }
    this.processingProcess = setTimeout(() => {
      this.processing = false;
    }, timeout || 10000);
  }

  stopProcessing() {
    if (this.processingProcess) {
      clearTimeout(this.processingProcess);
    }
    this.processing = false;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.inited.pipe(filter(f => f), take(1)).toPromise().then(rs => {
      this.controls.forEach(control => {
        if (control?.focus) {
          const formcontrol = $(this.formEle.nativeElement).find(`[name=${control.name}]`)
          formcontrol[0].focus();
          formcontrol.select();
        }
      });
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
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
      this.processing = true;
      this.onInit(this.formGroup, this).then(rs => {
        this.processing = false;
        this.inited.next(true);
      });
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    // if (!this.ref) {
    // this.commonService.clearHeaderActionControlList();
    // }
    // this.destroy$.next();
    // this.destroy$.complete();
    // this.onClose && this.onClose(this.formGroup, this);
    // setTimeout(() => {
    //   this.ref = null;
    // }, 500);
  }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (this.commonService.dialogStack[this.commonService.dialogStack.length - 1] === this.ref) {
  //     // console.log(event.key + ': listen on show case dialog...');
  //     const action = this.actions.find(f => f.keyShortcut == event.key);
  //     if (action) {
  //       if (action.action(this.formGroup, this)) {
  //         this.dismiss();
  //       }

  //       return false;
  //     }
  //     if (this.onKeyboardEvent) {
  //       return this.onKeyboardEvent(event, this);
  //     }
  //   }
  //   return true;
  // }

  onKeyboardEvent(event: KeyboardEvent, component?: BaseComponent) {
    if (this.commonService.dialogStack[this.commonService.dialogStack.length - 1] === this.ref) {
      if (!this.processing) {
        const action = this.actions.find(f => f.keyShortcut == event.key);
        if (action) {
          if (action.action(this.formGroup, this)) {
            this.dismiss();
          }
          return false;
        }
      }
      // if (this.onKeyboardEvent) {
      //   return this.onKeyboardEvent(event, this);
      // }
    }
    super.onKeyboardEvent(event, component);
    return true;
  }

  onAction(item: DialogFormAction, form: FormGroup) {
    return item?.action(form, this);
  }

  checkButtonDisabled(actionParams: DialogFormAction, form: FormGroup) {
    if (actionParams?.disabled) {
      return actionParams?.disabled(actionParams, form, this);
    }
    return false;
  }

  dismiss() {
    this.ref.close();
  }
}
