import { Component, OnInit } from '@angular/core';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ApiService } from '../../../../services/api.service';
import { RootServices } from '../../../../services/root.services';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { IvoipService } from '../../ivoip-service';
import { PbxModel } from '../../../../models/pbx.model';
import { DomainFormComponent } from '../domain-form/domain-form.component';
import { SmartTableSetting } from '../../../../lib/data-manager/data-manger-list.component';

@Component({
  selector: 'ngx-domain-list',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss'],
})
export class DomainListComponent extends IvoipBaseListComponent<PbxDomainModel> implements OnInit {

  componentName = 'DomainListComponent';
  formPath: string = '/ivoip/domains/form';
  apiPath: string = '/ivoip/domains';
  idKey: string = 'Id';
  formDialog = DomainFormComponent;

  activePbx: string;
  pbxList: { id: string, text: string }[] = [];
  pbxListConfig = {
    placeholder: 'Chọn tổng đài...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Description',
    },
  };

  constructor(
    public rsv: RootServices,
    public apiService: ApiService,
    public router: Router,
    public cms: CommonService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(rsv, apiService, router, cms, dialogService, toastService, ivoipService);
    // this.apiPath = '/user/groups';
    // this.idKey = 'Code';
  }

  loadListSetting(): SmartTableSetting {
    return this.configSetting({
      mode: 'external',
      selectMode: 'multi',
      actions: {
        position: 'right',
      },
      // add: {
      //   addButtonContent: '<i class="nb-edit"></i> <i class="nb-trash"></i> <i class="nb-plus"></i>',
      //   createButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // edit: {
      //   editButtonContent: '<i class="nb-edit"></i>',
      //   saveButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // delete: {
      //   deleteButtonContent: '<i class="nb-trash"></i>',
      //   confirmDelete: true,
      // },
      // pager: {
      //   display: true,
      //   perPage: 9999999,
      // },
      columns: {
        No: {
          title: 'Stt',
          type: 'text',
          width: '5%',
          class: 'no',
          filter: false,
        },
        PbxDescription: {
          title: 'Tổng đài',
          type: 'string',
          width: '30%',
        },
        DomainName: {
          title: 'Domain',
          type: 'string',
          width: '30%',
        },
        Description: {
          title: 'Mô tả',
          type: 'string',
          width: '40%',
          filterFunction: (value: string, query: string) => this.cms.smartFilter(value, query),
        },
      },
    });
  }

  ngOnInit() {
    this.restrict();
    this.ivoipService.getPbxList(pbxList => {

      this.pbxList = this.cms.convertOptionList(pbxList, 'Code', 'Description');
      this.activePbx = this.ivoipService.getActivePbx();
      super.ngOnInit();

    });
  }

  async init() {
    const rs = await super.init();
    // Extend action control list
    this.actionButtonList.splice(0, 1, {
      type: 'select2',
      name: 'pbx',
      status: 'success',
      label: 'Tạo',
      icon: 'plus',
      title: this.cms.textTransform(this.cms.translate.instant('Common.selectPbx'), 'head-title'),
      size: 'medium',
      select2: { data: this.pbxList, option: this.pbxListConfig },
      value: this.activePbx,
      change: (value: any, option: any) => {
        this.onChangePbx(value);
      },
      disabled: () => {
        return false;
      },
      click: () => {
        this.gotoForm();
        return false;
      },
    });
    return rs;
  }

  getList(callback: (list: PbxDomainModel[]) => void) {
    this.apiService.get<PbxDomainModel[]>(this.apiPath, { limit: 999999999, offset: 0, includePbxDescription: true, belongTopPbx: this.ivoipService.getActivePbx() }, results => callback(results));
  }

  onDeclareNewDomainForPbx(): false {

    return false;
  }

  onChangePbx(event: PbxModel) {
    this.ivoipService.onChangePbx(event);
    this.loadList();
  }

  onReloadBtnClick(): false {
    this.ivoipService.getPbxList(pbxList => {

      this.pbxList = this.cms.convertOptionList(pbxList, 'Code', 'Description');
      this.activePbx = this.ivoipService.getActivePbx();
      this.loadList();

    }, true);
    return false;
  }


}
