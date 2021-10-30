import { Component, forwardRef, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ControlValueAccessor, Validator, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
// import { Select2Options, Select2AjaxOptions, Select2QueryOptions, Select2SelectionObject, IdTextPair } from '../../../../vendor/ng2select2/lib/ng2-select2.interface';
import * as _ from 'lodash';
import { Observable, Subject, Subscription } from 'rxjs';
import { Select2AjaxOptions } from '../../../../vendor/ng2select2 copy/lib/ng2-select2.interface';
import { IdTextPair, Select2Options, Select2QueryOptions, Select2SelectionObject } from '../../../../vendor/ng2select2/lib/ng2-select2.interface';

// declare var Search: any;

// Search.prototype.handleSearch = function (evt) {
//   if (!this._keyUpPrevented) {
//     var input = this.$search.val();

//     this.trigger('query', {
//       term: input
//     });
//   }

//   this._keyUpPrevented = false;
// };

export interface Select2Option {
  [key: string]: any;
  width?: string;
  dropdownAutoWidth?: boolean;
  minimumInputLength?: number;
  minimumResultsForSearch?: number;
  maximumSelectionSize?: number;
  placeholder?: string | IdTextPair;
  separator?: string;
  allowClear?: boolean;
  multiple?: boolean;
  closeOnSelect?: boolean;
  openOnEnter?: boolean;
  id?: (object: any) => string;
  matcher?: (term: string, text: string, option: any) => boolean;
  formatSelection?: (object: any, container: JQuery, escapeMarkup: (markup: string) => string) => string;
  formatResult?: (object: any, container: JQuery, query: any, escapeMarkup: (markup: string) => string) => string;
  formatResultCssClass?: (object: any) => string;
  formatNoMatches?: (term: string) => string;
  formatSearching?: () => string;
  formatInputTooShort?: (term: string, minLength: number) => string;
  formatSelectionTooBig?: (maxSize: number) => string;
  formatLoadMore?: (pageNumber: number) => string;
  createSearchChoice?: (term: string, data: any) => any;
  initSelection?: (element: JQuery, callback: (data: any) => void) => void;
  tokenizer?: (input: string, selection: any[], selectCallback: () => void, options: Select2Options) => string;
  tokenSeparators?: string[];
  query?: (options: Select2QueryOptions) => void;
  ajax?: Select2AjaxOptions;
  data?: any;
  tags?: any;
  containerCss?: any;
  containerCssClass?: any;
  dropdownCss?: any;
  dropdownCssClass?: any;
  escapeMarkup?: (markup: string) => string;
  theme?: string;
  /**
  * Template can return both plain string that will be HTML escaped and a jquery object that can render HTML
  */
  templateSelection?: (object: Select2SelectionObject) => any;
  templateResult?: (object: Select2SelectionObject) => any;
  language?: string | string[] | {};
  selectOnClose?: boolean;
  sorter?: (data: any[]) => any[];

  keyMap: {
    id: string,
    text: string,
  };
  // ajax?: {
  //   url: (params: { term: string }) => string;
  //   delay: number,
  //   processResults: (data: any, params: any) => { results: [] },
  // };
}

@Component({
  selector: 'ngx-select2',
  templateUrl: './select2.component.html',
  styleUrls: ['./select2.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select2Component),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Select2Component),
      multi: true,
    },
  ],
})
export class Select2Component implements ControlValueAccessor, Validator, OnChanges, AfterViewInit, OnInit {

  touchedChanges: Subject<boolean> = new Subject<boolean>();
  statusChanges$: Subscription;
  currentValue = null;

  private provinceData: { id: number, name: string, type: 'central' | 'province' };
  onChange: (item: any) => void;
  onTouched: () => void;
  isDisabled: boolean;
  @Input('data') data: any[];
  @Input('value') value: string | string[];
  // @Input('disabled') disabled: string | string[];
  _select2Option: Select2Options;
  @Input('select2Option') set select2Option(option: Select2Options) {
    option['templateResult'] = (object: Select2SelectionObject, container?: JQuery) => {
      if (object?.id === object?.text) {
        $(container).addClass('new');
      }
      return object?.text;
    };
    this._select2Option = option;
  }
  // @Input('select2Option') set select2Option(option: Select2Options){
  //   option['templateResult'] = (object: Select2SelectionObject, container?: JQuery) => {
  //     if (object?.id === object?.text) {
  //       $(container).addClass('new');
  //     }
  //     return object?.text;
  //   };
  //   this._select2Option = option;
  // }
  @Output() selectChange = new EventEmitter<Object>();
  @Input() status?: string;
  @ViewChild('controls') controls: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.previousValue !== changes.data.currentValue) {
      // this.data.unshift({
      //   id: '',
      //   text: this.select2Option.placeholder,
      // });
    }
  }

  constructor() {

    // Override
    // const markAsTouched = this.formControl.markAsTouched;
    // this.formControl.markAsTouched = ({ onlySelf }: { onlySelf?: boolean } = {}) => {
    //   markAsTouched({ onlySelf });
    //   // this.touchedChanges.next(true);
    //   this.onTouched();
    // };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // $(this.controls.nativeElement).prop('status', this.status);
    // (async () => {
    //   while (!this.select2Option) await new Promise(resolve => setTimeout(() => resolve(true), 50));
    // this.select2Option['templateResult'] = (object: Select2SelectionObject, container?: JQuery) => {
    //   if (object?.id === object?.text) {
    //     $(container).addClass('new');
    //   }
    //   return object?.text;
    // };
    //   this._select2Option = this.select2Option;
    // })();
    // this.formControl.valueChanges.subscribe(value => {
    //   console.log(value); 
    // });
  }

  select2Value = '';
  fieldValue: string | string[];

  // select2Option = {
  //   placeholder: 'Select option...',
  //   allowClear: true,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 1,
  //   // ajax: {
  //   //   url: params => {
  //   //     return environment.api.baseUrl + '/contact/contacts?token='
  //   //       + localStorage.getItem('api_token') + '&filter_Name=' + params['term'];
  //   //   },
  //   //   delay: 300,
  //   //   processResults: (data: any, params: any) => {
  //   //     console.info(data, params);
  //   //     return {
  //   //       results: data.map(item => {
  //   //         item['id'] = item['Code'];
  //   //         item['text'] = '[' + item['Code'] + '] ' + item['Name'];
  //   //         return item;
  //   //       }),
  //   //     };
  //   //   },
  //   // },
  //   query: (options: Select2QueryOptions) => {
  //     this.remoteData(options.term, list => options.callback({ results: list }), error => console.warn(error));
  //   },
  // };

  isSelect(provinceId: number): boolean {
    return !this.provinceData ? false : (provinceId === this.provinceData.id);
  }

  writeValue(value: any) {
    if (value) {
      const keyMap = this._select2Option['keyMap'];
      if (this._select2Option['ajax']) {
        if (value instanceof Array) {
          // value = value.map(i => ({...i, id: i[keyMap['id']], text: i[keyMap['text']]}));
          const tmpVal = [];
          this.data = value.map(i => {
            tmpVal.push(this.getItemId(i));
            return { ...i, id: this.getItemId(i), text: this.getItemText(i) };
          });
          this.value = tmpVal;
        } else {
          if (this.getItemId(value) && this.getItemText(value)) {
            value['id'] = this.getItemId(value);
            value['text'] = this.getItemText(value);
            this.data = [
              value,
            ];
            this.value = value[keyMap['id']];
          } else {
            this.data = [
              {
                id: '',
                text: 'Select option...',
              },
              {
                id: value,
                text: value,
              },
            ];
            this.value = value;
          }
        }
      } else if (value instanceof Array) {
        // this.value = value.map(item => item[keyMap['id']]);

        // if (!this.data || this.data.length === 0) {
        //   this.data = value;
        // }
        // let data = this.data;
        // if (!this.data) {
        //   this.data = [];
        // }
        const data = this.data ? [...this.data.map(idata => { delete idata.selected; return idata; })] : [];
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (!data.some(item => this.getItemId(item) === (this.getItemId(value[i]) || value[i]))) {
              const insertItem = { id: (this.getItemId(value[i]) || value[i]), text: (this.getItemText(value[i]) || value[i]), selected: true };
              data.push(insertItem);
            }
          }
        }
        this.data = data;
        this.value = value.map(i => (this.getItemId(i) || i));
      } else {
        let vl = null;
        if (!(value instanceof Object)) {
          vl = { id: value, text: value };
        } else {
          vl = value;
        }
        if (this.getItemId(vl) && this.getItemText(vl)) {
          const data = this.data ? [...this.data.map(idata => { delete idata.selected; return idata; })] : [];
          // Auto push item to data if not exists
          // if (!this.data) {
          //   this.data = [];
          // }
          if (!data.some(item => this.getItemId(item) === this.getItemId(vl))) {
            data.push({ ...vl, id: this.getItemId(vl), text: this.getItemText(vl), selected: true });
          }
          this.data = data;
          this.value = this.getItemId(vl);
          // this.value = vl;
        } else {
          if (typeof vl === 'object') {
            console.warn('select 2 value is a object but not contain id and text properties');
          }
          this.value = vl;
        }
      }
    }
    else {
      // note: Fix for init NULL value for ajax type
      // if (this.select2Option['ajax']) {
      // this.data = [{ id: '', text: '' }];

      // if(!this.data) {
      //   this.data = [];
      // }

      // if (!this.data.some(item => this.getItemId(item) === '')) {
      //   this.data.push({ id: '', text: '' });
      // }

      // }
      this.value = '';
    }
    // this.selectChange.emit(value);
  }

  protected getItemId(item: any) {
    return item['id'] ? item['id'] : item[this._select2Option['keyMap']['id']];
  }

  protected getItemText(item: any) {
    return item['text'] ? item['text'] : item[this._select2Option['keyMap']['text']];
  }

  registerOnChange(fn: (item: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  handleOnTouched(e) {
    this.onTouched();
  }
  handleOnChange(e) {
    // const id = parseInt(e.value);
    // const itemSelect = this.data.find(item => item['id'] === id);
    // this.writeValue(e.value);
    // let dataChanged: any[] = e.data;
    // if (!this.select2Option['ajax']) {
    //   if (dataChanged) {
    //     dataChanged = dataChanged.map(i => typeof i['id'] !== 'undefined' ? i['id'] : i);
    //   }
    // }
    // const changedValue = this.select2Option.multiple ? dataChanged : dataChanged[0];
    const changedValue = this._select2Option.multiple ? e.data : e.data[0];
    // if (this.onChange) this.onChange(Array.isArray(changedValue) ? changedValue.map(v => v.id) : changedValue.id);
    if (this.onChange) this.onChange(this._select2Option.multiple ? (changedValue ? changedValue : []) : (changedValue ? changedValue : null));
    Object.keys(this._select2Option['keyMap']).forEach(k => {
      e.data.forEach((i: any) => {
        i[this._select2Option['keyMap'][k]] = i[k];
      });
    });
    // this.value = changedValue;
    this.selectChange.emit(changedValue);
    this.currentValue = changedValue;
  }

  validate(formControl: FormControl) {
    // if (!this.type || !this.provinceData) {
    //   return null;
    // }
    // return this.provinceData.type === this.type ? null : {
    //   type: {
    //     valid: false,
    //     actual: c.value,
    //   },
    // };
    // control.value
    // if(!this.currentValue) {
    //   return { invalidName: true, required: true, text: 'Select2: trường bắt buộc' };
    // }
    // try {
    //   if ((formControl.touched) && !formControl.value) {
    //     // if (formControl.errors?.text) {
    //       // this.warningText = formControl.errors.text;
    //     // }
    //     return { invalidName: true, required: true, text: 'Select2: trường bắt buộc' };
    //   }
    //   // this.warningText = null;
    //   return null;
    // } catch (err) {
    //   console.error(`Form control Select2 error`, err);
    // }
    return null;
  }
}
