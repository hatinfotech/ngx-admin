import { DataManagerFormComponent } from '../../lib/data-manager/data-manager-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../services/common.service';
import { Component, OnInit } from '@angular/core';
import { WebHostingService } from './web-hosting-service';
import { HttpErrorResponse } from '@angular/common/http';
import { RootServices } from '../../services/root.services';

@Component({template: ''})
export abstract class WebHostingBaseFormComponent<M> extends DataManagerFormComponent<M> implements OnInit {

  constructor(
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public webHostingService: WebHostingService,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: M[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['hosting'] = this.webHostingService.activeHosting;
    super.executeGet(params, success, error);
  }

  /** Execute api put */
  executePut(params: any, data: M[], success: (data: M[]) => void, error: (e: any) => void) {
    params['hosting'] = this.webHostingService.activeHosting;
    super.executePut(params, data, success, error);
  }

  /** Execute api post */
  executePost(params: any, data: M[], success: (data: M[]) => void, error: (e: any) => void) {
    params['hosting'] = this.webHostingService.activeHosting;
    super.executePost(params, data, success, error);
  }

}
