import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { UserActive, UserActivityData } from '../../../../@core/data/user-activity';
import { NbThemeService, NbIconLibraries, NbLayoutScrollService, NbDialogService } from '@nebular/theme';
import { OrdersChart } from '../../../../@core/data/orders-chart';
import { OrdersProfitChartData } from '../../../../@core/data/orders-profit-chart';
import { HelpdeskTicketModel, HelpdeskTicketCallingSessionModel } from '../../../../models/helpdesk.model';
import { ActionControl } from '../../../../lib/custom-element/action-control-list/action-control.interface';
import { QuickTicketFormComponent } from '../quick-ticket-form/quick-ticket-form.component';
import { MobileAppService, CallState } from '../../../mobile-app/mobile-app.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ContactModel } from '../../../../models/contact.model';
import { ShowcaseDialogComponent } from '../../../dialog/showcase-dialog/showcase-dialog.component';
import { PbxCdrModel } from '../../../../models/pbx-cdr.model';
import { DatePipe } from '@angular/common';
import { TicketPmsFormComponent } from '../ticket-pms-form/ticket-pms-form.component';

@Component({
  selector: 'ngx-helpdesk-dashboard',
  templateUrl: './helpdesk-dashboard.component.html',
  styleUrls: ['./helpdesk-dashboard.component.scss'],
})
export class HelpdeskDashboardComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  componentName = 'HelpdeskDashboardComponent';
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

  dataList: HelpdeskTicketModel[] | { selected: boolean }[] = [];
  selectedItems: HelpdeskTicketModel[] = [];
  selectedItemEles: { id: string, el: any }[] = [];

  ordersChartData: OrdersChart;

  // @ViewChild('helpdeskDashboard', { static: true }) helpdeskDashboard: ElementRef;
  // @ViewChild('helpdeskHeader', { static: true }) helpdeskHeader: ElementRef;

  hadRowsSelected = false;
  hadMultiRowSelected = false;
  processing = false;
  actionButtonList: ActionControl[] = [
    {
      type: 'text',
      name: 'search',
      status: 'primary',
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
    {
      type: 'button',
      name: 'create',
      status: 'warning',
      label: 'Tạo',
      icon: 'file-add',
      title: 'Tạo TICKET mới',
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
      name: 'getLostTicket',
      status: 'danger',
      label: 'Lấy yêu cầu nhỡ',
      icon: 'download',
      title: 'Lấy các yêu cầu từ cuộc gọi nhỡ',
      size: 'medium',
      disabled: () => {
        return this.processing;
      },
      click: () => {
        this.processing = true;
        this.fetchLostTicketByCallLogs().then(rs => {
          this.processing = false;
        });
        return false;
      },
    },
    {
      type: 'button',
      name: 'refresh',
      status: 'success',
      // label: 'Refresh',
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

  quickTicketFormList: { index: string, ticketCode?: string, phoneNumber?: string, form?: QuickTicketFormComponent }[] = [];

  infiniteLoadModel: {
    tickets: HelpdeskTicketModel[],
    placeholders: [],
    loading: boolean,
    pageToLoadNext: number,
  } = {
      tickets: [],
      placeholders: [],
      loading: false,
      pageToLoadNext: 1,
    };
  pageSize = 10;

  @ViewChild('quickTicketForm', { static: true }) quickTicketForm: QuickTicketFormComponent;

  quickFormOnInitSubject = new BehaviorSubject<string>(null);
  quickFormOnInit$ = this.quickFormOnInitSubject.asObservable();
  private callStateSubscription: Subscription;

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
    public mobileAppService: MobileAppService,
    public datePipe: DatePipe,
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

    this.callStateSubscription = this.mobileAppService.callState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async callState => {
        this.callStateListen(callState);
        // if (callState.state === 'incomming') {
        //   const formComponent = await this.createNewItem(callState.partnerNumber, callState.session.id) as { form: QuickTicketFormComponent };
        //   callState.session.stateChanged$.pipe(takeUntil(this.destroy$)).subscribe(async state => {
        //     if (state === 'terminated') {
        //       // Check point call logs and map call log id
        //       this.monitorAndMapCallLog(callState, formComponent);
        //     }
        //   });
        // }
        // if (callState.state === 'waiting-incomming') {
        //   const formComponent = await this.createDependingTicketByPhoneNumber(callState.partnerNumber, callState.session.id);
        //   callState.session.stateChanged$.pipe(takeUntil(this.destroy$)).subscribe(async state => {
        //     if (state === 'terminated') {
        //       this.monitorAndMapCallLog(callState, formComponent);
        //     }
        //   });

        // }
        // if (callState.state === 'incomming-cancel') {
        //   this.updateTemporaryTicketForIncommingCancel(callState);
        // }
      });

  }

  async callStateListen(callState: CallState) {
    if (callState.state === 'incomming') {
      const formComponent = await this.createNewItem(callState.partnerNumber, callState.session.id) as { form: QuickTicketFormComponent };

      callState.session.stateChanged$.pipe(takeUntil(this.destroy$)).subscribe(async state => {
        if (state === 'terminated') {
          // Check point call logs and map call log id
          this.monitorAndMapCallLog(callState, formComponent);
        }
      });
    }
    if (callState.state === 'waiting-incomming') {
      const formComponent = await this.createDependingTicketByPhoneNumber(callState.partnerNumber, callState.session.id);
      callState.session.stateChanged$.pipe(takeUntil(this.destroy$)).subscribe(async state => {
        if (state === 'terminated') {
          this.monitorAndMapCallLog(callState, formComponent);
        }
      });

    }
    if (callState.state === 'incomming-cancel') {
      this.updateTemporaryTicketForIncommingCancel(callState);
    }
  }

  onResume() {
    // this.commonService.openMobileSidebar();
    super.onResume();
    this.callStateSubscription.unsubscribe();
    this.mobileAppService.callState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async callState => {
        this.callStateListen(callState);
      });
  }

  ngOnInit() {
    this.commonService.openMobileSidebar();
  }

  async monitorAndMapCallLog(callState, formComponent) {
    // Check point call logs and map call log id
    const currentDateTime = new Date();
    const callLogs = (await this.apiService.getPromise<PbxCdrModel[]>('/helpdesk/relativeCallLogs', {
      filter_Direction: 'inbound',
      filter_Start: new Date(currentDateTime.getTime() - 30000).toISOString() + '/' + new Date(currentDateTime.getTime() + 180000).toISOString(),
      filter_CallerNumber: callState.partnerNumber,
    }));
    if (callLogs && callLogs.length > 0) {
      if (formComponent.form.id) {
        // Update call log for ticket
        this.apiService.putPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { id: [formComponent.form.id[0]] }, [{
          Code: formComponent.form.id[0],
          CallLog: callLogs[0].Id,
        }]);
      }
    }
  }

  onFilterChange() {
    this.commonService.takeUntil('helpdesk-filter-change', 500, () => {
      this.infiniteLoadModel.pageToLoadNext = 1;
      this.infiniteLoadModel.tickets = [];
      this.loadNext(this.infiniteLoadModel);
    });
  }

  loadNext(cardData) {
    if (cardData.loading) { return; }

    cardData.loading = true;
    cardData.placeholders = new Array(this.pageSize);

    this.apiService.get<HelpdeskTicketModel[]>('/helpdesk/tickets', {
      search: this.keyword,
      sort_LastUpdate: 'desc',
      // sort_Id: 'desc',
      limit: this.pageSize,
      offset: (cardData.pageToLoadNext - 1) * this.pageSize,
      includeState: true,
      includeLastMessage: true,
    }, nextList => {
      // this.dataList = list.map(item => {
      //   item['selected'] = false;
      //   return item;
      // });

      cardData.placeholders = [];
      cardData.tickets.push(...nextList);
      cardData.loading = false;
      cardData.pageToLoadNext++;

    });

    // this.newsService.load(cardData.pageToLoadNext, this.pageSize)
    //   .subscribe(nextNews => {
    //     cardData.placeholders = [];
    //     cardData.news.push(...nextNews);
    //     cardData.loading = false;
    //     cardData.pageToLoadNext++;
    //   });
  }

  // ngAfterViewInit(): void {
  //   // tslint:disable-next-line: ban
  //   const helpdeskDashboard = $(document.getElementById('helpdeskDashboard'));
  //   // tslint:disable-next-line: ban
  //   const helpdeskHeaderEle = $(document.getElementsByClassName('.card-header-container'));
  //   // this.subcriptions.push(this.layoutScrollService.getPosition().s  ubscribe(position => {
  //   //   console.info(position);
  //   // }));

  //   let checkpoint = null;
  //   this.layoutScrollService.onScroll().pipe(takeUntil(this.destroy$)).subscribe(position => {
  //     const helpdeskHeaderOffset = helpdeskHeaderEle.offset();
  //     const helpdeskDashboardOffset = helpdeskDashboard.offset();
  //     if (!checkpoint && helpdeskHeaderOffset.top < 50) {
  //       checkpoint = helpdeskDashboardOffset.top;

  //       this.commonService.pushHeaderActionControlList(this.actionButtonList);

  //       //   helpdeskHeaderEle.css({ position: 'fixed', zIndex: 1, width: fixedWidth, top: fixedOffset.top, left: helpdeskHeaderOffset.left });
  //       //   helpdeskDashboard.css({paddingTop: helpdeskHeaderEle.height() + 17});
  //     }

  //     // console.info(`${checkpoint} && ${helpdeskDashboardOffset.top} >= ${checkpoint}`);
  //     if (checkpoint && helpdeskDashboardOffset.top > checkpoint) {
  //       //   helpdeskHeaderEle.css({ position: 'relative', zIndex: 'initial', width: 'initial', top: 'initial', left: 'initial' });
  //       //   helpdeskDashboard.css({paddingTop: 'initial'});
  //       this.commonService.popHeaderActionControlList();
  //       checkpoint = null;
  //     }
  //   });
  // }

  loadList() {
    // this.apiService.get<HelpdeskTicketModel[]>('/helpdesk/tickets', { limit: 20 }, list => {
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
  }

  refresh() {
    this.commonService.takeUntil('helpdesk-filter-change', 500, () => {
      this.infiniteLoadModel.pageToLoadNext = 1;
      this.infiniteLoadModel.tickets = [];
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

  async createNewItem(phoneNumber?: string, tracking?: string) {
    // this.openFormDialplog();
    const existsQuickForm = this.quickTicketFormList.filter(f => f.index === tracking)[0];
    if (!tracking || !existsQuickForm) {
      this.showQuickForm = true;
      const quickForm = { index: tracking ? tracking : ('new_' + Date.now()), phoneNumber: phoneNumber };
      this.quickTicketFormList.unshift(quickForm);

      return new Promise<{ index: string, ticketCode?: string, phoneNumber?: string, form?: QuickTicketFormComponent }>(resolve => {
        this.quickFormOnInit$.pipe(takeUntil(this.destroy$)).subscribe(trk => {
          if (tracking === trk) {
            const depForm = this.quickTicketFormList.filter(f => f.index === trk)[0];
            if (depForm) {
              depForm.form.description = 'Yêu cầu mới từ khách hàng có số điện thoại ' + phoneNumber + ' vào ' + (new Date().toString());
            }
            if (phoneNumber) {
              this.apiService.putPromise('/helpdesk/relativeCallLogs/checkpoint', {}, []);
            }
            resolve(depForm);
          }
        });
        this.layoutScrollService.scrollTo(0, 0);
      });

    } else {
      // Scroll to center
      if (existsQuickForm.form && existsQuickForm.form.elRef && existsQuickForm.form.elRef.nativeElement) {
        const offsetTop = existsQuickForm.form.elRef.nativeElement.offsetTop;
        this.layoutScrollService.scrollTo(0, offsetTop - 55);
      }
      // this.layoutScrollService.onScroll().subscribe(p => console.info(p));
    }
    // Load tiket list by phone
    if (phoneNumber) {
      this.keyword = phoneNumber;
      this.refresh();
    }

    return false;
  }

  editItem(id: string) {
    this.showQuickForm = true;
    const quickForm = { index: id, ticketCode: id };
    this.quickTicketFormList.unshift(quickForm);
    this.layoutScrollService.scrollTo(0, 0);
    return false;
  }

  updateTemporaryTicketForIncommingCancel(callState: CallState) {
    // this.openFormDialplog();
    const tracking = callState.session.id;
    const existsQuickForm = this.quickTicketFormList.filter(f => f.index === tracking)[0];
    if (existsQuickForm) {
      this.showQuickForm = true;
      // if (!existsQuickForm.form.description) {
      const message = 'Yêu cầu bị nhỡ từ khách hàng có số điện thoại ' + callState.session.caller.phone + ' vào ' + (new Date().toString())
      existsQuickForm.form.description += ('\n' + message);
      try {
        existsQuickForm.form.f7ChatRoom.sendMessage({ Text: message });
      } catch (e) {
        // skip error
      }
      // }
    }
    return false;
  }

  async createDependingTicketByPhoneNumber(phoneNumber?: string, tracking?: string) {
    // this.showQuickForm = true;
    const quickForm = { index: tracking, phoneNumber: phoneNumber };
    this.quickTicketFormList.push(quickForm);

    return new Promise(resolve => {
      this.quickFormOnInit$.pipe(takeUntil(this.destroy$)).subscribe(trk => {
        if (tracking === trk) {
          const depForm = this.quickTicketFormList.filter(f => f.index === trk)[0];
          if (depForm) {
            depForm.form.description = 'Yêu cầu bị nhỡ từ khách hàng có số điện thoại ' + phoneNumber + ' vào ' + (new Date().toString());
          }
          resolve(depForm);
        }
      });
    });
  }


  async onQuickFormInit(form: QuickTicketFormComponent) {
    console.info(form);
    this.quickTicketFormList.filter(f => f.index === form.index)[0].form = form;

    // Load form by contact phone
    if (await form.loadByCallSessionId()) {
      // Auto save after init 10s
      setTimeout(() => {
        form.save();
      }, 10000);
    } else {
      form.loadByPhoneNumber().then(rs => {
        if (rs) {
          this.quickFormOnInitSubject.next(form.index);

          // Auto save after init 10s
          form.save().then(newTickets => {
            if (newTickets[0] && newTickets[0].ChatRoom) {
              // Attach F7ChatRoom in to quick form component
              this.openChatRoom(newTickets[0].ChatRoom, true).then(f7ChatRoom => {
                form.f7ChatRoom = f7ChatRoom;
                // setTimeout(() => {
                //   f7ChatRoom.sendMessage({ Text: form.description });
                // }, 5000);
              });
            }
          });
        }
      });
    }
  }

  onQuickFormClose(index: string) {

    if (index) {
      this.quickTicketFormList = this.quickTicketFormList.filter(f => f.index !== index);
      console.info(this.quickTicketFormList);
    }

    if (this.quickTicketFormList.length === 0) {
      this.showQuickForm = false;
      this.keyword = '';
      setTimeout(() => {
        this.refresh();
      }, 1000);
    }
  }

  /** Implement required */
  openFormDialplog(ids?: string[], onDialogSave?: (newData: HelpdeskTicketModel[]) => void, onDialogClose?: () => void) {
    this.commonService.openDialog(QuickTicketFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: ids,
        onDialogSave: (newData: HelpdeskTicketModel[]) => {
          if (onDialogSave) onDialogSave(newData);
        },
        onDialogClose: () => {
          if (onDialogClose) onDialogClose();
        },
      },
    });
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

  selectOne(event: any, item: HelpdeskTicketModel) {
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

  phoneCall(ticket: HelpdeskTicketModel, phone: string, name: string) {
    if (ticket && ticket.Code) {
      const callSession = this.mobileAppService.phoneCall(phone, name);
      callSession.stateChanged$.pipe(takeUntil(this.destroy$)).subscribe(state => {
        if (state === 'progress') {
          this.commonService.takeUntil('add_call_sessin_to_ticket', 3000).then(() => {
            if (callSession && callSession.id) {
              this.apiService.postPromise<HelpdeskTicketCallingSessionModel[]>('/helpdesk/ticketCallingSessions', {}, [{ Ticket: ticket.Code, CallSession: callSession.id, State: 'CALLOUT' }]).then(rs => {
                console.log(rs);
              });
            }
          });
        }
      });
    } else {
      console.error('Ticket was not provided');
    }
    return false;
  }

  async openChatRoom(chatRoomId: string, silient?: boolean) {
    return this.mobileAppService.openChatRoom({ ChatRoom: chatRoomId, silient: silient || false });
  }

  saveContact(ticket: HelpdeskTicketModel) {
    this.apiService.postPromise<ContactModel[]>('/contact/contacts', {}, [{
      Name: ticket.ObjectName,
      Phone: ticket.ObjectPhone,
      Email: ticket.ObjectEmail,
      Address: ticket.ObjectAddress,
    }]).then(rs => {
      // Update ticket
      this.apiService.putPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { id: ticket.Code }, [{
        Code: ticket.Code,
        Object: rs[0].Code,
      }]);
      this.commonService.openDialog(ShowcaseDialogComponent, {
        context: {
          title: this.commonService.translate.instant('Notification'),
          content: this.commonService.translate.instant('Helpldesk.contactSaveSuccess'),
        },
      });
    });
  }

  async fetchLostTicketByCallLogs() {
    const callresult = ['missed', 'voicemail', 'cancelled', 'failed'];
    for (let h = 0; h < callresult.length; h++) {
      const lostCall = (await this.apiService.getPromise<PbxCdrModel[]>('/helpdesk/relativeCallLogs', {
        filter_CallResult: callresult[h],
        filter_Direction: 'inbound',
      }));
      if (lostCall && lostCall.length > 0) {
        let isCheckPoint = false;
        for (let i = 0; i < lostCall.length; i++) {
          console.log(lostCall[i]);
          const phonenumber = lostCall[i].CallerNumber.replace(/[^0-9]/g, '');
          let contactName = phonenumber;
          let contactAddress = '';
          let contactEmail = '';
          let contactCode = null;
          const contact = (await this.apiService.getPromise<ContactModel[]>('/contact/contacts', { filter_Phone: phonenumber }))[0];
          if (contact) {
            contactName = contact.Name;
            contactEmail = contact.Email;
            contactAddress = contact.Address;
            contactCode = contact.Code;
          }
          const newTicket: HelpdeskTicketModel = {
            Object: contactCode,
            ObjectName: contactName,
            ObjectPhone: phonenumber,
            ObjectEmail: contactEmail,
            ObjectAddress: contactAddress,
            Description: 'Yêu cầu bị nhỡ từ số ' + phonenumber + (contact ? (' của khách hàng ' + contact.Name) : '') + ' vào lúc ' + (this.datePipe.transform(lostCall[i].Start)),
            CallLog: lostCall[i].Id,
            State: 'MISSED',
          };
          try {
            await this.apiService.postPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { autoCreateChatRoom: true, silient: true }, [newTicket]);
            if (!isCheckPoint) {
              this.apiService.putPromise('/helpdesk/relativeCallLogs/checkpoint', { date: new Date(lostCall[i].Start).toISOString() }, []);
              isCheckPoint = true;
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
    this.refresh();
    return true;
  }

  previewState(item: HelpdeskTicketModel) {
    this.commonService.openDialog(ShowcaseDialogComponent, {
      context: {
        title: this.commonService.translateText('Helpdesk.Ticket.title', { action: this.commonService.translate.instant('Common.changeState'), definition: '' }),
        content: this.commonService.translateText('Helpdesk.changeStateConfirm', { description: `<i>${item.Description}</i>` }),
        actions: [
          {
            label: this.commonService.translateText('Helpdesk.State.approved'),
            status: 'danger',
            action: () => {
              this.apiService.putPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { id: [item.Code], changeStateTo: 'APPROVED' }, [{ Code: item.Code }])
                .then((result) => {
                  this.refresh();
                });
            },
          },
          {
            label: this.commonService.translateText('Helpdesk.State.cancel'),
            status: 'warning',
            action: () => {
              this.apiService.putPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { id: [item.Code], changeStateTo: 'CANCEL' }, [{ Code: item.Code }]).then((result) => {
                this.refresh();
              });
            },
          },
          {
            label: this.commonService.translateText('Helpdesk.State.complete'),
            status: 'success',
            action: () => {
              this.apiService.putPromise<HelpdeskTicketModel[]>('/helpdesk/tickets', { id: [item.Code], changeStateTo: 'COMPLETE' }, [{ Code: item.Code }]).then((result) => {
                this.refresh();
              });
            },
          },
        ],
      },
    });
  }

  /** Open assign categories dialog */
  openAssignCategoiesDialog(ticket: HelpdeskTicketModel) {
    if (ticket) {
      this.commonService.openDialog(TicketPmsFormComponent, {
        context: {
          inputMode: 'dialog',
          inputResource: ticket,
          onDialogSave: (newData: HelpdeskTicketModel[]) => {
            this.refresh();
          },
          onDialogClose: () => {
          },
        },
        closeOnEsc: false,
        closeOnBackdropClick: false,
      });
    }
  }
}
