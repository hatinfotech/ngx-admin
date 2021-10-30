import { diacritic } from './../lib/diacritic';
import { timezones } from './../lib/timezones';
import { HelpdeskTicketModel } from './../models/helpdesk.model';
import { TaxModel } from './../models/tax.model';
import { Injectable, Type, TemplateRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { ApiService } from './api.service';
import {
  NbDialogService, NbMenuItem, NbToastrService, NbSidebarService,
  NbSidebarComponent, NbDialogRef, NbDialogConfig, NbIconLibraries, NbThemeService, NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { ShowcaseDialogComponent } from '../modules/dialog/showcase-dialog/showcase-dialog.component';
import { Location, getCurrencySymbol, CurrencyPipe, DatePipe } from '@angular/common';
import { ActionControl } from '../lib/custom-element/action-control-list/action-control.interface';
import localeVi from '@angular/common/locales/vi';
import localeEn from '@angular/common/locales/en';
import { BaseComponent } from '../lib/base-component';
import { LoginInfoModel } from '../models/login-info.model';
import { TranslateService } from '@ngx-translate/core';
import { LocaleConfigModel } from '../models/system.model';
import { environment } from '../../environments/environment';
import { MySocket } from '../lib/nam-socket/my-socket';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { filter, take } from 'rxjs/operators';
import { UnitModel } from '../models/unit.model';
import { DeviceModel } from '../models/device.model';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from './notification.service';
import { MobileAppService } from '../modules/mobile-app/mobile-app.service';
import * as moment from 'moment';
import { FileStoreModel } from '../models/file.model';
import { createMask } from '@ngneat/input-mask';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { CashPaymentVoucherPrintComponent } from '../modules/accounting/cash/payment/cash-payment-voucher-print/cash-payment-voucher-print.component';
import { CashReceiptVoucherPrintComponent } from '../modules/accounting/cash/receipt/cash-receipt-voucher-print/cash-receipt-voucher-print.component';
import { AccountingOtherBusinessVoucherPrintComponent } from '../modules/accounting/other-business-voucher/accounting-other-business-voucher-print/accounting-other-business-voucher-print.component';
import { CollaboratorAwardPrintComponent } from '../modules/collaborator/award/collaborator-award-print/collaborator-award-print.component';
import { CollaboratorCommissionPaymentPrintComponent } from '../modules/collaborator/commission-payment/collaborator-commission-payment-print/collaborator-commission-payment-print.component';
import { CollaboratorCommissionPrintComponent } from '../modules/collaborator/commission/collaborator-commission-print/collaborator-commission-print.component';
import { CollaboratorOrderPrintComponent } from '../modules/collaborator/order/collaborator-order-print/collaborator-order-print.component';
import { CommerceServiceByCycleFormComponent } from '../modules/commerce-service-by-cycle/service-by-cycle/commerce-service-by-cycle-form/commerce-service-by-cycle-form.component';
import { DeploymentVoucherPrintComponent } from '../modules/deployment/deployment-voucher/deployment-voucher-print/deployment-voucher-print.component';
import { PurchaseOrderVoucherPrintComponent } from '../modules/purchase/order/purchase-order-voucher-print/purchase-order-voucher-print.component';
import { PurchaseVoucherPrintComponent } from '../modules/purchase/voucher/purchase-voucher-print/purchase-voucher-print.component';
import { SalesPriceReportPrintComponent } from '../modules/sales/price-report/sales-price-report-print/sales-price-report-print.component';
import { SalesVoucherPrintComponent } from '../modules/sales/sales-voucher/sales-voucher-print/sales-voucher-print.component';
import { WarehouseGoodsDeliveryNotePrintComponent } from '../modules/warehouse/goods-delivery-note/warehouse-goods-delivery-note-print/warehouse-goods-delivery-note-print.component';
import { WarehouseGoodsReceiptNotePrintComponent } from '../modules/warehouse/goods-receipt-note/warehouse-goods-receipt-note-print/warehouse-goods-receipt-note-print.component';
import { QuickTicketFormComponent } from '../modules/helpdesk/dashboard/quick-ticket-form/quick-ticket-form.component';
import { NotificationModel } from '../models/notification.model';
import { RootConfigModel, SystemConfigModel } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  // private DIACRITICS = diacritic;

  // ready$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private permissionsCache$ = new BehaviorSubject<{ [key: string]: boolean }>({});
  private excludeComponents = [
    // 'AppComponent',
    // 'ECommerceComponent',
    // 'DashboardComponent',
  ];
  public env = environment;
  private previousUrl = null;
  private routeParams: { type?: string, icon?: string, title: string, content: string, actions?: { label: string, icon?: string, status?: string, action?: () => void }[] }[] = [];

  public locale$ = new BehaviorSubject<{ locale: string, skipUpdate?: boolean }>({ locale: 'vi-VN', skipUpdate: true });
  public languageLoaded$ = new BehaviorSubject<boolean>(false);
  public theme$ = new BehaviorSubject<{ theme: string, skipUpdate?: boolean }>(null);
  public timezone$: BehaviorSubject<{ timezone: string, skipUpdate?: boolean }> = new BehaviorSubject<{ timezone: string, skipUpdate?: boolean }>(null);
  public configReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // private loginInfo: LoginInfoModel;
  // loginInfoSubject: BehaviorSubject<LoginInfoModel> = new BehaviorSubject<LoginInfoModel>(null);
  // loginInfo$ = this.loginInfoSubject.asObservable();
  loginInfo: LoginInfoModel = new LoginInfoModel();

  distributeFileStoreCookieRequestSubject: BehaviorSubject<string> = new BehaviorSubject<string>('assets/images/nick.png');
  distributeFileStoreCookieRequest$ = this.distributeFileStoreCookieRequestSubject.asObservable();

  componentChangeSubject: BehaviorSubject<{ componentName: string, state: boolean, data?: any }> = new BehaviorSubject<{ componentName: string, state: boolean, data?: any }>({ componentName: '', state: false });
  componentChange$: Observable<{ componentName: string, state: boolean, data?: any }> = this.componentChangeSubject.asObservable();

  pushHeaderActionControlListSubject: BehaviorSubject<ActionControl[]> = new BehaviorSubject<ActionControl[]>([]);
  pushHeaderActionControlList$: Observable<ActionControl[]> = this.pushHeaderActionControlListSubject.asObservable();
  // popHeaderActionControlListSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  // popHeaderActionControlList$: Observable<void> = this.popHeaderActionControlListSubject.asObservable();

  popHeaderActionControlList$: Subject<void> = new Subject<void>();
  clearHeaderActionControlList$: Subject<void> = new Subject<void>();


  authenticatedSubject = new BehaviorSubject<LoginInfoModel>(null);
  authenticated$ = this.authenticatedSubject.asObservable();

  menuSidebar: NbSidebarComponent;
  mobileSidebar: NbSidebarComponent;

  loginInfo$ = new BehaviorSubject<LoginInfoModel>(null);
  private mainSocket: MySocket;
  mainSocketInfo$ = new BehaviorSubject<{ protocol?: string, domain: string; port: number; url?: string }>(null);

  taxList: TaxModel[];
  unitList: UnitModel[];

  // localStorageAvailable$: BehaviorSubject<WindowLocalStorage> = new BehaviorSubject<WindowLocalStorage>(null);

  notificationMessage: BehaviorSubject<any>;
  timezones$ = new BehaviorSubject<any>(null);
  systemConfigs$ = new BehaviorSubject<SystemConfigModel>(null);

  constructor(
    public authService: NbAuthService,
    public apiService: ApiService,
    public dialogService: NbDialogService,
    public toastService: NbToastrService,
    public router: Router,
    public _location: Location,
    public sidebarService: NbSidebarService,
    public translate: TranslateService,
    public currencyPipe: CurrencyPipe,
    public iconsLibrary: NbIconLibraries,
    public datePipe: DatePipe,
    private themeService: NbThemeService,
    public messagingService: NotificationService,
    private toastrService: NbToastrService,
    private mobileService: MobileAppService,
    public activeRoute: ActivatedRoute,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public notificationService: NotificationService,
  ) {
    // this.authService.onAuthenticationChange().subscribe(state => {
    //   if (state) {
    //     this.loadPermissionToCache();
    //   }
    // });

    const getTimezonesProcess = setInterval(() => {
      if (timezones) {
        clearInterval(getTimezonesProcess);
        this.timezones$.next(timezones as any);
      }
    }, 300);

    /** Load langCode */
    translate.addLangs(['en-US', 'vi-VN']);
    translate.setDefaultLang('en-US');
    moment.locale('en');
    // translate.setDefaultLang('vi-VN');
    this.locale$.subscribe(info => {
      if (info) {
        this.dateTimeAdapter.setLocale(info.locale);
        this.languageLoaded$.next(false);
        translate.use(info.locale).pipe(take(1)).toPromise().then(() => setTimeout(() => this.languageLoaded$.next(true), 1000));
        localStorage.setItem('configuration.locale', info.locale);
        if (!info.skipUpdate) {
          this.apiService.putPromise<LocaleConfigModel[]>('/system/user-configs', {}, [{ LocaleCode: info.locale }]).then(rs => {
            console.log('Update locale success');
          });
        }
        moment.locale(info.locale);
      }
    });
    this.theme$.subscribe(info => {
      if (info) {
        // translate.use(info.theme);
        localStorage.setItem('configuration.theme', info.theme);
        this.themeService.changeTheme(info.theme);
        if (!info.skipUpdate) {
          this.apiService.putPromise<LocaleConfigModel[]>('/system/user-configs', {}, [{ Theme: info.theme }]).then(rs => {
            console.log('Update theme success');
          });
        }
      }
    });
    this.timezone$.subscribe(info => {
      if (info) {
        localStorage.setItem('configuration.timezone', info.timezone);
        if (!info.skipUpdate) {
          this.apiService.putPromise<LocaleConfigModel[]>('/system/user-locales', {}, [{ Timezone: info.timezone }]).then(rs => {
            console.log('Update timezone success');
          });
        }
      }
    });
    /** End Load langCode */

    // Init main socket
    this.apiService.getPromise<{ domain: string, port: number, protocol?: string, url?: string }>('/chat/services/connect-info', {}).then(rs => {
      rs.url = `${rs.protocol || 'https'}://${rs.domain}:${rs.port}`;
      this.mainSocketInfo$.next(rs);
      // this.mainSocket = new MySocket(this.mainSocketInfo.url);
      this.initMainSocket().then(sc => {
        // this.mainSocket = sc;
        // sc.on('Helpdesk_Had_New_Ticket').subscribe();
        console.info('Conntect to local chat server success');
      });

    }).catch(e => console.error(e));

    this.authService.onAuthenticationChange().subscribe(async state => {
      console.info('Authentication change with state ' + state);
      if (state) {
        this.loadPermissionToCache();
        // Get login info
        this.apiService.get<LoginInfoModel>('/user/login/info', {}, loginInfo => {
          // this.loginInfoSubject.next(loginInfo);
          this.loginInfo = loginInfo;
          this.loginInfo$.next(loginInfo);
          this.authenticatedSubject.next(loginInfo);
          // this.cookieService.set(loginInfo.distributeFileStore.name, loginInfo.distributeFileStore.value, null, '/', loginInfo.distributeFileStore.domain.replace(/https?:\/\/\./g, ''));
          // this.cookieService.set(loginInfo.distributeFileStore.name, loginInfo.distributeFileStore.value, null, null, loginInfo.distributeFileStore.domain);
          if (loginInfo.distribution && loginInfo.distribution.cookie && loginInfo.distribution.fileStores) {
            const fileStoreCode = Object.keys(loginInfo.distribution.fileStores).pop();
            const firstFileStore = loginInfo.distribution.fileStores[fileStoreCode];
            this.distributeFileStoreCookieRequestSubject.next(firstFileStore.requestCookieUrl + '&time=' + (Date.now()));
          }
          const locale = loginInfo['configuration']['locale'] || 'vi-VN';
          const timezone = loginInfo['configuration']['timezone'] || 'America/Los_Angeles';
          const theme = loginInfo['configuration']['theme'] || 'default';
          this.locale$.next({ locale, skipUpdate: true });
          this.timezone$.next({ timezone, skipUpdate: true });
          this.theme$.next({ theme, skipUpdate: true });
          // localStorage.setItem('configuration.locale', locale);
          // localStorage.setItem('configuration.timezone', timezone);
          // Re-register main socket on login changed
          this.mainSocket.emit('register', {
            token: this.apiService.getAccessToken(),
            user: {
              id: this.loginInfo.user.Code,
              name: this.loginInfo.user.Name,
            },
          }).then(rs2 => {
            console.log('Main socket registerd');
            console.log(rs2);
          });

        });

        // tax cache
        this.takeUntil('load_tax_unit_list', 3000).then(async rs => {
          this.taxList = (await this.apiService.getPromise<TaxModel[]>('/accounting/taxes')).map(tax => {
            tax['id'] = tax.Code;
            tax['text'] = tax.Name;
            return tax;
          });
          this.unitList = (await this.apiService.getPromise<UnitModel[]>('/admin-product/units', { limit: 'nolimit' })).map(tax => {
            tax['id'] = tax.Code;
            tax['text'] = tax.Name;
            return tax;
          });
        });

        // Notification
        this.notificationService.requestPermission().then(token => {
          //Register device
          this.registerDevice({ pushRegId: token });
        });
      } else {
        // this.loginInfoSubject.next(new LoginInfoModel());
        // this.unregisterDevice();
        this.clearCache();
      }
    });

    // Subcribe authorized event
    this.apiService.unauthorizied$.subscribe(info => {
      if (info) {
        this.setPreviousUrl(info.previousUrl);
      }
    });

    // Listen notification service event
    this.notificationService.eventEmiter.subscribe(event => {
      switch (event.name) {
        case 'open-notification':
          const notification: NotificationModel = event.data;
          // Chat room case
          if (notification.Type === 'CHATROOM') {

            this.mobileService.allReady().then(rs => {
              if (/^\/dashboard/.test(this.router.url)) {
                // home page
                this.mobileService.openChatRoom({ ChatRoom: notification.Data?.room }, 'large-smart-bot');
              } else {
                this.openMobileSidebar();
                this.mobileService.openChatRoom({ ChatRoom: notification.Data?.room }, 'small-smart-bot');
              }
            });
          }

          // Activity case
          if (notification.Type === 'ACTIVITY') {
            if (notification?.Action === 'OPENTICKET') {
              this.openTicketForm({ Code: notification?.Data?.ticket, UuidIndex: notification?.Data?.uuid });
            }
          }
          break;
      }
    });

    this.apiService.getPromise<SystemConfigModel>('/system/settings', {}).then(systemConfigs => {
      console.log(systemConfigs);
      this.systemConfigs$.next(systemConfigs);
    });
  }

  /**
   * Wait for language loaded
   * @return Promise<boolean>
   */
  async waitForLanguageLoaded(): Promise<boolean> {
    return this.languageLoaded$.pipe(filter(f => f), take(1)).toPromise();
  }
  async waitForReady(): Promise<boolean> {
    // return this.languageLoaded$.pipe(filter(f => f), take(1)).toPromise();
    return Promise.all([
      this.languageLoaded$.pipe(filter(f => f), take(1)).toPromise(),
      this.permissionsCache$.pipe(filter(f => !!f), take(1)).toPromise(),
      this.timezones$.pipe(filter(f => !!f), take(1)).toPromise(),
    ]).then(allStatus => {
      return true;
    });
  }

  async getMainSocket(): Promise<MySocket> {
    if (this.mainSocket) {
      return this.mainSocket;
    }
    return this.initMainSocket();
  }

  async initMainSocket(): Promise<MySocket> {
    const mainSocketInfo = await this.mainSocketInfo$.pipe(filter(f => !!f), take(1)).toPromise();
    if (this.mainSocket) {
      return this.mainSocket.onConnect$.pipe(filter(f => f), take(1)).toPromise().then(rs => this.mainSocket);
    }
    this.mainSocket = new MySocket(mainSocketInfo.url);
    // return new Promise<MySocket>((resolve, reject) => {

    // Auto register when main socket reconnected
    this.mainSocket.onReconnect$.subscribe(rs => {
      this.mainSocket.emit('register', {
        token: this.apiService.getAccessToken(),
        user: {
          id: this.loginInfo?.user?.Code,
          name: this.loginInfo?.user?.Name,
        },
      }).then(rs2 => {
        console.log('Main socket registerd');
        console.log(rs2);
      });
    });

    return this.mainSocket.onConnect$.pipe(filter(f => f), take(1)).toPromise().then(rs => {
      // resolve(this.mainSocket);
      return this.mainSocket.emit<{ socketServerId: string }>('register', {
        // token: this.apiService.getAccessToken(),
        // user: {
        //   id: this.loginInfo.user.Code,
        //   name: this.loginInfo.user.Name,
        // },
      }).then(rs2 => {
        console.log('Main socket registerd');
        console.log(rs2);
        // Store socket service id
        this.mainSocket.socketServerId$.next(rs2.socketServerId);
        return this.mainSocket;
      }).catch((err: { socketServerId: string }) => {
        if (err && err.socketServerId) {
          // Store socket service id
          this.mainSocket.socketServerId$.next(err.socketServerId);
        }
        return this.mainSocket;
      });
      // if (subscription) {
      //   subscription.unsubscribe();
      // }
    });
    // });

  }

  getMenuTree(callback: (menuTree: NbMenuItem[]) => void) {
    this.apiService.get<NbMenuItem[]>('/menu/menu-items', { limit: 999999, restrictPms: true, isTree: true, includeUsers: true, select: 'id=>Code,group=>Group,title,link=>Link=>Title,icon=>Icon,children=>Children' }, list => {
      callback(list);
    });
  }

  get location() {
    return this._location;
  }

  setPreviousUrl(url: string) {
    this.previousUrl = url;
  }

  goback() {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
      this.previousUrl = null;
    } else {
      this._location.back();
      // this.router.navigate(['/']);
    }

  }

  goToPrevious() {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
      this.previousUrl = null;
    } else {
      // this._location.back();
      this.router.navigate(['/']);
    }

  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  getRouteParams(id: number): { type?: string, icon?: string, title: string, content: string, actions?: { label: string, icon?: string, status?: string, action?: () => void }[] } {
    const param = this.routeParams.splice(id - 1, 1);
    return param ? param[0] : null;
  }

  gotoNotification(params: { type?: string, icon?: string, title: string, content: string, actions?: { label: string, icon?: string, status?: string, action?: () => void }[] }): void {
    this.routeParams.push(params);
    // this.router.navigate(['/notification', this.routeParams.length]);
    // this.toastService.show(params.content, params.title, {
    //   status: 'warning',
    // })
  }

  // privegetPermissions() {
  //   if (!this.permissionsCache) {
  //     this.loadPermissionToCache(() => {

  //     });
  //   }
  //   return this.permissionsCache;
  // }

  async loadPermissionToCache(callback?: () => void) {
    if (!this.permissionsCache$.value || Object.keys(this.permissionsCache$.value).length === 0) {
      this.apiService.getPromise<{ Component: string, Path: string, Permission: string, State: number }[]>('/user/permissions', { limit: 'nolimit', loadPermissionsForLoggedUser: true }).then(results => {
        const permissionsCache = {};
        results.map(item => {
          if (item.Component)
            permissionsCache[`${item.Component}_${item.Permission}`] = item.State > 0 ? true : false;
        });
        if (callback) callback();
        this.permissionsCache$.next(permissionsCache);
        return permissionsCache;
      });
    } else {
      if (callback) callback();
      return this.permissionsCache$.value;
    }
  }

  checkPermission(componentName: string, permission: string, callback?: (result: boolean) => boolean) {
    // path = path.replace(/^\//g, '').replace(/\:id/g, '').replace(/\/$/g, '');
    // const componentName = component['componentName'];
    if (this.excludeComponents.indexOf(componentName) < 0) {
      // return this.loadPermissionToCache().then(permissionsCache => {
      const result = typeof this.permissionsCache$.value[`${componentName}_${permission}`] === 'undefined' ? false : this.permissionsCache$.value[`${componentName}_${permission}`];
      callback && callback(result);
      return result;
      // });
    }
    return callback && callback(true) || true;
  }

  clearCache() {
    this.permissionsCache$.next(null);
  }

  /** Dialog */
  showDiaplog(title: string, content: string, buttons: { label: string, icon?: string, status?: string, action?: () => void }[], onClose?: () => void) {
    return this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: title,
        content: content,
        actions: buttons,
        onClose: () => {
          onClose && onClose();
        },
      },
    });
  }

  openDialog<T>(content: Type<T> | TemplateRef<T>, userConfig?: Partial<NbDialogConfig<Partial<T> | string>>): NbDialogRef<T> {
    setTimeout(() => {
      // tslint:disable-next-line: ban
      $('html').css({ top: 0 });
    }, 50);
    let dialogLoading = null;
    if (userConfig.context) {
      const afterInit = userConfig.context['onAfterInit'];
      userConfig.context['onAfterInit'] = (component?: BaseComponent, type?: string) => {
        afterInit && afterInit(component, type);
        setTimeout(() => {
          dialogLoading && dialogLoading.fadeOut(300);
        }, 300);
      }
    }

    if (userConfig?.context) {
      if (!userConfig?.context['inputMode']) {
        userConfig.context['inputMode'] = 'dialog';
      }
    }

    const dialogRef = this.dialogService.open<T>(content, userConfig);
    if (dialogRef['overlayRef'] && dialogRef['overlayRef']['_pane'] && userConfig.context['showLoadinng']) {

      const panel = $(dialogRef['overlayRef']['_pane']);
      dialogLoading = $('\
        <div class="cube" style="left: 50%; right: initial; bottom:initial; top: 50%">\
          <div class="sides">\
            <div class="top"></div>\
            <div class="right"></div>\
            <div class="bottom"></div>\
            <div class="left"></div>\
            <div class="front"></div>\
            <div class="back"></div>\
          </div>\
        </div>');

      panel.find('nb-dialog-container').append(dialogLoading);
    }

    return dialogRef;
  }

  /** Dialog */
  // openRelativeVoucherDiaplog(title: string, content: string, buttons: { label: string, icon?: string, status?: string, action?: () => void }[]) {
  //   return this.dialogService.open(ShowcaseDialogComponent, {
  //     context: {
  //       title: title,
  //       content: content,
  //       actions: buttons,
  //     },
  //   });
  // }

  resumeDialog(dialogRef: NbDialogRef<BaseComponent> | any, config?: { events: { onDialogClose?: () => void, onDialogChoose?: (selectItems: any[]) => void } }): boolean {
    if (dialogRef.show) {
      dialogRef.show(config);
    }
    return true;
  }
  /** End dialog */

  convertUnicodeToNormal(text: string) {
    return text.replace(/[^\u0000-\u007E]/g, (a) => {
      return diacritic[a] || a;
    }).replace(/[^a-z0-9 ]+/ig, '');
  }

  smartFilter(value: string, query: string) {
    return (new RegExp(this.convertUnicodeToNormal(query).toLowerCase().replace(/\s+/g, '.*'), 'ig')).test(this.convertUnicodeToNormal(value));
  }

  getFullRoutePath(route: ActivatedRouteSnapshot): string {
    /** The url we are going to return */
    if (route.routeConfig) {
      const url = route.routeConfig.path;
      console.info('[router-reuse] returning url', url);

      return route.pathFromRoot.filter(v => v.routeConfig && v.routeConfig.path).map(v => v.routeConfig.path ? v.routeConfig.path : '').join('/');
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  pushLoggedIn(state: boolean) {
    this.isLoggedIn$.next(state);
  }

  convertOptionList(list: any[], idKey: string, labelKey: string) {
    return list.map(item => {
      item['id'] = item[idKey] = item[idKey] ? item[idKey] : 'undefined';
      item['text'] = item[labelKey] = item[labelKey] ? item[labelKey] : 'undefined';

      return item;
    });
  }

  private takeUltilCount = {};
  private takeUltilPastCount = {};
  async takeUntil(context: string, delay: number, callback?: () => void): Promise<boolean> {
    const result = new Promise<boolean>(resolve => {
      if (delay === 0) {
        // if (callback) callback(); else return;
        resolve(true);
        return;
      }
      if (!this.takeUltilCount[context]) this.takeUltilCount[context] = 0;
      this.takeUltilCount[context]++;
      ((takeCount) => {
        setTimeout(() => {
          this.takeUltilPastCount[context] = takeCount;
        }, delay);
      })(this.takeUltilCount[context]);
      setTimeout(() => {
        if (this.takeUltilPastCount[context] === this.takeUltilCount[context]) {
          // callback();
          resolve(true);
        }
      }, delay);
    });
    if (callback) {
      callback();
    }
    return result;
  }

  private takeOncePastCount = {};
  private takeOnceCount = {};
  async takeOnce(context: string, delay: number): Promise<boolean> {
    const result = new Promise<boolean>(resolve => {
      // resolve(true);
      // if (delay === 0) {
      //   resolve(true);
      //   return;
      // }
      if (this.takeOncePastCount[context] === this.takeOnceCount[context]) {
        resolve(true);
      }
      if (!this.takeOnceCount[context]) { this.takeOnceCount[context] = 0; }
      this.takeOnceCount[context]++;
      ((takeCount) => {
        setTimeout(() => {
          this.takeOncePastCount[context] = takeCount;
        }, delay);
      })(this.takeOnceCount[context]);
      setTimeout(() => {
        if (this.takeOncePastCount[context] === this.takeOnceCount[context]) {
          this.takeOncePastCount[context] = null;
          this.takeOnceCount[context] = null;
          // resolve(true);
        }
      }, delay);
    });
    return result;
  }

  generatePassword(length: number): string {
    return Array(length)
      .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
      .map(x => x[Math.floor(Math.random() * x.length)]).join('');
  }

  pushHeaderActionControlList(actionControlList: ActionControl[]) {
    this.pushHeaderActionControlListSubject.next(actionControlList.map(control => ({ ...control, size: 'small' })));
  }
  popHeaderActionControlList() {
    this.popHeaderActionControlList$.next();
  }
  clearHeaderActionControlList() {
    this.clearHeaderActionControlList$.next();
  }

  openMobileSidebar() {
    if (this.menuSidebar && this.mobileSidebar) {
      if (this.menuSidebar.expanded) {
        this.sidebarService.toggle(true, 'menu-sidebar');
      }
      if (this.mobileSidebar.collapsed) {
        this.sidebarService.toggle(true, 'chat-sidebar');
      }
    } else {
      console.info('Sidebar was not ready !!!');
    }
  }

  // openMenuSidebar() {

  // }

  getBaseUrl() {
    return `${window.location.origin}/${environment.basePath}`;
  }

  getApiUrl() {
    if (/^http/i.test(this.env.api.baseUrl)) {
      return this.env.api.baseUrl;
    }
    return window.location.origin + this.env.api.baseUrl;
  }

  textTitleCase(text: string): string {
    const sentence = text.toLowerCase().split(' ');
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    // document.write(sentence.join(' '));
    return sentence.join(' ');
  }

  textTransform(text: string, transform: 'title' | 'upper' | 'lower' | 'head-title'): string {
    switch (transform) {
      case 'title':
        return this.textTitleCase(text);
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'head-title':
        return text.replace(/^./, text.charAt(0).toUpperCase());
      default: return text;
    }
  }

  translateText(key: string | Array<string>, interpolateParams?: Object, transform?: 'title' | 'upper' | 'lower' | 'head-title') {
    return this.textTransform(this.translate.instant(key, interpolateParams).trim(), transform ? transform : 'head-title');
  }

  getCurrentLoaleDataset() {
    const currentLocaleCode = this.translate.currentLang;
    if (currentLocaleCode) {
      switch (currentLocaleCode) {
        case 'vi-VN': return localeVi;
        case 'en-US': return localeEn;
      }
    }
    return null;
  }

  getCurrentCurrencySymbol() {
    return getCurrencySymbol('VND', 'narrow', this.translate.currentLang);
  }

  getNumberRadixPointChar() {
    return this.getCurrentLoaleDataset()[13][0];
  }
  getNumberGroupPointChar() {
    return this.getCurrentLoaleDataset()[13][1];
  }

  getCurrencyMaskConfig(): CurrencyMaskConfig {
    const locale = this.getCurrentLoaleDataset();
    return { prefix: '', suffix: ' ' + getCurrencySymbol('VND', 'narrow', this.translate.currentLang), thousands: locale[13][1], decimal: locale[13][0], precision: 0, align: 'right', allowNegative: false };
  }

  getNumberMaskConfig(): CurrencyMaskConfig {
    const locale = this.getCurrentLoaleDataset();
    return { prefix: '', suffix: '', thousands: locale[13][1], decimal: locale[13][0], precision: 0, align: 'right', allowNegative: false };
  }

  getPercentMaskConfig(): CurrencyMaskConfig {
    const locale = this.getCurrentLoaleDataset();
    return { prefix: '', suffix: '%', thousands: locale[13][1], decimal: locale[13][0], precision: 0, align: 'right', allowNegative: false };
  }

  getTaxMaskConfig(): CurrencyMaskConfig {
    const locale = this.getCurrentLoaleDataset();
    return { prefix: '', suffix: '%', thousands: locale[13][1], decimal: locale[13][0], precision: 0, align: 'right', allowNegative: false };
  }

  createFloatNumberMaskConfig(options?: Inputmask.Options) {
    const radixPoint = this.getNumberRadixPointChar();
    const groupsSeparator = this.getNumberGroupPointChar();
    return createMask({
      alias: 'numeric',
      groupSeparator: this.getNumberGroupPointChar(),
      radixPoint: this.getNumberRadixPointChar(),
      digits: 2,
      prefix: '',
      placeholder: '0',
      parser: (value: string) => {
        return parseFloat(radixPoint !== '.' ? value.replace(new RegExp(`\\${groupsSeparator}`, 'g'), '').replace(new RegExp(`\\${radixPoint}`, 'g'), '.') : value);
      },
      onBeforeMask: (initialValue: string, opts: Inputmask.Options) => {
        return radixPoint !== '.' ? `${initialValue}`.replace('.', radixPoint) : initialValue;
      },
      ...options,
    })
  }

  getObjectId(obj: any, idName?: string) {
    return obj && typeof obj[idName || 'id'] !== 'undefined' ? obj[idName || 'id'] : obj;
  }

  getObjectText(obj: any, textName?: string) {
    return obj && typeof obj[textName || 'text'] !== 'undefined' ? obj[textName || 'text'] : obj;
  }

  currencyTransform(value: any, currencyCode?: string, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): string | null {
    return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
  }

  async registerDevice(option?: { pushRegId?: string }) {
    return this.apiService.postPromise<DeviceModel>('/device/devices/', { registerDevice: true }, {
      RegisterId: option && option.pushRegId || undefined,
      Uuid: this.getDeviceUuid() + this.env.bundleId,
      Name: 'browser',
      Platform: 'browser',
      Version: '1.0',
      SenderIdentification: this.env.firebase.messagingSenderId,
      Owner: this.loginInfo?.user?.Name,
      Mode: this.env.production ? 'Production' : 'Development',
      BundleId: this.env.bundleId,
      AppVersion: this.env.version,
    }).then(rs => {
      console.info('Device register success', rs);
      return rs;
    }).catch(err => {
      console.error('Device register error', err);
      return Promise.reject(err);
    });
  }

  async unregisterDevice(option?: { pushRegId?: string }) {
    // return this.messagingService.getToken().then(token => {
    return this.apiService.putPromise<DeviceModel>('/device/devices/', { unregisterDevice: true }, {
      Uuid: this.getDeviceUuid() + this.env.bundleId,
    }).then(rs => {
      console.info('Device unregister success', rs);
      //   this.messagingService.deleteToken(token);
      return rs;
    }).catch(err => {
      console.error('Device unregister error', err);
      return Promise.reject(err);
      // });
    });

  }

  /** Auto generate device uuid */
  getDeviceUuid() {
    let deviceUuid = localStorage.getItem('device_uuid');
    if (deviceUuid) {
      return deviceUuid;
    }
    deviceUuid = uuidv4();
    localStorage.setItem('device_uuid', deviceUuid);
    return deviceUuid;
  }

  openTicketForm(id: { Code?: string, UuidIndex?: string }) {
    this.openDialog<QuickTicketFormComponent>(QuickTicketFormComponent, {
      context: {
        showLoadinng: false,
        inputMode: 'dialog',
        ticketCode: id.Code,
        uuidIndex: id.UuidIndex,
        onDialogSave: (newData: HelpdeskTicketModel[]) => {
        },
        onDialogClose: () => {
        },
      },
      closeOnEsc: false,
      closeOnBackdropClick: false,
    });
  }

  voucherPrintConponentTypeIndex = {
    'SALES': SalesVoucherPrintComponent,
    'PURCHASE': PurchaseVoucherPrintComponent,
    'PURCHASEORDER': PurchaseOrderVoucherPrintComponent,
    'GOODSDELIVERY': WarehouseGoodsDeliveryNotePrintComponent,
    'GOODSRECEIPT': WarehouseGoodsReceiptNotePrintComponent,
    'RECEIPT': CashReceiptVoucherPrintComponent,
    'PAYMENT': CashPaymentVoucherPrintComponent,
    'PRICEREPORT': SalesPriceReportPrintComponent,
    'DEPLOYMENT': DeploymentVoucherPrintComponent,
    'OTHERBUSINESSVOUCHER': AccountingOtherBusinessVoucherPrintComponent,
    'SERVICEBYCYCLE': CommerceServiceByCycleFormComponent,
    'CLBRTORDER': CollaboratorOrderPrintComponent,
    'CLBRTCOMMISSION': CollaboratorCommissionPrintComponent,
    'CLBRTCOMMPAY': CollaboratorCommissionPaymentPrintComponent,
    'COLLABORATORORDER': CollaboratorOrderPrintComponent,
    'CLBRTAWARD': CollaboratorAwardPrintComponent,
    'CLBRTWEEKLYAWARD': CollaboratorAwardPrintComponent,
    'CLBRTMONTHLYAWARD': CollaboratorAwardPrintComponent,
    'CLBRTQUARTERLYAWARD': CollaboratorAwardPrintComponent,
    'CLBRTYEARLYAWARD': CollaboratorAwardPrintComponent,
  };
  previewVoucher<M>(type: string, relativeVocher: string, onClose?: (data: M) => void) {
    if (this.voucherPrintConponentTypeIndex[type]) {
      this.openDialog(this.voucherPrintConponentTypeIndex[type], {
        context: {
          showLoadinng: true,
          title: 'Xem trước',
          id: [this.getObjectId(relativeVocher)],
          inputMode: 'dialog',
          mode: 'print',
          inputId: [this.getObjectId(relativeVocher)],
          // data: data,
          idKey: ['Code'],
          // approvedConfirm: true,
          onClose: (data: M) => {
            onClose && onClose(data);
          },
        },
      });
      return true;
    }
    return false;
  }

  async getAvailableFileStores(option?: { weight?: number, limit?: number }) {
    return this.apiService.getPromise<FileStoreModel[]>('/file/file-stores', { filter_Type: 'REMOTE', sort_Weight: 'asc', eq_IsAvailable: true, eq_IsUpload: true, requestUploadToken: true, weight: option?.weight, limit: option?.limit || 1 });
  }

  getBeginOfDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 999)
  }
  getEndOfDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 0)
  }

  get lastVoucherDate(): Date {
    const tmp: any = localStorage.getItem('Voucher.lastVoucherDate');
    let current: Date;
    if (tmp) current = new Date(tmp);
    if (!current) {
      current = new Date();
      localStorage.setItem('Voucher.lastVoucherDate', current.toISOString());
    }
    return current;
  }

  set lastVoucherDate(date: Date) {
    if (date instanceof Date) {
      localStorage.setItem('Voucher.lastVoucherDate', date.toISOString());
    }
  }

  roundUsing(number, func, prec) {
    var temp = number * Math.pow(10, prec)
    temp = func(temp);
    return temp / Math.pow(10, prec);
  }
}
