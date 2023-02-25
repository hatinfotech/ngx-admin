import { Select2Option } from './../select2/select2.component';
import { Select2Component } from '../../../../vendor/ng2select2.copy/lib/ng2-select2.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit, ElementRef, Type } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ViewCell } from 'ng2-smart-table';
import { NbPosition, NbTrigger } from '@nebular/theme';

@Component({
  template: `
    <div [style]="style" [class]="class">{{this.value}}</div>
  `,
})
export class SmartTableBaseComponent implements ViewCell, OnInit {

  // renderValue: any;
  disabled: boolean = false;
  style: string;
  class: string;
  name?: string;
  hasModified?: boolean = false;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  init?: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    // this.renderValue = this.value ? true : false;
  }

  onChange(value: any) {
    this.valueChange.emit(value);
    this.value = value;
  }

}

@Component({
  template: `
    <div [style]="style" [class]="class"><nb-checkbox [disabled]="disabled" [checked]="renderValue" (checkedChange)="onChange($event)"></nb-checkbox></div>
  `,
})
export class SmartTableCheckboxComponent extends SmartTableBaseComponent implements ViewCell, OnInit {

  renderValue: boolean;
  // disabled: boolean = false;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value ? true : false;
  }

  onChange(value: any) {
    this.valueChange.emit(value);
    this.value = value;
  }

}

@Component({
  selector: 'ngx-smart-table-button',
  template: `
  <div [style]="style" [class]="class">
    <button *ngIf="display" [outline]="outline" [disabled]="disabled" nbButton [status]="status" hero size="small" (click)="onClick()" nbTooltip="{{title || 'undefined'}}">
      <nb-icon [pack]="iconPack" [icon]="icon"></nb-icon><ng-container *ngIf="label">{{label}}</ng-container>
    </button>
  </div>`,
})
export class SmartTableButtonComponent extends SmartTableBaseComponent implements ViewCell, OnInit {
  renderValue: string;
  iconPack: string;
  icon: string;
  label: string = null;
  status: string = 'success';
  display: boolean = false;
  // disabled: boolean = false;
  outline: boolean = false;
  title?: string;

  @Input() value: string | number;
  @Input() rowData: any;

  // @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.renderValue = this.value.toString().toUpperCase();
    this.valueChange.emit(this.value);
    this.init.emit(this.rowData);
  }

  onClick() {
    this.click.emit(this.rowData);
    return false;
  }
}

@Component({
  selector: 'ngx-smart-table-button',
  template: `
  <div [style]="style" [class]="class"><nb-icon [pack]="iconPack" [icon]="icon" [status]="status" (click)="onClick()" style="cursor: pointer"> {{label}}</nb-icon></div>
  `,
})
export class SmartTableIconComponent extends SmartTableBaseComponent implements ViewCell, OnInit {

  renderValue: string;
  iconPack: string;
  icon: string;
  label: string = '';
  status: string = 'success';
  display: boolean = false;
  // disabled: boolean = false;

  @Input() value: string | number;
  @Input() rowData: any;

  // @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.renderValue = this.value.toString().toUpperCase();
    this.valueChange.emit({ value: this.value, row: this.rowData });
  }

  onClick() {
    this.click.emit(this.rowData);
  }
}

@Component({
  selector: 'ngx-smart-table-thumbnail',
  template: `
  <div [style]="style" [class]="class">
    <div class="thumbnail-wrap" [nbPopover]="chooseComponent" [nbPopoverTrigger]="trigger" [nbPopoverPlacement]="position">
      <div class="thumbnail" [ngStyle]="{'background-image': renderValue}" (click)="onClick()" title="{{title}}"></div>
    </div>
  </div>
  <ng-template #chooseComponent>
    <div class="button-items-rows">
      <button nbButton status="primary" (click)="onPreview()"><nb-icon pack="eva" icon="external-link-outline"></nb-icon>Xem hình</button>
      <button nbButton status="danger" (click)="onUpload()"><nb-icon pack="eva" icon="cloud-upload-outline"></nb-icon>Upload</button>
    </div>
  </ng-template>
`,
  styles: [
    `
    .thumbnail-wrap {
      border: 1px solid #ccc;
      cursor: pointer;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      /* border-radius: 0.3rem; */
      /* border-radius: 50%; */
      border: none;
      padding-top: 3px;
      padding-bottom: 3px;
      width: 3rem;
      min-height: 3rem;
    }
    .thumbnail {
      background-size: cover;
      background-repeat: no-repeat;
      background-color: var(--gray);
      width: 3rem;
      min-height: 3rem;
      border-radius: 50%;
    }
    .button-items-rows {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin: -0.5rem;
      padding: 1rem;
    }
    .button-items-rows>* {
        margin: 0.5rem;
        margin-top: 0.5rem;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        margin-left: 0.5rem;
    }
    .img-preview {
      background-repeat: no-repeat;
      background-size: cover;
      width: 200px;
      height: 150px;      
    }
  `,
  ],
})
export class SmartTableThumbnailComponent extends SmartTableBaseComponent implements ViewCell, OnInit {
  // renderValue: string;
  iconPack: string;
  icon: string;
  label: string = '';
  status: string = 'success';
  display: boolean = false;
  // disabled: boolean = false;
  title = '';
  trigger = NbTrigger.CLICK;
  position = NbPosition.RIGHT;


  @Input() value: string | number;
  @Input() rowData: any;
  // displayValue: string | number;

  // @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();
  @Output() previewAction: EventEmitter<any> = new EventEmitter();
  @Output() uploadAction: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.renderValue = `url(${this.value})`;
    this.valueChange.emit({ value: this.value, row: this.rowData });
  }

  onClick() {
    this.click.emit(this.rowData);
    return false;
  }

  onPreview() {
    this.previewAction.emit(this.rowData);
    return false;
  }

  onUpload() {
    this.uploadAction.emit(this.rowData);
    return false;
  }

  get renderValue() {
    return `url(${this.value && this.value['Thumbnail'] || this.value || 'assets/images/no-image-available.png'})`;
  }

}

@Component({
  template: `<div [style]="style" [class]="class">
    {{this.value | date:(format$ | async)}}
</div>`,
})
export class SmartTableDateTimeComponent extends SmartTableBaseComponent implements ViewCell, OnInit {

  // renderValue: string;
  // disabled: boolean = false;
  format$ = new BehaviorSubject('short');

  @Input() value: string;
  @Input() rowData: any;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.renderValue = this.value;
  }

  onChange(value: any) {
    this.valueChange.emit(value);
    this.value = value;
  }

}

@Component({
  template: `<div [style]="style" [class]="class">{{value | currency:'VND'}}</div>`,
})
export class SmartTableCurrencyComponent extends SmartTableBaseComponent implements ViewCell, OnInit {

  @Input() value: number;
  @Input() rowData: any;

  ngOnInit() {
    // this.renderValue = this.value;
  }

  // get parseValue(): number {
  //   return typeof this.value === 'string' ? parseFloat(this.value) : (typeof this.value === 'undefined' ? 0 : this.value);
  // }

  onChange(value: any) {
    this.valueChange.emit(value);
    this.value = value;
  }

}
@Component({
  template: `<div [style]="style" [class]="class">{{value < 0 && '(' || ''}}{{parseValue | currency:'VND'}}{{value < 0 && ')' || ''}}</div>`,
})
export class SmartTableAccCurrencyComponent extends SmartTableBaseComponent implements ViewCell, OnInit {

  @Input() value: number;
  @Input() rowData: any;

  ngOnInit() {
    // this.renderValue = this.value;
  }

  get parseValue(): number {
    return Math.abs(typeof this.value === 'string' ? parseFloat(this.value) : (typeof this.value === 'undefined' ? 0 : this.value));
  }

  onChange(value: any) {
    this.valueChange.emit(value);
    this.value = value;
  }

}


export interface SmartTableCompoentTagModel {
  id: string;
  text: string;
  tip: string;
  type?: string;
  icon?: string;
  iconPack?: string;
  status?: string;
  [key: string]: any;
}

@Component({
  template: `<div [style]="style" [class]="class">
    <a (click)="onClick(tag)" *ngFor="let tag of value" class="tag nowrap" [ngStyle]="{'background-color': tag?.status == 'primary' ? '#3366ff' : (tag?.status == 'danger' ? '#ff708d' : (tag?.status == 'warning' ? '#b86e00' : false))}" [ngClass]="{'nowrap': nowrap}" nbTooltip="{{renderToolTip(tag)}}"><nb-icon icon="{{tag.icon || 'pricetags'}}" pack="{{tag.iconPack || 'eva'}}"></nb-icon> {{labelAsText(tag) || tag.id}}</a>
  </div>`
})
export class SmartTableTagsComponent extends SmartTableBaseComponent implements ViewCell, OnInit {

  @Input() value: SmartTableCompoentTagModel | any;
  @Input() rowData: any;

  @Output() click = new EventEmitter<{ id: string, text: string, type: string }>();

  labelAsText(tag: SmartTableCompoentTagModel) {
    return null;
  };

  renderToolTip(tag: SmartTableCompoentTagModel) {
    return (tag.type ? `${tag.type}: ` : '') + tag.text;
  }

  nowrap = true;

  ngOnInit() {
    // this.renderValue = this.value;
    // console.log(123);
  }

  protected onClick(tag: { id: string, text: string, type: string }) {
    this.click.emit(tag);
  }

  onChange(value: any) {
    this.valueChange.emit(value);
    this.value = value;
  }

}
@Component({
  template: `<div [style]="style" [class]="class">
    <a (click)="onClick(value)" class="tag nowrap" [ngClass]="{'nowrap': nowrap}" nbTooltip="{{renderToolTip(value)}}"><nb-icon icon="{{value.icon || 'pricetags'}}" pack="{{value.iconPack || 'eva'}}"></nb-icon> {{labelAsText(value) || value.id}}</a>
  </div>`,
  providers: [CurrencyPipe]
})
export class SmartTableTagComponent extends SmartTableBaseComponent implements ViewCell, OnInit {

  @Input() value: SmartTableCompoentTagModel | any;
  @Input() rowData: any;

  @Output() click = new EventEmitter<{ id: string, text: string, type: string }>();

  labelAsText = (tag: SmartTableCompoentTagModel) => {
    return null;
  };

  renderToolTip(tag: SmartTableCompoentTagModel) {
    return (tag.type ? `${tag.type}: ` : '') + tag.text;
  }

  nowrap = true;

  ngOnInit() {
    // this.renderValue = this.value;
    console.log(123);
  }

  public onClick(tag: { id: string, text: string, type: string }) {
    this.click.emit(tag);
  }

  onChange(value: any) {
    this.valueChange.emit(value);
    this.value = value;
  }

}

@Component({
  template: `
    <!-- <nb-checkbox [disabled]="disable" [checked]="renderValue" (checkedChange)="onChange($event)"></nb-checkbox> -->
    <div [style]="style" [class]="class">
      <input #inputText type="text" [name]="name" nbInput fullWidth
          [placeholder]="placeholder" class="align-right" [formControl]="inputControl"
          currencyMask [options]="curencyFormat">
    </div>
  `,
})
export class SmartTableCurrencyEditableComponent extends SmartTableBaseComponent implements ViewCell, OnInit, AfterViewInit {

  inputControl = new FormControl;
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();

  renderValue: boolean;
  // disabled: boolean = false;
  placeholder: string = '';
  delay: number = 1000;
  name: string = '';
  isPatchingValue = false;

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputText', { static: false }) input: ElementRef;

  jqueryInput: JQuery;

  constructor(public commonService: CommonService) {
    super();
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: number) => {
        this.onChange(value);
      });

  }

  set status(status: string) {
    if (this.jqueryInput) {
      this.jqueryInput.removeClass('status-primary');
      this.jqueryInput.removeClass('status-info');
      this.jqueryInput.removeClass('status-warning');
      this.jqueryInput.removeClass('status-danger');
      this.jqueryInput.removeClass('status-success');
      if (status) {
        this.jqueryInput.addClass('status-' + status);
      }
    }
  }

  ngAfterViewInit() {
    // console.log(this.input.nativeElement);
    const thisInput = this.jqueryInput = $(this.input.nativeElement);
    thisInput.keyup(e => {
      if (e.keyCode === 13) {
        thisInput.closest('tr').next().find('input[name="' + this.name + '"]').focus();
      }
    });
  }

  ngOnInit() {
    this.renderValue = this.value ? true : false;
    this.isPatchingValue = true;
    this.inputControl.patchValue(this.value);
    this.isPatchingValue = false;
  }

  onChange(value: any) {
    if (this.value !== value && !this.isPatchingValue) {
      this.valueChange.emit(value);
      this.value = value;
    }
  }

}

@Component({
  template: `
    <!-- <nb-checkbox [disabled]="disable" [checked]="renderValue" (checkedChange)="onChange($event)"></nb-checkbox> -->
    <div [style]="style" [class]="class">
      <input #inputText type="text" [name]="name" nbInput fullWidth [attr.disabled]="disabled ? 'disabled' : null"
          [placeholder]="placeholder" class="align-right" [formControl]="inputControl"
          [inputMask]="towDigitsInputMask">
    </div>
  `,
})
export class SmartTableNumberEditableComponent extends SmartTableBaseComponent implements ViewCell, OnInit, AfterViewInit {

  inputControl = new FormControl;
  // numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  towDigitsInputMask = this.commonService.createFloatNumberMaskConfig({
    digitsOptional: false,
    digits: 2
  });

  renderValue: boolean;
  disabled: boolean = false;
  placeholder: string = '';
  delay: number = 1000;
  name: string = '';
  isPatchingValue = false;

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputText', { static: false }) input: ElementRef;

  jqueryInput: JQuery;

  constructor(public commonService: CommonService) {
    super();
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: number) => {
        this.onChange(value);
      });

  }

  set status(status: string) {
    if (this.jqueryInput) {
      this.jqueryInput.removeClass('status-primary');
      this.jqueryInput.removeClass('status-info');
      this.jqueryInput.removeClass('status-warning');
      this.jqueryInput.removeClass('status-danger');
      this.jqueryInput.removeClass('status-success');
      if (status) {
        this.jqueryInput.addClass('status-' + status);
      }
    }
  }

  ngAfterViewInit() {
    // console.log(this.input.nativeElement);
    const thisInput = this.jqueryInput = $(this.input.nativeElement);
    thisInput.keyup(e => {
      if (e.keyCode === 13) {
        thisInput.closest('tr').next().find('input[name="' + this.name + '"]').focus();
      }
    });
  }

  ngOnInit() {
    this.renderValue = this.value ? true : false;
    this.isPatchingValue = true;
    this.inputControl.patchValue(this.value);
    this.isPatchingValue = false;
    this.init.emit(this.rowData);
  }

  onChange(value: any) {
    if (this.value !== value && !this.isPatchingValue) {
      this.valueChange.emit(value);
      this.value = value;
      this.rowData[this.name] = value;
      this.rowData['hasModified'] = true;
      this.hasModified = true;
    }
  }

}

@Component({
  template: `
  <div [style]="style" [class]="class">
    <input #inputText type="text" [name]="name" nbInput fullWidth
        [placeholder]="placeholder" [formControl]="inputControl">
  </div>
  `,
})
export class SmartTableTextEditableComponent extends SmartTableBaseComponent implements ViewCell, OnInit, AfterViewInit {

  inputControl = new FormControl;

  renderValue: boolean;
  // disabled: boolean = false;
  placeholder: string = '';
  delay: number = 1000;
  name: string = '';
  isPatchingValue = false;
  defaultVavlue = '';

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputText', { static: false }) input: ElementRef;

  jqueryInput: JQuery;

  constructor(public commonService: CommonService) {
    super();
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: number) => {
        this.onChange(value);
      });

  }

  set status(status: string) {
    if (this.jqueryInput) {
      this.jqueryInput.removeClass('status-primary');
      this.jqueryInput.removeClass('status-info');
      this.jqueryInput.removeClass('status-warning');
      this.jqueryInput.removeClass('status-danger');
      this.jqueryInput.removeClass('status-success');
      if (status) {
        this.jqueryInput.addClass('status-' + status);
      }
    }
  }

  ngAfterViewInit() {
    // console.log(this.input.nativeElement);
    const thisInput = this.jqueryInput = $(this.input.nativeElement);
    thisInput.keyup(e => {
      if (e.keyCode === 13) {
        thisInput.closest('tr').next().find('input[name="' + this.name + '"]').focus();
      }
    });
  }

  ngOnInit() {
    this.renderValue = this.value ? true : false;
    this.isPatchingValue = true;
    this.inputControl.patchValue(this.value || this.defaultVavlue);
    setTimeout(() => {
      this.isPatchingValue = false;
    }, 1000);
  }

  setValue(value: any) {
    this.value = value;
    this.inputControl.patchValue(this.value);
  }

  onChange(value: any) {
    if (this.value !== value && !this.isPatchingValue) {
      this.valueChange.emit(value);
      this.value = value;
    }
  }

}
@Component({
  template: `
  <div [style]="style" class="form-group" #wrap>
      <ngx-select2 *ngIf="select2Option" [formControl]="inputControl" [select2Option]="select2Option" [data]="data" #select2Conponent (selectChange)="onSelectChange($event, select2Conponent)"></ngx-select2>
  </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 0;
    }
  `]
})
export class SmartTableSelect2EditableComponent extends SmartTableBaseComponent implements ViewCell, OnInit, AfterViewInit {

  inputControl = new FormControl;
  @ViewChild('select2Conponent') inputComponent: Select2Component;
  @ViewChild('wrap') wrap: ElementRef;
  data: any[];

  select2Option: Select2Option;

  renderValue: boolean;
  // disabled: boolean = false;
  placeholder: string = '';
  delay: number = 1000;
  name: string = '';
  isPatchingValue = false;
  defaultVavlue = '';

  _status: string;

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputText', { static: false }) input: ElementRef;

  jqueryInput: JQuery;

  constructor(public commonService: CommonService) {
    super();
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: number) => {
        this.onChange(value);
      });

  }

  set status(status: string) {
    this._status = status;
    if (status) {
      // console.log(this.inputComponent['controls'].element);
      $(this.wrap.nativeElement).attr('state', status);
    }

    // if (this.jqueryInput) {
    //   this.jqueryInput.removeClass('status-primary');
    //   this.jqueryInput.removeClass('status-info');
    //   this.jqueryInput.removeClass('status-warning');
    //   this.jqueryInput.removeClass('status-danger');
    //   this.jqueryInput.removeClass('status-success');
    //   if (status) {
    //     this.jqueryInput.addClass('status-' + status);
    //   }
    // }
  }

  ngAfterViewInit() {
    // console.log(this.input.nativeElement);
    // const thisInput = this.jqueryInput = $(this.input.nativeElement);
    // thisInput.keyup(e => {
    //   if (e.keyCode === 13) {
    //     thisInput.closest('tr').next().find('input[name="' + this.name + '"]').focus();
    //   }
    // });
  }

  ngOnInit() {
    this.renderValue = this.value ? true : false;
    this.isPatchingValue = true;
    this.inputControl.patchValue(this.value || this.defaultVavlue);
    setTimeout(() => {
      this.isPatchingValue = false;
    }, 1000);
  }

  setValue(value: any) {
    this.value = value;
    this.inputControl.patchValue(this.value);
  }

  onChange(value: any) {
    if (this.value !== value && !this.isPatchingValue) {
      this.valueChange.emit(value);
      this.value = value;
    }
  }

  public onSelectChange = (value: any, select2Conponent: Select2Component) => { };

}

@Component({
  selector: 'ngx-stmart-table-icon-view',
  template: `
  <div [style]="style" [class]="class">
    <div style="text-align: center">
      <i *ngIf="type==='font'" style="font-size: 1.5rem; cursor: pointer; color: #42aaff;" (click)="onClick()" [class]="renderValue"></i>
      <nb-icon style="width: 1.5rem; height: 1.5rem; cursor: pointer" *ngIf="type==='nb'" [pack]="pack" [icon]="renderValue" [status]="status" (click)="onClick()"></nb-icon>
    </div>
  </div>
  `,
})
export class IconViewComponent extends SmartTableBaseComponent implements ViewCell, OnInit {
  renderValue: string;
  type: 'nb' | 'font';
  pack?: string | 'eva';
  status?: string | 'info' | 'primary' | 'success' | 'danger' | 'warning' = 'primary';

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.renderValue = this.value.toString().toUpperCase();
  }

  onClick() {
    this.click.emit(this.rowData);
  }
}


