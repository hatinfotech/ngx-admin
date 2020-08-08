import { Component, forwardRef, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, Validator, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

@Component({
  selector: 'ngx-textntags',
  templateUrl: './textntags.component.html',
  styleUrls: ['./textntags.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextNTagsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextNTagsComponent),
      multi: true,
    },
  ],
})
export class TextNTagsComponent implements ControlValueAccessor, Validator, OnChanges, AfterViewInit {

  onChange: (item: any) => void;
  onTouched: () => void;
  @Input('selectMode') selectMode: any[];
  @Input('value') value: string | string[];
  @Input('placeholder') placeholder: string;
  @Output() change = new EventEmitter<Object>();
  @Input() status?: string;
  @ViewChild('controls') controls: ElementRef;

  formControl = new FormControl();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.previousValue !== changes.data.currentValue) {
    }
  }

  ngAfterViewInit() {
    // $('textarea.tagged_text').textntags({
    //   onDataRequest: function (mode, query, triggerChar, callback) {
    //     var data = [
    //       { id:1, name:'Daniel Zahariev',  'img':'http://example.com/img1.jpg', 'type':'contact' },
    //       { id:2, name:'Daniel Radcliffe', 'img':'http://example.com/img2.jpg', 'type':'contact' },
    //       { id:3, name:'Daniel Nathans',   'img':'http://example.com/img3.jpg', 'type':'contact' }
    //     ];
    
    //     query = query.toLowerCase();
    //     var found = _.filter(data, function(item) { return item.name.toLowerCase().indexOf(query) > -1; });
    
    //    callback.call(this, found);
    //   }
    // });
  }

  select2Value = '';
  fieldValue: string | string[];

  isSelect(provinceId: number): boolean {
    return false;
  }

  writeValue(value: any) {
    // this.value = value.split(' ~ ').map(dt => new Date(dt));
    this.value = Array.isArray(value) ? value.join(' ~ ') : value;
    this.formControl.setValue(Array.isArray(value) ? value.map(dt => new Date(dt)) : value.split(' ~ ').map(dt => new Date(dt)));
  }

  registerOnChange(fn: (item: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    // this.isDisabled = isDisabled;
  }

  handleOnChange(e: Date[]) {
    this.value = e.map(dt => dt.toISOString()).join(' ~ ');
    if (this.onChange) {
      this.onChange(this.value);
    }
    this.change.emit(this.value);
  }

  validate(c: FormControl) {
    return null;
  }
}
