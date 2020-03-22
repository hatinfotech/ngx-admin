import { Component, OnInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../../lib/data-manager/data-manager-form.component';
import { CrawlPlanModel, CrawlPlanStoreModel, CrawlPlanBotModel, CrawlServerModel } from '../../../../models/crawl.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../../services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WpSiteModel } from '../../../../models/wordpress.model';
import { MySocket } from '../../../../lib/nam-socket/my-socket';
import { CrawlService } from '../../crawl.service';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-crawl-plan-form',
  templateUrl: './crawl-plan-form.component.html',
  styleUrls: ['./crawl-plan-form.component.scss'],
})
export class CrawlPlanFormComponent extends DataManagerFormComponent<CrawlPlanModel> implements OnInit {

  componentName: string = 'CrawlPlanFormComponent';
  idKey = 'Code';
  apiPath = '/crawl/plans';
  baseFormUrl = '/crawl/plan/form';

  wpSiteList: WpSiteModel[] = [];
  botList: CrawlServerModel[] = [];

  constructor(
    protected activeRoute: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected apiService: ApiService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected commonService: CommonService,
    protected ref: NbDialogRef<CrawlPlanFormComponent>,
    protected service: CrawlService,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, commonService);
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

  async ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init(): Promise<boolean> {
    // Load option data first
    this.wpSiteList = await this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { limit: 99999999 });
    this.botList = await this.apiService.getPromise<WpSiteModel[]>('/crawl/servers', { limit: 99999999 });

    // Parent init
    return super.init();
  }

  formLoad(formData: CrawlPlanModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: CrawlPlanModel) => void) {
    super.formLoad(formData, (index, newForm, itemFormData) => {

      // Components form load
      if (itemFormData.Stores) itemFormData.Stores.forEach(component => {
        const storeFormGroup = this.makeNewStoreFormGroup(component);
        (newForm.get('Stores') as FormArray).push(storeFormGroup);
        // this.onAddSyncTargetFormGroup(componentFormGroup);
      });

      // Components form load
      if (itemFormData.Bots) itemFormData.Bots.forEach(bot => {
        const botFormGroup = this.makeNewBotFormGroup(bot);
        (newForm.get('Bots') as FormArray).push(botFormGroup);
        // this.onAddSyncTargetFormGroup(componentFormGroup);
      });

    });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: CrawlPlanModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeStores'] = true;
    params['includeBots'] = true;
    super.executeGet(params, success, error);
  }

  makeNewFormGroup(data?: CrawlPlanModel): FormGroup {
    const newForm = this.formBuilder.group({

      Code: [''],
      Description: ['', Validators.required],
      TargetUrl: ['', Validators.required],
      TargetTitlePath: ['', Validators.required],
      TargetDescriptionPath: ['', Validators.required],
      TargetCreatedPath: [''],
      TargetCategoriesPath: [''],
      TargetFeatureImagePath: [''],
      TargetAuthorPath: [''],
      TargetContentPath: ['', Validators.required],
      TargetImageSrc: [''],
      Frequency: [''],
      State: ['INSTANT'],
      Stores: this.formBuilder.array([

      ]),
      Bots: this.formBuilder.array([

      ]),
    });
    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }
  onAddFormGroup(index: number, newForm: FormGroup, formData?: CrawlPlanModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  makeNewStoreFormGroup(data?: CrawlPlanStoreModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Site: ['', Validators.required],
      Active: [''],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  getStores(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Stores') as FormArray;
  }

  addStoreFormGroup(formGroupIndex: number, index: number, newFormGroup: FormGroup) {
    const component = this.makeNewStoreFormGroup();
    this.getStores(formGroupIndex).push(component);
    this.onAddStoreFormGroup(formGroupIndex, index, newFormGroup);
    return false;
  }

  onAddStoreFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.getStores(mainIndex).push([]);
  }

  removeStoreGroup(formGroupIndex: number, index: number) {
    this.getStores(formGroupIndex).removeAt(index);
    return false;
  }

  makeNewBotFormGroup(data?: CrawlPlanBotModel): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      Bot: ['', Validators.required],
      IsMain: [''],
      Active: [''],
    });

    if (data) {
      newForm.patchValue(data);
    }
    return newForm;
  }

  getBots(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('Bots') as FormArray;
  }

  addBotFormGroup(formGroupIndex: number, index: number, newFormGroup: FormGroup) {
    const component = this.makeNewBotFormGroup();
    this.getBots(formGroupIndex).push(component);
    this.onAddBotFormGroup(formGroupIndex, index, newFormGroup);
    return false;
  }

  onAddBotFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.getStores(mainIndex).push([]);
  }

  removeBotGroup(formGroupIndex: number, index: number) {
    this.getBots(formGroupIndex).removeAt(index);
    return false;
  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/wordpress/wp-site/list']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  onTestCrawlClick(formItem: FormGroup) {
    this.testCrawl(formItem);
    return false;
  }

  async testCrawl(formItem: FormGroup) {
    const formData: CrawlPlanModel = formItem.value;
    console.log('Test crawl', formItem.value);

    const mainBot = formData.Bots.filter(bot => bot.IsMain)[0];
    console.log('Main bot', mainBot);

    const botInfo = (await this.apiService.getPromise<CrawlServerModel[]>('/crawl/servers', { id: mainBot.Bot }))[0];
    if (botInfo) {
      const botSocket = await this.service.getBotSocket(botInfo.ApiUrl);
      // subscription.unsubscribe();
      console.log('Main bot socket connected');
      botSocket.emit<any>('test-crawl', formData, 300000).then(post => {
        console.log('emit callback', post);
        this.dialogService.open(ShowcaseDialogComponent, {
          context: {
            title: 'Crawl preview',
            content: `Hình đại diện: <br><img src="${post.featured_media}" /><p>${post.description}</p><br>${post.content}`,
            actions: [
              {
                label: 'Trở về',
                icon: 'back',
                status: 'info',
                action: () => { },
              },
            ],
          },
        });
      });

    }

    return false;
  }

  onStartCrawlClick(formItem: FormGroup) {
    const plan: CrawlPlanModel = formItem.value;
    this.startCrawl(plan);
    return false;
  }

  async startCrawl(crawlPlan: CrawlPlanModel) {
    await this.save();
    // const formData: CrawlPlanModel = formItem.value;
    console.log('Start crawl', crawlPlan);

    crawlPlan.Bots.forEach(async bot => {

      // const mainBot = crawlPlan.Bots.filter(bot => bot.IsMain)[0];
      console.log('Main bot', bot);

      const botInfo = (await this.apiService.getPromise<CrawlServerModel[]>('/crawl/servers', { id: bot.Bot }))[0];
      if (botInfo) {
        const botSocket = await this.service.getBotSocket(botInfo.ApiUrl);
        if (bot.Active) {
          // subscription.unsubscribe();
          console.log('Main bot socket connected');

          const planInfo: CrawlPlanModel = JSON.parse(JSON.stringify(crawlPlan));
          delete planInfo.Bots;

          // Prepare store sites
          const storeSiteInfo = await this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { id: planInfo.Stores.map(store => store.Site) });
          for (let s = 0; s < planInfo.Stores.length; s++) {
            planInfo.Stores[s].Site = storeSiteInfo.filter(site => site.Code === planInfo.Stores[s].Site)[0];
          }

          // Emit command
          botSocket.emit<CrawlPlanModel>('start-crawl', planInfo, 300000).then(post => {
            console.log('emit callback', post);
          });
        } else {
          // Emit command
          botSocket.emit<string>('stop-crawl', bot.Bot, 300000).then(post => {
            console.log('emit callback', post);
          });
        }
      }
    });
    return false;
  }

  onStopCrawlClick(formItem: FormGroup) {
    this.stopCrawl(formItem.value);
    return false;
  }

  async stopCrawl(crawlPlan: CrawlPlanModel) {
    // const formData: CrawlPlanModel = formItem.value;
    console.log('Stop crawl', crawlPlan);

    crawlPlan.Bots.forEach(async bot => {
      // const mainBot = crawlPlan.Bots.filter(bot => bot.IsMain)[0];
      console.log('Main bot', bot);

      const botInfo = (await this.apiService.getPromise<CrawlServerModel[]>('/crawl/servers', { id: bot.Bot }))[0];
      if (botInfo) {
        const botSocket = await this.service.getBotSocket(botInfo.ApiUrl);
        // subscription.unsubscribe();
        console.log('Main bot socket connected');

        const planInfo: CrawlPlanModel = JSON.parse(JSON.stringify(crawlPlan));
        // delete planInfo.Bots;

        // Prepare store sites
        // const storeSiteInfo = await this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { id: planInfo.Stores.map(store => store.Site) });
        // for (let s = 0; s < planInfo.Stores.length; s++) {
        //   planInfo.Stores[s].Site = storeSiteInfo.filter(site => site.Code === planInfo.Stores[s].Site)[0];
        // }

        // Emit command
        botSocket.emit<string>('stop-crawl', planInfo.Code, 300000).then(status => {
          console.log('emit callback', status);
        });

      }
    });

    return false;
  }
}
