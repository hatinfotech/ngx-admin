import { Component, forwardRef, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, Validator, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

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
export class Select2Component implements ControlValueAccessor, Validator, OnChanges {


  private provinceData: { id: number, name: string, type: 'central' | 'province' };
  onChange: (item: any) => void;
  onTouched: () => void;
  isDisabled: boolean;
  @Input('data') data: any[];
  @Input('value') value: string | string[];
  @Input('select2Option') select2Option: Select2Options;
  @Output() selectChange = new EventEmitter<Object>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.previousValue !== changes.data.currentValue) {
      this.data.unshift({
        id: '',
        text: this.select2Option.placeholder,
      });
    }
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
        if (value[keyMap['id']] && value[keyMap['text']]) {
          value['id'] = value[keyMap['id']];
          value['text'] = value[keyMap['text']];
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
      } else if (value instanceof Array) {
        this.value = value.map(item => item[keyMap['id']]);
      } else {
        if (value[keyMap['id']] && value[keyMap['text']]) {
          this.value = value[keyMap['id']];
        } else {
          this.value = value;
        }
      }
    } else {
      this.value = '';
    }
    // this.selectChange.emit(value);
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
    const changedValue = this.select2Option.multiple ? e.data : e.data[0];
    if (this.onChange) this.onChange(changedValue);
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
