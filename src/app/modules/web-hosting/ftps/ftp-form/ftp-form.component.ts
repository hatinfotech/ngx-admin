import { Component, OnInit } from '@angular/core';
import { WebHostingBaseFormComponent } from '../../web-hosting-base-form.component';
import { WhFtpModel } from '../../../../models/wh-ftp.model';
import { WhWebsiteModel } from '../../../../models/wh-website.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { WebHostingService } from '../../web-hosting-service';
import { HttpErrorResponse } from '@angular/common/http';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-ftp-form',
  templateUrl: './ftp-form.component.html',
  styleUrls: ['./ftp-form.component.scss'],
})
export class FtpFormComponent extends WebHostingBaseFormComponent<WhFtpModel> implements OnInit {

  componentName: string = 'FtpFormComponent';
  idKey = 'ftp_user_id';
  apiPath = '/web-hosting/ftps';
  baseFormUrl = '/web-hosting/ftps/form';

  websiteList: WhWebsiteModel[] = [];
  websiteListConfig = {
    placeholder: 'Chọn website...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'domain_id',
      text: 'domain',
    },
  };

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
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms, webHostingService);
  }

  async ngOnInit() {
    this.restrict();
    this.websiteList = this.convertOptionList(await this.webHostingService.getWebsiteList(), 'domain_id', 'domain');
    super.ngOnInit();
    // this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', {}, websites => {
    //   this.websiteList = this.convertOptionList(websites, 'domain_id', 'domain');

    //   super.ngOnInit();
    // });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WhFtpModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WhFtpModel): FormGroup {
    const newForm = this.formBuilder.group({
      ftp_user_id: [''],
      hosting: [this.webHostingService ? this.webHostingService.activeHosting : '', Validators.required],
      parent_domain_id: ['', Validators.required],
      username: [''],
      password: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: WhFtpModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/web-hosting/ftps/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
