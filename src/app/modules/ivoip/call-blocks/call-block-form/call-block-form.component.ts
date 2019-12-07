import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { UserGroupModel } from '../../../../models/user-group.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { UserModel } from '../../../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PbxCallBlockModel } from '../../../../models/pbx-call-block.model';

@Component({
  selector: 'ngx-call-block-form',
  templateUrl: './call-block-form.component.html',
  styleUrls: ['./call-block-form.component.scss']
})
export class CallBlockFormComponent extends DataManagerFormComponent<PbxCallBlockModel> implements OnInit {

  idKey = 'call_block_uuid';
  apiPath = '/ivoip/call-blocks';
  baseFormUrl = '/ivoip/call-blocks/form';

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
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


  ngOnInit() {
    super.ngOnInit();
    this.blockActions = [
      {
        id: 'Reject',
        text: 'Reject',
        Code: 'Reject',
        Name: 'Reject',
      },
      {
        id: 'Busy',
        text: 'Busy',
        Code: 'Busy',
        Name: 'Busy',
      },
      {
        id: 'Hold',
        text: 'Hold',
        Code: 'Hold',
        Name: 'Hold',
      },
    ];
  }

  /** Get form data by id from api */
  getFormData(callback: (data: PbxCallBlockModel[]) => void) {
    this.apiService.get<PbxCallBlockModel[]>(this.apiPath, { id: this.id, multi: true, includeUsers: true },
      data => callback(data),
    ), (e: HttpErrorResponse) => {
      this.onError(e);
    };
  }

  makeNewFormGroup(data?: PbxCallBlockModel): FormGroup {
    const newForm = this.formBuilder.group({
      // call_block_uuid_old: [''],
      call_block_uuid: [''],
      call_block_name: [''],
      call_block_number: ['', Validators.required],
      call_block_action: [''],
      call_block_enabled: [''],
    });
    if (data) {
      //   data[this.idKey + '_old'] = data[this.idKey];
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: PbxCallBlockModel): void { }
  onRemoveFormGroup(index: number): void {

  }
  goback(): false {
    this.router.navigate(['/ivoip/call-blocks/list']);
    return false;
  }
  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
