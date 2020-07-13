import { Component, forwardRef, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, Validator, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { GridApi, ColumnApi, Module, AllCommunityModules, IDatasource } from '@ag-grid-community/all-modules';

@Component({
  selector: 'ngx-ag-list',
  templateUrl: './ag-list.component.html',
  styleUrls: ['./ag-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgListComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AgListComponent),
      multi: true,
    },
  ],
})
export class AgListComponent implements ControlValueAccessor, Validator, OnChanges {


  private provinceData: { id: number, name: string, type: 'central' | 'province' };
  onChange: (item: any) => void;
  onTouched: () => void;
  isDisabled: boolean;
  @Input('data') data: IDatasource;
  @Input('value') value: { id: string, text: string }[];
  // @Input('disabled') disabled: string | string[];
  @Input('select2Option') select2Option: Select2Options;
  @Input() columnDefs: any;
  @Output() selectChange = new EventEmitter<Object>();
  @Output() getData = new EventEmitter<{ limit: number, offset: number }>();

  pagination = false;
  maxBlocksInCache = 9999;
  paginationPageSize = 40;
  cacheBlockSize = 40;

  public defaultColDef = {
    sortable: true,
    resizable: true,
    // suppressSizeToFit: true,
  };

  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public modules: Module[] = AllCommunityModules;

  public rowSelection = 'multiple';
  public rowModelType = 'infinite';
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = 1;
  public getRowNodeId = (item: { id: string }) => {
    return item.id;
  }

  public multiSortKey = 'ctrl';
  public rowDragManaged = false;
  public rowHeight: number;
  public getRowHeight;
  public hadRowsSelected = false;
  public rowData: any[];
  public gridParams;
  public cacheOverflowSize = 2;
  updateMode = 'live';
  public components = {
    loadingCellRenderer: (params) => {
      if (params.value) {
        return params.value;
      } else {
        return '<img src="assets/images/loading.gif">';
      }
    },
  };

  onGridReady(params) {
    this.gridParams = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.addEventListener('rowDataChanged', (e) => {
      console.log(e);
    });

    this.loadList();
  }


  /** Get data from api and push to list */
  loadList(callback?: (list: any[]) => void) {

    if (this.gridApi) {
      this.gridApi.setDatasource(this.data);

    }

  }

  onRowSelected() {
    // this.updateActionState();
    this.value = this.gridApi.getSelectedNodes().map(node => node.data);
    this.selectChange.emit(this.value);
    if (this.onChange) this.onChange(this.value);
  }

  onColumnResized() {
    this.gridApi.resetRowHeights();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.previousValue !== changes.data.currentValue) {
    }
  }

  select2Value = '';
  fieldValue: string | string[];


  isSelect(provinceId: number): boolean {
    return !this.provinceData ? false : (provinceId === this.provinceData.id);
  }

  writeValue(value: any) {
    this.value = value;
    // this.gridApi.forEachNode(node => {
    //   if (value.some(v => v.id === node.data.id)) {
    //     node.setSelected(true, false);
    //   }
    // });
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
    const changedValue = e.data;
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
