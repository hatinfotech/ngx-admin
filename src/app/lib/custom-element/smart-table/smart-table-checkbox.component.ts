import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
    <nb-checkbox [disabled]="disable" [checked]="renderValue"></nb-checkbox>
  `,
})
export class SmartTableCheckboxComponent implements ViewCell, OnInit {

  renderValue: boolean;
  disable: boolean = false;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    this.renderValue = this.value ? true : false;
  }

}

@Component({
  selector: 'ngx-smart-table-button',
  template: `
  <button *ngIf="display" [disabled]="disabled" nbButton status="success" hero size="tiny" (click)="onClick()">
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
    this.valueChange.emit({value: this.value, row: this.rowData});
  }

  onClick() {
    this.click.emit(this.rowData);
  }
}
