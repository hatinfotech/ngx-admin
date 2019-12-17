import { DataManagerFormComponent } from '../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../services/common.service';
import { IvoipService } from './ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { OnInit } from '@angular/core';

export abstract class IvoipBaseFormComponent<M> extends DataManagerFormComponent<M> implements OnInit {

  domainList: { id?: string, text: string, children: any[] }[] = [];
  select2OptionForDoaminList = this.ivoipService.getDomainListOption();
  // activePbxDoamin: string;



  userRecordActionList: { id: string, text: string }[] = [
    {
      id: 'all',
      text: 'Tất cả',
    },
    {
      id: 'local',
      text: 'Nội bộ',
    },
    {
      id: 'inbound',
      text: 'Gọi vào',
    },
    {
      id: 'outbound',
      text: 'Gọi ra',
    },
    {
      id: '',
      text: 'Không ghi âm',
    },
  ];
  select2OptionForUserRecordActionList = {
    placeholder: 'Chọn kểu ghi âm...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    protected ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  ngOnInit() {
    this.ivoipService.loadDomainList(domains => {
      this.domainList = domains;
      // this.activePbxDoamin = this.ivoipService.getPbxActiveDomain();
      super.ngOnInit();
    });
  }

  get activePbxDoamin() {
    return this.ivoipService ? this.ivoipService.getPbxActiveDomainUuid() : '';
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    super.executeGet(params, success, error);
  }

  /** Execute api put */
  executePut(params: any, data: M[], success: (data: M[]) => void, error: (e: any) => void) {
    params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    super.executePut(params, data, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: M[], success: (data: M[]) => void, error: (e: any) => void) {
    params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
    super.executePost(params, data, success, error);
  }

}
