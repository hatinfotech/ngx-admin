import { DataManagerFormComponent } from '../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../services/common.service';
import { OnInit } from '@angular/core';
import { WebHostingService } from './web-hosting-service';

export abstract class WebHostingBaseFormComponent<M> extends DataManagerFormComponent<M> implements OnInit {

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public webHostingService: WebHostingService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  // get activePbxDoamin() {
  //   return this.ivoipService ? this.ivoipService.getPbxActiveDomainUuid() : '';
  // }

  // /** Execute api get */
  // executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void) {
  //   params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
  //   super.executeGet(params, success, error);
  // }

  // /** Execute api put */
  // executePut(params: any, data: M[], success: (data: M[]) => void, error: (e: any) => void) {
  //   params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
  //   super.executePut(params, data, success, error);
  // }

  // /** Execute api post */
  // executePost(params: any, data: M[], success: (data: M[]) => void, error: (e: any) => void) {
  //   params['domainId'] = this.ivoipService.getPbxActiveDomainUuid();
  //   super.executePost(params, data, success, error);
  // }

}
