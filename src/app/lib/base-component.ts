import { OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ReuseComponent } from './reuse-component';
import { Subscription, Subject } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { Icon } from './custom-element/card-header/card-header.component';
import { ActionControl } from './custom-element/action-control-list/action-control.interface';

export abstract class BaseComponent implements OnInit, OnDestroy, ReuseComponent, AfterViewInit {

  abstract componentName: string = '';
  requiredPermissions: string[] = ['ACCESS'];

  protected subcriptions: Subscription[] = [];
  protected destroy$: Subject<void> = new Subject<void>();
  public reuseDialog = false;
  public showLoadinng = true;
  public sourceOfDialog: string = null;
  public loading = false;

  public overlayWraper: JQuery;
  public overlayBackdrop: JQuery;


  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() onDialogClose?: () => void;
  @Input() onDialogHide?: () => void;
  @Input() onAfterInit?: () => void;

  favicon: Icon = { pack: 'eva', name: 'list', size: 'medium', status: 'primary' };
  @Input() title?: string;
  @Input() size?: string = 'medium';
  actionButtonList: ActionControl[] = [
    {
      name: 'refresh',
      status: 'success',
      // label: 'Refresh',
      icon: 'sync',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.refresh'), 'head-title'),
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
      label: 'esc',
      icon: 'close',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.close'), 'head-title'),
      size: 'medium',
      disabled: () => false,
      hidden: () => !this.ref || Object.keys(this.ref).length === 0 ? true : false,
      click: () => {
        this.close();
        return false;
      },
    },
  ];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<BaseComponent> & { [key: string]: any },
  ) {
    commonService.iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  // init() {
  //   this.restrict();
  // }

  restrict() {
    this.commonService.checkPermission(this.componentName, 'ACCESS', result => {
      if (!result) {
        this.commonService.gotoNotification({
          title: 'Quyền truy cập',
          content: 'Bạn không có quyền trên chức năng vừa truy cập !',
          actions: [
            {
              label: 'OK', status: 'success', action: () => {
                this.router.navigate(['/']);
              },
            },
          ],
        });
      }
    });
  }

  ngOnInit(): void {
    if (!this.ref) {
      this.commonService.clearHeaderActionControlList();
    }
    this.restrict();
    this.init();
  }

  async init(): Promise<boolean> {
    return true;
  }

  onResume() {
    this.commonService.clearHeaderActionControlList();
    this.restrict();
  }

  ngOnDestroy(): void {
    if (!this.ref) {
      this.commonService.clearHeaderActionControlList();
    }
    if (this.subcriptions) {
      this.subcriptions.forEach(subciption => {
        subciption.unsubscribe();
      });
    }
    this.destroy$.next();
    this.destroy$.complete();
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
        this.ref.hide = () => {
          this.overlayWraper.fadeOut(100);
          this.overlayBackdrop.fadeOut(100);
          setTimeout(() => {
            dialog.close();
          }, 100);
          if (this.onDialogHide) this.onDialogHide();
        };

        // Show dialog
        this.ref.show = (config?: { events?: { [key: string]: any } }) => {
          if (config && config.events) {
            Object.keys(config.events).forEach((eventName: string) => {
              this[eventName] = config.events[eventName];
            });
          }
          const lastBackdrop = $('.cdk-global-overlay-wrapper:last');
          lastBackdrop.after(this.overlayBackdrop);
          this.overlayBackdrop.after(this.overlayWraper);
          this.overlayWraper.fadeIn(100);
          this.overlayBackdrop.fadeIn(100);
          if (this.onDialogHide) this.onDialogHide();
        };

        compoentNativeEle.closest('.cdk-global-overlay-wrapper').addClass('dialog');
        console.log(compoentNativeEle);
      }
    }
  }

  refresh() {

  }

  close() {
    if (this.ref) {
      if (this.reuseDialog && this.ref.hide) {
        this.ref.hide();
      } else {
        this.ref.close();
      }
    }
  }

  hide() {
    if (this.ref && this.ref.hide) {
      this.ref.hide();
    }
  }

  show() {
    if (this.ref) {
      // if (this.reuseDialog && this.ref.hide) {
      //   this.ref.show();
      // } else {
      this.ref.close();
      // }
    }
  }

  async loadCache(): Promise<any> {
    return true;
  }

  async clearCache(): Promise<any> {
    return true;
  }

}
