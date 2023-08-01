import { CommonService } from './../../../services/common.service';
import { Component, Input, ViewChild, AfterViewInit, ElementRef, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { MytableContent } from '../../../lib/custom-element/my-components/my-table/my-table.component';
import { Subject, Subscription } from 'rxjs';
import { ActionControl } from '../../../lib/custom-element/action-control-list/action-control.interface';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { Icon } from '../../../lib/custom-element/card-header/card-header.component';

export interface DialogActionButton {
  label: string;
  icon?: string;
  rightIcon?: string;
  status?: string;
  outline?: boolean;
  disabled?: boolean;
  focus?: boolean;
  keyShortcut?: string;
  action?: (item?: DialogActionButton, dialog?: ShowcaseDialogComponent) => any;
};

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent implements AfterViewInit, OnInit, OnDestroy {

  // @Input() title: string;
  @Input() content: string;
  @Input() footerContent: string;
  @Input() tableContent: MytableContent;
  // @Input() onAfterInit: () => void;
  @Input() actions: DialogActionButton[];
  @ViewChild('dialogWrap', { static: true }) dialogWrap: ElementRef;
  @Input() onClose?: (asCase?: string) => void;
  // @Input() onKeyboardEvent?: (event: KeyboardEvent, component: ShowcaseDialogComponent) => void;
  // loading = false;
  closeCase?: string = 'default';

  // constructor(public ref: NbDialogRef<ShowcaseDialogComponent>, public cms?: CommonService) {

  // }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.cms.dialogStack[this.cms.dialogStack.length - 1] === this.ref) {
      console.log(event.key + ': listen on show case dialog...');
      const action = this.actions.find(f => f.keyShortcut == event.key);
      if (action) {
        action.action(action, this);
        return false;
      }
      if (this.onKeyboardEvent) {
        return this.onKeyboardEvent(event, this);
      }
    }
    return true;
  }

  // ngOnInit(): void {
  //   if (this.actions) {
  //     for (const element of this.actions) {
  //       // if (!element.action) {
  //       // }

  //       if (typeof element.disabled === 'undefined') {
  //         element.disabled = false;
  //       }

  //       const superAction = element.action;
  //       element.action = async (item?: DialogActionButton, dialog?: ShowcaseDialogComponent) => {
  //         superAction && (await superAction(item, dialog));
  //         this.dismiss('action');
  //       };
  //       if (!element.status) {
  //         element.status = 'info';
  //       }
  //     };
  //   }
  // }

  onButtonClick(item: DialogActionButton) {
    item?.action(item, this);
  }

  setLoading(status: boolean) {
    this.loading = status;
  }


  // ngAfterViewInit(): void {
  //   // $(this.dialogWrap.nativeElement).closest('.cdk-overlay-pane').css({ width: '100%' });
  //   // $('.cdk-overlay-pane:has(ngx-showcase-dialog)').css({ width: '100%' });
  //   if (this.ref) {
  //     const dialog: NbDialogRef<ShowcaseDialogComponent> = this.ref;
  //     const nativeEle = dialog.componentRef.location.nativeElement;
  //     // tslint:disable-next-line: ban
  //     $(nativeEle).closest('.cdk-global-overlay-wrapper').addClass('dialog');
  //     $(nativeEle).find('.buttons-row button.is-focus')[0]?.focus();
  //   }
  //   this.onAfterInit && this.onAfterInit();
  // }

  // ngOnDestroy(): void {
  //   this.onClose && this.onClose(this.closeCase);
  // }

  dismiss(asCase?: string) {
    this.closeCase = asCase;
    // this.onClose && this.onClose(asCase);
    this.ref.close();
  }







  componentName = '';
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
  @Input() onAfterInit?: (component?: ShowcaseDialogComponent) => void;

  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  @Input() title?: string;
  @Input() size?: string = 'medium';
  @Input() actionButtonList?: ActionControl[] = [];

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<ShowcaseDialogComponent>,
  ) {
    cms.iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
    this.cms.systemConfigs$.subscribe(settings => {
      if (settings.LICENSE_INFO && settings.LICENSE_INFO.register && settings.LICENSE_INFO.register) {
        this.registerInfo.voucherInfo = settings.LICENSE_INFO.register.voucherInfo.replace(/\\n/g, '<br>');
        this.registerInfo.voucherLogo = settings.LICENSE_INFO.register.voucherLogo;
        this.registerInfo.voucherLogoHeight = settings.LICENSE_INFO.register.voucherLogoHeight;
      }
    });
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

  onKeyboardEvent(event: KeyboardEvent, component?: ShowcaseDialogComponent) {
    return true;
  }
  onKeyupEvent(event: KeyboardEvent) {
    return true;
  }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (this.ref instanceof NbDialogRef) {
  //     if (this.cms.dialogStack[this.cms.dialogStack.length - 1] === this.ref) {
  //       return this.onKeyboardEvent(event);
  //     }
  //   } else {
  //     return this.onKeyboardEvent(event);
  //   }
  //   return true;
  // }
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

    if (this.actions) {
      for (const element of this.actions) {
        // if (!element.action) {
        // }

        if (typeof element.disabled === 'undefined') {
          element.disabled = false;
        }

        const superAction = element.action;
        element.action = async (item?: DialogActionButton, dialog?: ShowcaseDialogComponent) => {
          superAction && (await superAction(item, dialog));
          this.dismiss('action');
        };
        if (!element.status) {
          element.status = 'info';
        }
      };
    }
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
      const dialog: NbDialogRef<ShowcaseDialogComponent> = this.ref;
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


}
