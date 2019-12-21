import { Component, OnInit } from '@angular/core';
import { IvoipBaseFormComponent } from '../../ivoip-base-form.component';
import { PbxGatewayModel } from '../../../../models/pbx-gateway.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { IvoipService } from '../../ivoip-service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';

@Component({
  selector: 'ngx-gateway-form',
  templateUrl: './gateway-form.component.html',
  styleUrls: ['./gateway-form.component.scss'],
})
export class GatewayFormComponent extends IvoipBaseFormComponent<PbxGatewayModel> implements OnInit {

  idKey = 'gateway_uuid';
  apiPath = '/ivoip/gateways';
  baseFormUrl = '/ivoip/gateways/form';

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public ivoipService: IvoipService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, ivoipService);
  }

  blockActions: { id: string, text: string, Code: string, Name: string }[];
  select2OptionForBlockActions = {
    placeholder: 'Chọn kiểu chặn...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
  };

  privateActiveDmain: string;
  privateDmainList: {
    id: string,
    text: string,
    domain: PbxDomainModel,
  }[] = [];
  privateDmainListConfig = {
    placeholder: 'Global',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'DomainId',
      text: 'DomainName',
    },
  };

  profileList: {id?: string, text: string}[] = [];

  ngOnInit() {
    this.ivoipService.getActiveDomainList(domainList => {
      this.privateDmainList = this.convertOptionList(domainList, 'DomainId', 'DomainName');
      super.ngOnInit();
    });
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: PbxGatewayModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: PbxGatewayModel): FormGroup {
    const newForm = this.formBuilder.group({
      gateway_uuid: [''],
      domain_uuid: [],
      gateway: ['', Validators.required],
      username: [''],
      register_transport: ['udp'],
      password: [''],
      distinct_to: [''],
      caller_id_in_from: ['true', Validators.required],
      proxy: ['', Validators.required],
      realm: [''],
      from_domain: [''],
      from_user: [''],
      expire_seconds: [800],
      register: ['false'],
      retry_seconds: [30],
      context: ['public', Validators.required],
      profile: ['external', Validators.required],
      description: [''],
      enabled: [true],
    });
    if (data) {
      //   data[this.idKey + '_old'] = data[this.idKey];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxGatewayModel): void { }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/gateways/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
