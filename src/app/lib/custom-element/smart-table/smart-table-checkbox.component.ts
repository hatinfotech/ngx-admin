import { Component, OnInit, Input } from '@angular/core';

import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
    <nb-checkbox [checked]="renderValue"></nb-checkbox>
  `,
})
export class SmartTableCheckboxComponent implements ViewCell, OnInit {

  renderValue: boolean;

  @Input() value: string | number;
  @Input() rowData: any;

  ngOnInit() {
    this.renderValue = this.value ? true : false;
  }

}
