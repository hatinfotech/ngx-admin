import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'ngx-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {

  editing = {};
  rows = [];

  ColumnMode = ColumnMode;

  constructor() { }

  ngOnInit() {
    this.fetch(data => {
      this.rows = data;
    });
  }

  fetch(cb) {
    // this.dataService.getEmployees(success => {
    //   this.rows = success;
    // }, error => {
    //   // tslint:disable-next-line: no-console
    //   console.log(error);
    // });
  }

  updateValue(event, cell, rowIndex) {
    // tslint:disable-next-line: no-console
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    // tslint:disable-next-line: no-console
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }

}
