import { Select2Option } from './../../../../lib/custom-element/select2/select2.component';
import { CurrencyPipe } from '@angular/common';
import { DeploymentVoucherModel } from './../../../../models/deployment.model';
import { DeploymentVoucherFormComponent } from './../../../deployment/deployment-voucher/deployment-voucher-form/deployment-voucher-form.component';
import { WarehouseGoodsInContainerModel } from './../../../../models/warehouse.model';
import { UnitModel } from './../../../../models/unit.model';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductModel, ProductSearchIndexModel, ProductUnitModel } from './../../../../models/product.model';
import { ContactModel } from './../../../../models/contact.model';
import { CommercePosOrderModel, CommercePosCashVoucherModel, CommercePosReturnModel, CommercePosReturnDetailModel, CommercePosOrderDetailModel } from './../../../../models/commerce-pos.model';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild, ɵCodegenComponentFactoryResolver } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogRef, NbGlobalPhysicalPosition } from "@nebular/theme";
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
import { CommercePosDeploymentVoucherPrintComponent } from '../commerce-pos-deployment-voucher-print/commerce-pos-deployment-voucher-print.component';
import { ImagesViewerComponent } from '../../../../lib/custom-element/my-components/images-viewer/images-viewer.component';
import { resolve } from 'dns';
import { AccBankAccountModel } from '../../../../models/accounting.model';

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
  providers: [CurrencyPipe]
})
export class CommercePosGuiComponent extends BaseComponent implements AfterViewInit {

  /** Component name */
  componentName = 'CommercePosGuiComponent';
  title: string = 'Máy bán hàng';
  currentDate = new Date();

  status = '';

  loading = false;
  processing = false;
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

  quantityFormat: CurrencyMaskConfig = { ...this.cms.getNumberMaskConfig(), precision: 2 };
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.cms.getCurrencyMaskConfig(), precision: 0, allowNegative: true };

  order: OrderModel = new OrderModel;

  paymentMethod = [
    { id: 'CASH', text: 'Tiền mặt', status: 'success' },
    { id: 'DEBT', text: 'Công nợ', status: 'warning' },
    { id: 'BANKTRANSFER', text: 'Chuyển khoản', status: 'primary' },
    { id: 'MIXED', text: 'Hỗn hợp', status: 'danger' },
  ];

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

  bankAccountList: AccBankAccountModel[] = [];
  select2OptionForContact = {
    ...this.cms.makeSelect2AjaxOption('/contact/contacts', {
      includeIdText: true,
      includeGroups: true,
      sort_SearchRank: 'desc',
    }, {
      placeholder: 'F6 - Chọn khách hàng...', limit: 10, prepareReaultItem: (item) => {
        item['text'] = item['Code'] + ' - ' + (item['Title'] ? (item['Title'] + '. ') : '') + (item['ShortName'] ? (item['ShortName'] + '/') : '') + item['Name'] + '' + (item['Groups'] ? (' (' + item['Groups'].map(g => g.text).join(', ') + ')') : '');
        return item;
      },
      containerCss: `
        width: 100%
      `
    }),
  }
  select2OptionForBankAccount: Select2Option = {
    placeholder: 'Tài khoản ngân hàng...',
    allowClear: true,
    width: '100%',
    dropdownAutoWidth: true,
    minimumInputLength: 0,
    keyMap: {
      id: 'id',
      text: 'text',
    },
  }

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public currencyPipe: CurrencyPipe,
    public ref?: NbDialogRef<CommercePosGuiComponent>,
    public formBuilder?: FormBuilder,
  ) {
    super(cms, router, apiService, ref);

    this.cms.systemConfigs$.pipe(takeUntil(this.destroy$)).subscribe(settings => {
      this.systemConfigs = settings;
    });

    this.historyOrders.push(this.orderForm);
  }

  toastDefaultConfig = {
    position: NbGlobalPhysicalPosition.BOTTOM_LEFT,
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    screenfull.onchange(event => {
      console.log(event);
      setTimeout(() => {
        this.cms.sidebarService.collapse('menu-sidebar');
        this.cms.sidebarService.collapse('chat-sidebar');
      }, 300);
    });

    this.cms.layout$.next('fullscreen');
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    $('html').css({ fontSize: 'initial' });
  }

  onResume() {
    super.onResume();
    this.cms.sidebarService.collapse('menu-sidebar');
    this.cms.sidebarService.collapse('chat-sidebar');
  }

  onObjectChange(formGroup: FormGroup, selectedData: ContactModel) {
    // this.cms.takeUntil('pos-on-object-change', 300, () => {

    if (selectedData && !selectedData['doNotAutoFill']) {
      if (selectedData.Code) {
        if (!formGroup['isProcessing']) {
          formGroup.get('ObjectName').setValue(selectedData.Name);
          formGroup.get('ObjectPhone').setValue(selectedData.Phone);
          formGroup.get('ObjectAddress').setValue(selectedData.Address);
        }

        if (selectedData.Code == 'POSCUSTOMER') {
        } else {
          // Load current debt
          if (formGroup['voucherType'] == 'COMMERCEPOSORDER' && formGroup.get('State').value != 'APPROVED') {
            this.apiService.getPromise<any[]>('/accounting/reports', {
              // reportReceivablesFromCustomer: true,
              // groupBy: 'Object',
              eq_Accounts: '131',
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
    if (!formGroup['isProcessing'] && !selectedData) {
      // Clear
      formGroup.get('ObjectName').setValue('');
      formGroup.get('ObjectPhone').setValue('');
      formGroup.get('ObjectAddress').setValue('');
    }

    // });

    (document.activeElement as HTMLElement).blur();
  }

  private goodsList: ProductSearchIndexModel[] = [];
  // private productSearchIndex: { [key: string]: ProductSearchIndexModel } = {};
  private updateGoodsInfoProcessing = false;
  async updateGoodsInfo() {
    this.status = 'Đang tải bảng giá...';
    if (this.updateGoodsInfoProcessing) {
      console.warn('Other processing in progress...');
      return false;
    }
    ;
    this.updateGoodsInfoProcessing = true;
    // while (true) {
    try {
      // await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 'nolimit' }).then(productList => {
      //   for (const product of productList) {
      //     this.productMap[product.Code] = product;
      //   }
      //   console.log(this.productMap);
      // });
      // await this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { limit: 'nolimit' }).then(unitList => {
      //   for (const unit of unitList) {
      //     this.unitMap[unit['Sequence']] = unit;
      //   }
      //   console.log(this.unitMap);
      //   return true;
      // });
      // await this.apiService.getPromise<any>('/warehouse/goods', {
      //   getFindOrderIndex: true,
      //   limit: 'nolimit'
      // }).then(rs => {
      //   this.findOrderMap = rs;
      //   return true;
      // });

      // await this.apiService.getPromise<any[]>('/sales/master-price-table-details', {
      //   masterPriceTable: 'default',
      //   includeCategories: true,
      //   includeGroups: true,
      //   includeFeaturePicture: true,
      //   getRawData: true,
      //   limit: 'nolimit',
      //   includeContainers: true,
      // }).then(priceTableDetails => {
      //   this.masterPriceTable = {};
      //   for (const priceTableDetail of priceTableDetails) {
      //     priceTableDetail.Price = parseFloat(priceTableDetail.Price);
      //     this.masterPriceTable[`${priceTableDetail.Product}-${priceTableDetail.Unit}`] = priceTableDetail;
      //   }
      //   // console.log(this.masterPriceTable);
      //   this.status = '';

      // });

      // Get goods list
      this.goodsList = [];
      this.productMap = {};
      this.unitMap = {};
      this.findOrderMap = {};
      let offset = 0;
      this.progressStatus = 'danger';
      this.progress = 0;
      // while (true) {
      this.progressStatus = 'success';
      this.progress = 0;
      this.progressLabel = 'Đang tải thông tin sản phẩm...';
      const rs = await this.apiService.getProgress<ProductSearchIndexModel[]>('/commerce-pos/product-search-indexs', { fromCache: true }, (loaded, total) => {
        this.progress = parseInt(loaded / total * 100 as any);
        this.progressLabel = 'Đang tải thông tin sản phẩm...' + this.progress + '%';
      }).then(rs => {
        this.progress = 0;

        for (const productSearchIndex of rs) {
          // const price = this.masterPriceTable[`${productSearchIndex.Code}-${this.cms.getObjectId(productSearchIndex.Unit)}`]?.Price || null;
          productSearchIndex['WarehouseUnit'] = { id: productSearchIndex.BaseUnit, text: productSearchIndex.BaseUnitLabel };
          const goods = {
            id: `${productSearchIndex.Code}-${productSearchIndex.Unit}-${productSearchIndex.Container}`,
            text: productSearchIndex.Name + ' (' + productSearchIndex.UnitLabel + ')',
            Code: productSearchIndex.Code,
            Sku: productSearchIndex.Sku?.toUpperCase(),
            Name: productSearchIndex.Name,
            FeaturePicture: productSearchIndex.FeaturePicture,
            // Unit: goodsInContainer.Unit,
            Container: {
              id: productSearchIndex.Container,
              text: productSearchIndex.ContainerName,
              FindOrder: productSearchIndex.ContainerFindOrder,
              Shelf: productSearchIndex.ContainerShelf,
              ShelfName: productSearchIndex.ContainerShelfName,
            },
            BaseUnit: { id: productSearchIndex.BaseUnit, text: productSearchIndex.BaseUnitLabel },
            // ConversionRatio: productSearchIndex.ConversionRatio,
            Unit: { id: productSearchIndex.Unit, text: productSearchIndex.UnitLabel, Sequence: productSearchIndex.UnitSeq },
            // Shelf: { id: goodsInContainer.ContainerShelf, text: goodsInContainer.ContainerShelfName },
            Price: productSearchIndex.Price,
            PriceOfBaseUnitText: productSearchIndex.Price && productSearchIndex.BaseUnit != productSearchIndex.Unit && (' (' + (this.currencyPipe.transform(productSearchIndex.Price / productSearchIndex.ConversionRatio, 'VND') + '/' + productSearchIndex.BaseUnitLabel) + ')') || '',
            Inventory: null,
            Keyword: (productSearchIndex.Sku + ' ' + productSearchIndex.Name + ' (' + productSearchIndex.UnitLabel + ')').toLowerCase()
          };
          this.goodsList.push(goods);
          // this.productSearchIndex[`${productSearchIndex.Code}-${productSearchIndex.Unit}-${productSearchIndex.Container}`] = productSearchIndex;

          if (!this.productMap[productSearchIndex.Code]) this.productMap[productSearchIndex.Code] = productSearchIndex;
          if (!this.productUnitMap[productSearchIndex.Code + '-' + productSearchIndex.Unit]) this.productUnitMap[productSearchIndex.Code + '-' + productSearchIndex.Unit] = productSearchIndex;
          if (!this.unitMap[productSearchIndex.UnitSeq]) this.unitMap[productSearchIndex.UnitSeq] = { id: productSearchIndex.Unit, text: productSearchIndex.UnitLabel, Sequence: productSearchIndex.UnitSeq };
          if (!this.findOrderMap[productSearchIndex.ContainerFindOrder]) this.findOrderMap[productSearchIndex.ContainerFindOrder] = productSearchIndex;
          if (productSearchIndex.BaseUnit == productSearchIndex.Unit) {
            if (!this.skuBaseUnitMap[(productSearchIndex.Sku || '').toUpperCase()]) this.skuBaseUnitMap[(productSearchIndex.Sku || '').toUpperCase()] = productSearchIndex;
          }
        }

        // offset += 100;
        return rs;
      });
      this.progress = 0;
      this.updateGoodsInfoProcessing = false;
      return true;
    } catch (err) {
      this.updateGoodsInfoProcessing = false;
      this.progress = 0;
      console.log(err);
      console.log('retry...');
      this.status = 'Lỗi tải bảng giá, đang thử lại...';
      this.cms.showToast('Bảng giá mới chưa được cập nhật, refersh trình duyệt để tải lại', 'Cập nhật bảng giá không thành công !', { ...this.toastDefaultConfig, status: 'danger' });
      return false;
    }
    // }
  }

  private unitMap: { [key: string]: ProductUnitModel } = {};
  private productMap: { [key: string]: ProductModel } = {};
  private productUnitMap: { [key: string]: ProductModel } = {};
  private skuBaseUnitMap: { [key: string]: ProductModel } = {};
  // private findOrderMap: { [key: string]: { Goods: string, Unit: string, UnitLabel: string, Container: string } } = {};
  private findOrderMap: { [key: string]: ProductModel } = {};
  async init() {
    this.loading = true;
    const result = await super.init().then(async status => {
      const loginId = await this.cms.loginInfo$.pipe(filter(f => !!f), take(1)).toPromise().then(loginInfo => loginInfo?.user?.Code);
      this.apiService.getPromise<any>('/commerce-pos/product-search-indexs', { cacheCheckPonit: true }).then(rs => rs.data).then(serverProductSearchIndexCheckPoint => {
        console.log(serverProductSearchIndexCheckPoint);
        localStorage.setItem(loginId + '_PRODUCT_SEARCH_INDEX_CACHE_CHECK_POINT', serverProductSearchIndexCheckPoint);
      });
      this.bankAccountList = await this.apiService.getPromise<AccBankAccountModel[]>('/accounting/bank-accounts', { limit: 'nolimit', select: "id=>Code,text=>CONCAT(Owner;' ';AccountNumber;' ';Bank;' ';Branch)" });
      while (true) {
        try {
          await this.updateGoodsInfo();
          break;
        } catch (err) {
          console.error(err);
          this.cms.showToast('Chưa thể tải thông tin sản phẩm, thử lại trong 3s', 'Tải thông tin sản phẩm thất bại', { status: 'danger' });
          await new Promise(resolve => setTimeout(() => resolve(true), 3000));
        }
      }

      // Notification
      this.cms.showToast('Hệ thống đã sẵn sàng để bán hàng !', 'POS đã sẵn sàng', { ...this.toastDefaultConfig, status: 'success' });
      setInterval(() => {
        console.log('Listen new master price table update...');
        // this.apiService.getPromise<any>('/sales/master-price-tables/getUpdate', { priceTable: 'default' }).then(rs => {
        //   console.log(rs);
        //   if (rs && rs.State == 'UPDATED') {
        //     this.cms.showToast('Có bảng giá mới, vui lòng chờ trong giây lát !', 'Có bảng giá mới !', { status: 'primary' });
        //     return this.updateGoodsInfo().then(status => {
        //       this.cms.showToast('Hệ thống đã cập nhật bảng giá mới, mời bạn tiếp tục bán hàng !', 'Đã cập nhật bảng giá mới !', { status: 'success' });
        //       return status;
        //     });
        //   }
        //   return false;
        // }).catch(err => {
        //   console.log(err);
        // });

        this.apiService.getPromise<any>('/commerce-pos/product-search-indexs', { cacheCheckPonit: true }).then(rs => rs.data).then(serverProductSearchIndexCheckPoint => {
          console.log(serverProductSearchIndexCheckPoint);
          const productSearchCacheCheckPoint = localStorage.getItem(loginId + '_PRODUCT_SEARCH_INDEX_CACHE_CHECK_POINT');
          if (serverProductSearchIndexCheckPoint && serverProductSearchIndexCheckPoint != productSearchCacheCheckPoint) {
            this.cms.showToast('Có bảng giá mới, vui lòng chờ trong giây lát !', 'Có bảng giá mới !', { ...this.toastDefaultConfig, status: 'primary' });
            return this.updateGoodsInfo().then(status => {
              this.cms.showToast('Hệ thống đã cập nhật bảng giá mới, mời bạn tiếp tục bán hàng !', 'Đã cập nhật bảng giá mới !', { ...this.toastDefaultConfig, status: 'success' });
              localStorage.setItem(loginId + '_PRODUCT_SEARCH_INDEX_CACHE_CHECK_POINT', serverProductSearchIndexCheckPoint);
              return status;
            });
          }
          return false;
        }).catch(err => {
          console.log(err);
        });
      }, 20000);

      return status;
    });
    this.cms.sidebarService.collapse('menu-sidebar');
    this.cms.sidebarService.collapse('chat-sidebar');

    await this.save(this.orderForm);

    // Listen price table update

    this.loading = false;
    return result;
  }

  makeNewOrderForm(data?: CommercePosOrderModel) {
    const newForm = this.formBuilder.group({
      Code: [],
      Title: [],
      BarCode: [],
      Object: [],
      ObjectName: [],
      ObjectPhone: [],
      ObjectEmail: [],
      ObjectAddress: [],
      ObjectIdenfiedNumber: [],
      Note: [],
      SubNote: [],
      Amount: [0],
      CashReceipt: [null],
      DecreaseForTotal: [null],
      CashBack: [null],
      State: [null],
      DateOfSale: [null],
      Created: [null],
      Details: this.formBuilder.array([]),
      Returns: [],
      RelativeVouchers: [data?.Returns ? [{ id: data.Returns, text: data.Returns, type: 'COMMERCEPOSRETURN' }] : null],
      DebitFunds: [],
      // FinalReceipt: [],
      IsDebt: [false],
      PaymentMethod: [this.paymentMethod.find(f => this.cms.getObjectId(f) == 'CASH')],
      ReceiptBankAccount: [],
      CashTransferAmount: [],
      CashAmount: [],
    });
    newForm['voucherType'] = 'COMMERCEPOSORDER';
    newForm['isReceipt'] = true;
    newForm['isProcessing'] = null;
    newForm['returnsObj'] = data?.returnsObj;
    if (data) {
      if (data.Object) {
        data.Object = {
          id: this.cms.getObjectId(data.Object),
          text: this.cms.getObjectText(data.Object) || data.ObjectName,
          Phone: data.ObjectPhone,
          Email: data.ObjectEmail,
          Address: data.ObjectAddress,
        };
      }
      if (typeof data.PaymentMethod === 'string') {
        data.PaymentMethod = this.paymentMethod.find(f => this.cms.getObjectId(f) === data.PaymentMethod);
      }
      newForm.patchValue(data);
      if (data.Details) {
        const details = (this.getDetails(newForm) as FormArray).controls;
        for (const detail of data.Details) {
          details.push(this.makeNewOrderDetail(detail));
        }
        this.calculateTotal(newForm);
      }

    }

    // newForm['modified'] = false;
    // newForm.valueChanges.subscribe(value => {
    //   console.log('form value modified', value);
    //   newForm['modified'] = true;
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
        Title: [],
        BarCode: [],
        Order: [order.Code || null],
        Object: [order.Object || null],
        ObjectName: [order.ObjectName || null],
        ObjectPhone: [order.objectPhone || null],
        ObjectEmail: [order.ObjectEmail || null],
        ObjectAddress: [order.ObjectAddress || null],
        Note: [],
        SubNote: [],
        Amount: [0],
        // CashBack: [0],
        CashReceipt: [0],
        State: [null],
        DateOfReturn: [new Date()],
        Created: [null],
        RelativeVouchers: [[{ id: order.Code, text: order.Title || order.Code, type: 'COMMERCEPOSORDER' }]],
        Details: this.formBuilder.array([]),
        IsDebt: [false],
        PaymentMethod: [this.paymentMethod.find(f => this.cms.getObjectId(f) == 'CASH')],
        ReceiptBankAccount: [],
        CashTransferAmount: [],
        CashAmount: [],
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
        Amount: [0],
        CashBack: [0],
        CashReceipt: [0],
        State: [null],
        DateOfSale: [new Date()],
        Created: [null],
        Details: this.formBuilder.array([]),
        IsDebt: [false],
        PaymentMethod: [this.paymentMethod.find(f => this.cms.getObjectId(f) == 'CASH')],
        ReceiptBankAccount: [],
        CashTransferAmount: [],
        CashAmount: [],
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

    // newForm['modified'] = false;
    // newForm.valueChanges.subscribe(value => {
    //   console.log('form value modified', value);
    //   newForm['modified'] = true;
    // });

    return newForm;
  }

  makeNewOrderDetail(detail?: CommercePosReturnDetailModel) {
    return this.formBuilder.group({
      SystemUuid: [detail.SystemUuid || null],
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

  returnVoucherMap: { [key: string]: FormGroup } = {};

  async makeNewOrder(data?: CommercePosOrderModel, returnsObj?: any, option?: { force?: boolean, location?: string, autoActiveForm?: boolean }) {

    option = {
      ...option,
      autoActiveForm: typeof option?.autoActiveForm == 'undefined' ? true : option.autoActiveForm
    }

    const endOrderForm = this.historyOrders[this.historyOrders.length - 1];
    if (!returnsObj && !option?.force && endOrderForm && this.orderForm['voucherType'] != 'COMMERCEPOSRETURN' && endOrderForm.getRawValue()['State'] == 'NOTJUSTAPPROVED' && endOrderForm.getRawValue()['Details'].length == 0) {
      this.historyOrderIndex = this.historyOrders.length - 1;
      this.orderForm = this.historyOrders[this.historyOrders.length - 1];
      return this.orderForm;
    }

    let orderForm = null;
    if (this.orderForm.get('State').value !== 'APPROVED') {
      this.save(this.orderForm);
    }

    if (returnsObj) {
      if (typeof returnsObj === 'string') {
        const returnsData = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/returns/' + returnsObj, { includeDetails: true, renderBarCode: true, includeObject: true, includeUnit: true }).then(rs => rs[0]);
        returnsObj = await this.makeNewReturnsForm(returnsData);
        this.returnVoucherMap[returnsData.Code] = returnsObj;
      }

      let debitFunds = 0;
      // if (!returnsObj.IsDebt) {
      const returnsDetails = returnsObj && (returnsObj.get('Details') as FormArray).controls || null;
      if (returnsDetails) {
        for (const detail of returnsDetails) {
          debitFunds += detail.get('Price').value * detail.get('Quantity').value;
        }
      }
      // }

      let returnObject = null;
      if (returnsObj.get('Object').value) {
        returnObject = await this.apiService.getPromise<ContactModel[]>('/contact/contacts/' + this.cms.getObjectId(returnsObj.get('Object').value), { includeIdText: true }).then(rs => rs[0]);
      }

      orderForm = this.makeNewOrderForm({ ...data, Object: returnObject.Object, ObjectName: data?.ObjectName || returnObject.ObjectName, ObjectPhone: data?.ObjectPhone || returnObject.ObjectPhone, ObjectEmail: data?.ObjectEmail || returnObject.ObjectEmail, ObjectAddress: data?.ObjectAddress || returnObject.ObjectAddress, returnsObj, Code: null, Returns: returnsObj.get('Code').value, DebitFunds: debitFunds });
    } else {
      orderForm = this.makeNewOrderForm(data);
    }
    this.calculateTotal(orderForm);
    if (option?.location == 'HEAD') {
      this.historyOrders.unshift(orderForm);
      if (option.autoActiveForm) {
        this.historyOrderIndex = 0;
        this.orderForm = orderForm;
      } else {
        this.historyOrderIndex++;
      }
    } else {
      this.historyOrders.push(orderForm);
      if (option.autoActiveForm) {
        this.historyOrderIndex = this.historyOrders.length - 1;
        this.orderForm = orderForm;
      }
    }
    if (!data || !data.Code) {
      await this.save(orderForm);
    }
    return orderForm;
  }

  async makeNewReturns(data?: CommercePosReturnModel, order?: string, option?: { force?: boolean, location?: string, autoActiveForm?: boolean }) {

    option = {
      ...option,
      autoActiveForm: typeof option?.autoActiveForm == 'undefined' ? true : option.autoActiveForm
    }

    // const endOrderForm = this.historyOrders[this.historyOrders.length - 1];
    // if (!returns && !option?.force && endOrderForm && this.orderForm['voucherType'] != 'COMMERCEPOSRETURN' && endOrderForm.getRawValue()['State'] == 'NOTJUSTAPPROVED' && endOrderForm.getRawValue()['Details'].length == 0) {
    //   this.historyOrderIndex = this.historyOrders.length - 1;
    //   this.orderForm = this.historyOrders[this.historyOrders.length - 1];
    //   return this.orderForm;
    // }

    let orderForm = null;
    if (this.orderForm.get('State').value !== 'APPROVED') {
      this.save(this.orderForm);
    }

    // if (order) {
    //   const returnsObj = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + order, { includeDetails: true, includeRelativeVouchers: true }).then(rs => rs[0]);

    //   let debitFunds = 0;

    //   if (returnsObj && returnsObj?.Details) {
    //     for (const detail of returnsObj.Details) {
    //       debitFunds += detail.Price * detail.Quantity;
    //     }
    //   }

    //   if (returnsObj.Object) {
    //     returnsObj.Object = await this.apiService.getPromise<ContactModel[]>('/contact/contacts/' + this.cms.getObjectId(returnsObj.Object), { includeIdText: true }).then(rs => rs[0]);
    //   }

    //   orderForm = this.makeNewReturnsForm({ ...data, Object: returnsObj.Object, returnsObj, Code: null, Returns: order, DebitFunds: debitFunds });
    // } else {
    orderForm = this.returnVoucherMap[data.Code];
    if (!orderForm) {
      orderForm = await this.makeNewReturnsForm(data);
    }
    // }
    this.calculateTotal(orderForm);
    if (option?.location == 'HEAD') {
      this.historyOrders.unshift(orderForm);
      if (option.autoActiveForm) {
        this.historyOrderIndex = 0;
        this.orderForm = orderForm;
      } else {
        this.historyOrderIndex++;
      }
    } else {
      this.historyOrders.push(orderForm);
      if (option.autoActiveForm) {
        this.historyOrderIndex = this.historyOrders.length - 1;
        this.orderForm = orderForm;
      }
    }
    if (!data || !data.Code) {
      await this.save(orderForm);
    }
    return orderForm;
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

  calculateTotal(orderForm: FormGroup) {
    let total = 0;
    for (const detail of this.getDetails(orderForm).controls) {
      total += parseFloat(detail.get('Price').value) * parseFloat(detail.get('Quantity').value);
    }

    orderForm.get('Amount').setValue(total);
    // const discount = this.orderForm.get('DecreaseForTotal');
    // this.orderForm.get('FinalReceipt').setValue(parseFloat(total || 0 as any) - parseFloat((discount.value || 0)));

    this.onCashReceiptChanged(orderForm);
    return total;
  }

  async onSearchInputKeydown(event: any) {
    // console.log(event);

    const inputValue: string = event.target?.value;
    if (event.key == 'Enter' && (!this.searchResults || this.searchResults.length == 0)) {
      try {
        await this.barcodeProcess(inputValue);
        event.target.value = '';
        event.target.blur();
      } catch (err) {
        this.cms.showToast(err, 'Cảnh báo', { ...this.toastDefaultConfig, status: 'warning' });
      }
    }
    return true;
  }

  lastSearchCount = 0;
  async onSearchInputKeyup(event: any) {
    // console.log(event);
    this.cms.takeUntilCallback('commerce-pos-search', 300, () => {
      const inputValue: string = event.target?.value;
      if ((event.key.length == 1 && /[a-z0-9\ ]/i.test(event.key)) || (event.key.length > 1 && ['Backspace'].indexOf(event.key) > -1)) {
        if (/\w+/.test(inputValue)) {
          this.lastSearchCount++;
          const currentSearchCount = this.lastSearchCount;


          if (this.goodsList && this.goodsList.length > 0) {
            // Search in local memory
            let rs = this.goodsList.filter(f => new RegExp('^' + inputValue.toUpperCase()).test(f.Sku)).slice(0, 256);
            // rs = rs.concat(rs, this.goodsList.filter(f => this.cms.smartFilter(f.Keyword, inputValue.toLowerCase())).slice(0, 256));
            let rsByKeyword = this.goodsList.filter(f => this.cms.smartFilter(f.Keyword, inputValue.toLowerCase())).slice(0, 256);
            for (const item of rsByKeyword) {
              if (rs.findIndex(f => f.Code == item.Code && this.cms.getObjectId(f.Unit) == this.cms.getObjectId(item.Unit) && this.cms.getObjectId(f.Container) == this.cms.getObjectId(item.Container)) < 0) {
                rs.push(item);
              }
            }

            if (currentSearchCount == this.lastSearchCount) {
              this.searchResults = rs;
              if (this.searchResults[0]) {
                this.searchResults[0].active = true;
                this.searchResultActiveIndex = 0;
                setTimeout(() => {
                  this.searchListViewport.scrollToIndex(0, 'smooth');
                }, 0);
              }

              // Get inventory for top 10 results
              const top10 = this.searchResults.slice(0, 10);
              top10.forEach(m => m.Inventory = null);

              if (top10.length > 0) {
                this.apiService.getPromise<any[]>('/warehouse/goods-in-containers', { id: top10.map(m => m.id), includeAccessNumbers: false }).then(goodsInContainerList => {
                  console.log(goodsInContainerList);
                  for (const goodsInContainer of goodsInContainerList) {
                    // const goods = this.productSearchIndex[`${goodsInContainer.Goods}-${goodsInContainer.Unit}-${goodsInContainer.Container}`];
                    const goods = top10.find(f => f.Code === goodsInContainer.Goods && this.cms.getObjectId(f.Unit) === goodsInContainer.Unit && this.cms.getObjectId(f.Container) === goodsInContainer.Container);
                    if (goods) {
                      goods.Inventory = goodsInContainer.Inventory;
                    }
                  }
                });
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
              sort_GoodsName: 'asc',
              sort_UnitNo: 'asc',
              search: inputValue,
              limit: 20
            }).then(rs => {
              if (currentSearchCount == this.lastSearchCount) {
                this.searchResults = rs.map(goods => {
                  // goods.Price = this.masterPriceTable[`${goods.Goods}-${this.cms.getObjectId(goods.Unit)}`]?.Price;
                  if (!goods.Price) {
                    goods.Price = this.productUnitMap[`${goods.Goods}-${this.cms.getObjectId(goods.Unit)}`]?.Price;
                  }
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
    this.cms.takeUntil('commerce-pos-seach-contact-by-phone', 600).then(() => {
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
    this.cms.takeUntil('commerce-pos-save-contact-name', 3000).then(() => {
    });
  }

  inputValue: string = '';
  isBarcodeProcessing = new BehaviorSubject<number>(0);
  barcodeQueue: { inputValue: string, option?: { searchByFindOrder?: boolean, searchBySku?: boolean, product?: ProductModel } }[] = [];
  barcodeProcessCount = -1;
  async barcodeProcess(inputValue: string, option?: { searchByFindOrder?: boolean, searchBySku?: boolean, product?: ProductModel, onHadPrimise?: (promise: Promise<any>) => void }) {

    this.barcodeProcessCount++;
    const queueId = this.barcodeProcessCount;

    // Wait for previous barcode process finish
    await this.isBarcodeProcessing.pipe(filter(f => {
      console.log(`Barcode processing queue check: ${f} === ${queueId}`);
      return f === queueId;
    }), take(1)).toPromise();

    try {
      this.inputValue = inputValue = inputValue && inputValue.trim() || inputValue;
      const detailsControls = this.getDetails(this.orderForm).controls
      const systemConfigs = await this.cms.systemConfigs$.pipe(takeUntil(this.destroy$), filter(f => !!f), take(1)).toPromise().then(settings => settings);
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
          product = this.skuBaseUnitMap[inputValue.toUpperCase()];
          // if (this.goodsList) {
          //   const products = this.goodsList.filter(f => f.Sku == inputValue.toUpperCase());
          //   for (const prod of products) {
          //     const productInfo = this.productUnitMap[prod.Code + '-' + this.cms.getObjectId(prod.Unit)];

          //     // Tìm vị trí tương ứng với đơn vị tính cơ bản
          //     if (productInfo && this.cms.getObjectId(productInfo.WarehouseUnit) == this.cms.getObjectId(prod.Unit)) {
          //       product = prod;
          //       break;
          //     }
          //   }
          // }
          if (!product) {
            product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', { includeUnit: true, includePrice: true, eq_Sku: inputValue, includeInventory: true }).then(rs => {
              return rs[0];
            });
          }

          if (!product) {
            this.cms.showToast(`Sku không tồn tại !`, 'Sku không tồn tại !', { ...this.toastDefaultConfig, status: 'danger' });
            // resolve(true);
            // return;
            throw new Error(`Sku không tồn tại !`);
          }
          productId = product.Code;
          unit = product.Unit;
          unitId = this.cms.getObjectId(product.Unit);
        } else {
          if (option?.searchByFindOrder || inputValue.length < 5) {
            //Tìm hàng hóa theo số nhận thức
            product = this.findOrderMap[inputValue];
            // if (goodsInContainer && goodsInContainer.Goods && goodsInContainer.Unit) {
            //   productId = goodsInContainer.Goods;
            //   product = this.productMap[productId];
            //   unitId = goodsInContainer.Unit;
            //   product.Unit = unit = { id: goodsInContainer.Unit, text: goodsInContainer.UnitLabel };
            //   product.Container = goodsInContainer.Container;
            // }
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
              unitId = unitId || this.cms.getObjectId(unit);
              // product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
              if (!product.Price) {
                product.Price = this.productUnitMap[`${product.Code}-${unitId}`]?.Price;
              }
              // product.FindOrder = inputValue.trim();
              product.FindOrder = product.ContainerFindOrder || inputValue.trim();
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

              product = this.productUnitMap[this.findOrderMap[findOrder].Code + '-' + this.cms.getObjectId(this.findOrderMap[findOrder].Unit)];

              if (product && unitSeq) {
                unit = this.unitMap[unitSeq];
                if (unit) {
                  unitId = unit.Code;
                  // product.Unit = { ...unit, id: unit.Code, text: unit.Name };
                  product.Unit = unit;
                }
              }

              if (!product) {
                throw new Error('Không tìm thấy hàng hóa !');
              }

              unitId = this.cms.getObjectId(product.Unit);
              // product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
              if (!product.Price) {
                product.Price = this.productUnitMap[`${product.Code}-${unitId}`]?.Price;
              }
              productId = product.Code;
              product.FindOrder = findOrder;

            } else {
              if (new RegExp('^127' + coreId + '\\d+').test(inputValue)) {
                accessNumber = inputValue;
              } else {
                if (new RegExp('^128' + coreId).test(inputValue)) {
                  setTimeout(() => {

                    this.cms.openDialog(ShowcaseDialogComponent, {
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
                    this.cms.openDialog(ShowcaseDialogComponent, {
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
                } else if (new RegExp('^113' + coreId).test(inputValue)) {
                  setTimeout(() => {
                    this.cms.openDialog(ShowcaseDialogComponent, {
                      context: {
                        title: 'Máy bán hàng',
                        content: 'Xem lại phiếu triển khai và đơn hàng liên quan',
                        actions: [
                          {
                            label: 'Mở lại bill liên quan (F10)',
                            keyShortcut: 'F10',
                            status: 'primary',
                            action: async () => {
                              const deploymentVoucher = await this.apiService.getPromise<DeploymentVoucherModel[]>('/deployment/vouchers/' + inputValue, { includeRelativeVouchers: true }).then(rs => rs[0]);
                              this.loadVoucher(deploymentVoucher?.RelativeVouchers?.find(f => f.type == 'COMMERCEPOSORDER')?.id);
                            }
                          },
                          {
                            label: 'Xem lại (Enter)',
                            keyShortcut: 'Enter',
                            status: 'success',
                            focus: true,
                            action: async () => {
                              this.cms.previewVoucher('DEPLOYMENT80', inputValue);
                            }
                          },
                        ],
                        onClose: () => {
                        },
                      }
                    });
                  }, 50);
                  throw new Error('Trường hợp xem lại phiếu triển khai');
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
                    unitId = this.cms.getObjectId(product.WarehouseUnit);
                    // product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
                    if (!product.Price) {
                      product.Price = this.productUnitMap[`${product.Code}-${unitId}`]?.Price;
                    }
                  }
                }

                let unitIdLength = null;

                if (!product) {

                  const extracted = this.cms.extractGoodsBarcode(inputValue);
                  accessNumber = extracted.accessNumber;
                  productId = extracted.productId;
                  unitSeq = extracted.unitSeq;
                  unit = this.unitMap[unitSeq];
                  unitId = this.cms.getObjectId(unit);

                  product = this.productUnitMap[productId + '-' + unitId];

                  if (product && unitSeq) {
                    unit = this.unitMap[unitSeq];
                    if (unit) {
                      unitId = this.cms.getObjectId(unit);
                      // product.Unit = { ...unit, id: unit.Code, text: unit.Name };
                      product.Unit = unit;
                    }
                  }
                }

                // }
              }
            }

            // get access number inventory 
            if (new RegExp('^127' + coreId).test(accessNumber)) {
              const getProductByAccessNumberPromise = this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', {
                accessNumber: accessNumber,
                includeUnit: true,
                includePrice: false,
                includeInventory: true,
                includePreviousOrder: this.orderForm['voucherType'] == 'COMMERCEPOSRETURN',
              }).then(rs => {

                product = rs[0];

                if (!product) {
                  this.cms.showToast(`Số truy xuất ${accessNumber} không tồn tại !`, 'Số truy xuất không tồn tại !', { ...this.toastDefaultConfig, status: 'warning' });
                  existsProduct.get('AccessNumbers').setValue((existsProduct.get('AccessNumbers').value || []).filter(f => f != accessNumber));
                  throw new Error(`Số truy xuất ${accessNumber} không tồn tại !`);
                }

                const addReturnGoodsPromise = new Promise((resolve, reject) => {
                  setTimeout(async () => {
                    try {
                      const existsProductIndex = detailsControls.findIndex(f => this.cms.getObjectId(f.get('Product').value) === productId && this.cms.getObjectId(f.get('Unit').value) == unitId);
                      existsProduct = detailsControls[existsProductIndex] as FormGroup;
                      if (existsProduct) {

                        existsProduct.get('Container').setValue(product.Container);

                        if (this.orderForm['voucherType'] == 'COMMERCEPOSRETURN') {
                          if (product.Inventory && product.Inventory > 0) {
                            this.cms.showToast(`${product.Name} (${product.Unit.Name}) đang có trong kho! không thể trả hàng với hàng hóa chưa xuất kho !`, 'Hàng hóa chưa xuất bán !', { status: 'warning' });
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
                                  if (this.cms.getObjectId(product['LastAccEntry']['Object']) != this.cms.getObjectId(object.value)) {

                                    this.cms.showToast('Liên hệ trên đơn bán hàng phải giống với trên đơn trả hàng !', 'Không đúng liên hệ đã mua hàng trước đó', { ...this.toastDefaultConfig, status: 'warning' });
                                    return false;

                                  }
                                }
                              }

                              // Set relative vouchers
                              const detailsRelativeVouchers = existsProduct.get('RelativeVouchers');
                              const detailsRelativeVouchersData = detailsRelativeVouchers.value || [];

                              if (!detailsRelativeVouchersData.some(f => this.cms.getObjectId(f) == product['LastAccEntry']['Voucher'])) {
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
                              if (!relativeVouchersData.some(f => this.cms.getObjectId(f) == product['LastAccEntry']['Voucher'])) {
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

                                await new Promise(resolve => setTimeout(() => resolve(true), 1000));
                              }

                              // Trả hàng về vị trí trước đó đã xuất bán
                              existsProduct.get('Container').setValue(product['LastWarehouseEntry']['Container']);

                            }

                          }
                        } else {
                          if (!product.Inventory || product.Inventory < 1) {
                            this.cms.showToast(`${product.Name} (${product.Unit.Name}) (${accessNumber}) không có trong kho`, 'Hàng hóa không có trong kho !', { ...this.toastDefaultConfig, status: 'warning' });
                            existsProduct.get('AccessNumbers').setValue((existsProduct.get('AccessNumbers').value || []).filter(f => f != accessNumber));
                            // return;
                          }
                        }
                      }
                    } catch (err) {
                      reject(err);
                    }
                    resolve(true);
                  }, 1000);
                });
                option?.onHadPrimise(addReturnGoodsPromise);

                return product;
              });

              option?.onHadPrimise && option.onHadPrimise(getProductByAccessNumberPromise);

              if (!unitId || !product) { // Nếu tem cũ không có unit sequence thì phải lấy thông tin sản phẩm bằng số truy xuất ngay từ đầu
                await getProductByAccessNumberPromise;
              }
              if (product) {
                productId = product.Code;
                unitId = unitId || this.cms.getObjectId(product.Unit);
                if (!product.Price) {
                  // product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
                  product.Price = this.productUnitMap[`${product.Code}-${unitId}`]?.Price;
                }
              } else {
                product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, {
                  includeUnit: true,
                  includePrice: false,
                  includeInventory: true,
                  unitSeq: unitSeq
                }).then(rs => {
                  return rs[0];
                });
                unitId = this.cms.getObjectId(product.Unit);
                if (!product.Price) {
                  // product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
                  product.Price = this.productUnitMap[`${product.Code}-${unitId}`]?.Price;
                }
              }
            }
          }
        }
      } else {
        productId = product.Code;
        unitId = this.cms.getObjectId(product.Unit);
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
          unitId = this.cms.getObjectId(product.Unit);
          // product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
          if (!product.Price) {
            // product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
            product.Price = this.productUnitMap[`${product.Code}-${unitId}`]?.Price;
          }
        }
        // }
      }

      if (this.orderForm.value?.State == 'APPROVED') {
        this.cms.showToast('Bạn phải hủy phiếu mới thêm hàng hóa vào được!', 'Đơn hàng đã thanh toán !', { ...this.toastDefaultConfig, status: 'warning' });
        throw new Error('Bạn phải hủy phiếu mới thêm hàng hóa vào được!');
      }

      console.log(accessNumber, productId);
      let existsProductIndex = detailsControls.findIndex(f => this.cms.getObjectId(f.get('Product').value) === productId && this.cms.getObjectId(f.get('Unit').value) == unitId);
      existsProduct = detailsControls[existsProductIndex] as FormGroup;
      if (existsProduct) {
        const quantityControl = existsProduct.get('Quantity');
        const priceControl = existsProduct.get('Price');
        const toMoney = existsProduct.get('ToMoney');
        const accessNumbersContorl = existsProduct.get('AccessNumbers');
        const accessNumbers = accessNumbersContorl.value || [];
        if (accessNumber) {
          if (!accessNumbers.find(f => f == accessNumber)) {
            quantityControl.setValue(quantityControl.value + 1);
            toMoney.setValue(quantityControl.value * priceControl.value);
            if (accessNumber) {
              accessNumbersContorl.setValue([...accessNumbers, accessNumber]);
            }
            // this.calculateTotal(this.orderForm);

            this.playIncreasePipSound();
            this.calculateToMoney(existsProduct);
            this.calculateTotal(this.orderForm);
            this.activeDetail(this.orderForm, existsProduct, existsProductIndex);
          } else {
            this.playErrorPipSound();
            this.cms.showToast('Mã truy xuất đã được quét trước đó rồi, mời bạn quét tiếp các mã khác !', 'Trùng mã truy xuất !', { ...this.toastDefaultConfig, status: 'warning' });
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

            if (!product.Unit || !this.cms.getObjectId(product.Unit) || this.cms.getObjectId(product.Unit) == 'n/a') {
              this.playErrorPipSound();
              this.cms.showToast('Không thể bán hàng với hàng hóa chưa được cài đặt đơn vị tính !', 'Sản phẩm chưa cài đặt đơn vị tính !', { ...this.toastDefaultConfig, status: 'danger' });
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
              this.cms.showToast('Không thể bán hàng với hàng hóa chưa có giá bán !', 'Hàng hóa chưa có giá bán !', { ...this.toastDefaultConfig, status: 'danger' });
              return [];
            }).then(prices => prices.find(f => this.cms.getObjectId(f.Unit) == this.cms.getObjectId(product.Unit))).then(price => {
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
                this.cms.showToast('Không thể bán hàng với hàng hóa chưa có giá bán !', 'Hàng hóa chưa có giá bán !', { ...this.toastDefaultConfig, status: 'danger' });
              }
            });
          } else {
            this.playErrorPipSound();
            this.cms.showToast('Hàng hóa không tồn tại !', 'Hàng hóa không tồn tại !', { ...this.toastDefaultConfig, status: 'danger' });
            throw new Error('Hàng hóa không tồn tại !');
          }
        }
      }
      this.isBarcodeProcessing.next(queueId + 1);
      console.log('Barcode process sucess for queue: ' + queueId);
      return existsProduct;
    } catch (err) {
      console.error(err);
      this.isBarcodeProcessing.next(queueId + 1);
      return null;
    }
  }

  destroyOrder(event?: any) {
    this.cms.showDialog('POS', 'Bạn có muốn hủy phiếu này không ?', [
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

  dateOfPrevious = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
  async onPreviousOrderClick() {
    if (this.processing) {
      console.log('an other process is processing...');
      return;
    }
    this.processing = true;
    this.status = 'Tải đơn hàng trước...'
    this.historyOrderIndex = this.historyOrders.findIndex(f => f === this.orderForm);
    if (this.historyOrderIndex > 0) {
      this.save(this.historyOrders[this.historyOrderIndex]).then(rs => {
        console.log('Đã lưu nháp');
      }).catch(err => {
        console.warn('Lưu nháp không thành công', err);
      });
      this.historyOrderIndex--;
      this.orderForm = this.historyOrders[this.historyOrderIndex];
    } else {
      const params: any = {
        sort_Created: 'desc',
        limit: 'nolimit',
        // includeDetails: true,
        // includeRelativeVouchers: true,
        // includeObject: true,
        mergeReturnVouchers: true
      };
      console.log('Load voucher to:' + this.dateOfPrevious);
      if (this.historyOrders[0] && this.historyOrders[0].get('Code').value) {
        // params.lt_Code = this.historyOrders[0].get('Code').value;
        params.gt_VoucherDate = this.dateOfPrevious.toISOString();
        params.le_Created = this.historyOrders[0].get('Created').value;
        params.ne_Code = this.historyOrders[0].get('Code').value;
      }
      // this.loading = true;
      this.progressStatus = 'danger';
      this.progress = 0;
      await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders', params).then(async rs => {
        console.log(rs);
        let i = 0;
        this.progress = 0;
        for (const _order of rs) {
          i++;
          if (_order.Type == 'COMMERCEPOSORDER') {
            const order = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + _order.Code, { includeDetails: true, renderBarCode: true, includeObject: true, includeUnit: true, includeRelativeVouchers: true }).then(rs => rs[0]);
            await this.makeNewOrder(order, (order?.RelativeVouchers || []).find(f => f.type == 'COMMERCEPOSRETURN')?.id || null, { force: true, location: 'HEAD', autoActiveForm: false });
          }
          if (_order.Type == 'COMMERCEPOSRETURN') {

            const returns = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/returns/' + _order.Code, { includeDetails: true, renderBarCode: true, includeObject: true, includeUnit: true, includeRelativeVouchers: true }).then(rs => rs[0]);
            await this.makeNewReturns(returns, null, { force: true, location: 'HEAD', autoActiveForm: false });
          }
          const progress = parseInt((i / rs.length * 100) as any);
          if (progress <= 100) {
            this.progress = progress;
          } else {
            this.progress = 100;
            this.progressStatus = 'success';
          }
          this.progressLabel = 'Tải đơn hàng ' + this.cms.datePipe.transform(this.dateOfPrevious, 'shortDate') + ' (' + i + '/' + rs.length + ')';
        }
        this.progress = 0;
        if (rs.length > 0) {
          this.save(this.historyOrders[this.historyOrderIndex]).then(rs => {
            console.log('Đã lưu nháp');
          }).catch(err => {
            console.warn('Lưu nháp không thành công', err);
          });
          this.historyOrderIndex--;
          this.orderForm = this.historyOrders[this.historyOrderIndex];
        }
      });
      this.dateOfPrevious.setDate(this.dateOfPrevious.getDate() - 1);
      // this.loading = false;
    }
    this.status = '';
    this.processing = false;
  }
  async onNextOrderClick() {
    if (this.processing) {
      console.log('an other process is processing...');
      return;
    }
    this.processing = true;
    this.status = 'Tải đơn hàng sau...'
    this.historyOrderIndex = this.historyOrders.findIndex(f => f === this.orderForm);
    if (this.historyOrderIndex < this.historyOrders.length - 1) {
      this.save(this.historyOrders[this.historyOrderIndex]).then(rs => {
        console.log('Đã lưu nháp');
      }).catch(err => {
        console.warn('Lưu nháp không thành công', err);
      });
      this.historyOrderIndex++;
      this.orderForm = this.historyOrders[this.historyOrderIndex];
    }
    this.processing = false;
    this.status = '';
  }

  focusToQuantity(detailIndex: number) {
    const activeEle = $(this.orderDetailTableRef.nativeElement.children[detailIndex + 1]);
    activeEle[0].scrollIntoView();

    const quantityEle = activeEle.find('.pos-quantity')[0] as HTMLInputElement;
    quantityEle.focus();
    quantityEle.select();
    // let timeout = null;

    // timeout = setTimeout(() => {
    //   // auto blue after 5s
    //   quantityEle.blur();
    // }, 3000);

    // quantityEle.onkeyup = () => {
    //   // console.log(123);
    //   clearTimeout(timeout);
    //   timeout = setTimeout(() => {
    //     // auto blue after 5s
    //     quantityEle.blur();
    //   }, 3000);
    // };

  }

  autoBlur(event: any, timeout?: number, context?: string) {
    console.log('autoBlur event: ', event);
    const control = event.currentTarget;
    if (control.blurTimeoutProcess) {
      clearTimeout(control.blurTimeoutProcess);
    }
    control.blurTimeoutProcess = setTimeout(() => {
      // auto blue after 5s
      if (context == 'posSearchInput') {
        if (!this.searchResults || this.searchResults.length == 0) {
          this.blurAll();
        }
      } else {
        control.blur();
      }
    }, timeout || 5000);

    control.onkeyup = () => {
      // console.log(123);
      clearTimeout(control.blurTimeoutProcess);
      control.blurTimeoutProcess = setTimeout(() => {
        // auto blue after 5s
        if (context == 'posSearchInput') {
          if (!this.searchResults || this.searchResults.length == 0) {
            this.blurAll();
          }
        } else {
          control.blur();
        }
      }, timeout || 5000);
    };
  }

  clearAutoBlur(event: any, context?: string) {
    console.log('clearAutoBlur event: ', event);
    const control = event.currentTarget;
    if (control.blurTimeoutProcess) {
      clearTimeout(control.blurTimeoutProcess);
    }

    // if (context == 'posSearchInput') {
    //   this.blurAll();
    // }
  }


  barcode = '';
  findOrderKeyInput = '';
  searchInputPlaceholder = '';
  promiseAll = [];
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
      if (this.cms.dialogStack.length === 0) {
        this.blurAll();
      }
      return true;
    }

    if (this.cms.dialogStack.length === 0) {
      if (event.key == 'F6') {
        console.log(this.customerEle);
        $(this.customerEle['controls'].selector.nativeElement)['select2']('open');
        return false;
      }

      // Toggle debt
      if (event.key == 'F7') {
        this.switchPaymentMethod(this.orderForm);
        return false;
      }

      if (event.key == 'F10') {
        if (this.cms.dialogStack.length === 0) {
          this.onMakeNewReturnsForm();
          return false;
        }
      }
      if (event.key == 'F11') {
        if (this.cms.dialogStack.length === 0) {
          const cashReceiptEle = $('#CashReceipt');
          const decreaseForTotalEle = $('#DecreaseForTotal');
          if (decreaseForTotalEle.is(':focus')) {
            cashReceiptEle[0].focus();
            cashReceiptEle.select();
          } else {
            // this.decreaseForTotalEleRef.nativeElement.focus();
            decreaseForTotalEle[0].focus();
            decreaseForTotalEle.select();
          }
          event.preventDefault();
          return false;
        }
      }

      // Payment/re-print
      if (event.key == 'F9') {
        if (this.orderForm.value?.State == 'APPROVED') {
          this.print(this.orderForm, { printType: 'RETAILINVOICE' });
        } else {
          this.payment(this.orderForm, { skipPrint: false, printType: 'RETAILINVOICE' });
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
          this.cms.showToast('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { ...this.toastDefaultConfig, status: 'warning' });
          this.playErrorPipSound();
          return false;
        }

        const details = this.getDetails(this.orderForm).controls;
        let activeDetail = details.find(f => f['isActive'] === true);

        this.cms.openDialog(DialogFormComponent, {
          context: {
            title: 'Thay đổi giá bán',
            onInit: async (form, dialog) => {
              const priceControl = form.get('Price');
              const quanityControl = form.get('Quantity');
              const toMoneyControl = form.get('ToMoney');

              priceControl.valueChanges.pipe(takeUntil(dialog.destroy$)).subscribe(value => {
                toMoneyControl.setValue(priceControl.value * quanityControl.value);
              });
              quanityControl.valueChanges.pipe(takeUntil(dialog.destroy$)).subscribe(value => {
                toMoneyControl.setValue(priceControl.value * quanityControl.value);
              });
              toMoneyControl.valueChanges.pipe(takeUntil(dialog.destroy$)).subscribe(value => {
                priceControl.setValue(toMoneyControl.value / quanityControl.value, { emitEvent: false });
              });

              return true;
            },
            controls: [
              {
                name: 'Description',
                label: 'Mô tả',
                placeholder: 'Mô tả thêm cho việc thay đổi giá bán',
                type: 'text',
                initValue: activeDetail.get('Description').value,
              },
              {
                name: 'Quantity',
                label: 'Số lượng',
                placeholder: 'Số lượng',
                type: 'number',
                initValue: activeDetail.get('Quantity').value,
              },
              {
                name: 'Price',
                label: 'Giá thay đổi',
                placeholder: 'Giá thay đổi',
                type: 'currency',
                initValue: activeDetail.get('Price').value,
                focus: true,
              },
              {
                name: 'ToMoney',
                label: 'Thành tiền',
                placeholder: 'Thành tiền',
                type: 'currency',
                initValue: activeDetail.get('ToMoney').value,
              },
            ],
            actions: [
              {
                label: 'Esc - Trở về',
                icon: 'back',
                status: 'basic',
                keyShortcut: 'Escape',
                action: async () => { return true; },
              },
              {
                label: 'Enter - Xác nhận',
                icon: 'generate',
                status: 'success',
                keyShortcut: 'Enter',
                action: async (form: FormGroup, formDialogConpoent: DialogFormComponent) => {
                  activeDetail.get('Price').setValue(form.get('Price').value);
                  activeDetail.get('Quantity').setValue(form.get('Quantity').value);
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
        if (this.cms.dialogStack.length === 0) {
          this.makeNewOrder();
        }
        event.preventDefault();
        return true;
      }

      if (event.key == '+') {
        if (this.cms.dialogStack.length === 0) {
          const details = this.getDetails(this.orderForm).controls;
          const activeDetail = details.find(f => f['isActive'] === true) as FormGroup;
          if (activeDetail) {
            this.onIncreaseQuantityClick(this.orderForm, activeDetail);
          }
        }
        return false;
      }
      if (event.key == '-') {
        if (this.cms.dialogStack.length === 0) {
          const details = this.getDetails(this.orderForm).controls;
          const activeDetail = details.find(f => f['isActive'] === true) as FormGroup;
          if (activeDetail) {
            this.onDecreaseQuantityClick(this.orderForm, activeDetail);
          }
        }
        return false;
      }

      if (event.key == 'Delete') {
        if (this.cms.dialogStack.length === 0) {
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
    } else {
      // Skip system function key
      if (['F12', 'F5', 'F3'].indexOf(event.key) > -1) {
        return false;
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
        if (this.cms.dialogStack.length === 0) {
          this.onPreviousOrderClick();
          event.preventDefault();
        }
        return true;
      }
      if (event.key == 'ArrowRight') {
        if (this.cms.dialogStack.length === 0) {
          this.onNextOrderClick();
          event.preventDefault();
        }
        return true;
      }

      if (event.key == 'ArrowDown') {
        if (this.cms.dialogStack.length === 0) {

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
        if (this.cms.dialogStack.length === 0) {

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
    if (this.cms.dialogStack.length === 0) {
      if ((/^[0-9a-z]$/i.test(event.key) || ['Enter'].indexOf(event.key) > -1) && (document.activeElement as HTMLElement).tagName == 'BODY') {

        this.cms.barcodeScanDetective(event.key, barcode => {
          this.barcodeProcess(barcode, {
            onHadPrimise: (promise) => {
              // this.promiseAll.push(promise);
            }
          }).then(status => {
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
              this.cms.showToast(err, 'Cảnh báo', { ...this.toastDefaultConfig, status: 'warning' });
            }
          } else {
            if (this.findOrderKeyInput && this.findOrderKeyInput.length < 6) {
              try {
                this.barcodeProcess(this.findOrderKeyInput, { searchByFindOrder: true });
              } catch (err) {
                this.cms.showToast(err, 'Cảnh báo', { ...this.toastDefaultConfig, status: 'warning' });
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
      this.cms.showToast('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { ...this.toastDefaultConfig, status: 'warning' });
      this.playErrorPipSound();
      return false;
    }

    const removedRelativeVouchers = this.getDetails(orderForm).controls[index]?.value?.RelativeVouchers?.map(m => this.cms.getObjectId(m)) || [];

    this.getDetails(orderForm).controls.splice(index, 1);
    this.calculateTotal(orderForm);

    // Remove relative voucher
    const relativeVouchers = orderForm.get('RelativeVouchers');
    let relativeVouchersData = relativeVouchers.value;
    for (const removedRelativeVoucher of removedRelativeVouchers) {
      if (this.getDetails(orderForm).controls?.findIndex(f => f.get('RelativeVouchers').value.some(s => this.cms.getObjectId(s) == removedRelativeVoucher) < 0)) {
        relativeVouchersData = relativeVouchersData.filter(f => this.cms.getObjectId(f) != removedRelativeVoucher);
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
      this.cms.showToast('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { ...this.toastDefaultConfig, status: 'warning' });
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
      this.cms.showToast('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { ...this.toastDefaultConfig, status: 'warning' });
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
      this.cms.showToast('Chỉ có thể bán hàng với số lượng lớn hơn 0', 'Số lượng phải lớn hơn 0', { ...this.toastDefaultConfig, status: 'warning' });
    }
  }

  removeCashBack(orderForm: FormGroup) {
    orderForm['cashBack'] = 0;
    orderForm.get('CashBack').setValue(0);
  }

  onCashReceiptChanged(orderForm: FormGroup) {
    // const cashReceiptControl = formGroup.get('CashReceipt');
    // const cashBackControl = formGroup.get('CashBack');
    // const totolControl = formGroup.get('Total');
    // cashBackControl.setValue(cashReceiptControl.value - totolControl.value);

    const cashReceiptControl = orderForm.get('CashReceipt');
    const decreaseForTotalControl = orderForm.get('DecreaseForTotal');
    const totalAmount = orderForm.get('Amount');
    const cashAmount = orderForm.get('CashAmount');
    const cashTransferAmount = orderForm.get('CashTransferAmount');
    const receivableDebt = orderForm['ReceivableDebt'] || 0;
    if (cashReceiptControl && totalAmount && decreaseForTotalControl && this.cms.getObjectId(orderForm.get('PaymentMethod').value) === 'CASH') {
      let cashBack = cashReceiptControl.value - ((totalAmount.value) - decreaseForTotalControl.value - (orderForm['returnsObj'] && this.cms.getObjectId(orderForm['returnsObj'].get('PaymentMethod').value) === 'CASH' ? orderForm['returnsObj'].get('Amount').value : 0));

      if (cashBack > 0) {
        orderForm['cashBack'] = cashBack;
        orderForm.get('CashBack').setValue(cashBack);
      } else {
        orderForm['cashBack'] = 0;
      }
    }
    if (cashTransferAmount && totalAmount && decreaseForTotalControl && this.cms.getObjectId(orderForm.get('PaymentMethod').value) === 'BANKTRANSFER') {
      const cashBack = cashTransferAmount.value - (totalAmount.value) - decreaseForTotalControl.value;
      if (cashBack > 0) {
        orderForm['cashBack'] = cashBack;
      } else {
        orderForm['cashBack'] = 0;
      }
    }
    if (cashAmount && cashTransferAmount && totalAmount && decreaseForTotalControl && this.cms.getObjectId(orderForm.get('PaymentMethod').value) === 'MIXED') {
      const cashBack = cashAmount.value + cashTransferAmount.value - (receivableDebt + totalAmount.value - decreaseForTotalControl.value);
      orderForm['cashBack'] = cashBack;
    }
    orderForm.get('CashBack').setValue(orderForm['cashBack']);

    if (orderForm['voucherType'] == 'COMMERCEPOSORDER') {
      if (orderForm['returnsObj'] && this.cms.getObjectId(orderForm['returnsObj'].get('PaymentMethod').value) === 'DEBT') {
        orderForm['isReceipt'] = true;
        orderForm.get('CashReceipt').enable();
      } else {
        if (orderForm['returnsObj'] && orderForm['returnsObj'].get('Amount').value >= orderForm.value?.Amount - orderForm.value?.DecreaseForTotal) {
          orderForm['isReceipt'] = false;
          orderForm.get('CashReceipt').disable();
        } else {
          orderForm['isReceipt'] = true;
          orderForm.get('CashReceipt').enable();
        }
      }
    }

  }

  async payment(orderForm: FormGroup, option?: { printType?: 'PRICEREPORT' | 'RETAILINVOICE', skipPrint?: boolean }) {
    // if (this.promiseAll.length > 0) {
    //   await new Promise(async resolve => {
    //     let isResolved = false;
    //     setTimeout(() => {
    //       if (!isResolved) {
    //         isResolved = true;
    //         resolve(true);
    //       }
    //     }, 30000);
    //     this.loading = true;
    //     await Promise.all(this.promiseAll);
    //     this.promiseAll = [];
    //     // await new Promise(resolve => setTimeout(() => resolve(true), 1000));
    //     this.loading = false;
    //     if (!isResolved) {
    //       isResolved = true;
    //       resolve(true);
    //     }
    //   })
    // }
    const data = orderForm.getRawValue();
    if (!data?.Details?.length) {
      this.cms.showToast('Bạn phải thêm hàng hóa vào đơn hàng trước khi thanh toán !', 'Chưa có hàng hóa nào trong đơn hàng !', { ...this.toastDefaultConfig, status: 'warning', duration: 5000 })
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

      this.cms.openDialog(CommercePosBillPrintComponent, {
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
            if (!newOrder.Object || !newOrder.Object.id) {
              newOrder.Object = null;
            }
            if (typeof newOrder.PaymentMethod == 'string') {
              newOrder.PaymentMethod = this.paymentMethod.find(f => this.cms.getObjectId(f) === newOrder.PaymentMethod);
            }
            orderForm.patchValue(newOrder);
            this.cms.showToast(option?.skipPrint ? `Đã thanh toán cho đơn hàng ${newOrder.Code}, để in phiếu nhấn nút điều hướng sang trái và in lại!` : `Đã thanh toán cho đơn hàng ${newOrder.Code}`, 'Đã thanh toán', { ...this.toastDefaultConfig, status: 'success', duration: 8000 })
            if (this.historyOrders[this.historyOrders.length - 1] == orderForm) {
              this.makeNewOrder();
            }
            console.log(this.historyOrders);

            // Decrease inventory
            // for (const detail of data.Details) {
            //   const goods = this.productSearchIndex[`${this.cms.getObjectId(detail.Product)}-${this.cms.getObjectId(detail.Unit)}-${this.cms.getObjectId(detail.Container)}`];
            //   if (goods) {
            //     goods.Inventory -= parseFloat(detail.Quantity);
            //   }
            // }

            this.playPaymentSound();
          },
          onClose: () => {
          },
          onAfterInit: (component: CommercePosBillPrintComponent) => {
            if (option?.skipPrint) {
              component?.close();
            } else {
              setTimeout(() => {
                if (!component.isProcessing) {
                  component?.close();
                }
              }, 15000);
            }
          }
        }
      });
    } else {
      this.cms.openDialog(CommercePosReturnsPrintComponent, {
        context: {
          skipPreview: true,
          instantPayment: true,
          data: [orderForm.getRawValue()],
          onSaveAndClose: (newOrder, printComponent) => {
            if (typeof newOrder.Object == 'string') {
              newOrder.Object = { id: newOrder.Object, text: `${newOrder.Object} - ${newOrder.ObjectName}` }
            }
            newOrder.Object = { ...orderForm.get('Object').value, ...newOrder.Object };
            if (!newOrder.Object || !newOrder.Object.id) {
              newOrder.Object = null;
            }
            orderForm.patchValue(newOrder);
            this.cms.showToast('Phiếu trả hàng đã lưu !', 'Đã lưu phiếu trả hàng !', { ...this.toastDefaultConfig, status: 'success', duration: 8000 })
            this.makeNewOrder();
            console.log(this.historyOrders);

            // Increase inventory
            // for (const detail of data.Details) {
            //   const goods = this.productSearchIndex[`${this.cms.getObjectId(detail.Product)}-${this.cms.getObjectId(detail.Unit)}-${this.cms.getObjectId(detail.Container)}`];
            //   if (goods) {
            //     goods.Inventory += parseFloat(detail.Quantity);
            //   }
            // }

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
              // const newOrderForm = await this.makeNewOrder(null, retunsOrder.Code);
              const newOrderForm = await this.makeNewOrder(null, orderForm);
              this.orderForm = newOrderForm;
            });
          }
        }
      });
    }
  }

  async saveAsPriceReport(orderForm: FormGroup, option?: { printType?: 'PRICEREPORT', skipPrint?: boolean }) {
    orderForm.get('Title').setValue(`Báo giá khách POS: ${orderForm.get('ObjectName').value} - ${this.cms.datePipe.transform(new Date(), 'short')}`);
    const data = orderForm.getRawValue();
    if (!data?.Details?.length) {
      this.cms.showToast('Bạn phải thêm hàng hóa vào đơn hàng trước khi báo giá !', 'Chưa có hàng hóa nào trong đơn hàng !', { ...this.toastDefaultConfig, status: 'warning', duration: 5000 })
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

      this.cms.openDialog(CommercePosBillPrintComponent, {
        context: {
          skipPreview: true,
          printType: option?.printType,
          type: 'PRICEREPORT',
          instantPayment: true,
          data: [data],
          onSaveAndClose: (newOrder: CommercePosOrderModel, printComponent) => {
            if (typeof newOrder.Object == 'string') {
              newOrder.Object = { id: newOrder.Object, text: `${newOrder.Object} - ${newOrder.ObjectName}` }
            }
            newOrder.Object = { ...orderForm.get('Object').value, ...newOrder.Object };
            if (!newOrder.Object || !newOrder.Object.id) {
              newOrder.Object = null;
            }
            orderForm.patchValue(newOrder);
            this.cms.showToast(option?.skipPrint ? `Đã báo giá cho đơn hàng ${newOrder.Code}` : `Đã báo giá cho đơn hàng ${newOrder.Code}`, 'Đã báo giá', { ...this.toastDefaultConfig, status: 'success', duration: 8000 })
            // this.makeNewOrder();
            console.log(this.historyOrders);
            // this.playPaymentSound();
          },
          onClose: () => {
          },
          onAfterInit: (component: CommercePosBillPrintComponent) => {
            // if (option?.skipPrint) {
            //   component?.close();
            // } else {
            //   setTimeout(() => {
            //     if (!component.isProcessing) {
            //       component?.close();
            //     }
            //   }, 15000);
            // }
          }
        }
      });
    }
  }

  async save(orderForm: FormGroup): Promise<CommercePosOrderModel> {
    // if (orderForm.get('Code').value && !orderForm['modified']) {
    //   console.log('voucher was not modified => not need save');
    //   return orderForm.value;
    // }
    const voucherType = orderForm['voucherType'];
    const apiPath = voucherType == 'COMMERCEPOSORDER' ? '/commerce-pos/orders' : '/commerce-pos/returns';
    let order = orderForm.getRawValue();
    delete order.BarCode;
    if (orderForm && orderForm['isProcessing'] !== true && order.State != 'APPROVED') {
      return this.cms.takeUntil('commerce-pos-order-save', 500).then(status => {
        if (order.Code) {
          return this.apiService.putPromise(apiPath + '/' + order.Code, { renderBarCode: true, includeRelativeVouchers: true }, [order]).then(rs => {
            if (rs[0].Details) {
              for (const index in rs[0].Details) {
                const detailForm = (orderForm.get('Details') as FormArray).controls[index] as FormGroup;
                detailForm.get('SystemUuid').setValue(rs[0].Details[index].SystemUuid);
              }
            }
            return rs[0];
          });
        } else {
          orderForm['isProcessing'] = true;
          return this.apiService.postPromise(apiPath, { renderBarCode: true, includeRelativeVouchers: true }, [order]).then(rs => {
            orderForm.patchValue(rs[0]);
            orderForm['isProcessing'] = false;
            // orderForm['modified'] = false;
            if (rs[0].Details) {
              for (const index in rs[0].Details) {
                const detailForm = (orderForm.get('Details') as FormArray).controls[index] as FormGroup;
                detailForm.get('SystemUuid').setValue(rs[0].Details[index].SystemUuid);
              }
            }
            return rs[0];
          });
        }
      });
    }
    console.log('Order Form đang khởi tạo => chưa lưu đơn !');
    return null;
  }

  async saveAsPriceReportx() {
    const voucherType = this.orderForm['voucherType'];
    if (voucherType != 'COMMERCEPOSORDER') {
      return Promise.reject('Phiếu hiện tại không phải đơn hàng POS');
    }
    const apiPath = '/commerce-pos/orders';
    this.orderForm.get('Title').setValue(`Báo giá khách POS: ${this.cms.getObjectText(this.orderForm.get('Object').value)}} - ${this.cms.datePipe.transform(this.orderForm.get('Created').value, 'short')}`);
    let order = this.orderForm.getRawValue();
    delete order.BarCode;
    if (this.orderForm && this.orderForm['isProcessing'] !== true && order.State != 'APPROVED') {
      return this.cms.takeUntil('commerce-pos-order-save', 500).then(status => {
        if (order.Code) {
          return this.apiService.putPromise(apiPath + '/' + order.Code, { renderBarCode: true, includeRelativeVouchers: true }, [order]).then(rs => {
            if (rs[0].Details) {
              for (const index in rs[0].Details) {
                const detailForm = (this.orderForm.get('Details') as FormArray).controls[index] as FormGroup;
                detailForm.get('SystemUuid').setValue(rs[0].Details[index].SystemUuid);
              }
            }
            return rs[0];
          });
        } else {
          this.orderForm['isProcessing'] = true;
          return this.apiService.postPromise(apiPath, { renderBarCode: true, includeRelativeVouchers: true }, [order]).then(rs => {
            this.orderForm.patchValue(rs[0]);
            this.orderForm['isProcessing'] = false;
            // orderForm['modified'] = false;
            if (rs[0].Details) {
              for (const index in rs[0].Details) {
                const detailForm = (this.orderForm.get('Details') as FormArray).controls[index] as FormGroup;
                detailForm.get('SystemUuid').setValue(rs[0].Details[index].SystemUuid);
              }
            }
            return rs[0];
          });
        }
      });
    }
    console.log('Order Form đang khởi tạo => chưa lưu đơn !');
    return null;
  }

  async print(orderForm: FormGroup, option?: { printType?: 'PRICEREPORT' | 'RETAILINVOICE' }) {
    if (orderForm.get('State').value !== 'APPROVED') {
      this.cms.showToast('Bạn chỉ có thể in lại phiếu đã chốt', 'Không thể in bill !', { ...this.toastDefaultConfig, status: 'warning' });
      return false;
    }
    option = {
      printType: 'PRICEREPORT',
      ...option
    }
    if (orderForm['voucherType'] == 'COMMERCEPOSORDER') {
      return new Promise(resovle => {

        this.cms.openDialog(CommercePosBillPrintComponent, {
          context: {
            skipPreview: true,
            printType: option.printType,
            data: [orderForm.getRawValue()],
            onSaveAndClose: (newOrder, printComponent) => {
              this.cms.showToast('Đã tạo phiếu chi hoàn tiền cho phiếu trả hàng !', 'Đã tạo phiếu chi !', { ...this.toastDefaultConfig, status: 'success', duration: 8000 })
            }
          }
        });
      });
    } else if (orderForm['voucherType'] == 'COMMERCEPOSRETURN') {
      this.cms.openDialog(CommercePosReturnsPrintComponent, {
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
      this.cms.showToast('Bạn chỉ có thể in lại phiếu đã chốt', 'Không thể in bill !', { ...this.toastDefaultConfig, status: 'warning' });
      return false;
    }
    return new Promise(resovle => {
      this.cms.openDialog(CommercePosBillPrintComponent, {
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
      this.cms.showToast('Phiếu trả hàng chưa được duyệt', 'Không thể trả hàng !', { ...this.toastDefaultConfig, status: 'warning' });
      return false;
    }

    if (returnsObj.RelativeVouchers) {
      const refPayment = returnsObj.RelativeVouchers.find(f => f.type == 'CPOSPAYMENT');
      // Kiểm tra lại nó không cho hoàn tiền từ phiếu trả hàng
      // if (refPayment) {
      //   this.cms.showToast('Phiếu trả hàng này đã được hoàn tiền bởi phiếu chi ' + refPayment.id, 'Máy bán hàng', { status: 'danger', position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      //   return false;
      // }
      // const refOrder = returnsObj.RelativeVouchers.find(f => f.type == 'COMMERCEPOSORDER');
      // if (refOrder) {
      //   this.cms.showToast('Phiếu trả hàng này đã được cấn trừ trong đơn hàng ' + refOrder.id, 'Máy bán hàng', { status: 'danger', position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
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

      this.cms.openDialog(CommercePosPaymnentPrintComponent, {
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
    this.cms.openDialog(ContactAllListComponent, {
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
  switchPaymentMethod(orderForm: FormGroup) {
    const paymnetMethodControl = orderForm.get('PaymentMethod');

    if (orderForm.value?.State == 'APPROVED') {
      this.cms.showToast('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { ...this.toastDefaultConfig, });
      return false;
    }

    const index = this.paymentMethod.findIndex(f => this.cms.getObjectId(f) === this.cms.getObjectId(paymnetMethodControl.value));
    if (index < 0 || index === this.paymentMethod.length - 1) {
      paymnetMethodControl.setValue(this.paymentMethod[0]);
    } else {
      paymnetMethodControl.setValue(this.paymentMethod[index + 1]);
    }

    this.cms.showToast('Phiếu này sẽ ghi nhận doanh thu ' + this.cms.getObjectText(paymnetMethodControl.value) + ' !', 'Ghi nhận doanh thu ' + this.cms.getObjectText(paymnetMethodControl.value), { ...this.toastDefaultConfig, status: paymnetMethodControl.value?.status, duration: 5000 });
    this.onCashReceiptChanged(orderForm);
    return true;
    const debtControl = orderForm.get('IsDebt');
    debtControl.setValue(!debtControl.value);
    if (orderForm.value?.State == 'APPROVED') {
      this.cms.showToast('Không thể thay đổi thông tin trên phiếu đã duyệt, hãy hủy phiếu trước khi thay đổi !', 'Phiếu đã duyệt', { ...this.toastDefaultConfig, });
      return false;
    }
    if (orderForm['voucherType'] == 'COMMERCEPOSORDER') {
      if (debtControl.value) {
        this.cms.showToast('Phiếu này sẽ ghi nhận doanh thu công nợ !', 'Ghi nhận doanh thu công nợ', { ...this.toastDefaultConfig, status: 'primary', duration: 1000 });
      } else {
        this.cms.showToast('Phiếu này sẽ ghi nhận doanh thu tiền mặt !', 'Ghi nhận doanh thu tiền mặt', { ...this.toastDefaultConfig, status: 'success', duration: 1000 });
      }
    } else if (orderForm['voucherType'] == 'COMMERCEPOSRETURN') {
      if (debtControl.value) {
        this.cms.showToast('Phiếu này sẽ ghi giảm doanh thu công nợ !', 'Ghi giảm doanh thu công nợ', { ...this.toastDefaultConfig, status: 'primary', duration: 1000 });
      } else {
        this.cms.showToast('Phiếu này sẽ ghi giảm doanh thu tiền mặt !', 'Ghi giảm doanh thu tiền mặt', { ...this.toastDefaultConfig, status: 'success', duration: 1000 });
      }
    }
    if (debtControl.value) {
      orderForm.get('CashReceipt').disable();
    } else {
      orderForm.get('CashReceipt').enable();
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

  async openDeploymentForm(orderForm: FormGroup) {
    const orderData: CommercePosOrderModel = orderForm.getRawValue();

    if (orderData?.Details?.length == 0) {
      this.cms.showToast('Không có gì để triển khai', 'Không thể triển khai cho đơn hàng rỗng !', { ...this.toastDefaultConfig, status: 'warning', duration: 10000 })
      return false;
    }

    await this.save(orderForm);
    this.cms.openDialog(DeploymentVoucherFormComponent, {
      context: {
        printDialog: CommercePosDeploymentVoucherPrintComponent,
        data: [
          {
            ...orderData,
            IsDebt: false,
            Code: null,
            Title: `Triển khai cho đơn hàng POS ${orderData.Code}, khách hàng: ${orderData.ObjectName}`,
            DeploymentDate: new Date(),
            RelativeVouchers: [{
              type: 'COMMERCEPOSORDER',
              id: orderData.Code,
              text: orderData.Title || `Đơn hàng POS - ${orderData.Code}`,
            }],
            DirectReceiverName: orderData.ObjectName,
            DirectReceiverPhone: orderData.ObjectPhone,
            DeliveryAddress: orderData.ObjectAddress,
            Details: orderData.Details.map(detail => {
              const product = this.productUnitMap[this.cms.getObjectId(detail.Product) + '-' + this.cms.getObjectId(detail.Unit)];
              product.id = product?.Code;
              product.text = product?.Name;
              detail.Product = product as any;
              return detail;
            }).filter(f => f.Product?.Type != 'SERVICE')
          }
        ],
        onDialogSave(newData) {
          const relativeVouchers = orderForm.get('RelativeVouchers');
          const relativeVouchersData: any[] = relativeVouchers.value || [];
          if (relativeVouchersData.findIndex(f => f.id == newData[0].Code) < 0) {
            relativeVouchersData.push({
              type: 'DEPLOYMENT',
              id: newData[0].Code,
              text: newData[0].Title
            });
          }
        },
      }
    })
  }

  preview(type: string, id: string) {
    this.cms.previewVoucher(type, id);
  }

  previewGoodsThumbnail(detail: FormGroup) {
    let images: any = detail.get('Image').value;
    if (images && !Array.isArray(images)) {
      images = [images];
    }
    if (images && images.length > 0) {
      this.cms.openDialog(ImagesViewerComponent, {
        context: {
          images: images.map(m => m.OriginImage),
          imageIndex: 0
        }
      });
    }
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
