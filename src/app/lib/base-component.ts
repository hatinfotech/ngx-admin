import { OnInit, OnDestroy, Input, Type, TemplateRef } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ReuseComponent } from './reuse-component';
import { Subscription, Subject } from 'rxjs';
import { NbDialogRef, NbDialogConfig } from '@nebular/theme';
import { Icon } from './custom-element/card-header/card-header.component';
import { ActionControl } from './custom-element/action-control-list/action-control.interface';

export abstract class BaseComponent implements OnInit, OnDestroy, ReuseComponent {

  abstract componentName: string = '';
  requiredPermissions: string[] = ['ACCESS'];

  protected subcriptions: Subscription[] = [];
  protected destroy$: Subject<void> = new Subject<void>();
  public reuseDialog = false;

  @Input() inputMode: 'dialog' | 'page' | 'inline';
  @Input() onDialogClose?: () => void;
  @Input() onDialogHide?: () => void;

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
      // label: 'Refresh',
      icon: 'close',
      title: this.commonService.textTransform(this.commonService.translate.instant('Common.close'), 'head-title'),
      size: 'medium',
      disabled: () => false,
      hidden: () => !this['ref'] || Object.keys(this['ref']).length === 0 ? true : false,
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
  ) { }

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
    this.commonService.updateHeaderActionControlList([]);
    this.restrict();
    this.init();
  }

  async init(): Promise<boolean> {
    return true;
  }

  onResume() {
    this.commonService.updateHeaderActionControlList([]);
    this.restrict();
  }

  ngOnDestroy(): void {
    this.commonService.updateHeaderActionControlList([]);
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
    if (this['ref']) {
      const dialog: NbDialogRef<BaseComponent> = this['ref'];
      if (dialog && dialog.componentRef && dialog.componentRef.location && dialog.componentRef.location.nativeElement) {
        const nativeEle = dialog.componentRef.location.nativeElement;
        // tslint:disable-next-line: ban
        const compoentNativeEle = $(nativeEle);
        const overlayWraper = compoentNativeEle.closest('.cdk-global-overlay-wrapper');
        const overlayBackdrop = overlayWraper.prev();

        // Hide dialog
        this['ref'].hide = () => {
          overlayWraper.fadeOut(100);
          overlayBackdrop.fadeOut(100);
          if (this.onDialogHide) this.onDialogHide();
        };

        // Show dialog
        this['ref'].show = (config?: { events?: { [key: string]: any } }) => {
          if (config && config.events) {
            Object.keys(config.events).forEach((eventName: string) => {
              this[eventName] = config.events[eventName];
            });
          }
          const lastBackdrop = $('.cdk-global-overlay-wrapper:last');
          lastBackdrop.after(overlayBackdrop);
          overlayBackdrop.after(overlayWraper);
          overlayWraper.fadeIn(100);
          overlayBackdrop.fadeIn(100);
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
    if (this['ref']) {
      if (this.reuseDialog && this['ref'].hide) {
        this['ref'].hide();
      } else {
        this['ref'].close();
      }
    }
  }

  hide() {
    if (this['ref'] && this['ref'].hide) {
      this['ref'].hide();
    }
  }

  show() {
    if (this['ref']) {
      // if (this.reuseDialog && this['ref'].hide) {
      //   this['ref'].show();
      // } else {
      this['ref'].close();
      // }
    }
  }

}
