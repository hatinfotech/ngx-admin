import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AccMasterBookModel } from '../../../../models/accounting.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-acc-master-book-form',
  templateUrl: './acc-master-book-form.component.html',
  styleUrls: ['./acc-master-book-form.component.scss']
})
export class AccMasterBookFormComponent extends DataManagerFormComponent<AccMasterBookModel> implements OnInit {

  componentName: string = 'AccMasterBookFormComponent';
  idKey = 'Code';
  baseFormUrl = '/warehouse/book/form';
  apiPath = '/accounting/master-books';

  select2OptionForWarehouse = {
    placeholder: this.cms.translateText('Common.choose'),
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
    public rsv: RootServices,
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<AccMasterBookFormComponent>,
  ) {
    super(rsv, activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    return super.init();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: AccMasterBookModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeParent'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: AccMasterBookModel): FormGroup {
    const currrentDate = new Date();
    const newForm = this.formBuilder.group({
      Code: [''],
      Year: [currrentDate.getFullYear(), Validators.required],
      DateOfStart: ['', Validators.required],
      DateOfEnd: ['', Validators.required],
      DateOfBeginning: ['', Validators.required],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: AccMasterBookModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  async save() {
    const result = super.save();
    result.then(rs => {
      this.loadCache();
    });
    return result;
  }

}
