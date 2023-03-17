import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { AdsCodeModel } from '../../../../models/ads.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-ads-code-form',
  templateUrl: './ads-code-form.component.html',
  styleUrls: ['./ads-code-form.component.scss'],
})
export class AdsCodeFormComponent extends DataManagerFormComponent<AdsCodeModel> implements OnInit {

  componentName: string = 'AdsCodeFormComponent';
  idKey = 'Code';
  apiPath = '/ads/codes';
  baseFormUrl = '/ads/code/form';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<AdsCodeFormComponent>,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
  }

  getRequestId(callback: (id?: string[]) => void) {
    callback(this.inputId);
  }

  select2ParamsOption = {
    placeholder: 'Brandname...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    multiple: true,
    tags: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  /** Execute api get */
  executeGet(params: any, success: (resources: AdsCodeModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    // params['includeUsers'] = true;
    super.executeGet(params, adsList => {
      adsList.forEach(ads => {
        ads.Embed = `<div class="oads"></div><script>
(function(){
console.log('debug');
var oads = document.getElementsByClassName( 'oads' );
console.log(oads);
oads = oads[ oads.length - 1 ];
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4){
        oads.innerHTML = xhr.responseText;
    }
};
xhr.open('GET', 'https://core.opersol.com/Ads/Content/get?code=${ads.Code}');
xhr.send();
})();
</script>`;
      });
      success(adsList);
    }, error);
  }

  makeNewFormGroup(data?: AdsCodeModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Type: ['WEBSITE', Validators.required],
      Area: [''],
      Site: [''],
      Embed: [''],
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: AdsCodeModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/ads/content/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

}
