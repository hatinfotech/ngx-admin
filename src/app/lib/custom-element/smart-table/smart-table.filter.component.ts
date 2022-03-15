import { CommonService } from './../../../services/common.service';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'ng2-smart-table';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Select2Option } from '../select2/select2.component';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

class SmartTableFilterQuery {

  constructor(
    public condition: string,
    public value: string,
  ) {

  }

  public toString = (): string => {
    return this.value;
  }
}
@Component({
  selector: 'ngx-smart-table-filter',
  template: `
      <input type="text" [status]="status" [ngClass]="inputClass" nbInput fullWidth [formControl]="inputControl" placeholder="{{ column.title }}" (keyup)="doSerach($event)">
  `,
})
export class SmartTableFilterComponent extends DefaultFilter implements OnInit, OnChanges {

  inputControl = new FormControl();
  condition?: string;
  status = 'basic';

  // searchEvent = 'keyup';

  constructor(
    public commonService: CommonService,
  ) {
    super();
    this.delay = 1000;
  }

  doSerach(event: KeyboardEvent) {
    
    if (event.key == 'Enter') {
      if (this.condition) {
        this.query = new SmartTableFilterQuery(this.condition, this.inputControl.value) as any;
        this.setFilter();
      } else {
        this.query = this.inputControl.value;
        this.setFilter();
      }
      this.status = 'success';
      setTimeout(() => {
        this.status = 'basic';
      }, 1000);
    } 
    // else {
    //   this.status = 'warning';
    // }
    // else {
    //   if (!this.inputControl.value) {
    //     this.commonService.takeUntilCallback('smart-table-filter-input-keyup', 300, () => {
    //       this.query = new SmartTableFilterQuery(this.condition, this.inputControl.value) as any;
    //       this.setFilter();
    //     });
    //   }
    // }
  }

  ngOnInit() {
    const config = this.column.getFilterConfig();
    if (config) {
      this.condition = config.condition || this.condition;
    }
    if (config && config.delay) {
      this.delay = config.delay;
    }
    if (this.query) {
      this.inputControl.setValue(this.query);
    }
    this.inputControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        // debounceTime(this.delay),
      )
      .subscribe((value: string) => {
        // if (this.condition) {
        //   this.query = new SmartTableFilterQuery(this.condition, value) as any;
        //   this.setFilter();
        // } else {
        //   this.query = this.inputControl.value;
        //   this.setFilter();
        // }
        this.status = 'warning';
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.inputControl.setValue(changes.query.currentValue);
    }
  }
}

@Component({
  template: `
    <input nbInput size="medium" style="height: 2.5rem;"
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

  constructor(public commonService: CommonService) {
    super(commonService);
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
    <input nbInput size="medium" style="height: 2.5rem;"
      [owlDateTime]="datetimepicker" [owlDateTimeTrigger]="datetimepicker" [selectMode]="'range'"
      #number
      [ngClass]="inputClass"
      [formControl]="inputControl"
      class="form-control"
      [placeholder]="column.title"
      type="text">
      <owl-date-time #datetimepicker [pickerType]="'calendar'"></owl-date-time>
  `,
})
export class SmartTableDateRangeFilterComponent extends SmartTableFilterComponent implements OnInit, OnChanges {
  inputControl = new FormControl();

  constructor(public commonService: CommonService) {
    super(commonService);
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
          this.query = {
            dataType: 'date',
            searchType: 'range',
            range: dateVal,
          } as any;
          // this.query = value !== null ? (dateVal[0].toISOString() + '/' + dateVal[1].toISOString()) : '';
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
    <button nbButton status="danger" hero size="small" (click)="clearFilter()" style="float: right;"
              title="{{'Common.clearFilter' | translate | headtitlecase}}">
              <nb-icon pack="eva" icon="funnel"></nb-icon>
            </button>
  `,
})
export class SmartTableClearingFilterComponent extends SmartTableFilterComponent implements OnInit, OnChanges {
  inputControl = new FormControl();

  constructor(public commonService: CommonService) {
    super(commonService);
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
  <ngx-select2 [formControl]="inputControl" [select2Option]="select2Option" [data]="data"></ngx-select2>
  `,
})
export class SmartTableSelect2FilterComponent extends SmartTableFilterComponent implements OnInit, OnChanges {
  inputControl = new FormControl();
  select2Option: Select2Option & { data?: () => any[] };
  logic: 'AND' | 'OR' = 'AND';
  data: any[] = [];
  condition = 'filter';

  constructor(public commonService: CommonService) {
    super(commonService);
  }

  ngOnInit() {
    this.condition = this.column.getFilterConfig().condition || this.condition;
    this.select2Option = this.column.getFilterConfig().select2Option;
    if (this.select2Option.logic) {
      this.logic = this.select2Option.logic;
      if (this.select2Option.data) {
        this.data = this.select2Option.data;
      }
    }

    if (this.delay > 0) {
      this.inputControl.valueChanges
        .pipe(
          distinctUntilChanged(),
          debounceTime(this.delay),
        )
        .subscribe((value: [] & any) => {
          if (this.select2Option.multiple) {
            this.query = { condition: this.condition, value: value.length === 0 ? '' : (this.logic === 'AND' ? '{' : '[') + value.map((item: any) => item.id).join(',') + (this.logic === 'AND' ? '}' : ']') } as any;
            this.setFilter();
          } else {
            this.query = { condition: this.condition, value: value?.id || value } as any;
            this.setFilter();
          }
        });
    } else {
      const value = this.inputControl.value;
      if (this.select2Option.multiple) {
        this.query = value.length === 0 ? '' : (this.logic === 'AND' ? '{' : '[') + value.map((item: any) => item.id).join(',') + (this.logic === 'AND' ? '}' : ']');
        this.setFilter();
      } else {
        this.query = value;
        this.setFilter();
      }
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this.query = changes.query.currentValue;
      // this.inputControl.setValue(this.query);
    }
  }
}

@Component({
  selector: 'ngx-smart-table-select-filter',
  template: `
      <nb-select [formControl]="inputControl" size="medium" placeholder="{{column.title}}">
        <nb-option value="">{{selectText}}</nb-option>
        <nb-option *ngFor="let item of list" [value]="item.value">{{item.title}}</nb-option>
      </nb-select>
  `,
})
export class SmartTableSelectFilterComponent extends SmartTableFilterComponent implements OnInit, OnChanges {

  inputControl = new FormControl();
  list: { value: string, title: string }[];
  selectText: string;

  constructor(public commonService: CommonService) {
    super(commonService);
    this.delay = 1000;
  }

  ngOnInit() {
    const config = this.column.getFilterConfig();
    if (config && config.delay) {
      this.delay = config.delay;
    }

    const filterConfig = this.column.getFilterConfig();
    if (filterConfig.list) {
      this.list = filterConfig.list;
    }
    if (filterConfig.selectText) {
      this.selectText = filterConfig.selectText;
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
      this.inputControl.setValue(changes.query.currentValue);
    }
  }
}
