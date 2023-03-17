import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { ActionControl } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { UserActive } from '../../../../@core/data/user-activity';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbThemeService, NbLayoutScrollService, NbIconLibraries, NbDialogService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { QuickTicketFormComponent } from '../../../helpdesk/dashboard/quick-ticket-form/quick-ticket-form.component';
import { SmsModel } from '../../../../models/sms.model';

interface MnfiniteLoadModel<M> {
  data: (M & {selected: boolean})[];
  placeholders: any[];
  loading: boolean;
  pageToLoadNext: number;
}

@Component({
  selector: 'ngx-sms-sent-list',
  templateUrl: './sms-sent-list.component.html',
  styleUrls: ['./sms-sent-list.component.scss'],
})
export class SmsSentListComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  componentName = 'SmsSentListComponent';
  idKey = 'Code';

  // private $: any;

  private alive = true;
  select2Option = {
    placeholder: 'Chọn...',
    allowClear: false,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'DomainUuid',
      text: 'DomainName',
    },
  };

  userActivity: UserActive[] = [];
  type = 'month';
  types = ['week', 'month', 'year'];
  currentTheme: string;
  option: any;

  selectedItems: SmsModel[] = [];
  selectedItemEles: { id: string, el: any }[] = [];

  hadRowsSelected = false;
  hadMultiRowSelected = false;
  actionButtonList: ActionControl[] = [
    {
      type: 'text',
      name: 'search',
      status: 'default',
      label: 'Search',
      icon: 'message-square',
      title: 'Tìm kiếm',
      size: 'medium',
      value: () => {
        return this.keyword;
      },
      disabled: () => {
        return false;
      },
      click: () => {
        // this.refresh();
        return false;
      },
      change: (event, option) => {
        this.keyword = event.target.value;
        this.onFilterChange();
        return false;
      },
      typing: (event, option) => {
        this.keyword = event.target.value;
        return false;
      },
    },
    // {
    //   type: 'button',
    //   name: 'chat',
    //   status: 'success',
    //   label: 'Chat',
    //   icon: 'message-square',
    //   title: 'Vào phòng chat',
    //   size: 'tiny',
    //   disabled: () => {
    //     return !this.hadRowsSelected || this.hadMultiRowSelected;
    //   },
    //   click: () => {
    //     // this.refresh();
    //     if (this.selectedItems.length > 0) {
    //       this.openChatRoom(this.selectedItems[0].ChatRoom);
    //     }
    //     return false;
    //   },
    // },
    // {
    //   type: 'button',
    //   name: 'call',
    //   status: 'primary',
    //   label: 'Gọi',
    //   icon: 'phone-call',
    //   title: 'Gọi cho người được hỗ trợ',
    //   size: 'tiny',
    //   disabled: () => {
    //     return false;
    //   },
    //   click: () => {
    //     this.cms.openMenuSidebar();
    //     this.mobileAppService.switchScreen('phone');
    //     // this.refresh();
    //     return false;
    //   },
    // },
    // {
    //   type: 'button',
    //   name: 'create',
    //   status: 'warning',
    //   label: 'Tạo',
    //   icon: 'file-add',
    //   title: 'Tạo TICKET mới',
    //   size: 'tiny',
    //   disabled: () => {
    //     return false;
    //   },
    //   click: () => {
    //     // this.createNewItem();
    //     return false;
    //   },
    // },
    // {
    //   type: 'button',
    //   name: 'create',
    //   status: 'info',
    //   label: 'Cập nhật',
    //   icon: 'edit',
    //   title: 'Cập nhật TICKET',
    //   size: 'tiny',
    //   disabled: () => {
    //     return false;
    //   },
    //   click: () => {
    //     this.editItem();
    //     return false;
    //   },
    // },
    // {
    //   type: 'button',
    //   name: 'view',
    //   status: 'success',
    //   label: 'Xem',
    //   icon: 'external-link',
    //   title: 'Xem thông tin TICKET',
    //   size: 'tiny',
    //   disabled: () => {
    //     return !this.hadRowsSelected || this.hadMultiRowSelected;
    //   },
    //   click: () => {
    //     // this.createNewItem();
    //     return false;
    //   },
    // },
    // {
    //   type: 'button',
    //   name: 'remove',
    //   status: 'danger',
    //   label: 'Huỷ',
    //   icon: 'close-circle',
    //   title: 'Huỷ yêu cầu',
    //   size: 'tiny',
    //   disabled: () => {
    //     return !this.hadRowsSelected;
    //   },
    //   click: () => {
    //     // this.reset();
    //     return false;
    //   },
    // },
    {
      type: 'button',
      name: 'refresh',
      status: 'success',
      label: 'Refresh',
      icon: 'sync',
      title: 'Làm mới',
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.refresh();
        return false;
      },
    },
  ];

  keyword: string = '';

  showQuickForm = false;

  infiniteLoadModel: MnfiniteLoadModel<SmsModel & {Preview: string}> = {
    data: [],
    placeholders: [],
    loading: false,
    pageToLoadNext: 1,
  };
  pageSize = 10;

  quickFormOnInitSubject = new BehaviorSubject<string>(null);
  quickFormOnInit$ = this.quickFormOnInitSubject.asObservable();

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public themeService: NbThemeService,
    public layoutScrollService: NbLayoutScrollService,
    public iconsLibrary: NbIconLibraries,
    public renderer: Renderer2,
    public dialogService: NbDialogService,
    // private mobileAppService: MobileAppService,
  ) {
    super(cms, router, apiService);

    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.loadList();

  }

  onResume() {
    super.onResume();
  }

  ngOnInit() {
    // this.cms.openMobileSidebar();
  }

  onFilterChange() {
    this.cms.takeUntil('sms-sent-filter-change', 500, () => {
      this.infiniteLoadModel.pageToLoadNext = 1;
      this.infiniteLoadModel.data = [];
      this.loadNext(this.infiniteLoadModel);
    });
  }

  loadNext(cardData: MnfiniteLoadModel<SmsModel & {Preview: string}>) {
    if (cardData.loading) { return; }

    cardData.loading = true;
    cardData.placeholders = new Array(this.pageSize);

    this.apiService.get<(SmsModel & {selected: boolean, Preview: string})[]>('/sms/sms', { search: this.keyword, limit: this.pageSize, offset: (cardData.pageToLoadNext - 1) * this.pageSize }, nextList => {

      nextList.forEach((i: any) => {
        const firstRecipient = i.Recipients ? i.Recipients[0] : null;
        if (firstRecipient) {
          i['Preview'] = i['Content'].replace('$ten', firstRecipient['Name']);
          i['Preview'] = i['Preview'].replace('$so_dien_thoai', firstRecipient['Phone']);
          i['Preview'] = i['Preview'].replace('$email', firstRecipient['Email']);
          i['Preview'] = i['Preview'].replace('$tham_so_1', i['Var1']);
          i['Preview'] = i['Preview'].replace('$tham_so_2', i['Var2']);
          i['Preview'] = i['Preview'].replace('$tham_so_3', i['Var3']);
          i['Preview'] = i['Preview'].replace('$tham_so_4', i['Var4']);
        }
      });

      cardData.placeholders = [];
      cardData.data.push(...nextList);
      cardData.loading = false;
      cardData.pageToLoadNext++;

    });

  }

  ngAfterViewInit(): void {
    // tslint:disable-next-line: ban
    const helpdeskDashboard = $(document.getElementById('helpdeskDashboard'));
    // tslint:disable-next-line: ban
    const helpdeskHeaderEle = $(document.getElementById('helpdeskHeader'));
    this.subcriptions.push(this.layoutScrollService.getPosition().subscribe(position => {
      console.info(position);
    }));
    let checkpoint = null;
    this.subcriptions.push(this.layoutScrollService.onScroll().subscribe(position => {
      const helpdeskHeaderOffset = helpdeskHeaderEle.offset();
      const helpdeskDashboardOffset = helpdeskDashboard.offset();
      if (!checkpoint && helpdeskHeaderOffset.top < 50) {
        checkpoint = helpdeskDashboardOffset.top;

        this.cms.pushHeaderActionControlList(this.actionButtonList);

      }

      if (checkpoint && helpdeskDashboardOffset.top > checkpoint) {
        this.cms.pushHeaderActionControlList([]);
        checkpoint = null;
      }


    }));
  }

  loadList() {
    // this.apiService.get<SmsModel[]>('/helpdesk/tickets', { limit: 20 }, list => {
    //   this.dataList = list.map(item => {
    //     item['selected'] = false;
    //     return item;
    //   });
    // });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  async refresh() {
    this.cms.takeUntil('helpdesk-filter-change', 500, () => {
      this.infiniteLoadModel.pageToLoadNext = 1;
      this.infiniteLoadModel.data = [];
      this.loadNext(this.infiniteLoadModel);
    });
    this.deleteSelected();
    return false;
  }

  deleteSelected() {
    this.selectedItems = [];
    this.hadRowsSelected = false;
    this.hadMultiRowSelected = false;
    return false;
  }

  editSelectedItem() {
    return false;
  }



  async onQuickFormInit(event: QuickTicketFormComponent) {
    console.info(event);
    // this.quickTicketFormList.filter(f => f.index === event.index)[0].form = event;

    // // Load form by contact phone
    // if (await event.loadByCallSessionId()) {
    //   // Auto save after init 10s
    //   setTimeout(() => {
    //     event.save();
    //   }, 10000);
    // } else {
    //   event.loadByPhoneNumber().then(rs => {
    //     if (rs) {
    //       this.quickFormOnInitSubject.next(event.index);

    //       // Auto save after init 10s
    //       event.save();
    //     }
    //   });
    // }
  }


  reset() {
    this.deleteSelected();
    return false;
  }

  toggleSelectItem(event: any, item: SmsModel) {
    item['selected'] = !item['selected'];
    if (item['selected']) {
      this.selectedItems.push(item);
      this.renderer.addClass(event.currentTarget, 'selected');
    } else {
      this.selectedItems = this.selectedItems.filter(sItem => sItem[this.idKey] !== item[this.idKey]);
      this.renderer.removeClass(event.currentTarget, 'selected');
    }
    this.hadRowsSelected = this.selectedItems.length > 0;
    this.hadMultiRowSelected = this.selectedItems.length > 1;
    return false;
  }

  selectOne(event: any, item: SmsModel) {
    this.selectedItemEles.forEach(selectedItemEle => {
      this.renderer.removeClass(selectedItemEle.el, 'selected');
    });
    this.selectedItems = [item];
    this.selectedItemEles = [{ id: item[this.idKey], el: event.currentTarget }];
    this.renderer.addClass(event.currentTarget, 'selected');
    this.hadRowsSelected = this.selectedItems.length > 0;
    this.hadMultiRowSelected = this.selectedItems.length > 1;
    return false;
  }

}
