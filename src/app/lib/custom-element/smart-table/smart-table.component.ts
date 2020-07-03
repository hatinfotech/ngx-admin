import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { CommonService } from '../../../services/common.service';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

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
  <button *ngIf="display" [disabled]="disabled" nbButton [status]="status" hero size="tiny" (click)="onClick()">
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
  template: `<div class="thumbnail" [ngStyle]="{'background-image': renderValue}"></div>`,
})
export class SmartTableThumbnailComponent implements ViewCell, OnInit {
  // renderValue: string;
  iconPack: string;
  icon: string;
  label: string = '';
  status: string = 'success';
  display: boolean = false;
  disabled: boolean = false;

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
  locale = this.commonService.getCurrentLoaleDataset();
  curencyFormat: CurrencyMaskConfig = { prefix: '', suffix: ' ' + this.locale[15], thousands: this.locale[13][1], decimal: this.locale[13][0], precision: 0, align: 'right', allowNegative: false };

  renderValue: boolean;
  disable: boolean = false;
  placeholder: string = '';
  delay: number = 1000;
  name: string = '';

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('inputText', { static: false }) input;

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

  ngAfterViewInit() {
    // console.log(this.input.nativeElement);
    const thisInput = $(this.input.nativeElement);
    thisInput.keyup(e => {
      if (e.keyCode === 13) {
        thisInput.closest('tr').next().find('input[name="' + this.name + '"]').focus();
      }
    });
  }

  ngOnInit() {
    this.renderValue = this.value ? true : false;
    this.inputControl.patchValue(this.value);
  }

  onChange(value: any) {
    this.valueChange.emit(value);
  }

}

