import { Component, OnInit } from '@angular/core';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { PbxCustomerModel } from '../../../../models/pbx-customer.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipService } from '../../ivoip-service';

@Component({
  selector: 'ngx-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent extends IvoipBaseListComponent<PbxCustomerModel> implements OnInit {

  componentName: string = 'CustomerListComponent';
  formPath = '/ivoip/customers/form';
  apiPath = '/ivoip/customers';
  idKey = 'Code';

  constructor(
    protected apiService: ApiService,
    public router: Router,
    protected commonService: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, commonService, dialogService, toastService, ivoipService);
  }

  editing = {};
  rows = [];

  settings = {
    mode: 'external',
    selectMode: 'multi',
    actions: {
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 100,
    },
    columns: {
      No: {
        title: 'Stt',
        type: 'string',
        width: '10%',
      },
      Code: {
        title: 'Mã',
        type: 'string',
        width: '10%',
      },
      Name: {
        title: 'Tên',
        type: 'string',
        width: '20%',
      },
      Phone: {
        title: 'Số điện thoại',
        type: 'string',
        width: '10%',
      },
      Email: {
        title: 'Số Public',
        type: 'string',
        width: '10%',
      },
      Pbx: {
        title: 'Tổng đài',
        type: 'string',
        width: '20%',
      },
      Domain: {
        title: 'Domain',
        type: 'string',
        width: '20%',
      },
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

}
