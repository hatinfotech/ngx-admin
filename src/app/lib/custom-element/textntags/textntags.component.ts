import { Component, forwardRef, Input, EventEmitter, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, Validator, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CommonService } from '../../../services/common.service';

declare const $: any;
declare const _: any;
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
  @Input() status?: string = 'basic';
  @Input() atTagLIst?: any[] = [];
  @Input() hashTagLIst?: any[] = [];
  @ViewChild('control') control: ElementRef;

  formControl = new FormControl();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.previousValue !== changes.data.currentValue) {
    }
  }

  constructor(
    public cms: CommonService,
  ) {

  }

  ngAfterViewInit() {
    const $this = this;
    const element = $(this.control.nativeElement);
    element.mentionsInput({
      minChars: 0,
      triggerChar: '@',
      hashtagTriggerChar: '#',
      templates: {
        wrapper: _.template('<div class="mentions-input-box"></div>'),
        autocompleteList: _.template('<div class="mentions-autocomplete-list"></div>'),
        autocompleteListItem: _.template('<li belongto="<%= group %>" data-ref-id="<%= id %>" data-ref-type="<%= type %>" data-display="<%= display %>"><%= content %></li>'),
        autocompleteListItemAvatar: _.template('<img src="<%= avatar %>" />'),
        autocompleteListItemIcon: _.template('<div class="icon <%= icon %>"></div>'),
        mentionsOverlay: _.template('<div class="mentions"><div></div></div>'),
        mentionItemSyntax: _.template('[<%= value %>](<%= type %>:<%= id %>)'),
        hashtagItemSyntax: _.template('[<%= value %>](<%= type %>:<%= id %>)'),
        mentionItemHighlight: _.template('<strong><span><%= value %></span></strong>')
      },
      onDataRequest: function (mode, query, callback) {
        const data = _.filter($this.atTagLIst, (item) => { return $this.cms.smartFilter(item.name, query) });
        console.log('mention search results: ', data);
        callback.call(this, data);
      },
      onHashtagDataRequest: function (mode, query, callback) {
        const data = _.filter($this.hashTagLIst, (item) => { return $this.cms.smartFilter(item.name, query) });
        console.log('hastag search results: ', data);
        callback.call(this, data);
      }
    });
    element.keyup(e => {
      this.cms.takeUntil('textmention-get-value', 300, () => {
        element.mentionsInput('val', (val) => {
          this.handleOnChange(val);
        });
      })
    })
  }

  select2Value = '';
  fieldValue: string | string[];

  isSelect(provinceId: number): boolean {
    return false;
  }

  writeValue(value: any) {
    this.value = value
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

  handleOnChange(value) {
    this.value = value;
    if (this.onChange) {
      this.onChange(this.value);
    }
    this.change.emit(this.value);
  }

  validate(c: FormControl) {
    return null;
  }
}
