import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { PbxDomainModel } from '../../../../models/pbx-domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxModel } from '../../../../models/pbx.model';

@Component({
  selector: 'ngx-domain-form',
  templateUrl: './domain-form.component.html',
  styleUrls: ['./domain-form.component.scss']
})
export class DomainFormComponent extends DataManagerFormComponent<PbxDomainModel> implements OnInit {

  idKey = 'Id';
  apiPath = '/ivoip/domains';
  baseFormUrl = '/ivoip/domains/form';

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    // protected ref: NbDialogRef<ShowcaseDialogComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
  }

  pbxList: { Code: string, Name: string }[] = [];
  select2OptionForPbxList = {
    placeholder: 'Chọn tổng đài...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'Code',
      text: 'Description',
    },
  };

  ngOnInit() {

    this.apiService.get<PbxModel[]>('/ivoip/pbxs', {select: 'Code,Description', limit: 9999}, list => {
      this.pbxList = this.convertOptionList(list, 'Code', 'Description');
      super.ngOnInit();
    });

  }

  /** Get form data by id from api */
  getFormData(callback: (data: PbxDomainModel[]) => void) {
    this.apiService.get<PbxDomainModel[]>(this.apiPath, { id: this.id, includeDomains: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: PbxDomainModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      DomainId: [''],
      Pbx: ['', Validators.required],
      DomainName: ['', Validators.required],
      // AdminKey: [''],
      Description: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxDomainModel): void {

  }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/domains/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void {

  }

}
