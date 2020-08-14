import { Component, forwardRef, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, Validator, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Select2Options, Select2AjaxOptions, Select2QueryOptions, Select2SelectionObject, IdTextPair } from '../../../../vendor/ng2-select2/lib/ng2-select2.interface';
import * as _ from 'lodash';

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
export class Select2Component implements ControlValueAccessor, Validator, OnChanges, AfterViewInit {

  private provinceData: { id: number, name: string, type: 'central' | 'province' };
  onChange: (item: any) => void;
  onTouched: () => void;
  isDisabled: boolean;
  @Input('data') data: any[];
  @Input('value') value: string | string[];
  // @Input('disabled') disabled: string | string[];
  @Input('select2Option') select2Option: Select2Options;
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

  ngAfterViewInit() {
    // $(this.controls.nativeElement).prop('status', this.status);
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
      const keyMap = this.select2Option['keyMap'];
      if (this.select2Option['ajax']) {
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
        if (!this.data) {
          this.data = [];
        }
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (!this.data.some(item => this.getItemId(item) === (this.getItemId(value[i]) || value[i]))) {
              const insertItem = { id: (this.getItemId(value[i]) || value[i]), text: (this.getItemText(value[i]) || value[i]) };
              this.data.push(insertItem);
            }
          }
        }
        this.value = value.map(i => (this.getItemId(i) || i));
      } else {
        if (this.getItemId(value) && this.getItemText(value)) {
          // Auto push item to data if not exists
          if (!this.data) {
            this.data = [];
          }
          if (!this.data.some(item => this.getItemId(item) === this.getItemId(value))) {
            this.data.push({ id: this.getItemId(value), text: this.getItemText(value) });
          }
          this.value = this.getItemId(value);
        } else {
          this.value = value;
        }
      }
    } else {
      this.value = '';
    }
    // this.selectChange.emit(value);
  }

  protected getItemId(item: any) {
    return item['id'] ? item['id'] : item[this.select2Option['keyMap']['id']];
  }

  protected getItemText(item: any) {
    return item['text'] ? item['text'] : item[this.select2Option['keyMap']['text']];
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
    const changedValue = this.select2Option.multiple ? e.data : e.data[0];
    // if (this.onChange) this.onChange(Array.isArray(changedValue) ? changedValue.map(v => v.id) : changedValue.id);
    if (this.onChange) this.onChange(this.select2Option.multiple ? (changedValue ? changedValue : []) : (changedValue ? changedValue : null));
    Object.keys(this.select2Option['keyMap']).forEach(k => {
      e.data.forEach((i: any) => {
        i[this.select2Option['keyMap'][k]] = i[k];
      });
    });
    this.selectChange.emit(changedValue);
  }

  validate(c: FormControl) {
    // if (!this.type || !this.provinceData) {
    //   return null;
    // }
    // return this.provinceData.type === this.type ? null : {
    //   type: {
    //     valid: false,
    //     actual: c.value,
    //   },
    // };
    return null;
  }
}
