import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { takeWhile } from 'rxjs/operators';
import { UserActive, UserActivityData } from '../../../../@core/data/user-activity';
import { NbThemeService, NbIconLibraries, NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { OrdersChart } from '../../../../@core/data/orders-chart';
import { OrdersProfitChartData } from '../../../../@core/data/orders-profit-chart';
import { ActionControl } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ContactModel } from '../../../../models/contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'ngx-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  componentName = 'ContactListComponent';
  idKey = 'Code';

  // private $: any;

  private alive = true;
  // select2Option = {
  //   placeholder: 'Chọn...',
  //   allowClear: false,
  //   width: '100%',
  //   dropdownAutoWidth: true,
  //   minimumInputLength: 0,
  //   keyMap: {
  //     id: 'DomainUuid',
  //     text: 'DomainName',
  //   },
  // };

  userActivity: UserActive[] = [];
  type = 'month';
  types = ['week', 'month', 'year'];
  currentTheme: string;
  option: any;

  dataList: ContactModel[] | { selected: boolean }[] = [];
  selectedItems: ContactModel[] = [];
  selectedItemEles: { id: string, el: any }[] = [];

  ordersChartData: OrdersChart;

  // @ViewChild('helpdeskDashboard', { static: true }) helpdeskDashboard: ElementRef;
  // @ViewChild('helpdeskHeader', { static: true }) helpdeskHeader: ElementRef;

  hadRowsSelected = false;
  hadMultiRowSelected = false;
  actionButtonList: ActionControl[] = [
    // {
    //   type: 'text',
    //   name: 'search',
    //   status: 'default',
    //   label: 'Search',
    //   icon: 'message-square',
    //   title: 'Tìm kiếm',
    //   size: 'tiny',
    //   value: () => {
    //     return this.keyword;
    //   },
    //   disabled: () => {
    //     return false;
    //   },
    //   click: () => {
    //     // this.refresh();
    //     return false;
    //   },
    //   change: (event, option) => {
    //     this.keyword = event.target.value;
    //     this.onFilterChange();
    //     return false;
    //   },
    //   typing: (event, option) => {
    //     this.keyword = event.target.value;
    //     return false;
    //   },
    // },
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
    //     this.commonService.openMenuSidebar();
    //     this.mobileAppService.switchScreen('phone');
    //     // this.refresh();
    //     return false;
    //   },
    // },
    {
      type: 'button',
      name: 'create',
      status: 'warning',
      label: 'Tạo liên hệ',
      icon: 'file-add',
      title: 'Tạo liên hệ mới',
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.createNewItem();
        return false;
      },
    },
    {
      type: 'button',
      name: 'advanceFilter',
      status: 'primary',
      label: 'Tìm kiếm nâng cao',
      icon: 'funnel',
      title: 'Tìm kiếm nâng cao',
      size: 'medium',
      hidden: () => {
        return this.isAdvanceFilter;
      },
      click: () => {
        this.isAdvanceFilter = true;
        // this.reset();
        return false;
      },
    },
    {
      type: 'button',
      name: 'Bỏ lọc',
      status: 'danger',
      label: 'Đặt lại',
      icon: 'refresh',
      title: 'Đặt lại tìm kiếm và sắp xếp',
      size: 'medium',
      hidden: () => {
        return !this.isAdvanceFilter;
      },
      click: () => {
        this.reset();
        this.isAdvanceFilter = false;
        return false;
      },
    },
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
  isAdvanceFilter = false;

  filter: { [key: string]: { type?: string, name?: string, placeholder?: string, value?: string } } = {
    Title: {
      type: 'text',
      name: 'Name',
      placeholder: 'Tên',
      value: '',
    },
    Name: {
      type: 'text',
      name: 'Name',
      placeholder: 'Tên',
      value: '',
    },
    ShortName: {
      type: 'text',
      name: 'ShortName',
      placeholder: 'Tên',
      value: '',
    },
    Phone: {
      type: 'text',
      name: 'Phone',
      placeholder: 'Số điện thoại',
      value: '',
    },
    Phone2: {
      type: 'text',
      name: 'Phone',
      placeholder: 'Số điện thoại',
      value: '',
    },
    Phone3: {
      type: 'text',
      name: 'Phone',
      placeholder: 'Số điện thoại',
      value: '',
    },
    Email: {
      type: 'text',
      name: 'Email',
      placeholder: 'Email',
      value: '',
    },
    Address: {
      type: 'text',
      name: 'Address',
      placeholder: 'Địa chỉ',
      value: '',
    },
    Organization: {
      type: 'text',
      name: 'Organization',
      placeholder: 'Công ty',
      value: '',
    },
    Type: {
      type: 'text',
      name: 'Type',
      placeholder: 'Công ty',
      value: '',
    },
    Note: {
      type: 'text',
      name: 'Type',
      placeholder: 'Công ty',
      value: '',
    },
  };

  // quickTicketFormList: { index: string, ticketCode?: string, phoneNumber?: string, form?: QuickTicketFormComponent }[] = [];

  infiniteLoadModel: {data: (ContactModel&{selected?: boolean, color?: string})[], placeholders: any[], loading: boolean, pageToLoadNext: number} = {
    data: [],
    placeholders: [],
    loading: false,
    pageToLoadNext: 1,
  };
  pageSize = 10;

  // @ViewChild('quickTicketForm', { static: true }) quickTicketForm: QuickTicketFormComponent;

  quickFormOnInitSubject = new BehaviorSubject<string>(null);
  quickFormOnInit$ = this.quickFormOnInitSubject.asObservable();
  private callStateSubscription: Subscription;

  select2Option = {
    placeholder: 'Nhóm...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 1,
    keyMap: {
      id: 'Code',
      text: 'Name',
    },
    ajax: {
      url: params => {
        return this.apiService.buildApiUrl('/contact/contacts', {filter_Name: params['term']});
      },
      delay: 300,
      processResults: (data: any, params: any) => {
        console.info(data, params);
        return {
          results: data.map(item => {
            item['id'] = item['Code'];
            item['text'] = item['Name'];
            return item;
          }),
        };
      },
    },
  };

  textCorlors = {
    darkslategray: {
      light: 'darkslategray',
      dark: '#519696',
    },
    orange: {
      light: 'orange',
      dark: 'orange',
    },
  };

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public themeService: NbThemeService,
    public userActivityService: UserActivityData,
    public ordersProfitChartService: OrdersProfitChartData,
    public layoutScrollService: NbLayoutScrollService,
    public iconsLibrary: NbIconLibraries,
    public renderer: Renderer2,
    public dialogService: NbDialogService,
    // private mobileAppService: MobileAppService,
    // private mmobileAppService: MobileAppService,
  ) {
    super(commonService, router, apiService);

    // iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });

    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    this.getUserActivity(this.type);
    this.getOrdersChartData('week');

    this.loadList();
  }

  onResume() {
    // this.commonService.openMobileSidebar();
    super.onResume();
    this.callStateSubscription.unsubscribe();
  }

  ngOnInit() {
    this.commonService.openMobileSidebar();
  }

  onFilterChange() {
    this.commonService.takeUntil('helpdesk-filter-change', 500, () => {
      this.infiniteLoadModel.pageToLoadNext = 1;
      this.infiniteLoadModel.data = [];
      this.loadNext(this.infiniteLoadModel);
    });
  }

  loadNext(cardData: {data: (ContactModel&{selected?: boolean, color?: string})[], placeholders: any[], loading: boolean, pageToLoadNext: number}) {
    if (cardData.loading) { return; }

    cardData.loading = true;
    cardData.placeholders = new Array(this.pageSize);

    const query = {
      search: this.keyword,
      sort_Id: 'desc',
      includeOrganizations: true,
      includeGroups: true,
      limit: this.pageSize,
      offset: (cardData.pageToLoadNext - 1) * this.pageSize,
    };

    Object.keys(this.filter).forEach(k => {
      if (this.filter[k].value) {
        query['filter_' + k] = this.filter[k].value;
      }
    });

    // if (this.filterName) query['filterName'] = this.filterName;
    // if (this.filterPhone) query['filterPhone'] = this.filterPhone;
    // if (this.filterEmail) query['filterEmail'] = this.filterEmail;
    // if (this.filterAddress) query['filterAddress'] = this.filterAddress;

    this.apiService.getPromise<(ContactModel&{selected?: boolean, color?: string})[]>('/contact/contacts', query).then(nextList => {
      // this.dataList = list.map(item => {
      //   item['selected'] = false;
      //   return item;
      // });

      cardData.placeholders = [];
      cardData.data.push(...nextList.map(i => {
        i.color = 'darkslategray';
        return i;
      }));
      cardData.loading = false;
      cardData.pageToLoadNext++;

    }).catch(e => {
      cardData.loading = false;
    });

    // this.newsService.load(cardData.pageToLoadNext, this.pageSize)
    //   .subscribe(nextNews => {
    //     cardData.placeholders = [];
    //     cardData.news.push(...nextNews);
    //     cardData.loading = false;
    //     cardData.pageToLoadNext++;
    //   });
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

        this.commonService.pushHeaderActionControlList(this.actionButtonList);

        //   helpdeskHeaderEle.css({ position: 'fixed', zIndex: 1, width: fixedWidth, top: fixedOffset.top, left: helpdeskHeaderOffset.left });
        //   helpdeskDashboard.css({paddingTop: helpdeskHeaderEle.height() + 17});
      }

      // console.info(`${checkpoint} && ${helpdeskDashboardOffset.top} >= ${checkpoint}`);
      if (checkpoint && helpdeskDashboardOffset.top > checkpoint) {
        //   helpdeskHeaderEle.css({ position: 'relative', zIndex: 'initial', width: 'initial', top: 'initial', left: 'initial' });
        //   helpdeskDashboard.css({paddingTop: 'initial'});
        this.commonService.pushHeaderActionControlList([]);
        checkpoint = null;
      }


    }));
  }

  loadList() {
    // this.apiService.get<ContactModel[]>('/helpdesk/tickets', { limit: 20 }, list => {
    //   this.dataList = list.map(item => {
    //     item['selected'] = false;
    //     return item;
    //   });
    // });
  }

  getOrdersChartData(period: string) {
    this.ordersProfitChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });
  }

  getUserActivity(period: string) {
    this.userActivityService.getUserActivityData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(userActivityData => {
        this.userActivity = userActivityData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
    this.commonService.pushHeaderActionControlList([]);
  }

  refresh() {
    this.commonService.takeUntil('helpdesk-filter-change', 500, () => {
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

  // editSelectedItem() {
  //   return false;
  // }

  clearFilter() {
    Object.keys(this.filter).forEach(k => this.filter[k].value = '');
  }

  reset() {
    this.deleteSelected();
    this.refresh();
    return false;
  }

  toggleSelectItem(event: any, item: ContactModel) {
    item['selected'] = !item['selected'];
    if (item['selected']) {
      this.selectedItems.push(item);
      this.renderer.addClass(event.currentTarget, 'selected');
    } else {
      this.selectedItems = this.selectedItems.filter(sItem => sItem[this.idKey] !== item[this.idKey]);
      this.renderer.removeClass(event.currentTarget, 'selected');
    }
    // console.info(this.selectedItems);
    this.hadRowsSelected = this.selectedItems.length > 0;
    this.hadMultiRowSelected = this.selectedItems.length > 1;
    return false;
  }

  selectOne(event: any, item: ContactModel) {
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

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: ContactModel[]) => void, onDialogClose?: () => void) {
    this.dialogService.open(ContactFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: ContactModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
  }

  editSelectedItem(): false {
    // console.info(this.getSelectedRows());
    this.openFormDialplog(this.selectedItems.map(i => i.Code), newData => {
      this.refresh();
    }, () => { });
    return false;
  }

  editItem(id: string): false {
    // console.info(this.getSelectedRows());
    this.openFormDialplog([id], newData => {
      this.refresh();
    }, () => { });
    return false;
  }

  // createNew() {
  //   this.openFormDialplog(null, newData => {
  //     this.refresh();
  //   }, () => { });
  //   return false;
  // }

  createNewItem(): false {
    this.openFormDialplog(null, newData => {
      this.refresh();
    }, () => { });
    return false;
  }

  onObjectChange(event) {

  }

  search() {
    this.refresh();
  }
}
