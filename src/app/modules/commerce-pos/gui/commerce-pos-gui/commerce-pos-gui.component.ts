import { UnitModel } from './../../../../models/unit.model';
import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductModel, ProductUnitModel } from './../../../../models/product.model';
import { ContactModel } from './../../../../models/contact.model';
import { CommercePosOrderModel, CommercePosCashVoucherModel, CommercePosReturnModel, CommercePosReturnDetailModel } from './../../../../models/commerce-pos.model';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogRef } from "@nebular/theme";
import { BaseComponent } from "../../../../lib/base-component";
import { ApiService } from "../../../../services/api.service";
import { CommonService } from "../../../../services/common.service";
import screenfull from 'screenfull';
import { filter, take, takeUntil } from "rxjs/operators";
import { SystemConfigModel } from "../../../../models/model";
import { CurrencyMaskConfig } from "ng2-currency-mask";
import { CommercePosBillPrintComponent } from '../commerce-pos-order-print/commerce-pos-bill-print.component';
import { CommercePosReturnsPrintComponent } from '../commerce-pos-returns-print/commerce-pos-returns-print.component';
import { CommercePosPaymnentPrintComponent } from '../commerce-pos-payment-print/commerce-pos-payment-print.component';
import { ContactAllListComponent } from '../../../contact/contact-all-list/contact-all-list.component';

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

  @ViewChild('newDetailPipSound', { static: true }) newDetailPipSound: ElementRef;
  @ViewChild('increaseDetailPipSound', { static: true }) increaseDetailPipSound: ElementRef;
  @ViewChild('errorSound', { static: true }) errorSound: ElementRef;
  @ViewChild('paymentSound', { static: true }) paymentSound: ElementRef;

  @ViewChild('ObjectPhone', { static: true }) objectPhoneEleRef: ElementRef;
  @ViewChild('Search', { static: true }) searchEleRef: ElementRef;
  @ViewChild('orderDetailTable', { static: true }) orderDetailTableRef: ElementRef;
  @ViewChild('searchResultsRef', { static: true }) searchResultsRef: ElementRef;

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

  // searchInput = '';

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

  async updateMaterPriceTable() {
    this.status = 'Đang tải bảng giá...';
    while (true) {
      try {
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
          this.commonService.toastService.show('Đã cập nhật bảng giá mới', 'POS Thương mại', { status: 'success' });
        });
        return true;
      } catch (err) {
        console.log(err);
        console.log('retry...');
        this.status = 'Lỗi tải bảng giá, đang thử lại...';
        this.commonService.toastService.show('Bảng giá mới chưa được cập nhật', 'POS Thương mại', { status: 'warning' });
        return false;
      }
    }
  }

  private unitMap: { [key: string]: ProductUnitModel } = {};
  private productMap: { [key: string]: ProductModel } = {};
  private findOrderMap: { [key: string]: { Goods: string, Unit: string, UnitLabel: string, Container: string } } = {};
  async init() {
    const result = await super.init().then(async status => {
      await this.apiService.getPromise<ProductModel[]>('/admin-product/products', { limit: 'nolimit' }).then(productList => {
        for (const product of productList) {
          this.productMap[product.Code] = product;
        }
        console.log(this.productMap);
        this.commonService.toastService.show('Đã tải danh sách hàng hóa', 'POS Thương mại', { status: 'success' });
      });
      await this.apiService.getPromise<ProductUnitModel[]>('/admin-product/units', { limit: 'nolimit' }).then(unitList => {
        for (const unit of unitList) {
          this.unitMap[unit['Sequence']] = unit;
        }
        console.log(this.unitMap);
        this.commonService.toastService.show('Đã tải danh sách đơn vị tính', 'POS Thương mại', { status: 'success' });
        return true;
      });
      await this.apiService.getPromise<any>('/warehouse/goods', {
        getFindOrderIndex: true,
        limit: 'nolimit'
      }).then(rs => {
        this.findOrderMap = rs;
        this.commonService.toastService.show('Đã tải danh sách vị trí', 'POS Thương mại', { status: 'success' });
        return true;
      });

      await this.updateMaterPriceTable();
      return status;
    });
    this.commonService.sidebarService.collapse('menu-sidebar');
    this.commonService.sidebarService.collapse('chat-sidebar');

    await this.save(this.orderForm);
    // await this.barcodeProcess('145742024962');
    // await this.barcodeProcess('146537024944');

    // await this.barcodeProcess('11802497101');
    // await this.barcodeProcess('11802497100');
    // await this.barcodeProcess('11802497099');
    // await this.barcodeProcess('11802497098');
    // await this.barcodeProcess('11802497097');
    // await this.barcodeProcess('11802497096');
    // await this.barcodeProcess('11802497095');
    // await this.barcodeProcess('11802497094');
    // await this.barcodeProcess('11802497093');
    // await this.barcodeProcess('11802497092');

    // Download master price table
    // (async () => {
    //   this.status = 'Đang tải bảng giá...';
    //   while (true) {
    //     try {
    //       await this.apiService.getPromise<any[]>('/sales/master-price-table-details', {
    //         masterPriceTable: 'default',
    //         includeCategories: true,
    //         includeGroups: true,
    //         includeFeaturePicture: true,
    //         getRawData: true,
    //         limit: 'nolimit',
    //         includeContainers: true,
    //       }).then(priceTableDetails => {
    //         this.masterPriceTable = {};
    //         for (const priceTableDetail of priceTableDetails) {
    //           priceTableDetail.Price = parseFloat(priceTableDetail.Price);
    //           this.masterPriceTable[`${priceTableDetail.Product}-${priceTableDetail.Unit}`] = priceTableDetail;
    //         }
    //         // console.log(this.masterPriceTable);
    //         this.status = '';
    //       });
    //       break;
    //     } catch (err) {
    //       console.log(err);
    //       console.log('retry...');
    //       this.status = 'Lỗi tải bảng giá, đang thử lại...';
    //     }
    //   }
    // })();

    // Listen price table update
    setInterval(() => {
      console.log('Listen new master price table update...');
      this.apiService.getPromise<any>('/sales/master-price-tables/getUpdate', { priceTable: 'default' }).then(rs => {
        console.log(rs);
        if (rs && rs.State == 'UPDATED') {
          return this.updateMaterPriceTable();
        }
        return false;
      }).catch(err => {
        console.log(err);
      });
    }, 60000);
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
      CashBack: [0],
      CashReceipt: [0],
      State: [null],
      DateOfSale: [null],
      Details: this.formBuilder.array([]),
      Returns: [],
      RelativeVouchers: [data?.Returns ? [{ id: data.Returns, text: data.Returns, type: 'CPOSRETURNS' }] : null],
      DebitFunds: [],
      IsDebt: [false],
    });
    newForm['voucherType'] = 'CPOSORDER';
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
    return newForm;
  }
  async makeNewReturnsForm(data?: CommercePosOrderModel, orderId?: string) {

    let order;
    let newForm;
    if (orderId) {
      order = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + orderId, { includeDetails: true }).then(rs => rs[0]);
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
        CashBack: [0],
        CashReceipt: [0],
        State: [null],
        DateOfReturn: [new Date()],
        RelativeVouchers: [[{ id: order.Code, text: order.Title || order.Code, type: 'CPOSORDER' }]],
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
        CashBack: [0],
        CashReceipt: [0],
        State: [null],
        DateOfSale: [new Date()],
        Details: this.formBuilder.array([]),
        IsDebt: [false],
      });
    }
    newForm['voucherType'] = 'CPOSRETURNS';
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
      FeaturePicture: [detail.Image[0] || null],
      Image: [Array.isArray(detail.Image) ? detail.Image[0] : detail.Image],
      AccessNumbers: [detail.AccessNumbers || null],
      Discount: [detail.Discount || 0],
      FindOrder: [detail.FindOrder || 0],
      Container: [detail.Container || 0],
    });
  }

  getDetails(formGroup: FormGroup) {
    return formGroup.get('Details') as FormArray;
  }

  async makeNewOrder(data?: CommercePosOrderModel, returns?: string) {

    if (this.orderForm['voucherType'] != 'CPOSRETURNS' && this.historyOrders[this.historyOrders.length - 1].get('State').value == 'NOTJUSTAPPROVED' && this.historyOrders[this.historyOrders.length - 1].get('Details').value?.length == 0) {
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

      // Kiểm tra lại nó không cho bán tiếp từ đơn trả hàng
      // if (returnsObj && returnsObj.RelativeVouchers) {
      //   const refOrder = returnsObj.RelativeVouchers.find(f => f.type == 'CPOSORDER');
      //   if (refOrder) {
      //     this.commonService.toastService.show('Phiếu trả hàng này đã được cấn trừ trong đơn hàng ' + refOrder.id, 'Máy bán hàng', { status: 'danger' });
      //     throw Error('Phiếu trả hàng này đã được cấn trừ trong đơn hàng ' + refOrder.id);
      //   }
      // }

      if (returnsObj && returnsObj?.Details) {
        for (const detail of returnsObj.Details) {
          debitFunds += detail.Price * detail.Quantity;
        }
      }


      this.orderForm = this.makeNewOrderForm({ ...data, returnsObj, Code: null, Returns: returns, DebitFunds: debitFunds });
    } else {
      this.orderForm = this.makeNewOrderForm(data);
    }
    this.calculateTotal(this.orderForm);
    this.historyOrders.push(this.orderForm);
    this.historyOrderIndex = this.historyOrders.length - 1;
    if (!data || !data.Code) {
      await this.save(this.orderForm);
    }
    return this.orderForm;
  }

  toggleFullscreen() {
    // const commercePosGuiEle = this.commercePosGui.nativeElement;
    if (!this.isFullscreenMode) {
      // this.commonService.layout$.next('full-screen');
      screenfull.request();
    } else {
      // this.commonService.layout$.next('one-column');
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
      if ((event.key.length == 1 && /[a-z0-9\ ]/.test(event.key)) || (event.key.length > 1 && ['Backspace'].indexOf(event.key) > -1)) {
        if (/\w+/.test(inputValue)) {
          this.lastSearchCount++;
          const currentSearchCount = this.lastSearchCount;
          this.apiService.getPromise<ProductModel[]>('/warehouse/goods', {
            includeCategories: true,
            includeFeaturePicture: true,
            includeUnit: true,
            includeContainer: true,
            // includeInventory: true,
            // sort_Id: 'desc',
            search: inputValue,
          }).then(rs => {
            if (currentSearchCount == this.lastSearchCount) {
              this.searchResults = rs.map(goods => {
                goods.Price = this.masterPriceTable[`${goods.Code}-${this.commonService.getObjectId(goods.WarehouseUnit)}`]?.Price;
                return goods;
              });
              if (rs[0]) {
                rs[0].active = true;
                this.searchResultActiveIndex = 0;
                // const activeEle = $(this.searchResultsRef.nativeElement.children[this.searchResultActiveIndex]);
                // activeEle[0].scrollIntoView();
                setTimeout(() => {
                  $(this.searchResultsRef.nativeElement).scrollTop(0);
                }, 0);
              }
              // return rs;
            } else {
              console.log('search results was lated');
            }
          });

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
                this.orderForm.get('Object').setValue(contact.Code);
              }
              if (contact.Name) {
                this.orderForm.get('ObjectName').setValue(contact.Name);
              }
            }
            // this.save(orderForm);
          }
        });
      }
    });
  }
  onObjectNameInput(orderForm: FormGroup, event: any) {
    this.commonService.takeUntil('commerce-pos-save-contact-name', 3000).then(() => {
      // this.save(orderForm);
    });
  }

  inputValue: string = '';
  async barcodeProcess(inputValue: string, option?: { searchByFindOrder?: boolean, product?: ProductModel }) {

    // if (inputValue && !/[^\d]/.test(inputValue)) {
    // if (inputValue) {
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
    let tmpProductFormGroup: FormGroup = null;
    let existsProduct: FormGroup = null;
    // inputValue = inputValue.replace(new RegExp('^118' + coreId), '');
    let product: ProductModel = option?.product || null;

    if (!product) {
      if (/^[a-z]+\d+/i.test(inputValue)) {
        // Search by sku
        product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', { includeUnit: true, includePrice: true, eq_Sku: inputValue, includeInventory: true }).then(rs => {
          return rs[0];
        });
        productId = product.Code;
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
              // isNotManageByAccessNumber: true
            }).then(rs => {
              return rs[0];
            });
          }
          if (product) {
            unitId = unitId || this.commonService.getObjectId(product.Unit);
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


            product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', {
              includeUnit: true,
              includePrice: false,
              includeInventory: true,
              findOrder: findOrder,
              // isNotManageByAccessNumber: true,
              unitSeq: unitSeq
            }).then(rs => {
              return rs[0];
            });
            if (!product) {
              return Promise.reject('Không tìn thấy hàng hóa');
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
                          focus: true,
                          action: async () => {
                            this.orderForm = await this.makeNewReturnsForm(null, inputValue);
                            this.save(this.orderForm);
                            this.historyOrders.push(this.orderForm);
                            this.historyOrderIndex = this.historyOrders.length - 1;
                          }
                        },
                        {
                          label: 'F10 - Mở lại bill',
                          keyShortcut: 'F10',
                          status: 'info',
                          focus: true,
                          action: async () => {
                            this.loadOrder(inputValue);
                          }
                        },
                      ],
                      onClose: () => {
                      },
                    }
                  });
                }, 50);
                return true;
              } else if (new RegExp('^129' + coreId).test(inputValue)) {
                setTimeout(() => {
                  this.shortcutKeyContext = 'returnspaymentconfirm';
                  this.commonService.openDialog(ShowcaseDialogComponent, {
                    context: {
                      title: 'Máy bán hàng',
                      content: 'Bạn có muốn tiếp tục bán hàng từ phiếu trả hàng ' + inputValue + ' hay hoàn tiền cho khách',
                      actions: [
                        {
                          label: 'ESC - Trở về',
                          status: 'basic',
                          action: () => {
                          }
                        },
                        {
                          label: 'F4 - Tiếp tục bán hàng',
                          keyShortcut: 'F4',
                          status: 'success',
                          focus: true,
                          action: async () => {
                            this.makeNewOrder(null, inputValue);
                          }
                        },
                        {
                          label: 'F2 - Hoàn tiền',
                          status: 'danger',
                          keyShortcut: 'F2',
                          action: async () => {
                            this.returnsPayment(inputValue);
                          }
                        },
                      ],
                      onClose: () => {
                      },
                    }
                  });
                }, 50);
                return true;
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
              // else if (inputValue.length < 10 && !new RegExp('^128|129' + coreId).test(inputValue)) {

              let unitIdLength = null;
              // if (!product) {
              //   // Truy van thong tin san pham theo cau truc moi
              //   unitIdLength = parseInt(inputValue.slice(0, 1));
              //   unitSeq = inputValue.slice(1, unitIdLength + 1);

              //   productId = inputValue.slice(unitIdLength + 1);
              //   productId = '118' + coreId + productId;
              //   product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, { includeUnit: true, includePrice: true, includeInventory: true, unitSeq: unitSeq }).then(rs => {
              //     return rs[0];
              //   });
              // }

              // => Thu truy van theo cau truc cu
              // if (!product) {
              //   productId = '118' + coreId + inputValue;
              //   unitSeq = null;
              //   product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, { includeUnit: true, includePrice: true, includeInventory: true }).then(rs => {
              //     return rs[0];
              //   });
              // }
              // if (product) {
              //   unitId = this.commonService.getObjectId(product.Unit);
              // }

              // } else {

              if (!product) {
                const productIdLength = parseInt(inputValue.substring(0, 2)) - 10;
                accessNumber = inputValue.substring(productIdLength + 2);
                if (accessNumber) {
                  accessNumber = '127' + accessNumber;
                }
                productId = inputValue.substring(2, 2 + productIdLength);
                unitIdLength = parseInt(productId.slice(0, 1));
                unitSeq = productId.slice(1, unitIdLength + 1);
                productId = productId.slice(unitIdLength + 1);
                productId = '118' + coreId + productId;

                product = this.productMap[productId];

                if (unitSeq) {
                  unit = this.unitMap[unitSeq];
                  unitId = unit.Code;

                  product.Unit = { ...unit, id: unit.Code, text: unit.Name };
                }
              }

              // }
            }
          }
          // get access number inventory 
          // get access number inventory 
          // get access number inventory 
          if (new RegExp('^127' + coreId).test(accessNumber)) {
            // product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', {
            this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', {
              accessNumber: accessNumber,
              includeUnit: true,
              includePrice: false,
              includeInventory: true
            }).then(rs => {

              product = rs[0];

              const existsProductIndex = detailsControls.findIndex(f => this.commonService.getObjectId(f.get('Product').value) === productId && this.commonService.getObjectId(f.get('Unit').value) == unitId);
              existsProduct = detailsControls[existsProductIndex] as FormGroup;
              if (existsProduct) {
                setTimeout(() => {

                  existsProduct.get('Container').setValue(product.Container);

                  if (this.orderForm['voucherType'] == 'CPOSRETURNS') {
                    if (product.Inventory && product.Inventory > 0) {
                      this.commonService.toastService.show('POS Thương mại', `${product.Name} (${product.Unit.Name}) đang có trong kho! không thể trả hàng với hàng hóa chưa xuất kho !`, { status: 'warning' });
                      existsProduct.get('AccessNumbers').setValue((existsProduct.get('AccessNumbers').value || []).filter(f => f != accessNumber));
                      // return;
                    }
                  } else {
                    if (!product.Inventory || product.Inventory < 1) {
                      this.commonService.toastService.show('POS Thương mại', `${product.Name} (${product.Unit.Name}) (${accessNumber}) không có trong kho`, { status: 'warning' });
                      existsProduct.get('AccessNumbers').setValue((existsProduct.get('AccessNumbers').value || []).filter(f => f != accessNumber));
                      // return;
                    }
                  }

                  // this.save(this.orderForm);
                }, 1000);
              }


              return product;
            });
            if (product) {
              productId = product.Code;
              unitId = unitId || this.commonService.getObjectId(product.Unit);
              product.Price = this.masterPriceTable[`${product.Code}-${unitId}`]?.Price;
              // if (this.orderForm['voucherType'] == 'CPOSRETURNS') {
              //   if (product.Inventory && product.Inventory > 0) {
              //     throw Error(`${product.Name} (${product.Unit.Name}) đang có trong kho! không thể trả hàng với hàng hóa chưa xuất kho !`);
              //   }
              // } else {
              //   if (!product.Inventory || product.Inventory < 1) {
              //     throw Error(`${product.Name} (${product.Unit.Name}) (${accessNumber}) không có trong kho`);
              //   }
              // }
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

          this.increaseDetailPipSound.nativeElement.play();
          this.calculateToMoney(existsProduct);
          this.calculateTotal(this.orderForm);
          this.activeDetail(this.orderForm, existsProduct, existsProductIndex);
        } else {
          this.errorSound.nativeElement.play();
          this.commonService.toastService.show('Trùng số truy xuất !', 'Commerce POS', { status: 'warning' });
        }
      } else {
        quantityControl.setValue(quantityControl.value + 1);
        this.calculateToMoney(existsProduct);
        this.calculateTotal(this.orderForm);

        this.activeDetail(this.orderForm, existsProduct, existsProductIndex);
        this.increaseDetailPipSound.nativeElement.play();
      }
      return existsProduct;
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
        FindOrder: product?.FindOrder,
        Container: product?.Container,
      });
      existsProductIndex = detailsControls.length - 1;

      if (product?.Price) {
        // Nếu đã có giá (trường hợp quét số truy xuất)
        this.calculateToMoney(existsProduct);
        detailsControls.push(existsProduct);
        this.calculateTotal(this.orderForm);
        this.activeDetail(this.orderForm, existsProduct, existsProductIndex);
        this.newDetailPipSound.nativeElement.play();
        // this.save(this.orderForm);
      } else {
        // Nếu chưa có giá (trường hợp quét ID sản phẩm)
        if (product) {

          if (!product.Unit || !this.commonService.getObjectId(product.Unit) || this.commonService.getObjectId(product.Unit) == 'n/a') {
            this.errorSound.nativeElement.play();
            this.commonService.toastService.show('Sản phẩm chưa cài đặt đơn vị tính !', 'Commerce POS', { status: 'danger' });
            return;
          }

          existsProduct.get('Description').setValue(product.Name);
          existsProduct.get('Sku').setValue(product.Sku);
          existsProduct.get('Unit').setValue(product.Unit);
          existsProduct.get('FeaturePicture').setValue(product.FeaturePicture?.Thumbnail);

          return await this.apiService.getPromise<any[]>('/sales/master-price-tables/getProductPriceByUnits', {
            // priceTable: 'BGC201031',
            product: productId,
            includeUnit: true
          }).then(prices => prices.find(f => this.commonService.getObjectId(f.Unit) == this.commonService.getObjectId(product.Unit))).then(price => {
            if (price) {
              existsProduct.get('Price').setValue(parseFloat(price.Price));
              existsProduct.get('ToMoney').setValue(price.Price * existsProduct.get('Quantity').value);

              this.calculateToMoney(existsProduct);
              detailsControls.push(existsProduct);
              this.calculateTotal(this.orderForm);

              this.activeDetail(this.orderForm, existsProduct, 0);

              this.newDetailPipSound.nativeElement.play();
              // this.save(this.orderForm);
            } else {
              this.commonService.toastService.show('Sản phẩm chưa có giá bán !', 'Commerce POS', { status: 'danger' });
            }
            return existsProduct;
          }).catch(err => {

            this.commonService.toastService.show('Sản phẩm chưa có giá bán !', 'Commerce POS', { status: 'danger' });
            this.errorSound.nativeElement.play();
          });
        } else {
          this.errorSound.nativeElement.play();
          this.commonService.toastService.show('Sản phẩm không tồn tại !', 'Commerce POS', { status: 'danger' });
          return false;
        }
      }
    }

    // }
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
        label: 'F10 - Xác nhận',
        keyShortcut: 'F10',
        status: 'danger',
        focus: true,
        action: () => {
          // this.order = new OrderModel();
          this.apiService.putPromise('/commerce-pos/orders', { changeState: 'UNRECORDED' }, [{ Code: this.orderForm.get('Code').value }]).then(rs => {
            this.orderForm.get('State').setValue('UNRECORDED');
            this.historyOrderIndex = this.historyOrders.findIndex(f => f === this.orderForm);
            if (this.historyOrderIndex > -1) {
              // this.historyOrders.splice(this.historyOrderIndex, 1);
              if (this.historyOrders.length == 0) {
                this.makeNewOrder();
              } else {
                this.historyOrderIndex = this.historyOrders.length - 1;
                this.orderForm = this.historyOrders[this.historyOrderIndex];
              }
            }

            setTimeout(() => {
              // event.target.blur();
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


  // isBarcodeJustScaned = false;
  barcode = '';
  // tmpQuantity = '';
  findOrderKeyInput = '';
  searchInputPlaceholder = '';
  // @HostListener('document:keydown', ['$event'])
  onKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);

    if (this.searchResults && this.searchResults.length > 0) {
      if (event.key == 'ArrowDown') {
        if (this.searchResultActiveIndex < this.searchResults.length - 1) {
          this.searchResultActiveIndex++;
          const activeEle = $(this.searchResultsRef.nativeElement.children[this.searchResultActiveIndex]);
          activeEle[0].scrollIntoView();

          event.preventDefault();
          // return false;
        }
        return false;
      }
      if (event.key == 'ArrowUp') {
        if (this.searchResultActiveIndex > 0) {
          this.searchResultActiveIndex--;

          const activeEle = $(this.searchResultsRef.nativeElement.children[this.searchResultActiveIndex]);
          activeEle[0].scrollIntoView();

          event.preventDefault();
          // return false;
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
        this.searchResults = null;
        // this.searchInput = '';
        this.searchEleRef.nativeElement.value = '';
        (document.activeElement as HTMLElement).blur();
      }
      return true;
    }

    if (event.key == 'F9') {
      if (this.commonService.dialogStack.length === 0) {
        if (this.orderForm.value?.State == 'APPROVED') {
          this.print(this.orderForm);
        } else {
          this.payment(this.orderForm);
        }
        event.preventDefault();
      }
      return true;
    }
    if (event.key == 'F8') {
      if (this.commonService.dialogStack.length === 0) {
        this.objectPhoneEleRef.nativeElement.focus();
        event.preventDefault();
      }
      return true;
    }
    if (event.key == 'F4') {
      if (this.commonService.dialogStack.length === 0) {
        this.destroyOrder();
        event.preventDefault();
        return false;
      }
      return true;
    }
    if (event.key == 'F8') {
      if (this.commonService.dialogStack.length === 0) {
        this.objectPhoneEleRef.nativeElement.focus();
        event.preventDefault();
      }
      return true;
    }
    if (event.key == 'F2') {
      if (this.commonService.dialogStack.length === 0) {
        const details = this.getDetails(this.orderForm).controls;
        let activeDetailIndex = details.findIndex(f => f['isActive'] === true);
        // const quantityEle = $(this.orderDetailTableRef.nativeElement.children[activeDetailIndex + 1]).find('.pos-quantity')[0] as HTMLInputElement;
        // quantityEle.focus();
        // quantityEle.select();

        this.focusToQuantity(activeDetailIndex);
        event.preventDefault();
        return false;
      }
      return true;
    }
    if (event.key == 'F3') {
      if (this.commonService.dialogStack.length === 0) {
        this.searchEleRef.nativeElement.focus();
        event.preventDefault();
      }
      return true;
    }
    if (event.key == 'F4') {
      if (this.shortcutKeyContext == 'returnspaymentconfirm') {
        this.makeNewOrder(null, this.inputValue);
      }
      return true;
    }
    if (event.key == 'F5') {
      if (this.commonService.dialogStack.length === 0) {
        this.makeNewOrder();
        event.preventDefault();
      }
      return true;
    }

    if (this.searchResults == null) {
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

          // this.tmpQuantity = '';
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
            // this.focusToQuantity(activeDetailIndex);

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

          // this.tmpQuantity = '';
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
            // this.focusToQuantity(activeDetailIndex);

            for (const detail of details) {
              if (detail !== nextDetail) {
                detail['isActive'] = false;
              }
            }
          }
        }
        return false;
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
      this.barcode += event.key;
      // if (/[0-9|\.]/.test(event.key)) {
      //   if (['Backspace'].indexOf(event.key) < 0 && !/[0-9\.]/.test(event.key)) {
      //     event.preventDefault();
      //     return false;
      //   }
      //   this.tmpQuantity += event.key;
      // }
      // if (event.key == 'Backspace') {
      //   this.tmpQuantity = this.tmpQuantity.slice(0, -1);
      //   const details = this.getDetails(this.orderForm).controls;
      //   const activeDetail = details.find(f => f['isActive'] === true) as FormGroup;
      //   if (activeDetail) {
      //     const quantityControl = activeDetail.get('Quantity');
      //     quantityControl.setValue(this.tmpQuantity);
      //   }
      //   this.barcode = this.barcode.slice(0, -1);
      // }
      if ((document.activeElement as HTMLElement).tagName == 'BODY' || (document.activeElement as HTMLElement).id == 'posSearchInput') {
        this.commonService.takeUntil('barcode-scan', 100).then(() => {
          console.log(this.barcode);
          if (this.barcode && /Enter$/.test(this.barcode)) {
            // this.tmpQuantity = '';
            try {
              if (this.barcode.length > 5) {
                this.barcodeProcess(this.barcode.replace(/Enter.*$/, '')).then(rs => {
                  // this.isBarcodeJustScaned = false;
                  // this.tmpQuantity = '';
                });
              }
              // this.findOrderKeyInput = '';
            } catch (err) {
              this.commonService.toastService.show(err, 'Cảnh báo', { status: 'warning' });
            }
          }
          this.barcode = '';
          // this.isBarcodeJustScaned = true;
        });
      }

      if ((document.activeElement as HTMLElement).tagName == 'BODY') {
        // Quantity processing
        // this.commonService.takeUntil('quantity-change', 150).then(() => {
        //   if (this.tmpQuantity) {
        //     const details = this.getDetails(this.orderForm).controls;
        //     const activeDetail = details.find(f => f['isActive'] === true) as FormGroup;
        //     if (activeDetail) {
        //       const quantityControl = activeDetail.get('Quantity');
        //       quantityControl.setValue(this.tmpQuantity);
        //       this.calculateToMoney(activeDetail);
        //       this.calculateTotal(this.orderForm);
        //       this.barcode = '';
        //     }
        //   }
        // });
      }

      if (/^[0-9]$/.test(event.key) && (document.activeElement as HTMLElement).tagName == 'BODY') {
        this.findOrderKeyInput += event.key;
        this.searchInputPlaceholder = this.findOrderKeyInput + ' - tìm theo vị trí hàng hóa...';
      }
      if (event.key == 'Backspace') {
        this.findOrderKeyInput = this.findOrderKeyInput.slice(0, -1);
        this.searchInputPlaceholder = this.findOrderKeyInput + ' - tìm theo vị trí hàng hóa...';
      }

      if (event.key == 'Enter' && this.findOrderKeyInput) {
        setTimeout(() => {
          if (this.findOrderKeyInput && this.findOrderKeyInput.length < 6) {
            try {
              this.barcodeProcess(this.findOrderKeyInput, { searchByFindOrder: true });
            } catch (err) {
              this.commonService.toastService.show(err, 'Cảnh báo', { status: 'warning' });
            }
          }
          this.findOrderKeyInput = '';
          this.searchInputPlaceholder = '';
        }, 300);
      }
    }

    // this.commonService.takeUntil('skip-by-barcode-scan', 110).then(() => {
    //   if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(event.key) > -1) {
    //     const details = this.getDetails(this.orderForm).controls;
    //     const activeDetail = details[parseInt(event.key) - 1];
    //     if (activeDetail) {
    //       activeDetail['isActive'] = true;

    //       // focus
    //       // $(this.orderDetailTableRef.nativeElement.children[parseInt(event.key)]).find('.pos-quantity')[0].focus();
    //       $(this.orderDetailTableRef.nativeElement.children[parseInt(event.key)])[0].scrollIntoView();

    //       for (const detail of details) {
    //         if (detail !== activeDetail) {
    //           detail['isActive'] = false;
    //         }
    //       }
    //     }
    //     event.preventDefault();
    //     return false;
    //   }
    // });

    return true;
  }

  onKeyupEvent(event: KeyboardEvent) {


    return true;
  }

  activeDetail(orderForm: FormGroup, activeDetail: FormGroup, index: number) {
    const details = this.getDetails(orderForm).controls;

    // const activeDetail = 
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
    this.getDetails(orderForm).controls.splice(index, 1);
    this.calculateTotal(orderForm);
    // this.save(orderForm);
  }

  onQuantityKeydown(orderForm: FormGroup, detail: FormGroup, event, numberFormat: CurrencyMaskConfig) {
    // return false;
    // detail.get('Quantity').setValue(1);
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
    // const currentQuantity = event.target.value;
    // this.commonService.takeUntil('change-quantity', 150).then(() => {
    //   if (!this.isBarcodeJustScaned) {
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    console.log('change quantity accepted');
    //   } else {
    //     event.target.value = currentQuantity;
    //     console.log('change quantity not accepted, restore: ' + currentQuantity);
    //   }
    // });
    return true;
  }

  onIncreaseQuantityClick(orderForm: FormGroup, detail: FormGroup) {
    // if (detail.get('AccessNumbers').value) {
    //   return false;
    // }
    const quantityControl = detail.get('Quantity');
    quantityControl.setValue(parseInt(quantityControl.value) + 1);
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    this.newDetailPipSound.nativeElement.play();
    // this.save(orderForm);
  }
  onDecreaseQuantityClick(orderForm: FormGroup, detail: FormGroup) {
    // if (detail.get('AccessNumbers').value) {
    //   return false;
    // }
    const quantityControl = detail.get('Quantity');
    if (quantityControl.value > 1) {
      quantityControl.setValue(parseInt(quantityControl.value) - 1);
      this.calculateToMoney(detail);
      this.calculateTotal(orderForm);
      this.increaseDetailPipSound.nativeElement.play();
      // this.save(orderForm);
    } else {
      this.errorSound.nativeElement.play();
      this.commonService.toastService.show('Số lượng phải lớn hơn 0', 'Cảnh báo', { status: 'warning' });
    }
  }

  onCashReceiptChanged(formGroup: FormGroup) {
    const cashReceiptControl = formGroup.get('CashReceipt');
    const cashBackControl = formGroup.get('CashBack');
    const totolControl = formGroup.get('Total');
    cashBackControl.setValue(cashReceiptControl.value - totolControl.value);
  }

  async payment(orderForm: FormGroup) {
    const data = orderForm.getRawValue();
    if (!data?.Details?.length) {
      this.commonService.toastService.show('Chưa có hàng hóa nào trong đơn hàng !', 'Máy bán hàng', { status: 'warning', duration: 5000 })
      return false;
    }
    await this.save(orderForm);
    orderForm['isProcessing'] = true;
    setTimeout(() => {
      orderForm['isProcessing'] = false;
    }, 500);
    if (orderForm['voucherType'] == 'CPOSORDER') {
      this.paymentSound.nativeElement.play();
      this.commonService.openDialog(CommercePosBillPrintComponent, {
        context: {
          skipPreview: true,
          instantPayment: true,
          data: [data],
          onSaveAndClose: (newOrder, printComponent) => {
            orderForm.patchValue(newOrder);
            this.commonService.toastService.show('Đơn hàng đã hoàn tất', 'Máy bán hàng', { status: 'success', duration: 8000 })
            this.makeNewOrder();
            // printComponent.close();
            console.log(this.historyOrders);
          },
          onClose: () => {
          }
        }
      });
    } else {
      this.commonService.openDialog(CommercePosReturnsPrintComponent, {
        context: {
          skipPreview: true,
          data: [orderForm.getRawValue()],
          onSaveAndClose: (newOrder, printComponent) => {
            orderForm.patchValue(newOrder);
            this.commonService.toastService.show('Phiếu trả hàng đã lưu !', 'Máy bán hàng', { status: 'success', duration: 8000 })
            // this.makeNewOrder();

            this.historyOrderIndex--;
            this.orderForm = this.historyOrders[this.historyOrderIndex];

            printComponent.close();
            console.log(this.historyOrders);
          },
          onClose: () => {
          }
        }
      });
    }
  }

  async save(orderForm: FormGroup): Promise<CommercePosOrderModel> {
    const voucherType = orderForm['voucherType'];
    const apiPath = voucherType == 'CPOSORDER' ? '/commerce-pos/orders' : '/commerce-pos/returns';
    let order = orderForm.getRawValue();
    delete order.BarCode;
    if (orderForm && orderForm['isProcessing'] !== true && order.State != 'APPROVED') {
      return this.commonService.takeUntil('commerce-pos-order-save', 500).then(status => {
        if (order.Code) {
          // params['id0'] = order.Code;
          return this.apiService.putPromise(apiPath + '/' + order.Code, { renderBarCode: true }, [order]).then(rs => {
            // orderForm.get('Code').setValue(rs[0].Code);
            // orderForm.patchValue(rs[0]);
            return rs[0];
          });
        } else {
          orderForm['isProcessing'] = true;
          return this.apiService.postPromise(apiPath, { renderBarCode: true }, [order]).then(rs => {
            // orderForm.get('Code').setValue(rs[0].Code);
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

  async print(orderForm: FormGroup) {
    if (orderForm.get('State').value !== 'APPROVED') {
      this.commonService.toastService.show('Bạn chỉ có thể in lại phiếu đã chốt', 'Máy bán hàng', { status: 'warning' });
      return false;
    }
    return new Promise(resovle => {
      this.commonService.openDialog(CommercePosBillPrintComponent, {
        context: {
          skipPreview: true,
          data: [orderForm.getRawValue()],
          onSaveAndClose: (newOrder, printComponent) => {
            this.commonService.toastService.show('Đã tạo phiếu chi hoàn tiền cho phiếu trả hàng !', 'Máy bán hàng', { status: 'success', duration: 8000 })
            resovle(true);
          }
        }
      });
    });
  }

  async printOrder(orderId: string) {
    const order = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + orderId, { includeDetails: true, renderBarCode: true }).then(rs => rs[0]);
    if (order.State !== 'APPROVED') {
      this.commonService.toastService.show('Bạn chỉ có thể in lại phiếu đã chốt', 'Máy bán hàng', { status: 'warning' });
      return false;
    }
    return new Promise(resovle => {
      this.commonService.openDialog(CommercePosBillPrintComponent, {
        context: {
          skipPreview: true,
          data: [order],
          onSaveAndClose: (newOrder, printComponent) => {
            // this.commonService.toastService.show('Đã tạo phiếu chi hoàn tiền cho phiếu trả hàng !', 'Máy bán hàng', { status: 'success', duration: 8000 })
            resovle(true);
          }
        }
      });
    });
  }

  async loadOrder(orderId: string) {
    const order = await this.apiService.getPromise<CommercePosOrderModel[]>('/commerce-pos/orders/' + orderId, { includeDetails: true, renderBarCode: true }).then(rs => rs[0]);
    // if (order.State !== 'APPROVED') {
    //   this.commonService.toastService.show('Bạn chỉ có thể in lại phiếu đã chốt', 'Máy bán hàng', { status: 'warning' });
    //   return false;
    // }
    // return new Promise(resovle => {
    //   this.commonService.openDialog(CommercePosBillPrintComponent, {
    //     context: {
    //       skipPreview: true,
    //       data: [order],
    //       onSaveAndClose: (newOrder, printComponent) => {
    //         // this.commonService.toastService.show('Đã tạo phiếu chi hoàn tiền cho phiếu trả hàng !', 'Máy bán hàng', { status: 'success', duration: 8000 })
    //         resovle(true);
    //       }
    //     }
    //   });
    // });
    this.makeNewOrder(order);
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
      this.commonService.toastService.show('Phiếu trả hàng chưa được duyệt', 'Máy bán hàng', { status: 'warning' });
      return false;
    }

    if (returnsObj.RelativeVouchers) {
      const refPayment = returnsObj.RelativeVouchers.find(f => f.type == 'CPOSPAYMENT');
      // Kiểm tra lại nó không cho hoàn tiền từ phiếu trả hàng
      // if (refPayment) {
      //   this.commonService.toastService.show('Phiếu trả hàng này đã được hoàn tiền bởi phiếu chi ' + refPayment.id, 'Máy bán hàng', { status: 'danger' });
      //   return false;
      // }
      // const refOrder = returnsObj.RelativeVouchers.find(f => f.type == 'CPOSORDER');
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
      RelativeVouchers: [{ id: returnsObj.Code, text: returnsObj.Note || returnsObj.Code, type: 'CPOSRETURNS' }],
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

            resovle(true);
          },
          onClose: () => {
            // this.shortcutKeyContext = 'main';
          },
        }
      });
    });
  }

  onChooseProduct(product: ProductModel) {
    (document.activeElement as HTMLElement).blur();
    this.searchEleRef.nativeElement.value = '';
    let productId = product.Code;
    this.searchResults = null;
    this.searchResultActiveIndex = 0;
    if (product.WarehouseUnit['sequence']) {
      const miniErpCode = this.systemConfigs.ROOT_CONFIGS.coreEmbedId;
      productId = productId.replace(new RegExp('^118' + miniErpCode), '');
      productId = product.WarehouseUnit['sequence'].length + product.WarehouseUnit['sequence'] + productId;
    }
    if (product.Container?.ContainerFindOrder) {
      this.barcodeProcess(product.Container.ContainerFindOrder, { searchByFindOrder: true });
    } else {
      product.Unit = product.WarehouseUnit;
      this.barcodeProcess(null, { product: product });
    }
    // this.tmpQuantity = '';
  }

  chooseCustomer() {
    this.commonService.openDialog(ContactAllListComponent, {
      context: {
        inputMode: 'dialog',
        onDialogChoose: async (chooseItems: ContactModel[]) => {
          console.log(chooseItems);
          const contact = chooseItems[0];
          if (contact) {
            this.orderForm.get('Object').setValue(contact.Code);
            this.orderForm.get('ObjectName').setValue(contact.Name);
            this.orderForm.get('ObjectPhone').setValue(contact.Phone);
          }
        }
      }
    });
  }

  toggleDebt() {
    this.orderForm.get('IsDebt').setValue(!this.orderForm.get('IsDebt').value);
    // this.save(this.orderForm);

    (document.activeElement as HTMLElement).blur();
  }

  async onMakeNewReturnsForm() {
    this.orderForm = await this.makeNewReturnsForm();
    this.save(this.orderForm);
    this.historyOrders.push(this.orderForm);
    this.historyOrderIndex = this.historyOrders.length - 1;

    (document.activeElement as HTMLElement).blur();
  }
}
