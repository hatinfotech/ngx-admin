import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

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
export class SmartTableDateTimeRangeFilterComponent extends DefaultFilter implements OnInit, OnChanges {
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
export class SmartTableClearingFilterComponent extends DefaultFilter implements OnInit, OnChanges {
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
