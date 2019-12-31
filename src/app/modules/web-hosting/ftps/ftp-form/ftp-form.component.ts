import { Component, OnInit } from '@angular/core';
import { WebHostingBaseFormComponent } from '../../web-hosting-base-form.component';
import { WhFtpModel } from '../../../../models/wh-ftp.model';
import { WhDatabaseUserModel } from '../../../../models/wh-database-user.model';
import { WhWebsiteModel } from '../../../../models/wh-website.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { WebHostingService } from '../../web-hosting-service';
import { HttpErrorResponse } from '@angular/common/http';

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
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    public webHostingService: WebHostingService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService, webHostingService);
  }

  ngOnInit() {
    this.restrict();

    this.apiService.get<WhWebsiteModel[]>('/web-hosting/websites', {}, websites => {
      this.websiteList = this.convertOptionList(websites, 'domain_id', 'domain');

      super.ngOnInit();
    });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WhFtpModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: WhFtpModel): FormGroup {
    const newForm = this.formBuilder.group({
      ftp_user_id: [''],
      hosting: [''],
      parent_domain_id: [''],
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
