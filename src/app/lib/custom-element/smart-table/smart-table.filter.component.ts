import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Select2Option } from '../select2/select2.component';

@Component({
  selector: 'ngx-smart-table-filter',
  template: `
      <input type="text" [ngClass]="inputClass" nbInput fullWidth [formControl]="inputControl" placeholder="{{ column.title }}">
  `,
})
export class SmartTableFilterComponent extends DefaultFilter implements OnInit, OnChanges {

  inputControl = new FormControl();

  constructor() {
    super();
    this.delay = 1000;
  }

  ngOnInit() {
    const config = this.column.getFilterConfig();
    if (config && config.delay) {
      this.delay = config.delay;
    }
    if (this.query) {
      this.inputControl.setValue(this.query);
    }
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: string) => {
        this.query = this.inputControl.value;
        this.setFilter();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.inputControl.setValue(this.query);
    }
  }
}

@Component({
  template: `
    <input
      [owlDateTime]="datetimepicker" [owlDateTimeTrigger]="datetimepicker" [selectMode]="'range'"
      #number
      [ngClass]="inputClass"
      [formControl]="inputControl"
      class="form-control"
      [placeholder]="column.title"
      type="text">
      <owl-date-time #datetimepicker></owl-date-time>
  `,
})
export class SmartTableDateTimeRangeFilterComponent extends SmartTableFilterComponent implements OnInit, OnChanges {
  inputControl = new FormControl();

  constructor() {
    super();
  }

  ngOnInit() {
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: number) => {
        const dateVal: Date[] = this.inputControl.value;
        if (dateVal[0] && dateVal[1]) {
          this.query = value !== null ? (dateVal[0].toISOString() + '/' + dateVal[1].toISOString()) : '';
          this.setFilter();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.query = changes.query.currentValue;
      let range: any[] = changes.query.currentValue.split('/');
      range = range.map(item => new Date(item));
      this.inputControl.setValue(range);
    }
  }
}

@Component({
  template: `
    <button nbButton status="danger" hero size="tiny" (click)="clearFilter()" style="float: right;"
              title="{{'Common.clearFilter' | translate | headtitlecase}}">
              <nb-icon pack="eva" icon="funnel"></nb-icon>
            </button>
  `,
})
export class SmartTableClearingFilterComponent extends SmartTableFilterComponent implements OnInit, OnChanges {
  inputControl = new FormControl();

  constructor() {
    super();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.query = changes.query.currentValue;
      this.inputControl.setValue(this.query);
    }
  }

  clearFilter() {
    console.log('clear filter');
    this.filter.emit('clear-filter');
    return false;
  }
}

@Component({
  selector: 'ngx-smart-table-select2-filter',
  template: `
  <ngx-select2 [formControl]="inputControl" [select2Option]="select2Option"></ngx-select2>
  `,
})
export class SmartTableSelect2FilterComponent extends SmartTableFilterComponent implements OnInit, OnChanges {
  inputControl = new FormControl();
  select2Option: Select2Option;
  // formControl: FormControl;

  constructor() {
    super();
  }

  ngOnInit() {
    this.select2Option = this.column.getFilterConfig().select2Option;
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(this.delay),
      )
      .subscribe((value: [] & any) => {
        if (this.select2Option.multiple) {
          this.query = value.length === 0 ? '' : '[' + value.map((item: any) => item.id).join(',') + ']';
          this.setFilter();
        } else {
          this.query = value;
          this.setFilter();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.query = changes.query.currentValue;
      // this.inputControl.setValue(this.query);
    }
  }
}
