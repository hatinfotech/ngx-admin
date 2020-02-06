import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactModel } from '../../../../models/contact.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { BaseComponent } from '../../../../lib/base-component';
import { AllCommunityModules, Module, IDatasource, IGetRowsParams, GridApi, ColumnApi } from '@ag-grid-community/all-modules';
import { AgGridAngular } from '@ag-grid-community/angular';
import { HttpClient } from '@angular/common/http';
import { ContactModule } from '../../contact.module';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { AgGridDataManagerListComponent } from '../../../../lib/data-manager/ag-grid-data-manger-list.component';

@Component({
  selector: 'ngx-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent extends AgGridDataManagerListComponent<ContactModel, ContactFormComponent> implements OnInit {

  componentName: string = 'ContactListComponent';
  formPath = '/contact/contact/form';
  apiPath = '/contact/contacts';
  idKey = 'Code';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    private http: HttpClient,
  ) {
    super(apiService, router, commonService, dialogService, toastService);

    this.columnDefs = this.configSetting([
      {
        headerName: '#',
        width: 52,
        valueGetter: 'node.data.No',
        cellRenderer: 'loadingCellRenderer',
        sortable: false,
        // suppressMenu: true,
        pinned: 'left',
        // suppressSizeToFit: false,
      },
      {
        headerName: 'Mã',
        field: 'Code',
        width: 115,
        filter: 'agTextColumnFilter',
        // suppressMenu: true,
        pinned: 'left',
        // suppressSizeToFit: false,
        // rowDrag: true,
      },
      {
        headerName: 'Tên',
        field: 'Name',
        width: 450,
        filter: 'agTextColumnFilter',
        // suppressMenu: true,
        pinned: 'left',
        // suppressSizeToFit: false,
        // cellStyle: { 'white-space': 'normal' },
        autoHeight: true,
      },
      {
        headerName: 'Điện thoại',
        field: 'Phone',
        width: 200,
        filter: 'agNumberColumnFilter',
        filterParams: {
          filterOptions: ['equals', 'lessThan', 'greaterThan'],
          suppressAndOrCondition: true,
        },
      },
      {
        headerName: 'Email',
        field: 'Email',
        width: 200,
        filter: 'agTextColumnFilter',
        // filterParams: { values: countries() },
      },
      {
        headerName: 'Địa chỉ',
        field: 'Address',
        width: 350,
        filter: 'agTextColumnFilter',
        // filterParams: {
        //   values: ['2000', '2004', '2008', '2012']
        // }
      },
    ]);
    // this.defaultColDef = {
    //   sortable: true,
    //   resizable: true,
    //   // suppressSizeToFit: true,
    // };
    // this.rowSelection = 'multiple';
    // this.rowModelType = 'infinite';
    // this.paginationPageSize = 100;
    // this.cacheOverflowSize = 2;
    // this.maxConcurrentDatasourceRequests = 2;
    // this.infiniteInitialRowCount = 1;
    // this.maxBlocksInCache = 2;
    // this.multiSortKey = 'ctrl';
    // this.rowDragManaged = false;
    // this.rowHeight = 100;
    // this.getRowHeight = (params: {data: any}) => {
    //   return 150;
    // };
    // this.getRowNodeId = (item: { id: string }) => {
    //   return item.id;
    // };
    // this.components = {
    //   loadingCellRenderer: (params) => {
    //     if (params.value) {
    //       return params.value;
    //     } else {
    //       return '<img src="assets/images/loading.gif">';
    //     }
    //   },
    // };

  }

  ngOnInit() {
    super.ngOnInit();
    // this.apiService.get<ContactModel[]>('/contact/contacts', {}, list => this.rowData = list);
  }

  onColumnResized() {
    this.gridApi.resetRowHeights();
  }

  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      console.info(column);
      if (['0', 'Code', 'Name'].indexOf(column.getColId()) < 0) {
        allColumnIds.push(column.getColId());
      }
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  getSelectedRows() {
    return this.gridApi.getSelectedRows();
  }

  onRowSelected() {
    this.hadRowsSelected = this.getSelectedRows().length > 0;
  }

  openFormDialplog(ids?: string[]) {
    this.dialogService.open(ContactFormComponent, {
      context: {
        inputId: ids,
        onDialogSave: (newData: ContactModel[]) => {

        },
        onDialogClose: () => {

        },
      },
    });
    return false;
  }
}

function countries() {
  return [
    'United States',
    'Russia',
    'Australia',
    'Canada',
    'Norway',
    'China',
    'Zimbabwe',
    'Netherlands',
    'South Korea',
    'Croatia',
    'France',
    'Japan',
    'Hungary',
    'Germany',
    'Poland',
    'South Africa',
    'Sweden',
    'Ukraine',
    'Italy',
    'Czech Republic',
    'Austria',
    'Finland',
    'Romania',
    'Great Britain',
    'Jamaica',
    'Singapore',
    'Belarus',
    'Chile',
    'Spain',
    'Tunisia',
    'Brazil',
    'Slovakia',
    'Costa Rica',
    'Bulgaria',
    'Switzerland',
    'New Zealand',
    'Estonia',
    'Kenya',
    'Ethiopia',
    'Trinidad and Tobago',
    'Turkey',
    'Morocco',
    'Bahamas',
    'Slovenia',
    'Armenia',
    'Azerbaijan',
    'India',
    'Puerto Rico',
    'Egypt',
    'Kazakhstan',
    'Iran',
    'Georgia',
    'Lithuania',
    'Cuba',
    'Colombia',
    'Mongolia',
    'Uzbekistan',
    'North Korea',
    'Tajikistan',
    'Kyrgyzstan',
    'Greece',
    'Macedonia',
    'Moldova',
    'Chinese Taipei',
    'Indonesia',
    'Thailand',
    'Vietnam',
    'Latvia',
    'Venezuela',
    'Mexico',
    'Nigeria',
    'Qatar',
    'Serbia',
    'Serbia and Montenegro',
    'Hong Kong',
    'Denmark',
    'Portugal',
    'Argentina',
    'Afghanistan',
    'Gabon',
    'Dominican Republic',
    'Belgium',
    'Kuwait',
    'United Arab Emirates',
    'Cyprus',
    'Israel',
    'Algeria',
    'Montenegro',
    'Iceland',
    'Paraguay',
    'Cameroon',
    'Saudi Arabia',
    'Ireland',
    'Malaysia',
    'Uruguay',
    'Togo',
    'Mauritius',
    'Syria',
    'Botswana',
    'Guatemala',
    'Bahrain',
    'Grenada',
    'Uganda',
    'Sudan',
    'Ecuador',
    'Panama',
    'Eritrea',
    'Sri Lanka',
    'Mozambique',
    'Barbados'
  ];
}
function sortAndFilter(allOfTheData, sortModel, filterModel) {
  return sortData(sortModel, filterData(filterModel, allOfTheData));
}
function sortData(sortModel, data) {
  var sortPresent = sortModel && sortModel.length > 0;
  if (!sortPresent) {
    return data;
  }
  var resultOfSort = data.slice();
  resultOfSort.sort(function (a, b) {
    for (var k = 0; k < sortModel.length; k++) {
      var sortColModel = sortModel[k];
      var valueA = a[sortColModel.colId];
      var valueB = b[sortColModel.colId];
      if (valueA == valueB) {
        continue;
      }
      var sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
      if (valueA > valueB) {
        return sortDirection;
      } else {
        return sortDirection * -1;
      }
    }
    return 0;
  });
  return resultOfSort;
}
function filterData(filterModel, data) {
  var filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }
  var resultOfFilter = [];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    if (filterModel.age) {
      var age = item.age;
      var allowedAge = parseInt(filterModel.age.filter);
      if (filterModel.age.type == 'equals') {
        if (age !== allowedAge) {
          continue;
        }
      } else if (filterModel.age.type == 'lessThan') {
        if (age >= allowedAge) {
          continue;
        }
      } else {
        if (age <= allowedAge) {
          continue;
        }
      }
    }
    if (filterModel.year) {
      if (filterModel.year.values.indexOf(item.year.toString()) < 0) {
        continue;
      }
    }
    if (filterModel.country) {
      if (filterModel.country.values.indexOf(item.country) < 0) {
        continue;
      }
    }
    resultOfFilter.push(item);
  }
  return resultOfFilter;
}
