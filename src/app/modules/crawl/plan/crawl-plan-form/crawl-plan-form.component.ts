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
import { CrawlService } from '../../crawl.service';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { takeUntil } from 'rxjs/operators';

export interface CrawlLog {
  plan: string;
  bot: string;
  message: string;
  status: { state: string };
  type: string;
}

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
  silent = true;

  wpSiteList: WpSiteModel[] = [];
  botList: CrawlServerModel[] = [];
  // strategyList: {id: string, text: string}[] = [];

  select2ProxiesOption = {
    placeholder: 'Chọn...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: false,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/network/proxies', { filter_Name: params['term'], filter_Enabled: true });
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = `${item['Description']} (${item['Host']}:${item['Port']})`;
            return item;
          }),
        };
      },
    },
  };

  select2AllowPathOption = {
    placeholder: 'Chọn...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  select2DenyPathOption = {
    placeholder: 'Chọn...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    tags: true,
    multiple: true,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  };

  crawlAlgorithmList: { id: string, text: string }[] = [];

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public commonService: CommonService,
    public ref: NbDialogRef<CrawlPlanFormComponent>,
    public service: CrawlService,
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
    const mainSocket = await this.commonService.getMainSocket();
    const crawlAlgorithms = await mainSocket.emit<{ id: string, text: string }[]>('crawl/get-algorithms', {});
    this.crawlAlgorithmList = crawlAlgorithms;
    const result = await super.init();
    mainSocket.on<CrawlLog>('crawl/log').pipe(takeUntil(this.destroy$)).subscribe(log => {
      console.log(log);
    });
    return result;
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
      TargetTitlePath: ['title=>text', Validators.required],
      TargetDescriptionPath: ['meta[property="og:title"]=>attr.content', Validators.required],
      TargetCreatedPath: ['meta[property="article:published_time"]=>attr.content'],
      TargetCategoriesPath: ['meta[property="article:section"]=>attr.content'],
      TargetFeatureImagePath: ['meta[property="og:image"]=>attr.content'],
      TargetAuthorPath: [''],
      TargetContentPath: ['', Validators.required],
      TargetImageSrc: ['src'],
      ExcludeContentElements: [''],
      Frequency: ['60'],
      Strategy: ['CRAWLNEW'],
      RequestHeaders: [''],
      State: ['INSTANT'],
      LastPublished: [''],
      DefaultCategory: [''],
      NumOfThread: [1],
      Proxies: [''],
      CrawlAlgorithm: ['CrawlBot', Validators.required],

      AllowPaths: [''],
      DenyPaths: [''],

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
      State: [''],
    });

    if (data) {
      newForm.patchValue(data);
      if (data.Bot) {
        this.commonService.getMainSocket().then(async mainSocket => {
          const botInfo = (await this.apiService.getPromise<CrawlServerModel[]>('/crawl/servers', { id: data.Bot }))[0];
          if (botInfo) {
            await mainSocket.emit<{ state: string, lastLog: string }>('crawl/init', botInfo);
            this.getCrawlStatus(this.array.controls[0] as FormGroup, data.Bot as string).then(status => {
              console.log(status);
              newForm.get('State').setValue(status.state);
            });
            mainSocket.on<CrawlLog>('crawl/log').pipe(takeUntil(this.destroy$)).subscribe(log => {
              if (log && log.data.plan === data.Plan && log.data.bot === data.Bot as string) {
                console.log(log);
                if (log.data.status) {
                  newForm.get('State').setValue(log.data.status.state);
                }
              }
            });
          }
        });
      }
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

  onTestCrawlClick(event: any, formItem: FormGroup, botForm: FormGroup, botCode: string) {
    const button = event.currentTarget;
    button.disabled = true;
    botForm.get('State').setValue('Testing');
    this.testCrawl(formItem, botCode).then((rs) => {
      button.disabled = false;
      botForm.get('State').setValue('Test complete');
    }).catch(e => {
      button.disabled = false;
      botForm.get('State').setValue('Test error');
    });
    return false;
  }

  async testCrawl(formItem: FormGroup, botCode: string) {
    const crawlPlan: CrawlPlanModel = JSON.parse(JSON.stringify(formItem.value));
    console.log('Test crawl', formItem.value);

    // Get crawl bots
    // const bots: CrawlPlanBotModel[] = botCode ? crawlPlan.Bots.filter(b => b.Bot === botCode) : crawlPlan.Bots;

    const mainBot = crawlPlan.Bots.filter(bot => botCode === bot.Bot)[0];
    const botInfo = (await this.apiService.getPromise<CrawlServerModel[]>('/crawl/servers', { id: mainBot.Bot }))[0];
    crawlPlan.Bots = [
      { Bot: botInfo, IsMain: true },
    ];
    console.log('Main bot', mainBot);
    if (botInfo) {
      return new Promise<any>(async (resolve, reject) => {
        const mainSocket = await this.commonService.getMainSocket();
        await mainSocket.emit<any>('crawl/init', botInfo);
        mainSocket.emit<any>('crawl/test-crawl', { bot: botInfo, plan: crawlPlan }, 300000).then(post => {
          console.log(post);
          const content = typeof post.content === 'object' ? post.content.join('<br>') : post.content;
          this.dialogService.open(ShowcaseDialogComponent, {
            context: {
              title: 'Crawl preview',
              content: `Categories : ${post.categories} <br>Hình đại diện: <br><img src="${post.featured_media}" /><p>${post.description}</p><br>${content}`,
              actions: [
                {
                  label: 'Trở về',
                  icon: 'back',
                  status: 'info',
                  action: () => { },
                },
              ],
            },
            hasScroll: true,
            closeOnEsc: true,
          });
          resolve(post);
        });
      });
    }
    return false;
  }

  onStartCrawlClick(event: any, planForm: FormGroup, botForm: FormGroup, botCode: string) {
    const button = event.currentTarget;
    button.disabled = true;
    botForm.get('State').setValue('Starting');
    this.startCrawl(planForm, botCode).then(rs => {
      button.disabled = false;
      botForm.get('State').setValue('Running');
    }).catch(e => {
      button.disabled = false;
      botForm.get('State').setValue('Start error');
    });

    return false;
  }

  async startCrawl(formItem: FormGroup, botCode: string) {
    try {
      const crawlPlan: CrawlPlanModel = formItem.value;
      console.log('Start crawl', crawlPlan);

      const botInfo = (await this.apiService.getPromise<CrawlServerModel[]>('/crawl/servers', { id: botCode }))[0];

      if (botInfo) {
        const mainSocket = await this.commonService.getMainSocket();
        await mainSocket.emit<any>('crawl/init', botInfo);
        console.log('Main bot socket connected');

        const planInfo: CrawlPlanModel = JSON.parse(JSON.stringify(crawlPlan));
        planInfo.Bots = [
          {
            Bot: botInfo,
          },
        ];

        // Prepare store sites
        const storeSiteInfo = await this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { id: planInfo.Stores.map(store => store.Site) });
        planInfo.Stores = planInfo.Stores.filter(store => {
          if (store.Active) {
            store.Site = storeSiteInfo.filter(site => site.Code === store.Site)[0];
            return true;
          }
          return false;
        });
        // for (let s = 0; s < planInfo.Stores.length; s++) {
        //   if (planInfo.Stores[s].Active) {
        //     planInfo.Stores[s].Site = storeSiteInfo.filter(site => site.Code === planInfo.Stores[s].Site)[0];
        //   } else {

        //   }
        // }

        return mainSocket.emit<{ state: string }>('crawl/start-crawl', { bot: botInfo, plan: planInfo }, 300000).then(status => {
          console.info(status);
        }).catch(e => {
          console.error(e);
        });

      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  onStopCrawlClick(event, formItem: FormGroup, botForm: FormGroup, botCode: string) {
    const button = event.currentTarget;
    button.disabled = true;
    botForm.get('State').setValue('Stoping');
    this.stopCrawl(formItem, botCode).then(rs => {
      button.disabled = false;
      botForm.get('State').setValue('Stopped');
    }).catch(e => {
      button.disabled = false;
      botForm.get('State').setValue('Stop error');
    });
    return false;
  }

  async stopCrawl(formItem: FormGroup, botCode: string) {
    try {
      const crawlPlan: CrawlPlanModel = formItem.value;
      console.log('Stop crawl', crawlPlan);

      const botInfo = (await this.apiService.getPromise<CrawlServerModel[]>('/crawl/servers', { id: botCode }))[0];
      if (botInfo) {
        // const botSocket = await this.service.getBotSocket(botInfo.ApiUrl);
        const mainSocket = await this.commonService.getMainSocket();
        // subscription.unsubscribe();
        console.log('Main bot socket connected');

        const planInfo: CrawlPlanModel = JSON.parse(JSON.stringify(crawlPlan));
        planInfo.Bots = [
          { Bot: botInfo },
        ];

        const status = await mainSocket.emit<{ state: string }>('crawl/stop-crawl', { bot: botInfo, plan: planInfo }, 300000);
        console.info(status);
        return status;
        // .then(status => {
        //   // resolve(status);
        //   console.info(status);
        // }).catch(e => {
        //   console.error(e);
        // });

      }
      // });
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  async getCrawlStatus(formItem: FormGroup, botCode: string): Promise<{ state: string }> {
    try {
      const crawlPlan: CrawlPlanModel = JSON.parse(JSON.stringify(formItem.value));
      console.log('Get crawl status', crawlPlan);

      // Get crawl bots
      const bots: CrawlPlanBotModel[] = botCode ? crawlPlan.Bots.filter(b => b.Bot === botCode) : crawlPlan.Bots;

      const bot = bots[0];
      if (bot) {
        console.log('Main bot', bot);
        const botInfo = (await this.apiService.getPromise<CrawlServerModel[]>('/crawl/servers', { id: bot.Bot }))[0];
        if (botInfo) {
          crawlPlan.Bots = [
            { Bot: botInfo },
          ];
          // return new Promise<{ state: string }>(async (resolve, reject) => {
          const mainSocket = await this.commonService.getMainSocket();

          const status = await mainSocket.emit<{ state: string }>('crawl/get-status', { bot: botInfo, plan: crawlPlan }, 15000);
          console.info(status);
          return status;
        }
      } else {
        throw Error('Bot info not defined');
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

}
