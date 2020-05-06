import { Component, OnInit } from '@angular/core';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { IvoipBaseListComponent } from '../../ivoip-base-list.component';
import { IvoipService } from '../../ivoip-service';
import { PbxModel } from '../../../../models/pbx.model';

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
    protected apiService: ApiService,
    public router: Router,
    protected common: CommonService,
    protected dialogService: NbDialogService,
    protected toastService: NbToastrService,
    public ivoipService: IvoipService,
  ) {
    super(apiService, router, common, dialogService, toastService, ivoipService);
    // this.apiPath = '/user/groups';
    // this.idKey = 'Code';
  }

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
      perPage: 9999999,
    },
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
        filterFunction: (value: string, query: string) => this.common.smartFilter(value, query),
      },
    },
  };

  ngOnInit() {
    this.restrict();
    this.ivoipService.getPbxList(pbxList => {

      this.pbxList = this.commonService.convertOptionList(pbxList, 'Code', 'Description');
      this.activePbx = this.ivoipService.getActivePbx();
      super.ngOnInit();

    });
  }

  initDataSource() {
    const source = super.initDataSource();

    // Set DataSource: prepareData
    source.prepareData = (data: any[]) => {
      data.forEach(item => {
        item.PbxDescription = this.pbxList.find(pbx => pbx.id === item.Pbx).text;
      });
      return data;
    };

    // Set DataSource: prepareParams
    // source.prepareParams = (params: any) => {
    //   params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    //   return params;
    // };

    return source;
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

      this.pbxList = this.commonService.convertOptionList(pbxList, 'Code', 'Description');
      this.activePbx = this.ivoipService.getActivePbx();
      this.loadList();

    }, true);
    return false;
  }


}
