import { WarehouseGoodsInContainerModel } from './../../../../models/warehouse.model';
import { UnitModel } from './../../../../models/unit.model';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductModel, ProductUnitModel } from './../../../../models/product.model';
import { ContactModel } from './../../../../models/contact.model';
import { CommercePosOrderModel, CommercePosCashVoucherModel, CommercePosReturnModel, CommercePosReturnDetailModel } from './../../../../models/commerce-pos.model';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild, ɵCodegenComponentFactoryResolver } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogRef } from "@nebular/theme";
import { BaseComponent } from "../../../../lib/base-component";
import { ApiService } from "../../../../services/api.service";
import { CommonService } from "../../../../services/common.service";
import screenfull from 'screenfull';
import { filter, map, take, takeUntil } from "rxjs/operators";
import { SystemConfigModel } from "../../../../models/model";
import { CurrencyMaskConfig } from "ng2-currency-mask";
import { CommercePosBillPrintComponent } from '../commerce-pos-order-print/commerce-pos-bill-print.component';
import { CommercePosReturnsPrintComponent } from '../commerce-pos-returns-print/commerce-pos-returns-print.component';
import { CommercePosPaymnentPrintComponent } from '../commerce-pos-payment-print/commerce-pos-payment-print.component';
import { ContactAllListComponent } from '../../../contact/contact-all-list/contact-all-list.component';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { BehaviorSubject } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

declare const openDatabase;

class OrderModel {
  [key: string]: any;
  Object?: string;
  ObjectName?: string;
  ObjectPhone?: string;
  ObjectEmail?: string;
  ObjectAddress?: string;
  ObjectIdentifiedNumber?: string;
  Note?: string;
  DateOfOrder?: Date;
  DateOfCreated?: Date;
  Details: {
    Sku: string,
    Product: string,
    Unit: string,
    Description: string,
    Quantity: number,
    Price: number,
    ToMoney: number,
    Discount?: number,
    AccessNumbers?: string[],
    FeaturePicture?: string
  }[] = [];
  Total: number = 0;

  constructor() {
  }
}

@Component({
  selector: 'ngx-commerce-pos-gui',
  templateUrl: './commerce-pos-gui.component.html',
  styleUrls: ['./commerce-pos-gui.component.scss'],
})
export class CommercePosGuiComponent extends BaseComponent implements AfterViewInit {

  /** Component name */
  componentName = 'CommercePosGuiComponent';
  title: string = 'Máy bán hàng';
  currentDate = new Date();

  status = '';

  loading = false;
  progress = 0;
  progressStatus = 'success';
  progressLabel = '0%';

  // @ViewChild('newDetailPipSound', { static: true }) newDetailPipSound: ElementRef;
  // @ViewChild('increaseDetailPipSound', { static: true }) increaseDetailPipSound: ElementRef;
  // @ViewChild('errorSound', { static: true }) errorSound: ElementRef;
  // @ViewChild('paymentSound', { static: true }) paymentSound: ElementRef;

  @ViewChild('ObjectPhone', { static: true }) objectPhoneEleRef: ElementRef;
  @ViewChild('ObjectName', { static: true }) objectNameEleRef: ElementRef;
  @ViewChild('ObjectAddress', { static: true }) objectAddressEleRef: ElementRef;
  @ViewChild('Search', { static: true }) searchEleRef: ElementRef;
  @ViewChild('orderDetailTable', { static: true }) orderDetailTableRef: ElementRef;
  @ViewChild('searchResultsRef', { static: true }) searchResultsRef: ElementRef;
  @ViewChild('customerEle', { static: true }) customerEle: ElementRef;
  @ViewChild('searchListViewport', { static: true }) searchListViewport: CdkVirtualScrollViewport;
  @ViewChild('DecreaseForTotal', { static: true }) decreaseForTotalEleRef: ElementRef;
  @ViewChild('CashReceipt', { static: true }) cashReceiptEleRef: ElementRef;
  // @ViewChild('CashBack', { static: true }) cashBackEleRef: ElementRef;

  get isFullscreenMode() {
    return screenfull.isFullscreen;
  }

  quantityFormat: CurrencyMaskConfig = { ...this.commonService.getNumberMaskConfig(), precision: 2 };
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0, allowNegative: true };

  order: OrderModel = new OrderModel;

  historyOrderIndex: number = 0;
  historyOrders: FormGroup[] = [];
  orderForm: FormGroup = this.makeNewOrderForm();

  systemConfigs: SystemConfigModel;
  shortcutKeyContext: string = 'main';

  searchResults: ProductModel[] = null;
  searchResultActiveIndex = 0;

  masterPriceTable: { [key: string]: ProductModel } = {};
  webdb: any;

  // searchInput = '';

  select2OptionForContact = {
    ...this.commonService.makeSelect2AjaxOption('/contact/contacts', { includeIdText: true, includeGroups: true }, {
      placeholder: 'F6 - Chọn khách hàng...', limit: 10, prepareReaultItem: (item) => {
        item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        return item;
      },
      containerCss: `
        width: 100%
      `
    }),
  }

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<CommercePosGuiComponent>,
    public formBuilder?: FormBuilder,
  ) {
    super(commonService, router, apiService, ref);

    this.commonService.systemConfigs$.pipe(takeUntil(this.destroy$)).subscribe(settings => {
      this.systemConfigs = settings;
    });

    this.historyOrders.push(this.orderForm);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    screenfull.onchange(event => {
      console.log(event);
      setTimeout(() => {
        this.commonService.sidebarService.collapse('menu-sidebar');
        this.commonService.sidebarService.collapse('chat-sidebar');
      }, 300);
    });

    this.commonService.layout$.next('fullscreen');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    $('html').css({ fontSize: 'initial' });
  }

  onResume() {
    super.onResume();
    this.commonService.sidebarService.collapse('menu-sidebar');
    this.commonService.sidebarService.collapse('chat-sidebar');
  }

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel) {
    if (selectedData && !selectedData['doNotAutoFill']) {
      if (selectedData.Code) {
        formGroup.get('ObjectName').setValue(selectedData.Name);
        formGroup.get('ObjectPhone').setValue(selectedData.Phone);
        formGroup.get('ObjectAddress').setValue(selectedData.Address);

        if (selectedData.Code == 'POSCUSTOMER') {
        } else {
          // Load current debt
          if (formGroup['voucherType'] == 'COMMERCEPOSORDER' && formGroup.get('State').value != 'APPROVED') {
            this.apiService.getPromise<any[]>('/accounting/reports', {
              reportReceivablesFromCustomer: true,
              // fromDate: new Date().toISOString(),
              toDate: new Date().toISOString(),
              limit: 1,
              eq_Object: selectedData.Code
            }).then(rs => {
              console.log(rs);
              if (rs && rs.length > 0) {
                formGroup['ReceivableDebt'] = rs[0]['TailDebit'];
              }
            });
          }
        }

      }
    }
    if (!this.orderForm['isProcessing'] && !selectedData) {
      // Clear
      formGroup.get('ObjectName').setValue('');
      formGroup.get('ObjectPhone').setValue('');
      formGroup.get('ObjectAddress').setValue('');
    }

    (document.activeElement as HTMLElement).blur();
  }

  private goodsList: ProductModel[] = [];
  async updateGodosInfo() {
    this.status = 'Đang tải bảng giá...';
    // while (true) {
    try {
      await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 'nolimit' }).then(productList => {
        for (const product of productList) {
          this.productMap[product.Code] = product;
        }
        console.log(this.productMap);
      });
      await this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { limit: 'nolimit' }).then(unitList => {
        for (const unit of unitList) {
          this.unitMap[unit['Sequence']] = unit;
        }
        console.log(this.unitMap);
        return true;
      });
      await this.apiService.getPromise<any>('/warehouse/goods', {
        getFindOrderIndex: true,
        limit: 'nolimit'
      }).then(rs => {
        this.findOrderMap = rs;
        return true;
      });

      await this.apiService.getPromise<any[]>('/sales/master-price-table-details', {
        masterPriceTable: 'default',
        includeCategories: true,
        includeGroups: true,
        includeFeaturePicture: true,
        getRawData: true,
        limit: 'nolimit',
        includeContainers: true,
      }).then(priceTableDetails => {
        this.masterPriceTable = {};
        for (const priceTableDetail of priceTableDetails) {
          priceTableDetail.Price = parseFloat(priceTableDetail.Price);
          this.masterPriceTable[`${priceTableDetail.Product}-${priceTableDetail.Unit}`] = priceTableDetail;
        }
        // console.log(this.masterPriceTable);
        this.status = '';

      });
      // this.commonService.toastService.show('Đã cập nhật bảng giá mới', 'POS Thương mại', { status: 'success' });


      // Get goods list
      this.goodsList = [];
      let offset = 0;
      this.progressStatus = 'danger';
      while (true) {
        const rs = await this.apiService.getObservable<WarehouseGoodsInContainerModel[]>('/warehouse/goods-in-containers', {
          sort_Goods: 'asc',
          sort_UnitNo: 'asc',
          offset: offset,
          limit: 100
        }).pipe(
          map((res) => {
            const total = +res.headers.get('x-total-count');
            let data = res.body;
            return { data, total };
          }),
        ).toPromise().then(result => {

          const rs = result.data;
          const total = result.total;

          const progress = parseInt(((offset + 101) / result.total * 100) as any);
          if (progress <= 100) {
            this.progress = progress;
          } else {
            this.progress = 100;
            this.progressStatus = 'success';
          }
          this.progressLabel = 'Tải thông tin hàng hóa (' + this.progress + '%)';

          for (const goodsInContainer of rs) {
            const price = this.masterPriceTable[`${goodsInContainer.Goods}-${this.commonService.getObjectId(goodsInContainer.Unit)}`]?.Price || null;
            this.goodsList.push({
              Code: goodsInContainer.Goods,
              Sku: goodsInContainer.GoodsSku?.toUpperCase(),
              Name: goodsInContainer.GoodsName,
              FeaturePicture: goodsInContainer.GoodsThumbnail,
              // Unit: goodsInContainer.Unit,
              Container: {
                id: goodsInContainer.Container,
                text: goodsInContainer.ContainerName,
                FindOrder: goodsInContainer.ContainerFindOrder,
                Shelf: goodsInContainer.ContainerShelf,
                ShelfName: goodsInContainer.ContainerShelfName,
              },
              Unit: { id: goodsInContainer.Unit, text: goodsInContainer.UnitLabel, Sequence: goodsInContainer.UnitSeq },
              // Shelf: { id: goodsInContainer.ContainerShelf, text: goodsInContainer.ContainerShelfName },
              Price: price,
              Keyword: (goodsInContainer.GoodsSku + ' ' + goodsInContainer.GoodsName).toLowerCase()
            });
          }

          offset += 100;
          return rs;
        });

        if (!rs || rs.length == 0) {
          break;
        }
      }

      console.log(this.goodsList);




      return true;
    } catch (err) {
      console.log(err);
      console.log('retry...');
      this.status = 'Lỗi tải bảng giá, đang thử lại...';
      this.commonService.toastService.show('Bảng giá mới chưa được cập nhật, refersh trình duyệt để tải lại', 'Cập nhật bảng giá không thành công !', { status: 'danger' });
      return false;
    }
    // }
  }

  private unitMap: { [key: string]: ProductUnitModel } = {};
  private productMap: { [key: string]: ProductModel } = {};
  private findOrderMap: { [key: string]: { Goods: string, Unit: string, UnitLabel: string, Container: string } } = {};
  async init() {
    this.loading = true;
    const result = await super.init().then(async status => {

      await this.updateGodosInfo();

      // Notification
      this.commonService.toastService.show('Hệ thống đã sẵn sàng để bán hàng !', 'POS đã sẵn sàng', { status: 'success' });

      return status;
    });
    this.commonService.sidebarService.collapse('menu-sidebar');
    this.commonService.sidebarService.collapse('chat-sidebar');

    await this.save(this.orderForm);

    // Listen price table update
    setInterval(() => {
      console.log('Listen new master price table update...');
      this.apiService.getPromise<any>('/sales/master-price-tables/getUpdate', { priceTable: 'default' }).then(rs => {
        console.log(rs);
        if (rs && rs.State == 'UPDATED') {
          this.commonService.toastService.show('Có bảng giá mới, vui lòng chờ trong giây lát !', 'Có bảng giá mới !', { status: 'primary' });
          return this.updateGodosInfo().then(status => {
            this.commonService.toastService.show('Hệ thống đã cập nhật bảng giá mới, mời bạn tiếp tục bán hàng !', 'Đã cập nhật bảng giá mới !', { status: 'success' });
            return status;
          });
        }
        return false;
      }).catch(err => {
        console.log(err);
      });
    }, 20000);

    this.loading = false;
    return result;
  }

  makeNewOrderForm(data?: CommercePosOrderModel) {
    const newForm = this.formBuilder.group({
      Code: [],
      BarCode: [],
      Object: [],
      ObjectName: [],
      ObjectPhone: [],
      ObjectEmail: [],
      ObjectAddress: [],
      ObjectIdenfiedNumber: [],
      Note: [],
      SubNote: [],
      Total: [0],
      CashReceipt: [null],
      DecreaseForTotal: [null],
      // CashBack: [null],
      State: [null],
      DateOfSale: [null],
      Details: this.formBuilder.array([]),
      Returns: [],
      RelativeVouchers: [data?.Returns ? [{ id: data.Returns, text: data.Returns, type: 'COMMERCEPOSRETURN' }] : null],
      DebitFunds: [],
      // FinalReceipt: [],
      IsDebt: [false],
    });
    newForm['voucherType'] = 'COMMERCEPOSORDER';
    newForm['isReceipt'] = true;
    newForm['isProcessing'] = null;
    if (data) {
      newForm.patchValue(data);
      if (data.Details) {
        const details = (this.getDetails(newForm) as FormArray).controls;
        for (const detail of data.Details) {
          details.push(this.makeNewOrderDetail(detail));
        }
        this.calculateTotal(newForm);
      }
    }

    // const decreaseTotal = newForm.get('DecreaseForTotal');
    // const cashReceipt = newForm.get('CashReceipt');
    // const cashBack = newForm.get('CashBack');
    // const total = newForm.get('Total');
    // const debitFunds = newForm.get('DebitFunds');
    // const finalReceipt = newForm.get('FinalReceipt');
    // decreaseTotal.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
    //   finalReceipt.setValue(parseFloat(total.value || 0) - parseFloat(debitFunds.value || 0) - parseFloat(decreaseTotal.value || 0));
    //   cashBack.setValue(parseFloat(cashReceipt.value || 0) - parseFloat(finalReceipt.value || 0));
    // });
    // cashReceipt.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
    //   finalReceipt.setValue(parseFloat(total.value || 0) - parseFloat(debitFunds.value || 0) - parseFloat(decreaseTotal.value || 0));
    //   cashBack.setValue(parseFloat(cashReceipt.value || 0) - parseFloat(finalReceipt.value || 0));
    // });

    return newForm;
  }
  async makeNewReturnsForm(data?: CommercePosReturnModel, orderId?: string) {

    let order;
    let newForm;
    if (orderId) {
      order = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + orderId, { includeDetails: true, includeRelativeVouchers: true }).then(rs => rs[0]);
    }

    if (order) {
      newForm = this.formBuilder.group({
        Code: [],
        BarCode: [],
        Order: [order.Code || null],
        Object: [order.Object || null],
        ObjectName: [order.ObjectName || null],
        ObjectPhone: [order.objectPhoneEleRef || null],
        ObjectEmail: [order.ObjectEmail || null],
        ObjectAddress: [order.ObjectAddress || null],
        Note: [],
        SubNote: [],
        Total: [0],
        // CashBack: [0],
        CashReceipt: [0],
        State: [null],
        DateOfReturn: [new Date()],
        RelativeVouchers: [[{ id: order.Code, text: order.Title || order.Code, type: 'COMMERCEPOSORDER' }]],
        Details: this.formBuilder.array([]),
        IsDebt: [false],
      });
      if (order.Details) {
        const details = (this.getDetails(newForm) as FormArray).controls;
        for (const detail of order.Details) {
          details.push(this.makeNewOrderDetail(detail));
        }
        this.calculateTotal(newForm);
      }
    } else {
      newForm = this.formBuilder.group({
        Code: [],
        BarCode: [],
        Object: [],
        ObjectName: [],
        ObjectPhone: [],
        ObjectEmail: [],
        ObjectAddress: [],
        ObjectIdenfiedNumber: [],
        Note: [],
        SubNote: [],
        Total: [0],
        // CashBack: [0],
        CashReceipt: [0],
        State: [null],
        DateOfSale: [new Date()],
        Details: this.formBuilder.array([]),
        IsDebt: [false],
        RelativeVouchers: [[]]
      });
    }
    newForm['voucherType'] = 'COMMERCEPOSRETURN';

    if (data) {
      newForm.patchValue(data);
      if (data.Details) {
        const details = (this.getDetails(newForm) as FormArray).controls;
        for (const detail of data.Details) {
          details.push(this.makeNewOrderDetail(detail));
        }
        this.calculateTotal(newForm);
      }
    }

    newForm['isProcessing'] = null;
    return newForm;
  }

  makeNewOrderDetail(detail?: CommercePosReturnDetailModel) {
    return this.formBuilder.group({
      Sku: [detail.Sku || null],
      Product: [detail.Product || null],
      Unit: [detail.Unit || 'n/a'],
      Description: [detail.Description || null],
      Quantity: [detail.Quantity || 0],
      Price: [detail.Price || 0],
      ToMoney: [detail.Quantity * detail.Price || 0],
      FeaturePicture: [detail.Image && detail.Image[0] || null],
      Image: [Array.isArray(detail.Image) ? detail.Image[0] : detail.Image],
      AccessNumbers: [detail.AccessNumbers || null],
      Discount: [detail.Discount || 0],
      FindOrder: [detail.FindOrder || 0],
      Container: [detail.Container || 0],
      RelativeVouchers: [detail.RelativeVouchers || []]
    });
  }

  getDetails(formGroup: FormGroup) {
    return formGroup.get('Details') as FormArray;
  }

  async makeNewOrder(data?: CommercePosOrderModel, returns?: string, option?: { force?: boolean, location?: string }) {

    const endOrderForm = this.historyOrders[this.historyOrders.length - 1];
    if (!returns && !option?.force && endOrderForm && this.orderForm['voucherType'] != 'COMMERCEPOSRETURN' && endOrderForm.getRawValue()['State'] == 'NOTJUSTAPPROVED' && endOrderForm.getRawValue()['Details'].length == 0) {
      this.historyOrderIndex = this.historyOrders.length - 1;
      this.orderForm = this.historyOrders[this.historyOrders.length - 1];
      return this.orderForm;
    }

    if (this.orderForm.get('State').value !== 'APPROVED') {
      this.save(this.orderForm);
    }

    if (returns) {
      const returnsObj = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/returns/' + returns, { includeDetails: true, includeRelativeVouchers: true }).then(rs => rs[0]);

      let debitFunds = 0;

      if (returnsObj && returnsObj?.Details) {
        for (const detail of returnsObj.Details) {
          debitFunds += detail.Price * detail.Quantity;
        }
      }

      if (returnsObj.Object) {
        returnsObj.Object = await this.apiService.getPromise<ContactModel[]>('/contact/contacts/' + this.commonService.getObjectId(returnsObj.Object), { includeIdText: true }).then(rs => rs[0]);
      }

      this.orderForm = this.makeNewOrderForm({ ...data, Object: returnsObj.Object, returnsObj, Code: null, Returns: returns, DebitFunds: debitFunds });
    } else {
      this.orderForm = this.makeNewOrderForm(data);
    }
    this.calculateTotal(this.orderForm);
    if (option?.location == 'HEAD') {
      this.historyOrders.unshift(this.orderForm);
      this.historyOrderIndex = 0;
    } else {
      this.historyOrders.push(this.orderForm);
      this.historyOrderIndex = this.historyOrders.length - 1;
    }
    if (!data || !data.Code) {
      await this.save(this.orderForm);
    }
    return this.orderForm;
  }

  toggleFullscreen() {
    if (!this.isFullscreenMode) {
      screenfull.request();
    } else {
      screenfull.exit();
    }
  }

  ngAfterViewInit() {

  }

  calculateToMoney(detail: FormGroup) {
    if (detail) {
      detail.get('ToMoney').setValue(parseFloat(detail.get('Quantity').value) * parseFloat(detail.get('Price').value));
    }
  }

  calculateTotal(form: FormGroup) {
    let total = 0;
    for (const detail of this.getDetails(form).controls) {
      total += parseFloat(detail.get('Price').value) * parseFloat(detail.get('Quantity').value);
    }

    this.orderForm.get('Total').setValue(total);
    // const discount = this.orderForm.get('DecreaseForTotal');
    // this.orderForm.get('FinalReceipt').setValue(parseFloat(total || 0 as any) - parseFloat((discount.value || 0)));

    this.onCashReceiptChanged(form);
    return total;
  }

  async onSearchInputKeydown(event: any) {
    console.log(event);

    const inputValue: string = event.target?.value;
    if (event.key == 'Enter' && (!this.searchResults || this.searchResults.length == 0)) {
      try {
        await this.barcodeProcess(inputValue);
        event.target.value = '';
        event.target.blur();
      } catch (err) {
        this.commonService.toastService.show(err, 'Cảnh báo', { status: 'warning' });
      }
    }
    return true;
  }

  lastSearchCount = 0;
  async onSearchInputKeyup(event: any) {
    console.log(event);
    this.commonService.takeUntilCallback('commerce-pos-search', 300, () => {
      const inputValue: string = event.target?.value;
      if ((event.key.length == 1 && /[a-z0-9\ ]/i.test(event.key)) || (event.key.length > 1 && ['Backspace'].indexOf(event.key) > -1)) {
        if (/\w+/.test(inputValue)) {
          this.lastSearchCount++;
          const currentSearchCount = this.lastSearchCount;


          if (this.goodsList && this.goodsList.length > 0) {
            // Search in local memory
            let rs = this.goodsList.filter(f => new RegExp('^' + inputValue.toUpperCase()).test(f.Sku)).slice(0, 256);
            rs = rs.concat(rs, this.goodsList.filter(f => this.commonService.smartFilter(f.Keyword, inputValue.toLowerCase())).slice(0, 256));

            if (currentSearchCount == this.lastSearchCount) {
              this.searchResults = rs;
              if (this.searchResults[0]) {
                this.searchResults[0].active = true;
                this.searchResultActiveIndex = 0;
                setTimeout(() => {
                  this.searchListViewport.scrollToIndex(0, 'smooth');
                }, 0);
              }
            } else {
              console.log('search results was lated');
            }

          } else {
            // If goods list indexing then search by server
            this.apiService.getPromise<ProductModel[]>('/warehouse/goods', {
              includeCategories: true,
              includeFeaturePicture: true,
              includeUnit: true,
              includeContainer: true,
              sort_Name: 'asc',
              sort_UnitConvertNo: 'asc',
              search: inputValue,
              limit: 20
            }).then(rs => {
              if (currentSearchCount == this.lastSearchCount) {
                this.searchResults = rs.map(goods => {
                  goods.Price = this.masterPriceTable[`${goods.Code}-${this.commonService.getObjectId(goods.WarehouseUnit)}`]?.Price;
                  return goods;
                });
                if (rs[0]) {
                  rs[0].active = true;
                  this.searchResultActiveIndex = 0;
                  setTimeout(() => {
                    this.searchListViewport.scrollToIndex(0, 'smooth');
                  }, 0);
                }
              } else {
                console.log('search results was lated');
              }
            });
          }

        } else {
          this.searchResults = null;
        }
      }
    });
    return true;
  }

  onObjectPhoneInput(orderForm: FormGroup, event: any) {
    this.commonService.takeUntil('commerce-pos-seach-contact-by-phone', 600).then(() => {
      const phone = this.orderForm.get('ObjectPhone').value;
      if (phone && phone.length > 9) {
        this.apiService.getPromise<ContactModel[]>('/contact/contacts', { search: phone, sort_Id: 'desc' }).then(rs => {
          if (rs.length > 0) {
            const contact = rs[0];
            if (contact) {
              if (contact.Code) {
                this.orderForm.get('Object').setValue({ id: contact.Code, text: `${contact.Code} - ${contact.Name}` });
              }
              if (contact.Name) {
                this.orderForm.get('ObjectName').setValue(contact.Name);
              }
            }
          }
        });
      }
    });
  }
  onObjectNameInput(orderForm: FormGroup, event: any) {
    this.commonService.takeUntil('commerce-pos-save-contact-name', 3000).then(() => {
    });
  }

  inputValue: string = '';
  isBarcodeProcessing = new BehaviorSubject<number>(0);
  barcodeQueue: { inputValue: string, option?: { searchByFindOrder?: boolean, searchBySku?: boolean, product?: ProductModel } }[] = [];
  barcodeProcessCount = -1;
  async barcodeProcess(inputValue: string, option?: { searchByFindOrder?: boolean, searchBySku?: boolean, product?: ProductModel }) {

    this.barcodeProcessCount++;
    const queueId = this.barcodeProcessCount;

    // Wait for previous barcode process finish
    await this.isBarcodeProcessing.pipe(filter(f => {
      console.log(`Barcode processing queue check: ${f} === ${queueId}`);
      return f === queueId;
    }), take(1)).toPromise();

    try {
      this.inputValue = inputValue;
      const detailsControls = this.getDetails(this.orderForm).controls
      const systemConfigs = await this.commonService.systemConfigs$.pipe(takeUntil(this.destroy$), filter(f => !!f), take(1)).toPromise().then(settings => settings);
      const coreId = systemConfigs.ROOT_CONFIGS.coreEmbedId;
      let productId = null;
      let accessNumber = null;
      let sku = null;
      let unit = null;
      let unitSeq = null;
      let unitId = null;
      let existsProduct: FormGroup = null;
      let product: ProductModel = option?.product || null;

      if (!product) {
        if (option?.searchBySku || /^[a-z]+\d+/i.test(inputValue)) {
          // Search by sku
          if (this.goodsList) {
            const products = this.goodsList.filter(f => f.Sku == inputValue.toUpperCase());
            for (const prod of products) {
              const productInfo = this.productMap[prod.Code];

              // Tìm vị trí tương ứng với đơn vị tính cơ bản
              if (productInfo && this.commonService.getObjectId(productInfo.WarehouseUnit) == this.commonService.getObjectId(prod.Unit)) {
                product = prod;
                break;
              }
            }
          }
          if (!product) {
            product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', { includeUnit: true, includePrice: true, eq_Sku: inputValue, includeInventory: true }).then(rs => {
              return rs[0];
            });
          }

          if (!product) {
            this.commonService.toastService.show(`Sku không tồn tại !`, 'Sku không tồn tại !', { status: 'danger' });
            // resolve(true);
            // return;
            throw new Error(`Sku không tồn tại !`);
          }
          productId = product.Code;
          unit = product.Unit;
          unitId = this.commonService.getObjectId(product.Unit);
        } else {
          if (option?.searchByFindOrder || inputValue.length < 5) {
            //Tìm hàng hóa theo số nhận thức
            const goodsInContainer = this.findOrderMap[inputValue];
            if (goodsInContainer && goodsInContainer.Goods && goodsInContainer.Unit) {
              productId = goodsInContainer.Goods;
              product = this.productMap[productId];
              unitId = goodsInContainer.Unit;
              product.Unit = unit = { id: goodsInContainer.Unit, text: goodsInContainer.UnitLabel };
              product.Container = goodsInContainer.Container;
            }
            if (!product) {
              product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', {
                includeUnit: true,
                includePrice: false,
                includeInventory: true,
                findOrder: inputValue,
              }).then(rs => {
                return rs[0];
              });
            }
            if (product) {
              unit = product.Unit;
              unitId = unitId || this.commonService.getObjectId(unit);
              product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
              product.FindOrder = inputValue.trim();
              productId = product.Code;
            }
          } else {
            if (/^9\d+/.test(inputValue)) {
              // Đây là barcode vị trí hàng hóa
              let tmpcode = inputValue.substring(1);
              const findOrderLength = parseInt(tmpcode.substring(0, 1));
              tmpcode = tmpcode.substring(1);
              const findOrder = tmpcode.substring(0, findOrderLength);
              tmpcode = tmpcode.substring(findOrderLength);
              const unitSeqLength = parseInt(tmpcode.substring(0, 1));
              tmpcode = tmpcode.substring(1);
              unitSeq = tmpcode.substring(0, unitSeqLength);
              tmpcode = tmpcode.substring(unitSeqLength);
              productId = tmpcode;

              product = this.productMap[this.findOrderMap[findOrder].Goods];

              if (product && unitSeq) {
                unit = this.unitMap[unitSeq];
                if (unit) {
                  unitId = unit.Code;
                  product.Unit = { ...unit, id: unit.Code, text: unit.Name };
                }
              }

              if (!product) {
                throw new Error('Không tìm thấy hàng hóa !');
              }

              unitId = this.commonService.getObjectId(product.Unit);
              product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
              productId = product.Code;
              product.FindOrder = findOrder;

            } else {
              if (new RegExp('^127' + coreId + '\\d+').test(inputValue)) {
                accessNumber = inputValue;
              } else {
                if (new RegExp('^128' + coreId).test(inputValue)) {
                  setTimeout(() => {

                    this.commonService.openDialog(ShowcaseDialogComponent, {
                      context: {
                        title: 'Máy bán hàng',
                        content: 'Bạn có muốn tạo phiếu trả hàng từ đơn hàng ' + inputValue,
                        actions: [
                          {
                            label: 'ESC - Trở về',
                            status: 'basic',
                            action: () => {
                            }
                          },
                          {
                            label: 'F7 - Tạo phiếu trả hàng',
                            keyShortcut: 'F7',
                            status: 'danger',
                            // focus: true,
                            action: async () => {
                              this.orderForm = await this.makeNewReturnsForm(null, inputValue);
                              this.save(this.orderForm);
                              this.historyOrders.push(this.orderForm);
                              this.historyOrderIndex = this.historyOrders.length - 1;
                            }
                          },
                          {
                            label: 'Mở lại bill (Enter)',
                            keyShortcut: 'Enter',
                            status: 'info',
                            focus: true,
                            action: async () => {
                              this.loadVoucher(inputValue);
                            }
                          },
                        ],
                        onClose: () => {
                        },
                      }
                    });
                  }, 50);
                  throw new Error('Trường hợp tạo phiếu trả hàng');
                } else if (new RegExp('^129' + coreId).test(inputValue)) {
                  setTimeout(() => {
                    this.shortcutKeyContext = 'returnspaymentconfirm';
                    this.commonService.openDialog(ShowcaseDialogComponent, {
                      context: {
                        title: 'Máy bán hàng',
                        content: 'Bạn có muốn tiếp tục bán hàng từ phiếu trả hàng ' + inputValue + ' hay hoàn tiền cho khách',
                        actions: [
                          {
                            label: 'Tiếp tục bán (F4)',
                            keyShortcut: 'F4',
                            status: 'success',
                            action: async () => {
                              this.makeNewOrder(null, inputValue);
                            }
                          },
                          {
                            label: 'Mở lại bill (Enter)',
                            keyShortcut: 'Enter',
                            status: 'info',
                            focus: true,
                            action: async () => {
                              this.loadVoucher(inputValue);
                            }
                          },
                        ],
                        onClose: () => {
                        },
                      }
                    });
                  }, 50);
                  throw new Error('Trường hợp tạo phiếu bán hàng từ phiếu trả hàng');
                } else if (new RegExp('^118' + coreId).test(inputValue)) {
                  product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + inputValue, {
                    includeUnit: true,
                    includePrice: false,
                    includeInventory: true,
                  }).then(rs => {
                    return rs[0];
                  });
                  if (product) {
                    productId = product.Code;
                    unitId = this.commonService.getObjectId(product.WarehouseUnit);
                    product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
                  }
                }

                let unitIdLength = null;

                if (!product) {

                  const extracted = this.commonService.extractGoodsBarcode(inputValue);
                  accessNumber = extracted.accessNumber;
                  productId = extracted.productId;
                  unitSeq = extracted.unitSeq;
                  unit = this.unitMap[unitSeq];
                  unitId = this.commonService.getObjectId(unit);

                  product = this.productMap[productId];

                  if (product && unitSeq) {
                    unit = this.unitMap[unitSeq];
                    if (unit) {
                      unitId = unit.Code;

                      product.Unit = { ...unit, id: unit.Code, text: unit.Name };
                    }
                  }
                }

                // }
              }
            }

            // get access number inventory 
            if (new RegExp('^127' + coreId).test(accessNumber)) {
              const waitForGetProductByAccessNumber = this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', {
                accessNumber: accessNumber,
                includeUnit: true,
                includePrice: false,
                includeInventory: true,
                includePreviousOrder: this.orderForm['voucherType'] == 'COMMERCEPOSRETURN',
              }).then(rs => {

                product = rs[0];

                if (!product) {
                  this.commonService.toastService.show(`Số truy xuất ${accessNumber} không tồn tại !`, 'Số truy xuất không tồn tại !', { status: 'warning' });
                  existsProduct.get('AccessNumbers').setValue((existsProduct.get('AccessNumbers').value || []).filter(f => f != accessNumber));
                  throw new Error(`Số truy xuất ${accessNumber} không tồn tại !`);
                }

                setTimeout(async () => {
                  const existsProductIndex = detailsControls.findIndex(f => this.commonService.getObjectId(f.get('Product').value) === productId && this.commonService.getObjectId(f.get('Unit').value) == unitId);
                  existsProduct = detailsControls[existsProductIndex] as FormGroup;
                  if (existsProduct) {

                    existsProduct.get('Container').setValue(product.Container);

                    if (this.orderForm['voucherType'] == 'COMMERCEPOSRETURN') {
                      if (product.Inventory && product.Inventory > 0) {
                        this.commonService.toastService.show(`${product.Name} (${product.Unit.Name}) đang có trong kho! không thể trả hàng với hàng hóa chưa xuất kho !`, 'Hàng hóa chưa xuất bán !', { status: 'warning' });
                        existsProduct.get('AccessNumbers').setValue((existsProduct.get('AccessNumbers').value || []).filter(f => f != accessNumber));


                        // return;
                      } else {
                        // Update price by previous voucher sales price
                        if (product['LastAccEntry'] && product['LastWarehouseEntry']) {
                          existsProduct.get('Price').setValue(product['LastAccEntry']['SalesPrice']);

                          this.calculateToMoney(existsProduct);
                          this.calculateTotal(this.orderForm);


                          // Auto set object
                          if (product['LastAccEntry']['Object']) {
                            const object = this.orderForm.get('Object');
                            if (!object.value) {
                              await this.apiService.getPromise<ContactModel[]>('/contact/contacts/' + product['LastAccEntry']['Object'], { includeIdText: true, limit: 1 }).then(rs => {
                                object.setValue(rs[0]);
                              });
                            } else {
                              if (this.commonService.getObjectId(product['LastAccEntry']['Object']) != this.commonService.getObjectId(object.value)) {

                                this.commonService.toastService.show('Liên hệ trên đơn bán hàng phải giống với trên đơn trả hàng !', 'Không đúng liên hệ đã mua hàng trước đó', { status: 'warning' });
                                return false;

                              }
                            }
                          }

                          const detailsRelativeVouchers = existsProduct.get('RelativeVouchers');
                          const detailsRelativeVouchersData = detailsRelativeVouchers.value || [];

                          if (!detailsRelativeVouchersData.some(f => this.commonService.getObjectId(f) == product['LastAccEntry']['Voucher'])) {
                            detailsRelativeVouchersData.push({
                              type: 'COMMERCEPOSORDER',
                              id: product['LastAccEntry']['Voucher'],
                              text: product['LastAccEntry']['Voucher'],
                              VoucherDate: product['LastWarehouseEntry']['VoucherDate'],
                              'Object': {
                                id: product['LastWarehouseEntry']['Object'],
                                text: product['LastWarehouseEntry']['ObjectName']
                              }
                            });
                            detailsRelativeVouchers.setValue([...detailsRelativeVouchersData]);
                          }

                          const relativeVouchers = this.orderForm.get('RelativeVouchers');
                          const relativeVouchersData = relativeVouchers.value || [];
                          if (!relativeVouchersData.some(f => this.commonService.getObjectId(f) == product['LastAccEntry']['Voucher'])) {
                            relativeVouchersData.push({
                              type: 'COMMERCEPOSORDER',
                              id: product['LastAccEntry']['Voucher'],
                              text: product['LastAccEntry']['Voucher'],
                              VoucherDate: product['LastWarehouseEntry']['VoucherDate'],
                              'Object': {
                                id: product['LastWarehouseEntry']['Object'],
                                text: product['LastWarehouseEntry']['ObjectName']
                              }
                            });
                            relativeVouchers.setValue([...relativeVouchersData]);
                          }

                          // Trả hàng về vị trí trước đó đã xuất bán
                          existsProduct.get('Container').setValue(product['LastWarehouseEntry']['Container']);

                        }

                      }
                    } else {
                      if (!product.Inventory || product.Inventory < 1) {
                        this.commonService.toastService.show(`${product.Name} (${product.Unit.Name}) (${accessNumber}) không có trong kho`, 'Hàng hóa không có trong kho !', { status: 'warning' });
                        existsProduct.get('AccessNumbers').setValue((existsProduct.get('AccessNumbers').value || []).filter(f => f != accessNumber));
                        // return;
                      }
                    }
                  }
                }, 1000);


                return product;
              });

              if (!unitId || !product) { // Nếu tem cũ không có unit sequence thì phải lấy thông tin sản phẩm bằng số truy xuất ngay từ đầu
                await waitForGetProductByAccessNumber;
              }
              if (product) {
                productId = product.Code;
                unitId = unitId || this.commonService.getObjectId(product.Unit);
                product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
              } else {
                product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, {
                  includeUnit: true,
                  includePrice: false,
                  includeInventory: true,
                  unitSeq: unitSeq
                }).then(rs => {
                  return rs[0];
                });
                unitId = this.commonService.getObjectId(product.Unit);
                product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
              }
            }
          }
        }
      } else {
        productId = product.Code;
        unitId = this.commonService.getObjectId(product.Unit);
      }

      if (!product) { // Nếu không lấy đươc thông tin sản phẩm theo số truy xuất
        // Case 2: Search by product id
        productId = inputValue.length < 9 ? `118${coreId}${inputValue}` : inputValue;
        accessNumber = null;
        product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, {
          includeUnit: true,
          includePrice: false,
          includeInventory: true
        }).then(rs => {
          return rs[0];
        });
        if (product) {
          unitId = this.commonService.getObjectId(product.Unit);
          product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
        }
        // }
      }

      if (this.orderForm.value?.State == 'APPROVED') {
        this.commonService.toastService.show('Bạn phải hủy phiếu mới thêm hàng hóa vào được!', 'Đơn hàng đã thanh toán !', { status: 'warning' });
        throw new Error('Bạn phải hủy phiếu mới thêm hàng hóa vào được!');
      }

      console.log(accessNumber, productId);
      let existsProductIndex = detailsControls.findIndex(f => this.commonService.getObjectId(f.get('Product').value) === productId && this.commonService.getObjectId(f.get('Unit').value) == unitId);
      existsProduct = detailsControls[existsProductIndex] as FormGroup;
      if (existsProduct) {
        const quantityControl = existsProduct.get('Quantity');
        const priceControl = existsProduct.get('Price');
        const toMoney = existsProduct.get('ToMoney');
        const accessNumbersContorl = existsProduct.get('AccessNumbers');
        if (accessNumber && accessNumbersContorl.value) {
          if (!accessNumbersContorl.value.find(f => f == accessNumber)) {
            quantityControl.setValue(quantityControl.value + 1);
            toMoney.setValue(quantityControl.value * priceControl.value);
            if (accessNumber && Array.isArray(accessNumbersContorl.value)) {
              accessNumbersContorl.setValue([...accessNumbersContorl.value, accessNumber]);
            }
            this.calculateTotal(this.orderForm);

            this.playIncreasePipSound();
            this.calculateToMoney(existsProduct);
            this.calculateTotal(this.orderForm);
            this.activeDetail(this.orderForm, existsProduct, existsProductIndex);
          } else {
            this.playErrorPipSound();
            this.commonService.toastService.show('Mã truy xuất đã được quét trước đó rồi, mời bạn quét tiếp các mã khác !', 'Trùng mã truy xuất !', { status: 'warning' });
          }
        } else {
          quantityControl.setValue(quantityControl.value + 1);
          this.calculateToMoney(existsProduct);
          this.calculateTotal(this.orderForm);

          this.activeDetail(this.orderForm, existsProduct, existsProductIndex);
          this.playIncreasePipSound();
        }
      } else {
        existsProduct = this.makeNewOrderDetail({
          Sku: product?.Sku || productId,
          Product: productId,
          Unit: product?.Unit || 'n/a',
          Description: product?.Name || productId,
          Quantity: 1,
          Price: product?.Price || 0,
          ToMoney: (product?.Price * 1) || 0,
          Image: product?.FeaturePicture || [],
          AccessNumbers: accessNumber ? [accessNumber] : null,
          Discount: 0,
          FindOrder: product?.FindOrder || product?.Container?.FindOrder,
          Container: product?.Container,
        });
        existsProductIndex = detailsControls.length - 1;

        if (product?.Price) {
          // Nếu đã có giá (trường hợp quét số truy xuất)
          this.calculateToMoney(existsProduct);
          detailsControls.push(existsProduct);
          this.calculateTotal(this.orderForm);
          this.activeDetail(this.orderForm, existsProduct, existsProductIndex);
          this.playNewPipSound();
        } else {
          // Nếu chưa có giá (trường hợp quét ID sản phẩm)
          if (product) {

            if (!product.Unit || !this.commonService.getObjectId(product.Unit) || this.commonService.getObjectId(product.Unit) == 'n/a') {
              this.playErrorPipSound();
              this.commonService.toastService.show('Không thể bán hàng với hàng hóa chưa được cài đặt đơn vị tính !', 'Sản phẩm chưa cài đặt đơn vị tính !', { status: 'danger' });
              throw new Error('Không thể bán hàng với hàng hóa chưa được cài đặt đơn vị tính !');
            }

            existsProduct.get('Description').setValue(product.Name);
            existsProduct.get('Sku').setValue(product.Sku);
            existsProduct.get('Unit').setValue(product.Unit);
            existsProduct.get('FeaturePicture').setValue(product.FeaturePicture?.Thumbnail);

            await this.apiService.getPromise<any[]>('/sales/master-price-tables/getProductPriceByUnits', {
              product: productId,
              includeUnit: true
            }).catch(err => {
              this.commonService.toastService.show('Không thể bán hàng với hàng hóa chưa có giá bán !', 'Hàng hóa chưa có giá bán !', { status: 'danger' });
              return [];
            }).then(prices => prices.find(f => this.commonService.getObjectId(f.Unit) == this.commonService.getObjectId(product.Unit))).then(price => {
              if (price || true) { // Cho phép chọn sản phẩm không có giá bán
                price = parseFloat(price?.Price || 0);
                existsProduct.get('Price').setValue(price);
                existsProduct.get('ToMoney').setValue(price * existsProduct.get('Quantity').value);

                this.calculateToMoney(existsProduct);
                detailsControls.push(existsProduct);
                this.calculateTotal(this.orderForm);
                this.activeDetail(this.orderForm, existsProduct, 0);
                this.playNewPipSound();
              } else {
                this.commonService.toastService.show('Không thể bán hàng với hàng hóa chưa có giá bán !', 'Hàng hóa chưa có giá bán !', { status: 'danger' });
              }
            });
          } else {
            this.playErrorPipSound();
            this.commonService.toastService.show('Hàng hóa không tồn tại !', 'Hàng hóa không tồn tại !', { status: 'danger' });
            throw new Error('Hàng hóa không tồn tại !');
          }
        }
      }
      this.isBarcodeProcessing.next(queueId + 1);
      console.log('Barcode process sucess for queue: ' + queueId);
      return existsProduct;
    } catch (err) {
      this.isBarcodeProcessing.next(queueId + 1);
      return null;
    }
  }

  destroyOrder(event?: any) {
    this.commonService.showDialog('POS', 'Bạn có muốn hủy phiếu này không ?', [
      {
        label: 'ESC - Trở về',
        status: 'primary',
        action: () => {
          setTimeout(() => {
            // event.target.blur();
            if ("activeElement" in document) {
              (document.activeElement as HTMLElement).blur();
            }
          }, 500);
        }
      },
      {
        label: 'Enter - Xác nhận',
        keyShortcut: 'Enter',
        status: 'danger',
        focus: true,
        action: () => {
          const apiPath = this.orderForm['voucherType'] == 'COMMERCEPOSORDER' ? '/commerce-pos/orders' : '/commerce-pos/returns';
          this.apiService.putPromise(apiPath, { changeState: 'UNRECORDED', includeRelativeVouchers: true }, [{ Code: this.orderForm.get('Code').value }]).then(rs => {
            this.orderForm.get('State').setValue('UNRECORDED');
            this.historyOrderIndex = this.historyOrders.findIndex(f => f === this.orderForm);
            if (this.historyOrderIndex > -1) {
            }

            setTimeout(() => {
              if ("activeElement" in document) {
                (document.activeElement as HTMLElement).blur();
              }
            }, 500);

          });

        }
      },
    ])
    return false;
  }

  onPreviousOrderClick() {
    this.historyOrderIndex = this.historyOrders.findIndex(f => f === this.orderForm);
    if (this.historyOrderIndex > 0) {
      this.save(this.historyOrders[this.historyOrderIndex]);
      this.historyOrderIndex--;
      this.orderForm = this.historyOrders[this.historyOrderIndex];
    } else {
      const params: any = {
        sort_Created: 'desc',
        limit: 1,
        includeDetails: true,
        includeRelativeVouchers: true,
        includeObject: true
      };
      if (this.historyOrders[0] && this.historyOrders[0].get('Code').value) {
        params.lt_Code = this.historyOrders[0].get('Code').value;
      }
      this.apiService.getPromise('/commerce-pos/orders', params).then(rs => {
        console.log(rs);
        this.makeNewOrder(rs[0], null, { force: true, location: 'HEAD' });
      });
    }
  }
  onNextOrderClick() {
    this.historyOrderIndex = this.historyOrders.findIndex(f => f === this.orderForm);
    if (this.historyOrderIndex < this.historyOrders.length - 1) {
      this.save(this.historyOrders[this.historyOrderIndex]);
      this.historyOrderIndex++;
      this.orderForm = this.historyOrders[this.historyOrderIndex];
    }
  }

  focusToQuantity(detailIndex: number) {
    const activeEle = $(this.orderDetailTableRef.nativeElement.children[detailIndex + 1]);
    activeEle[0].scrollIntoView();

    const quantityEle = activeEle.find('.pos-quantity')[0] as HTMLInputElement;
    quantityEle.focus();
    quantityEle.select();
    let timeout = null;

    timeout = setTimeout(() => {
      // auto blue after 5s
      quantityEle.blur();
    }, 3000);

    quantityEle.onkeyup = () => {
      // console.log(123);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // auto blue after 5s
        quantityEle.blur();
      }, 3000);
    };

  }


  barcode = '';
  findOrderKeyInput = '';
  searchInputPlaceholder = '';
  onKeyboardEvent(event: KeyboardEvent) {

    if (this.searchResults && this.searchResults.length > 0) {
      if (event.key == 'ArrowDown') {
        if (this.searchResultActiveIndex < this.searchResults.length - 1) {
          this.searchResultActiveIndex++;
          this.searchListViewport.scrollToIndex(this.searchResultActiveIndex, 'smooth');
          event.preventDefault();
        }
        return false;
      }
      if (event.key == 'ArrowUp') {
        if (this.searchResultActiveIndex > 0) {
          this.searchResultActiveIndex--;
          this.searchListViewport.scrollToIndex(this.searchResultActiveIndex, 'smooth');
          event.preventDefault();
        }
        return false;
      }
      if (event.key == 'Enter') {
        const product = this.searchResults[this.searchResultActiveIndex];
        this.onChooseProduct(product);
        event.preventDefault();
        return true;
      }
    }

    if (event.key == 'Escape') {
      this.shortcutKeyContext = 'main';
      if (this.commonService.dialogStack.length === 0) {
        this.blurAll();
      }
      return true;
    }

    if (this.commonService.dialogStack.length === 0) {
      if (event.key == 'F6') {
        console.log(this.customerEle);
        $(this.customerEle['controls'].selector.nativeElement)['select2']('open');
        return false;
      }

      // Toggle debt
      if (event.key == 'F7') {
        this.toggleDebt();
        return false;
      }

      if (event.key == 'F10') {
        if (this.commonService.dialogStack.length === 0) {
          this.onMakeNewReturnsForm();
          return false;
        }
      }
      if (event.key == 'F11') {
        if (this.commonService.dialogStack.length === 0) {
          if ($(this.decreaseForTotalEleRef.nativeElement).is(':focus')) {
            this.cashReceiptEleRef.nativeElement.focus();
          } else {
            this.decreaseForTotalEleRef.nativeElement.focus();
          }
          event.preventDefault();
          return false;
        }
      }

      // Payment/re-print
      if (event.key == 'F9') {
        if (this.orderForm.value?.State == 'APPROVED') {
          this.print(this.orderForm, { printType: 'INVOICE' });
        } else {
          this.payment(this.orderForm, { skipPrint: false, printType: 'INVOICE' });
        }
        event.preventDefault();
        // }
        return true;
      }
      if (event.key == 'F8') {
        if ($(this.objectPhoneEleRef.nativeElement).is(':focus')) {
          this.objectNameEleRef.nativeElement.focus();
        } else if ($(this.objectNameEleRef.nativeElement).is(':focus')) {
          this.objectAddressEleRef.nativeElement.focus();
        } else {
          this.objectPhoneEleRef.nativeElement.focus();
        }
        event.preventDefault();
        // }
        return true;
      }
      if (event.key == 'F4') {
        this.destroyOrder();
        event.preventDefault();
        return false;
        // }
        return true;
      }

      // Change quantity
      if (event.key == 'F2') {
        const details = this.getDetails(this.orderForm).controls;
        let activeDetailIndex = details.findIndex(f => f['isActive'] === true);

        this.focusToQuantity(activeDetailIndex);
        event.preventDefault();
        return false;
      }

      // Change price
      if (event.key == 'F12') {
        if (this.orderForm.value?.State == 'APPROVED') {
          this.commonService.toastService.show('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { status: 'warning' });
          this.playErrorPipSound();
          return false;
        }

        const details = this.getDetails(this.orderForm).controls;
        let activeDetail = details.find(f => f['isActive'] === true);

        this.commonService.openDialog(DialogFormComponent, {
          context: {
            title: 'Thay đổi giá bán',
            onInit: async (form, dialog) => {
              return true;
            },
            controls: [
              {
                name: 'Price',
                label: 'Giá thay đổi',
                placeholder: 'Giá thay đổi',
                type: 'currency',
                initValue: activeDetail.get('Price').value,
                focus: true,
              },
              {
                name: 'Description',
                label: 'Mô tả',
                placeholder: 'Mô tả thêm cho việc thay đổi giá bán',
                type: 'text',
                initValue: activeDetail.get('Description').value,
              },
            ],
            actions: [
              {
                label: 'Esc - Trở về',
                icon: 'back',
                status: 'basic',
                keyShortcut: 'Escape',
                action: () => { return true; },
              },
              {
                label: 'Enter - Xác nhận',
                icon: 'generate',
                status: 'success',
                keyShortcut: 'Enter',
                action: (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                  activeDetail.get('Price').setValue(form.get('Price').value);
                  activeDetail.get('Description').setValue(form.get('Description').value);

                  this.calculateToMoney(activeDetail as FormGroup);
                  this.calculateTotal(this.orderForm);
                  return true;
                },
              },
            ],
          },
        });

        event.preventDefault();
        return false;
      }

      // Forcus to serach
      if (event.key == 'F3') {
        this.searchEleRef.nativeElement.focus();
        event.preventDefault();
        return true;
      }
      if (event.key == 'F5') {
        this.makeNewOrder();
        event.preventDefault();
        return true;
      }

      if (event.key == '+') {
        if (this.commonService.dialogStack.length === 0) {
          const details = this.getDetails(this.orderForm).controls;
          const activeDetail = details.find(f => f['isActive'] === true) as FormGroup;
          if (activeDetail) {
            this.onIncreaseQuantityClick(this.orderForm, activeDetail);
          }
        }
        return false;
      }
      if (event.key == '-') {
        if (this.commonService.dialogStack.length === 0) {
          const details = this.getDetails(this.orderForm).controls;
          const activeDetail = details.find(f => f['isActive'] === true) as FormGroup;
          if (activeDetail) {
            this.onDecreaseQuantityClick(this.orderForm, activeDetail);
          }
        }
        return false;
      }

      if (event.key == 'Delete') {
        if (this.commonService.dialogStack.length === 0) {
          const details = this.getDetails(this.orderForm).controls;
          let activeDetailIndex = details.findIndex(f => f['isActive'] === true);
          if (activeDetailIndex > -1) {
            details.splice(activeDetailIndex, 1);
            this.calculateTotal(this.orderForm);
            const nextActive = details[activeDetailIndex] as FormGroup;
            if (nextActive) {
              this.activeDetail(this.orderForm, nextActive, activeDetailIndex);
            } else {
              if (details.length > 0) {
                activeDetailIndex = 0;
                this.activeDetail(this.orderForm, details[0] as FormGroup, activeDetailIndex);
              }
            }
          }
        }
      }
    }

    if (event.key == 'F4') {
      if (this.shortcutKeyContext == 'returnspaymentconfirm') {
        this.makeNewOrder(null, this.inputValue);
      }
      return true;
    }

    if ((this.searchResults == null || this.searchResults.length == 0) && (document.activeElement as HTMLElement).tagName == 'BODY') {
      if (event.key == 'ArrowLeft') {
        if (this.commonService.dialogStack.length === 0) {
          this.onPreviousOrderClick();
          event.preventDefault();
        }
        return true;
      }
      if (event.key == 'ArrowRight') {
        if (this.commonService.dialogStack.length === 0) {
          this.onNextOrderClick();
          event.preventDefault();
        }
        return true;
      }

      if (event.key == 'ArrowDown') {
        if (this.commonService.dialogStack.length === 0) {

          this.findOrderKeyInput = '';
          this.searchInputPlaceholder = '';
          (document.activeElement as HTMLElement).blur();

          const details = this.getDetails(this.orderForm).controls;
          let activeDetailIndex = details.findIndex(f => f['isActive'] === true);
          if (activeDetailIndex < 0) {
            activeDetailIndex = 0
          } else {
            activeDetailIndex++;
          }
          const nextDetail = details[activeDetailIndex];
          if (nextDetail) {
            nextDetail['isActive'] = true;

            $(this.orderDetailTableRef.nativeElement.children[activeDetailIndex + 1])[0].scrollIntoView();

            for (const detail of details) {
              if (detail !== nextDetail) {
                detail['isActive'] = false;
              }
            }
          }
        }

        return false;
      }

      if (event.key == 'ArrowUp') {
        if (this.commonService.dialogStack.length === 0) {

          this.findOrderKeyInput = '';
          this.searchInputPlaceholder = '';
          (document.activeElement as HTMLElement).blur();

          const details = this.getDetails(this.orderForm).controls;
          let activeDetailIndex = details.findIndex(f => f['isActive'] === true);
          if (activeDetailIndex > details.length - 1) {
            activeDetailIndex = details.length - 1;
          } else {
            activeDetailIndex--;
          }
          if (activeDetailIndex > -1) {
            const nextDetail = details[activeDetailIndex];
            nextDetail['isActive'] = true;

            $(this.orderDetailTableRef.nativeElement.children[activeDetailIndex + 1])[0].scrollIntoView();

            for (const detail of details) {
              if (detail !== nextDetail) {
                detail['isActive'] = false;
              }
            }
          }
        }
        return false;
      }
    } else {
      // Control for search results

    }

    if ("activeElement" in document) {
      if ((document.activeElement as HTMLElement).id == 'posSearchInput') {
        return true;
      }
      if ((document.activeElement as HTMLElement).id == 'ObjectPhone') {
        return true;
      }
      if ((document.activeElement as HTMLElement)?.classList?.value.indexOf('pos-quantity') > -1) {
        if (event.key == 'Enter') {
          (document.activeElement as HTMLElement).blur();
          this.findOrderKeyInput = '';
          this.searchInputPlaceholder = '';
          return true;
        }
      }
    }

    // Barcode scan
    if (this.commonService.dialogStack.length === 0) {
      if ((/^[0-9a-z]$/i.test(event.key) || ['Enter'].indexOf(event.key) > -1) && (document.activeElement as HTMLElement).tagName == 'BODY') {

        this.commonService.barcodeScanDetective(event.key, barcode => {
          this.barcodeProcess(barcode).then(status => {
            console.log('Barcode processed');
          });
        });

      }

      if (/^[0-9a-z]$/i.test(event.key) && (document.activeElement as HTMLElement).tagName == 'BODY') {
        this.findOrderKeyInput += event.key;
        this.searchInputPlaceholder = this.findOrderKeyInput + ' - tìm theo vị trí hàng hóa, sku...';
      }
      if (event.key == 'Backspace') {
        this.findOrderKeyInput = this.findOrderKeyInput.slice(0, -1);
        this.searchInputPlaceholder = this.findOrderKeyInput + ' - tìm theo vị trí hàng hóa, sku...';
      }

      if (event.key == 'Enter' && this.findOrderKeyInput) {
        setTimeout(() => {
          if (/[a-z]/i.test(this.findOrderKeyInput)) {
            try {
              this.barcodeProcess(this.findOrderKeyInput, { searchBySku: true });
            } catch (err) {
              this.commonService.toastService.show(err, 'Cảnh báo', { status: 'warning' });
            }
          } else {
            if (this.findOrderKeyInput && this.findOrderKeyInput.length < 6) {
              try {
                this.barcodeProcess(this.findOrderKeyInput, { searchByFindOrder: true });
              } catch (err) {
                this.commonService.toastService.show(err, 'Cảnh báo', { status: 'warning' });
              }
            }
          }
          this.findOrderKeyInput = '';
          this.searchInputPlaceholder = '';
        }, 300);
      }
    }

    // Disable F7 key for else
    if (event.key == 'F7') {
      return false;
    }

    return true;
  }

  blurAll() {
    this.searchResults = null;
    this.searchEleRef.nativeElement.value = '';
    this.searchInputPlaceholder = '';
    this.barcode = '';
    this.findOrderKeyInput = '';
    (document.activeElement as HTMLElement).blur();
  }

  onKeyupEvent(event: KeyboardEvent) {


    return true;
  }

  activeDetail(orderForm: FormGroup, activeDetail: FormGroup, index: number) {
    const details = this.getDetails(orderForm).controls;

    activeDetail['isActive'] = true;

    for (const detail of details) {
      if (detail !== activeDetail) {
        detail['isActive'] = false;
      }
    }
    setTimeout(() => {
      $(this.orderDetailTableRef.nativeElement?.children[index + 1])[0]?.scrollIntoView();
    }, 0);
  }

  removeDetail(orderForm: FormGroup, index: number) {
    if (orderForm.value?.State == 'APPROVED') {
      this.commonService.toastService.show('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { status: 'warning' });
      this.playErrorPipSound();
      return false;
    }

    const removedRelativeVouchers = this.getDetails(orderForm).controls[index]?.value?.RelativeVouchers?.map(m => this.commonService.getObjectId(m)) || [];

    this.getDetails(orderForm).controls.splice(index, 1);
    this.calculateTotal(orderForm);

    // Remove relative voucher
    const relativeVouchers = orderForm.get('RelativeVouchers');
    let relativeVouchersData = relativeVouchers.value;
    for (const removedRelativeVoucher of removedRelativeVouchers) {
      if (this.getDetails(orderForm).controls?.findIndex(f => f.get('RelativeVouchers').value.some(s => this.commonService.getObjectId(s) == removedRelativeVoucher) < 0)) {
        relativeVouchersData = relativeVouchersData.filter(f => this.commonService.getObjectId(f) != removedRelativeVoucher);
      }
    }
    relativeVouchers.setValue(relativeVouchersData);

    return true;
  }

  onQuantityKeydown(orderForm: FormGroup, detail: FormGroup, event, numberFormat: CurrencyMaskConfig) {
    if (['Backspace'].indexOf(event.key) < 0 && !/[0-9\.]/.test(event.key)) {
      event.preventDefault();
      return false;
    }
    const check = (event.target?.value + event.key).match(/\./g);
    if (check && check.length > 1) {
      event.preventDefault();
      return false;
    }
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    return true;
  }

  onQuantityChanged(orderForm: FormGroup, detail: FormGroup, event, numberFormat: CurrencyMaskConfig) {
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    console.log('change quantity accepted');
    return true;
  }

  onIncreaseQuantityClick(orderForm: FormGroup, detail: FormGroup) {
    if (orderForm.value?.State == 'APPROVED') {
      this.commonService.toastService.show('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { status: 'warning' });
      this.playErrorPipSound();
      return false;
    }
    const quantityControl = detail.get('Quantity');
    quantityControl.setValue(parseInt(quantityControl.value) + 1);
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    this.playNewPipSound();
  }
  onDecreaseQuantityClick(orderForm: FormGroup, detail: FormGroup) {
    if (orderForm.value?.State == 'APPROVED') {
      this.commonService.toastService.show('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { status: 'warning' });
      this.playErrorPipSound();
      return false;
    }
    const quantityControl = detail.get('Quantity');
    if (quantityControl.value > 1) {
      quantityControl.setValue(parseInt(quantityControl.value) - 1);
      this.calculateToMoney(detail);
      this.calculateTotal(orderForm);
      this.playDecreasePipSound();
    } else {
      this.playErrorPipSound();
      this.commonService.toastService.show('Chỉ có thể bán hàng với số lượng lớn hơn 0', 'Số lượng phải lớn hơn 0', { status: 'warning' });
    }
  }

  onCashReceiptChanged(formGroup: FormGroup) {
    // const cashReceiptControl = formGroup.get('CashReceipt');
    // const cashBackControl = formGroup.get('CashBack');
    // const totolControl = formGroup.get('Total');
    // cashBackControl.setValue(cashReceiptControl.value - totolControl.value);

    if (this.orderForm.value?.DebitFunds >= this.orderForm.value?.Total - this.orderForm.value?.DecreaseForTotal) {
      this.orderForm['isReceipt'] = false;
      this.orderForm.get('CashReceipt').disable();
    } else {
      this.orderForm['isReceipt'] = true;
      this.orderForm.get('CashReceipt').enable();
    }
  }

  async payment(orderForm: FormGroup, option?: { printType?: 'PRICEREPORT' | 'INVOICE', skipPrint?: boolean }) {
    const data = orderForm.getRawValue();
    if (!data?.Details?.length) {
      this.commonService.toastService.show('Bạn phải thêm hàng hóa vào đơn hàng trước khi thanh toán !', 'Chưa có hàng hóa nào trong đơn hàng !', { status: 'warning', duration: 5000 })
      return false;
    }
    delete data.DateOfSale;
    orderForm['isProcessing'] = true;
    setTimeout(() => {
      orderForm['isProcessing'] = false;
    }, 500);

    option = {
      printType: 'PRICEREPORT',
      ...option,
    };

    this.blurAll();

    if (orderForm['voucherType'] == 'COMMERCEPOSORDER') {

      this.commonService.openDialog(CommercePosBillPrintComponent, {
        context: {
          skipPreview: true,
          printType: option?.printType,
          instantPayment: true,
          data: [data],
          onSaveAndClose: (newOrder: CommercePosOrderModel, printComponent) => {
            if (typeof newOrder.Object == 'string') {
              newOrder.Object = { id: newOrder.Object, text: `${newOrder.Object} - ${newOrder.ObjectName}` }
            }
            newOrder.Object = { ...orderForm.get('Object').value, ...newOrder.Object };
            orderForm.patchValue(newOrder);
            this.commonService.toastService.show(option?.skipPrint ? `Đã thanh toán cho đơn hàng ${newOrder.Code}, để in phiếu nhấn nút điều hướng sang trái và in lại!` : `Đã thanh toán cho đơn hàng ${newOrder.Code}`, 'Đã thanh toán', { status: 'success', duration: 8000 })
            this.makeNewOrder();
            console.log(this.historyOrders);
            this.playPaymentSound();
          },
          onClose: () => {
          },
          onAfterInit: (component) => {
            if (option?.skipPrint) {
              component?.close();
            } else {
              setTimeout(() => {
                component?.close();
              }, 15000);
            }
          }
        }
      });
    } else {
      this.commonService.openDialog(CommercePosReturnsPrintComponent, {
        context: {
          skipPreview: true,
          instantPayment: true,
          data: [orderForm.getRawValue()],
          onSaveAndClose: (newOrder, printComponent) => {
            if (typeof newOrder.Object == 'string') {
              newOrder.Object = { id: newOrder.Object, text: `${newOrder.Object} - ${newOrder.ObjectName}` }
            }
            newOrder.Object = { ...orderForm.get('Object').value, ...newOrder.Object };
            orderForm.patchValue(newOrder);
            this.commonService.toastService.show('Phiếu trả hàng đã lưu !', 'Đã lưu phiếu trả hàng !', { status: 'success', duration: 8000 })
            this.makeNewOrder();
            console.log(this.historyOrders);
            this.playPaymentSound();
          },
          onClose: () => {
          },
          onAfterInit: (component: CommercePosReturnsPrintComponent) => {
            if (option?.skipPrint) {
              component?.close();
            }
            component.onContinueOrder.pipe(take(1)).toPromise().then(async retunsOrder => {
              // Find blank new order
              console.log('Return voucher: ', retunsOrder);
              const newOrderForm = await this.makeNewOrder(null, retunsOrder.Code);
              this.orderForm = newOrderForm;
            });
          }
        }
      });
    }
  }

  async save(orderForm: FormGroup): Promise<CommercePosOrderModel> {
    const voucherType = orderForm['voucherType'];
    const apiPath = voucherType == 'COMMERCEPOSORDER' ? '/commerce-pos/orders' : '/commerce-pos/returns';
    let order = orderForm.getRawValue();
    delete order.BarCode;
    if (orderForm && orderForm['isProcessing'] !== true && order.State != 'APPROVED') {
      return this.commonService.takeUntil('commerce-pos-order-save', 500).then(status => {
        if (order.Code) {
          return this.apiService.putPromise(apiPath + '/' + order.Code, { renderBarCode: true, includeRelativeVouchers: true }, [order]).then(rs => {
            return rs[0];
          });
        } else {
          orderForm['isProcessing'] = true;
          return this.apiService.postPromise(apiPath, { renderBarCode: true, includeRelativeVouchers: true }, [order]).then(rs => {
            orderForm.patchValue(rs[0]);
            orderForm['isProcessing'] = false;
            return rs[0];
          });
        }
      });
    }
    console.log('Order Form đang khởi tạo => chưa lưu đơn !');
    return null;
  }

  async print(orderForm: FormGroup, option?: { printType?: 'PRICEREPORT' | 'INVOICE' }) {
    if (orderForm.get('State').value !== 'APPROVED') {
      this.commonService.toastService.show('Bạn chỉ có thể in lại phiếu đã chốt', 'Không thể in bill !', { status: 'warning' });
      return false;
    }
    option = {
      printType: 'PRICEREPORT',
      ...option
    }
    if (orderForm['voucherType'] == 'COMMERCEPOSORDER') {
      return new Promise(resovle => {

        this.commonService.openDialog(CommercePosBillPrintComponent, {
          context: {
            skipPreview: true,
            printType: option.printType,
            data: [orderForm.getRawValue()],
            onSaveAndClose: (newOrder, printComponent) => {
              this.commonService.toastService.show('Đã tạo phiếu chi hoàn tiền cho phiếu trả hàng !', 'Đã tạo phiếu chi !', { status: 'success', duration: 8000 })
            }
          }
        });
      });
    } else if (orderForm['voucherType'] == 'COMMERCEPOSRETURN') {
      this.commonService.openDialog(CommercePosReturnsPrintComponent, {
        context: {
          skipPreview: true,
          data: [orderForm.getRawValue()],
          onSaveAndClose: (newOrder, printComponent) => {
          },
          onAfterInit: (component: CommercePosReturnsPrintComponent) => {
            component.onContinueOrder.pipe(take(1)).toPromise().then(async rs => {
              const newOrderForm = await this.makeNewOrder(null, orderForm.get('Code').value);
              this.orderForm = newOrderForm;
            });
          }
        }
      });
    }
    return true;
  }

  async printOrder(orderId: string) {
    const order = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + orderId, { includeDetails: true, renderBarCode: true, includeRelativeVouchers: true }).then(rs => rs[0]);
    if (order.State !== 'APPROVED') {
      this.commonService.toastService.show('Bạn chỉ có thể in lại phiếu đã chốt', 'Không thể in bill !', { status: 'warning' });
      return false;
    }
    return new Promise(resovle => {
      this.commonService.openDialog(CommercePosBillPrintComponent, {
        context: {
          skipPreview: true,
          data: [order],
          onSaveAndClose: (newOrder, printComponent) => {
          }
        }
      });
    });
  }

  async loadVoucher(voucherId: string) {
    if (/^128/.test(voucherId)) {
      const voucher = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + voucherId, { includeDetails: true, renderBarCode: true, includeObject: true, includeUnit: true, includeRelativeVouchers: true }).then(rs => rs[0]);
      if (voucher && voucher.Object?.id) {
        voucher.Object.text = `${voucher.Object.id} - ${voucher.Object.text}`;
      }
      this.makeNewOrder(voucher, null, { force: true });
    } else if (/^129/.test(voucherId)) {
      const voucher = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/returns/' + voucherId, { includeDetails: true, renderBarCode: true, includeObject: true, includeUnit: true, includeRelativeVouchers: true }).then(rs => rs[0]);
      if (voucher && voucher.Object?.id) {
        voucher.Object.text = `${voucher.Object.id} - ${voucher.Object.text}`;
      }
      this.orderForm = await this.makeNewReturnsForm(voucher);
    }
  }

  async returnsPayment(returns: string) {
    const returnsObj = await this.apiService.getPromise<CommercePosReturnModel[]>('/commerce-pos/returns/' + returns, { includeDetails: true, includeRelativeVouchers: true }).then(rs => rs[0]);
    let debitFunds = 0;
    if (returnsObj && returnsObj?.Details) {
      for (const detail of returnsObj.Details) {
        debitFunds += detail.Price * detail.Quantity;
      }
    }
    if (returnsObj.State !== 'APPROVED') {
      this.commonService.toastService.show('Phiếu trả hàng chưa được duyệt', 'Không thể trả hàng !', { status: 'warning' });
      return false;
    }

    if (returnsObj.RelativeVouchers) {
      const refPayment = returnsObj.RelativeVouchers.find(f => f.type == 'CPOSPAYMENT');
      // Kiểm tra lại nó không cho hoàn tiền từ phiếu trả hàng
      // if (refPayment) {
      //   this.commonService.toastService.show('Phiếu trả hàng này đã được hoàn tiền bởi phiếu chi ' + refPayment.id, 'Máy bán hàng', { status: 'danger' });
      //   return false;
      // }
      // const refOrder = returnsObj.RelativeVouchers.find(f => f.type == 'COMMERCEPOSORDER');
      // if (refOrder) {
      //   this.commonService.toastService.show('Phiếu trả hàng này đã được cấn trừ trong đơn hàng ' + refOrder.id, 'Máy bán hàng', { status: 'danger' });
      //   return false;
      // }
    }

    const returnsPaymentVoucher: CommercePosCashVoucherModel = {
      Type: 'CPOSPAYMENT',
      Object: returnsObj.Object,
      ObjectName: returnsObj.ObjectName,
      ObjectPhone: returnsObj.ObjectPhone,
      ObjectEmail: returnsObj.ObjectEmail,
      ObjectAddress: returnsObj.ObjectAddress,
      DateOfVoucher: new Date(),
      Description: 'Hoàn tiền cho phiếu trả hàng' + returnsObj.Code,
      Returns: returnsObj.Code,
      RelativeVouchers: [{ id: returnsObj.Code, text: returnsObj.Note || returnsObj.Code, type: 'COMMERCEPOSRETURN' }],
      Details: [
        {
          Description: 'Hoàn tiền cho phiếu trả hàng ' + returnsObj.Code,
          DebitAccount: '131',
          CreditAccount: '111',
          Amount: debitFunds,
          RelativeVoucher: returnsObj.Code
        }
      ]
    };

    return new Promise(resovle => {

      this.commonService.openDialog(CommercePosPaymnentPrintComponent, {
        context: {
          skipPreview: true,
          data: [returnsPaymentVoucher],
          onSaveAndClose: async (newReturnsPayment, printComponent) => {
            printComponent.close();
            this.historyOrderIndex = this.historyOrders.length - 1;
            this.orderForm = this.historyOrders[this.historyOrderIndex] || await this.makeNewOrder();

          },
          onClose: () => {
          },
        }
      });
    });
  }

  onChooseProduct(product: ProductModel) {
    (document.activeElement as HTMLElement).blur();
    this.searchEleRef.nativeElement.value = '';
    this.searchResults = null;

    this.barcodeProcess(null, { product: product });
  }

  chooseCustomer() {
    this.commonService.openDialog(ContactAllListComponent, {
      context: {
        inputMode: 'dialog',
        onDialogChoose: async (chooseItems: ContactModel[]) => {
          console.log(chooseItems);
          const contact = chooseItems[0];
          if (contact) {
            this.orderForm.get('Object').setValue({ id: contact.Code, text: `${contact.Code} - ${contact.Name}` });
            this.orderForm.get('ObjectName').setValue(contact.Name);
            this.orderForm.get('ObjectPhone').setValue(contact.Phone);
          }
        }
      }
    });
  }

  toggleDebt() {
    const debtControl = this.orderForm.get('IsDebt');
    debtControl.setValue(!debtControl.value);
    if (this.orderForm.value?.State == 'APPROVED') {
      this.commonService.toastService.show('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', {});
      return false;
    }
    if (this.orderForm['voucherType'] == 'COMMERCEPOSORDER') {
      if (debtControl.value) {
        this.commonService.toastService.show('Phiếu này sẽ ghi nhận doanh thu công nợ !', 'Ghi nhận doanh thu công nợ', { status: 'primary', duration: 1000 });
      } else {
        this.commonService.toastService.show('Phiếu này sẽ ghi nhận doanh thu tiền mặt !', 'Ghi nhận doanh thu tiền mặt', { status: 'success', duration: 1000 });
      }
    } else if (this.orderForm['voucherType'] == 'COMMERCEPOSRETURN') {
      if (debtControl.value) {
        this.commonService.toastService.show('Phiếu này sẽ ghi giảm doanh thu công nợ !', 'Ghi giảm doanh thu công nợ', { status: 'primary', duration: 1000 });
      } else {
        this.commonService.toastService.show('Phiếu này sẽ ghi giảm doanh thu tiền mặt !', 'Ghi giảm doanh thu tiền mặt', { status: 'success', duration: 1000 });
      }
    }
    (document.activeElement as HTMLElement).blur();
    return true;
  }

  async onMakeNewReturnsForm() {
    this.orderForm = await this.makeNewReturnsForm();
    this.save(this.orderForm);
    this.historyOrders.push(this.orderForm);
    this.historyOrderIndex = this.historyOrders.length - 1;

    (document.activeElement as HTMLElement).blur();
  }

  playNewPipSound() {
    const sound: HTMLAudioElement = new Audio('assets/sounds/beep-08b.wav');
    sound.play();
  }

  playIncreasePipSound() {
    const sound: HTMLAudioElement = new Audio('assets/sounds/beep-07a.wav');
    sound.play();
  }
  playDecreasePipSound() {
    const sound: HTMLAudioElement = new Audio('assets/sounds/beep-07a.wav');
    sound.play();
  }

  playErrorPipSound() {
    const sound: HTMLAudioElement = new Audio('assets/sounds/beep-03.wav');
    sound.play();
  }

  playPaymentSound() {
    const sound: HTMLAudioElement = new Audio('assets/sounds/benboncan_till-with-bell.wav');
    sound.play();
  }
}
