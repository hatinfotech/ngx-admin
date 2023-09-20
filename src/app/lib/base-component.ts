import { OnInit, OnDestroy, Input, AfterViewInit, Component, HostListener } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ReuseComponent } from './reuse-component';
import { Subscription, Subject } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { Icon } from './custom-element/card-header/card-header.component';
import { ActionControl } from './custom-element/action-control-list/action-control.interface';
import { CurrencyMaskConfig } from 'ng2-currency-mask';
import { environment } from '../../environments/environment';
import { RootServices } from '../services/root.services';

@Component({ template: '' })
export abstract class BaseComponent implements OnInit, OnDestroy, ReuseComponent, AfterViewInit {

  abstract componentName: string;
  requiredPermissions: string[] = ['ACCESS'];

  protected subcriptions: Subscription[] = [];
  protected destroy$: Subject<void> = new Subject<void>();
  @Input() reuseDialog = false;
  public showLoadinng = true;
  public sourceOfDialog: string = null;
  public loading = false;

  public overlayWraper: JQuery;
  public overlayBackdrop: JQuery;

  registerInfo: any = {
    voucherInfo: this.cms.translateText('Information.Voucher.register'),
    voucherLogo: environment.register.logo.voucher,
    voucherLogoHeight: 60,
  };


  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() onDialogClose?: () => void;
  @Input() onDialogHide?: () => void;
  @Input() onAfterInit?: (component?: BaseComponent) => void;

  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  @Input() title?: string;
  @Input() size?: string = 'medium';
  @Input() actionButtonList?: ActionControl[] = [];

  isDialog = false;

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<BaseComponent>,
  ) {
    cms.iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.cms.systemConfigs$.subscribe(settings => {
      if (settings.LICENSE_INFO && settings.LICENSE_INFO.register && settings.LICENSE_INFO.register) {
        this.registerInfo.voucherInfo = settings.LICENSE_INFO.register.voucherInfo.replace(/\\n/g, '<br>');
        this.registerInfo.voucherLogo = settings.LICENSE_INFO.register.voucherLogo;
        this.registerInfo.voucherLogoHeight = settings.LICENSE_INFO.register.voucherLogoHeight;
      }
    });

    this.isDialog = this.ref instanceof NbDialogRef;
  }

  // init() {
  //   this.restrict();
  // }

  restrict() {
    this.cms.checkPermission(this.componentName, 'ACCESS', result => {
      if (!result) {
        // this.cms.gotoNotification({
        //   title: 'Quyền truy cập',
        //   content: 'Bạn không có quyền trên chức năng vừa truy cập !',
        //   actions: [
        //     {
        //       label: 'OK', status: 'success', action: () => {
        //         this.router.navigate(['/']);
        //       },
        //     },
        //   ],
        // });
        // this.cms.toastService.show('Bạn không có quyền truy cập ' + this.componentName + ' !', 'Quyền truy cập', {
        //   status: 'warning',
        // })
        console.warn('Bạn không có quyền truy cập ' + this.componentName + ' !!! tạm thời vẫn cho vào component nhưng sẽ phải fix lại là không cho vào component khi không có quyền');
        return false;
      }
      return true;
    });
  }

  onKeyboardEvent(event: KeyboardEvent, component?: BaseComponent) {
    return true;
  }
  onKeyupEvent(event: KeyboardEvent) {
    return true;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.ref instanceof NbDialogRef) {
      if (this.cms.dialogStack[this.cms.dialogStack.length - 1] === this.ref) {
        return this.onKeyboardEvent(event);
      }
    } else {
      return this.onKeyboardEvent(event);
    }
    return true;
  }
  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    if (this.ref instanceof NbDialogRef) {
      if (this.cms.dialogStack[this.cms.dialogStack.length - 1] === this.ref) {
        if (event.key == 'Escape' && this.ref['originalCloseOnEsc'] === true) {
          this.ref.close();
        }
        return this.onKeyupEvent(event);
      }
    } else {
      return this.onKeyupEvent(event);
    }
    return true;
  }

  ngOnInit(): void {
    if (!this.ref) {
      this.cms.clearHeaderActionControlList();
    }
    this.restrict();
    this.init();
  }

  async init(): Promise<boolean> {
    await this.cms.waitForReady();
    this.actionButtonList = [
      {
        name: 'refresh',
        status: 'success',
        // label: 'Refresh',
        icon: 'sync',
        title: this.cms.textTransform(this.cms.translate.instant('Common.refresh'), 'head-title'),
        size: 'medium',
        disabled: () => {
          return false;
        },
        click: () => {
          this.refresh();
          return false;
        },
      },
      {
        name: 'close',
        status: 'danger',
        // label: 'Refresh',
        icon: 'close',
        title: this.cms.textTransform(this.cms.translate.instant('Common.close'), 'head-title'),
        size: 'medium',
        disabled: () => false,
        hidden: () => !this.ref || Object.keys(this.ref).length === 0 ? true : false,
        click: () => {
          this.close();
          return false;
        },
      }
    ];
    return true;
  }

  onResume() {
    this.cms.clearHeaderActionControlList();
    this.restrict();
  }

  ngOnDestroy(): void {
    if (!this.ref) {
      this.cms.clearHeaderActionControlList();
    }
    if (this.subcriptions) {
      this.subcriptions.forEach(subciption => {
        subciption.unsubscribe();
      });
    }
    this.destroy$.next();
    this.destroy$.complete();
    setTimeout(() => {
      this.ref = null;
    }, 500);
  }

  ngAfterViewInit(): void {
    // const nativeEle = this;
    // Fix dialog scroll
    if (this.ref) {
      const dialog: NbDialogRef<BaseComponent> = this.ref;
      if (dialog && dialog.componentRef && dialog.componentRef.location && dialog.componentRef.location.nativeElement) {
        const nativeEle = dialog.componentRef.location.nativeElement;
        // tslint:disable-next-line: ban
        const compoentNativeEle = $(nativeEle);
        this.overlayWraper = compoentNativeEle.closest('.cdk-global-overlay-wrapper');
        this.overlayWraper.addClass('scrollable-container');
        this.overlayBackdrop = this.overlayWraper.prev();

        // Hide dialog
        (this.ref as any).hide = () => {
          this.overlayWraper.fadeOut(100);
          this.overlayBackdrop.fadeOut(100);
          // this.overlayWraper.removeClass('dialog');
          setTimeout(() => {
            dialog.close();
          }, 100);
          if (this.onDialogHide) this.onDialogHide();
        };

        // Show dialog
        (this.ref as any).show = (config?: { events?: { [key: string]: any } }) => {
          if (config && config.events) {
            Object.keys(config.events).forEach((eventName: string) => {
              this[eventName] = config.events[eventName];
            });
          }
          const lastBackdrop = $('.cdk-global-overlay-wrapper:last');
          lastBackdrop.after(this.overlayBackdrop);
          this.overlayBackdrop.after(this.overlayWraper);
          // this.overlayWraper.addClass('dialog');
          this.overlayWraper.fadeIn(100);
          this.overlayBackdrop.fadeIn(100);
          // if (this.onDialogHide) this.onDialogHide();
        };

        compoentNativeEle.closest('.cdk-global-overlay-wrapper').addClass('dialog');
        console.log(compoentNativeEle);
      }
    }
  }

  async refresh(): Promise<any> {
    return true;
  }

  close() {
    if (this.ref) {
      // if (this.reuseDialog && (this.ref as any).hide) {
      //   (this.ref as any).hide();
      // } else {
      this.ref.close();
      // }
    }
  }

  hide() {
    if (this.ref && (this.ref as any).hide) {
      (this.ref as any).hide();
    }
  }

  show() {
    if (this.ref) {
      // if (this.reuseDialog && this.ref.hide) {
      //   this.ref.show();
      // } else {
      // this.ref.close();
      // }
    }
  }

  async loadCache(): Promise<any> {
    return true;
  }

  async clearCache(): Promise<any> {
    return true;
  }

  encodeId(id: string) {
    return this.cms.getObjectId(id || '').replace(/-/g, '~!');
  }

  decodeId(id: string) {
    return id.replace(/~!/g, '-');
  }

  // Fix currency mask


  onPasteNumber(event, numberFormat: CurrencyMaskConfig) {
    console.log(event);
    let clipboardData = event.clipboardData || window['clipboardData'];
    let pastedText: string = clipboardData.getData('text');
    console.log(pastedText);
    const decimalSymbol = numberFormat.decimal;
    const thousandsSymbol = numberFormat.thousands;
    pastedText = pastedText.replace(new RegExp(`\\${thousandsSymbol}`, 'g'), '');
    pastedText = pastedText.replace(new RegExp(`\\${decimalSymbol}`, 'g'), '.');
    pastedText = parseFloat(pastedText) as any;
    pastedText = this.cms.roundUsing(pastedText, Math.floor, 2) as any;
    event.target.value = pastedText;
    return false;
  }

  public currencyMaskFocus($event, numberFormat: CurrencyMaskConfig) {
    //getting current value
    var value = $event.currentTarget.value;
    //splitting by the value by the decimal separator
    var splitted = value.split(numberFormat.decimal);
    //selecting the integer part, which will be replaced with what the user will type
    //For example: 100,82 - where , is the decimal separator
    //We would select 100
    $event.currentTarget.selectionStart = 0;
    $event.currentTarget.selectionEnd = splitted[0].length;
  }

  public currencyMastKeydown($event, numberFormat: CurrencyMaskConfig) {
    //When the user presses ,
    //We want to select the decimal part to allow editting only the decimal part
    if ($event.key == numberFormat.decimal) {
      //First of all, we cancel all event propagation and the default behavior!
      $event.stopPropagation();
      $event.preventDefault();
      //Then we get the value itself
      var value = $event.currentTarget.value;
      //Find out where the decimal separator ist
      var start = value.indexOf(numberFormat.decimal) + 1;
      //select only the decimal part
      //For example: 100,82 - where , is the decimal separator
      //Would select only 82
      $event.currentTarget.selectionStart = start;
      $event.currentTarget.selectionEnd = start + numberFormat.precision;
    }
  }

  onControlEnter(event: KeyboardEvent) {
    if ((event.target as HTMLElement).nodeName.toLowerCase() !== 'textarea') {
      return false;
    }
    // return event.preventDefault();
    // return true;
  }

}
