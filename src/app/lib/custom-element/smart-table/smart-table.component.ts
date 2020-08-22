import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { stat } from 'fs';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
    <nb-checkbox [disabled]="disable" [checked]="renderValue" (checkedChange)="onChange($event)"></nb-checkbox>
  `,
})
export class SmartTableCheckboxComponent implements ViewCell, OnInit {

  renderValue: boolean;
  disable: boolean = false;

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
  <button *ngIf="display" [disabled]="disabled" nbButton [status]="status" hero size="small" (click)="onClick()" title="{{title}}">
    <nb-icon [pack]="iconPack" [icon]="icon"> {{label}}</nb-icon>
  </button>`,
})
export class SmartTableButtonComponent implements ViewCell, OnInit {
  renderValue: string;
  iconPack: string;
  icon: string;
  label: string = '';
  status: string = 'success';
  display: boolean = false;
  disabled: boolean = false;
  title?: string;

  @Input() value: string | number;
  @Input() rowData: any;

  // @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.renderValue = this.value.toString().toUpperCase();
    this.valueChange.emit(this.value);
  }

  onClick() {
    this.click.emit(this.rowData);
  }
}

@Component({
  selector: 'ngx-smart-table-button',
  template: `
  <nb-icon [pack]="iconPack" [icon]="icon" [status]="status" (click)="onClick()" style="cursor: pointer"> {{label}}</nb-icon>
  `,
})
export class SmartTableIconComponent implements ViewCell, OnInit {

  renderValue: string;
  iconPack: string;
  icon: string;
  label: string = '';
  status: string = 'success';
  display: boolean = false;
  disabled: boolean = false;

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
    <div class="thumbnail-wrap" [ngStyle]="{'background-image': 'url(assets/icon/eva/image-outline.svg)'}">
      <div class="thumbnail" [ngStyle]="{'background-image': renderValue}" (click)="onClick()" title="{{title}}"></div>
    </div>`,
  styles: [
    `
    .thumbnail-wrap {
      border: 1px solid #ccc;
      cursor: pointer;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      border-radius: 0.3rem;
      width: 3rem;
      min-height: 3rem;
    }
    .thumbnail {
      background-size: cover;
      background-repeat: no-repeat;
      width: 3rem;
      min-height: 3rem;
      border-radius: 0.3rem;
    }
  `,
  ],
})
export class SmartTableThumbnailComponent implements ViewCell, OnInit {
  // renderValue: string;
  iconPack: string;
  icon: string;
  label: string = '';
  status: string = 'success';
  display: boolean = false;
  disabled: boolean = false;
  title = '';

  @Input() value: string | number;
  @Input() rowData: any;
  // displayValue: string | number;

  // @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() click: EventEmitter<any> = new EventEmitter();
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // this.renderValue = `url(${this.value})`;
    this.valueChange.emit({ value: this.value, row: this.rowData });
  }

  onClick() {
    this.click.emit(this.rowData);
  }

  get renderValue() {
    return `url(${this.value})`;
  }

}

@Component({
  template: `{{this.value | date:(format$ | async)}}`,
})
export class SmartTableDateTimeComponent implements ViewCell, OnInit {

  // renderValue: string;
  disable: boolean = false;
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
  template: `
    <!-- <nb-checkbox [disabled]="disable" [checked]="renderValue" (checkedChange)="onChange($event)"></nb-checkbox> -->
    <input #inputText type="text" [name]="name" nbInput fullWidth
        [placeholder]="placeholder" class="align-right" [formControl]="inputControl"
        currencyMask [options]="curencyFormat">
  `,
})
export class SmartTableCurrencyEditableComponent implements ViewCell, OnInit, AfterViewInit {

  inputControl = new FormControl;
  curencyFormat: CurrencyMaskConfig = this.commonService.getCurrencyMaskConfig();

  renderValue: boolean;
  disable: boolean = false;
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
    <input #inputText type="text" [name]="name" nbInput fullWidth
        [placeholder]="placeholder" class="align-right" [formControl]="inputControl"
        currencyMask [options]="numberFormat">
  `,
})
export class SmartTableNumberEditableComponent implements ViewCell, OnInit, AfterViewInit {

  inputControl = new FormControl;
  numberFormat: CurrencyMaskConfig = this.commonService.getNumberMaskConfig();

  renderValue: boolean;
  disable: boolean = false;
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
    <input #inputText type="text" [name]="name" nbInput fullWidth
        [placeholder]="placeholder" class="align-right" [formControl]="inputControl">
  `,
})
export class SmartTableTextEditableComponent implements ViewCell, OnInit, AfterViewInit {

  inputControl = new FormControl;

  renderValue: boolean;
  disable: boolean = false;
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
  selector: 'ngx-stmart-table-icon-view',
  template: `
    <div style="text-align: center">
      <i *ngIf="type==='font'" style="font-size: 1.5rem; cursor: pointer; color: #42aaff;" (click)="onClick()" [class]="renderValue"></i>
      <nb-icon style="width: 1.5rem; height: 1.5rem; cursor: pointer" *ngIf="type==='nb'" [pack]="pack" [icon]="renderValue" [status]="status" (click)="onClick()"></nb-icon>
    </div>
  `,
})
export class IconViewComponent implements ViewCell, OnInit {
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


