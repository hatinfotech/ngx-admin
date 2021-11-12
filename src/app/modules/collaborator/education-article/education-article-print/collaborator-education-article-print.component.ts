import { Component, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { ProcessMap } from '../../../../models/process-map.model';
import { AppModule } from '../../../../app.module';
import { CollaboratorEducationArticleFormComponent } from '../education-article-form/collaborator-education-article-form.component';
import { CollaboratorEducationArticleModel } from '../../../../models/collaborator.model';

@Component({
  selector: 'ngx-collaborator-education-article-print',
  templateUrl: './collaborator-education-article-print.component.html',
  styleUrls: ['./collaborator-education-article-print.component.scss'],
})
export class CollaboratorEducationArticlePrintComponent extends DataManagerPrintComponent<CollaboratorEducationArticleModel> implements OnInit {

  /** Component name */
  componentName = 'CollaboratorEducationArticlePrintComponent';
  title: string = '';
  env = environment;
  apiPath = '/collaborator/education-articles';
  processMapList: ProcessMap[] = [];
  formDialog = CollaboratorEducationArticleFormComponent;
  idKey = ['Code', 'Page'];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CollaboratorEducationArticlePrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(commonService, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: CollaboratorEducationArticleModel) {
    return `PhieuMuaHang_${this.getIdentified(data).join('-')}` + (data.DateOfCreated ? ('_' + this.datePipe.transform(data.DateOfCreated, 'short')) : '');
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any) {
    if (value && value['text']) {
      return value['text'];
    }
    return value;
  }

  saveAndClose() {
    if (this.onSaveAndClose) {
      // this.onSaveAndClose(this.data.Code);
    }
    this.close();
    return false;
  }

  exportExcel(type: string) {
    this.close();
    return false;
  }

  get identifier() {
    // return this.data.Code;
    return '';
  }
  
  async getFormData(ids: string[]) {
    return this.apiService.getPromise<CollaboratorEducationArticleModel[]>(this.apiPath, { id: ids, includePage: true, includeProduct: true }).then(data => {
      this.summaryCalculate(data);
      return data;
    });
  }


  getItemDescription(item: CollaboratorEducationArticleModel) {
    return item?.Title;
  }

  summaryCalculate(data: CollaboratorEducationArticleModel[]) {
    for (const i in data) {
      const item = data[i];
      this.processMapList[i] = AppModule.processMaps.collaboratorEdutcationArticle[item.State || ''];
    }
    return data;
  }

}
