import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DataManagerFormComponent } from '../../../lib/data-manager/data-manager-form.component';
import { WpSiteModel, WpSiteSyncTaget } from '../../../models/wordpress.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { CommonService } from '../../../services/common.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { PermissionModel } from '../../../models/permission.model';
import { WpSyncSocketManager } from '../wp-sync-socket/wp-sync-socket.manager';
import { User } from '../../../lib/nam-socket/model/user';
import { ISocketNamespaceContext } from '../../../lib/nam-socket/socket.namspace';
import { WpSyncMessage } from '../wp-sync-socket/wp-sync-socket.namespace';
import { IDatasource, IGetRowsParams } from '@ag-grid-community/core';
// import { IDatasource, IGetRowsParams } from '@ag-grid-community/all-modules';

@Component({
  selector: 'ngx-sync-form',
  templateUrl: './sync-form.component.html',
  styleUrls: ['./sync-form.component.scss'],
})
export class SyncFormComponent extends DataManagerFormComponent<WpSiteModel> implements OnInit, AfterViewInit, ISocketNamespaceContext {

  componentName: string = 'EmailGatewayFormComponent';
  idKey = 'Code';
  apiPath = '/wordpress/wp-sites';
  baseFormUrl = '/wordpress/wp-site/form';

  select2SyncResourceOption = {
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
  };

  select2SyncPostTagsOption = {
    placeholder: 'Thêm...',
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

  select2SyncCategoiesOption = {
    placeholder: 'Thêm...',
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
  };

  wpSiteList: (WpSiteModel & { id: string, text: string })[];
  wpResourceList: { id: string, text: string }[] = [
    { id: 'POSTS', text: 'Posts' },
    { id: 'CATEGORIES', text: 'Categories' },
    { id: 'PRODUCTS', text: 'Products' },
    { id: 'MEDIAS', text: 'Media' },
  ];

  progressBarValue = 0;
  progressBarStatus = 'danger';
  processBarlabel = 'Synchronous...';

  // originSiteCategories: { [key: string]: { id: number, text: string }[] } = {};
  originSiteCategories: { [key: string]: IDatasource } = {};
  originSiteCategoriesColumnDefs: { [key: string]: any } = {};

  originSiteSyncPagess: { [key: string]: { id: number, text: string }[] } = {};

  progressBarMap: { [key: string]: { percent: number, status: string, label: string } } = {};

  logs: string[] = [];

  @ViewChild('logsEle', { static: false }) logsEle: ElementRef;
  logEleContain: any;
  socketManager: WpSyncSocketManager;
  syncStates: { [key: string]: string } = {};

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public apiService: ApiService,
    public toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public cms: CommonService,
    public ref: NbDialogRef<SyncFormComponent>,
    public _http: HttpClient,
  ) {
    super(activeRoute, router, formBuilder, apiService, toastrService, dialogService, cms);
    this.silent = true;
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
    this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { limit: 99999999 }).then(list => {
      this.wpSiteList = list.map(item => {
        return {
          id: item['Code'],
          text: item['Name'],
          ...item,
        };
      });

      // Init socket manager
      const user: User = {
        id: this.cms.loginInfo.user.Code,
        name: this.cms.loginInfo.user.Name,
        avatar: this.cms.loginInfo.user.Avatar,
      };

      this.socketManager = new WpSyncSocketManager(this.cms, user);
      this.socketManager.init().then(rs => {
        this.socketManager.onConnect().then(rs2 => {
          super.ngOnInit();
        });
      });
    });

  }

  /** Execute api get */
  executeGet(params: any, success: (resources: WpSiteModel[]) => void, error?: (e: HttpErrorResponse) => void) {
    params['includeSyncTargets'] = true;
    this.cms.getMainSocket().then(mainSocket => {
      super.executeGet(params, async (data) => {

        for (let i = 0; i < data.length; i++) {
          const siteInfo = data[i];
          // await mainSocket.emit<{ id: number, text: string }[]>('wp/get/categories', { siteInfo: siteInfo }, 30000).then((categories: { id: number, text: string }[]) => {
          //   this.originSiteCategories[siteInfo.Code] = categories;
          // });

          this.originSiteCategories[siteInfo.Code] = {
            rowCount: null,
            getRows: (getRowParams: IGetRowsParams) => {
              console.info('asking for ' + getRowParams.startRow + ' to ' + getRowParams.endRow);
              // this.cms.getMainSocket().then(mainSocket => {
              // const query = { limit: 40, offset: getRowParams.startRow };
              mainSocket.emit<{ id: number, text: string }[]>('wp/get/categories', { siteInfo: siteInfo, limit: 40, offset: getRowParams.startRow }, 30000).then((categories: { id: number, text: string }[]) => {
                // this.originSiteCategories[data.Code] = categories;
                let lastRow = -1;
                if (categories.length < 40) {
                  lastRow = getRowParams.startRow + categories.length;
                }
                getRowParams.successCallback(categories, lastRow);
                // this.gridApi.resetRowHeights();
              });
              // });
            },
          };

          this.originSiteCategoriesColumnDefs[siteInfo.Code] = [
            {
              headerName: '#',
              width: 100,
              valueGetter: 'node.data.id',
              cellRenderer: 'loadingCellRenderer',
              sortable: false,
              // pinned: 'left',
              checkboxSelection: true,
            },
            {
              headerName: 'Tên',
              field: 'name',
              width: 1024,
              sortable: false,
              filter: 'agTextColumnFilter',
              // pinned: 'left',
            },
            // {
            //   headerName: 'Số điện thoại',
            //   field: 'Phone',
            //   width: 250,
            //   filter: 'agTextColumnFilter',
            //   pinned: 'left',
            //   autoHeight: true,
            // },
            // {
            //   headerName: 'Tin nhắn',
            //   field: 'Message',
            //   width: 1000,
            //   filter: 'agTextColumnFilter',
            // },
          ];

          await mainSocket.emit<{ id: number, text: string, slug: string }[]>('wp/get/pages', { siteInfo: siteInfo }, 30000).then((pages: { id: number, text: string, slug: string }[]) => {
            this.originSiteSyncPagess[siteInfo.Code] = pages;
          });
        }
        if (success) success(data);

      });

    }, error);
  }

  makeNewFormGroup(data?: WpSiteModel): FormGroup {
    const newForm = this.formBuilder.group({
      Code: [''],
      Name: ['', Validators.required],
      Domain: [''],
      SyncCategories: [''],
      SyncPages: [''],
      // SyncTags: [''],
      SyncTargets: this.formBuilder.array([

      ]),
    });
    if (data) {
      newForm.patchValue(data);



    }

    return newForm;
  }

  makeNewSyncTargetFormGroup(data?: WpSiteSyncTaget): FormGroup {
    const newForm = this.formBuilder.group({
      Id: [''],
      TargetSite: ['', Validators.required],
      Resources: [''],
      Active: [''],
      // Categories: [''],
    });

    if (data) {
      newForm.patchValue(data);
      this.progressBarMap[data.TargetSite] = {
        percent: 0,
        label: '',
        status: 'danger',
      };

      // Open sync namespace
      this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { id: data.WpSite }).then(rs => {
        const originSiteInfo = rs[0];
        if (originSiteInfo && data.Active) {
          this.attachSyncProcess(originSiteInfo, data);
        }
      }).catch(e => console.error(e));

    }
    return newForm;
  }

  getSyncTargets(formGroupIndex: number) {
    return this.array.controls[formGroupIndex].get('SyncTargets') as FormArray;
  }

  addSyncTargetFormGroup(formGroupIndex: number, index: number, newFormGroup: FormGroup) {
    const component = this.makeNewSyncTargetFormGroup();
    this.getSyncTargets(formGroupIndex).push(component);
    this.onAddSyncTargetFormGroup(formGroupIndex, index, newFormGroup);
    return false;
  }

  onAddSyncTargetFormGroup(mainIndex: number, index: number, newFormGroup: FormGroup) {
    // this.getSyncTargets(mainIndex).push([]);
  }

  onSyncTargetChange(mainFormIndex: number, ip: number, item: PermissionModel) {
    // // console.info(item);

    // if (!this.isProcessing) {
    //   if (item) {
    //     if (this.templatePermissionList.findIndex((value: PermissionModel) => value.Code === item['Code']) < 0) {
    //       this.templatePermissionList.push(item);
    //     }
    //     // this.priceReportForm.get('Object').setValue($event['data'][0]['id']);
    //     if (item['Code']) {
    //       this.getPermissions(mainFormIndex).controls[ip].get('Description').setValue(item['Description']);
    //       this.getPermissions(mainFormIndex).controls[ip].get('Status').setValue(1);
    //     }
    //   }
    // }

  }

  removeSyncTargetGroup(formGroupIndex: number, index: number) {
    this.getSyncTargets(formGroupIndex).removeAt(index);
    return false;
  }

  onAddFormGroup(index: number, newForm: FormGroup, formData?: WpSiteModel): void {
    super.onAddFormGroup(index, newForm, formData);
  }
  onRemoveFormGroup(index: number): void {

  }

  goback(): false {
    super.goback();
    if (this.mode === 'page') {
      this.router.navigate(['/wordpress/sync/form']);
    } else {
      this.ref.close();
      // this.dismiss();
    }
    return false;
  }

  onUpdatePastFormData(aPastFormData: { formData: any; meta: any; }): void { }
  onUndoPastFormData(aPastFormData: { formData: any; meta: any; }): void { }

  prepareDataForSave(data: WpSiteModel[]) {
    super.prepareDataForSave(data);

    data.forEach(item => {
      Object.keys(item).forEach(k => {
        if (item[k]['id']) {
          delete (item[k]['selected']);
          delete (item[k]['disabled']);
          delete (item[k]['_resultId']);
          delete (item[k]['element']);
        }
      });
    });
  }

  originSiteCategoryChange(event: any, siteCode: string) {
    console.log('Categories changed', event);
  }


  async formLoad(formData: WpSiteModel[], formItemLoadCallback?: (index: number, newForm: FormGroup, formData: WpSiteModel) => void) {
    return super.formLoad(formData, async (index, newForm, itemFormData) => {

      // Components form load
      if (itemFormData.SyncTargets) itemFormData.SyncTargets.forEach(component => {
        const componentFormGroup = this.makeNewSyncTargetFormGroup(component);
        (newForm.get('SyncTargets') as FormArray).push(componentFormGroup);
        // this.onAddSyncTargetFormGroup(componentFormGroup);
      });

    });

  }

  startCopy(formItem: FormGroup) {
    this.save().then(rs => {

      rs.forEach(async originSite => {

        const user: User = {
          id: this.cms.loginInfo.user.Code,
          name: this.cms.loginInfo.user.Name,
          avatar: this.cms.loginInfo.user.Avatar,
        };

        originSite.SyncTargets.forEach(async syncTarget => {
          if (syncTarget.Active && syncTarget.Resources.some(i => i.id === 'POSTS')) {

            const targetSite = (await this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { id: syncTarget.TargetSite }))[0];
            const namespace = `wp/sync/site2site/${originSite.Code}-${targetSite.Code}`;
            if (targetSite) {

              // Process for target site
              console.info('Conntect to local chat server success');

              const socketNamespace = await this.socketManager.openNamesapce(this, namespace, user, {
                originSite: originSite,
                targetSite: targetSite,
                // tags: syncTarget.PostTags.map(tag => tag.id),
              });
              socketNamespace.clearMessageList();
              socketNamespace.sendMessage({
                namespace: namespace,
                index: Date.now(),
                content: 'Start sync',
                command: 'start',
                data: {},
              }, user);

            } else {
              console.log('target site not definied');
            }


          }
        });
      });
    });
    return false;
  }

  stopCopy() {
    this.save().then(rs => {

      rs.forEach(async originSite => {

        const user: User = {
          id: this.cms.loginInfo.user.Code,
          name: this.cms.loginInfo.user.Name,
          avatar: this.cms.loginInfo.user.Avatar,
        };

        originSite.SyncTargets.forEach(async syncTarget => {
          if (syncTarget.Resources.some(i => i.id === 'POSTS')) {

            const targetSite = (await this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { id: syncTarget.TargetSite }))[0];
            const namespace = `wp/sync/site2site/${originSite.Code}-${targetSite.Code}`;
            if (targetSite) {

              // Process for target site
              console.info('Conntect to local chat server success');

              const socketNamespace = await this.socketManager.openNamesapce(this, namespace, user, {
                originSite: originSite,
                targetSite: targetSite,
              });

              // Send command
              socketNamespace.sendMessage({
                namespace: namespace,
                index: Date.now(),
                content: 'Stop sync',
                command: 'stop',
                data: {},
              }, user);

            } else {
              console.log('target site not definied');
            }


          }
        });
      });
    });
    return false;

  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // this.logEleContain = this.logsEle.nativeElement;
    // this.logEleContai`n.changes.subscribe(_ => {
    //   this.logEleContain.scroll({
    //     top: this.logEleContain.scrollHeight,
    //     left: 0,
    //     behavior: 'smooth',
    //   });
    // });
  }

  getAuthenticateToken(): import('../../../lib/nam-socket/socket.namspace').JWTToken {
    return {
      access_token: this.apiService.getAccessToken(),
      refresh_token: this.apiService.getRefreshToken(),
    };
  }
  onChatRoomInit(): void {

  }
  onChatRoomConnect(): void {

  }
  onChatRoomReconnect(): void {

  }

  statusDis = { running: 'primary', stopped: 'warning', error: 'danger', complete: 'success' };
  onChatRoomHadNewMessage(newMessage: WpSyncMessage): void {
    const tartgetSiteCode = newMessage.namespace.split('-')[1];
    this.syncStates[tartgetSiteCode] = newMessage.state;

    this.progressBarMap[tartgetSiteCode].percent = newMessage.percent;
    this.progressBarMap[tartgetSiteCode].label = newMessage.state + '/' + newMessage.percent + '%';
    this.progressBarMap[tartgetSiteCode].status = this.statusDis[newMessage.state] || 'info';
    // this.logs.unshift(`[${targetSite.Name}] ` + (typeof progress.data.message === 'object' ? JSON.stringify(progress.data.message) : progress.data.message));

    this.logs.unshift(`[${tartgetSiteCode}] ` + (typeof newMessage.content === 'object' ? JSON.stringify(newMessage.content) : newMessage.content));

    if (this.logs.length > 300) {
      while (this.logs.length > 200) this.logs.pop();
    }

  }

  async attachSyncProcess(originSite: WpSiteModel, syncTarget: WpSiteSyncTaget) {
    if (syncTarget.Resources.some(i => i.id === 'POSTS')) {

      const user = {
        id: this.cms.loginInfo.user.Code,
        name: this.cms.loginInfo.user.Name,
        avatar: this.cms.loginInfo.user.Avatar,
      };

      const targetSite = (await this.apiService.getPromise<WpSiteModel[]>('/wordpress/wp-sites', { id: syncTarget.TargetSite }))[0];
      const namespace = `wp/sync/site2site/${originSite.Code}-${targetSite.Code}`;
      if (targetSite) {

        // Process for target site
        console.info('Conntect to local chat server success');

        const socketNamespace = await this.socketManager.openNamesapce(this, namespace, user, {
          originSite: originSite,
          targetSite: targetSite,
          // tags: syncTarget.PostTags.map(tag => tag.id),
        });

        // Sync message cache
        await socketNamespace.syncMessageList();

        // socketNamespace.sendMessage({
        //   namespace: namespace,
        //   index: Date.now(),
        //   content: 'Attach sync',
        //   command: 'attach',
        //   data: {},
        // }, user);

      } else {
        console.log('target site not definied');
      }


    }
  }

  isSynchroizing() {
    return Object.keys(this.syncStates).some(k => !this.syncStates[k] || (['running', 'runningerror'].indexOf(this.syncStates[k]) > -1));
  }
}
