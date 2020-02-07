import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { takeWhile } from 'rxjs/operators';
import { UserActive, UserActivityData } from '../../../../@core/data/user-activity';
import { NbThemeService, NbIconLibraries, NbLayoutScrollService } from '@nebular/theme';
import { OrdersChart } from '../../../../@core/data/orders-chart';
import { OrdersProfitChartData } from '../../../../@core/data/orders-profit-chart';
import { HelpdeskTicketModel } from '../../../../models/helpdesk-ticket.model';
import { ActionControl } from '../../../../interface/action-control.interface';

@Component({
  selector: 'ngx-helpdesk-dashboard',
  templateUrl: './helpdesk-dashboard.component.html',
  styleUrls: ['./helpdesk-dashboard.component.scss'],
})
export class HelpdeskDashboardComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  componentName = 'HelpdeskDashboardComponent';
  idKey = 'Code';

  private $: any;

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

  dataList: HelpdeskTicketModel[] | { selected: boolean }[] = [];
  selectedItems: HelpdeskTicketModel[] = [];

  ordersChartData: OrdersChart;

  // @ViewChild('helpdeskDashboard', { static: true }) helpdeskDashboard: ElementRef;
  // @ViewChild('helpdeskHeader', { static: true }) helpdeskHeader: ElementRef;

  hadRowsSelected = false;
  hadMultiRowSelected = false;
  actionControlListList: ActionControl[] = [
    {
      name: 'chat',
      status: 'success',
      label: 'Chat',
      icon: 'message-square',
      title: 'Vào phòng chat',
      size: 'tiny',
      disabled: () => {
        return !this.hadRowsSelected || this.hadMultiRowSelected;
      },
      click: () => {
        // this.refresh();
        return false;
      },
    },
    {
      name: 'call',
      status: 'primary',
      label: 'Gọi',
      icon: 'phone-call',
      title: 'Gọi cho người được hỗ trợ',
      size: 'tiny',
      disabled: () => {
        return !this.hadRowsSelected || this.hadMultiRowSelected;
      },
      click: () => {
        // this.refresh();
        return false;
      },
    },
    {
      name: 'create',
      status: 'warning',
      label: 'Tạo',
      icon: 'file-add',
      title: 'Tạo TICKET mới',
      size: 'tiny',
      disabled: () => {
        return this.hadRowsSelected;
      },
      click: () => {
        this.createNewItem();
        return false;
      },
    },
    {
      name: 'view',
      status: 'success',
      label: 'Xem',
      icon: 'external-link',
      title: 'Xem thông tin TICKET',
      size: 'tiny',
      disabled: () => {
        return !this.hadRowsSelected || this.hadMultiRowSelected;
      },
      click: () => {
        // this.createNewItem();
        return false;
      },
    },
    {
      name: 'remove',
      status: 'danger',
      label: 'Huỷ',
      icon: 'close-circle',
      title: 'Huỷ yêu cầu',
      size: 'tiny',
      disabled: () => {
        return !this.hadRowsSelected;
      },
      click: () => {
        // this.reset();
        return false;
      },
    },
    {
      name: 'refresh',
      status: 'success',
      label: 'Refresh',
      icon: 'sync',
      title: 'Làm mới',
      size: 'tiny',
      disabled: () => {
        return false;
      },
      click: () => {
        this.refresh();
        return false;
      },
    },
  ];

  constructor(
    protected commonService: CommonService,
    protected router: Router,
    protected apiService: ApiService,
    private themeService: NbThemeService,
    private userActivityService: UserActivityData,
    private ordersProfitChartService: OrdersProfitChartData,
    private layoutScrollService: NbLayoutScrollService,
    iconsLibrary: NbIconLibraries,
    private renderer: Renderer2,
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

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    const helpdeskDashboard = $(document.getElementById('helpdeskDashboard'));
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

        this.commonService.updateHeaderActionControlList(this.actionControlListList);

        //   helpdeskHeaderEle.css({ position: 'fixed', zIndex: 1, width: fixedWidth, top: fixedOffset.top, left: helpdeskHeaderOffset.left });
        //   helpdeskDashboard.css({paddingTop: helpdeskHeaderEle.height() + 17});
      }

      // console.info(`${checkpoint} && ${helpdeskDashboardOffset.top} >= ${checkpoint}`);
      if (checkpoint && helpdeskDashboardOffset.top > checkpoint) {
        //   helpdeskHeaderEle.css({ position: 'relative', zIndex: 'initial', width: 'initial', top: 'initial', left: 'initial' });
        //   helpdeskDashboard.css({paddingTop: 'initial'});
        this.commonService.updateHeaderActionControlList([]);
        checkpoint = null;
      }


    }));
  }

  loadList() {
    this.apiService.get<HelpdeskTicketModel[]>('/helpdesk/tickets', { limit: 20 }, list => {
      this.dataList = list.map(item => {
        item['selected'] = false;
        return item;
      });
    });
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
  }

  refresh() {
    this.loadList();
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

  createNewItem() {
    return false;
  }

  reset() {
    this.deleteSelected();
    return false;
  }

  toggleSelectItem(event: any, item: HelpdeskTicketModel) {
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

}
