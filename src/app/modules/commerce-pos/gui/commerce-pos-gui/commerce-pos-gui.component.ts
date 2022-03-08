import { ShowcaseDialogComponent } from './../../../dialog/showcase-dialog/showcase-dialog.component';
import { ProductModel } from './../../../../models/product.model';
import { ContactModel } from './../../../../models/contact.model';
import { CommercePosDetailModel, CommercePosOrderModel, CommercePosCashVoucherModel, CommercePosReturnsModel } from './../../../../models/commerce-pos.model';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from "@angular/core";
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
import { OverlayRef } from '@angular/cdk/overlay';

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

  @ViewChild('newDetailPipSound', { static: true }) newDetailPipSound: ElementRef;
  @ViewChild('increaseDetailPipSound', { static: true }) increaseDetailPipSound: ElementRef;
  @ViewChild('errorSound', { static: true }) errorSound: ElementRef;

  @ViewChild('ObjectPhone', { static: true }) objectPhoneEleRef: ElementRef;
  @ViewChild('Search', { static: true }) searchEleRef: ElementRef;
  @ViewChild('orderDetailTable', { static: true }) orderDetailTableRef: ElementRef;

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

  async init() {
    const result = await super.init();
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
      DateOfSale: [new Date()],
      Details: this.formBuilder.array([]),
      Returns: [],
      RelativeVouchers: [data?.Returns ? [{ id: data.Returns, text: data.Returns, type: 'CPOSRETURNS' }] : null],
      DebitFunds: [],
    });
    newForm['voucherType'] = 'CPOSORDER';
    newForm['isProcessing'] = null;
    if (data) {
      newForm.patchValue(data);
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
      });
      if (order.Details) {
        const details = (this.getDetails(newForm) as FormArray).controls;
        for (const detail of order.Details) {
          details.unshift(this.makeNewOrderDetail(detail));
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
      });
    }
    newForm['voucherType'] = 'CPOSRETURNS';
    newForm['isProcessing'] = null;
    return newForm;
  }

  makeNewOrderDetail(detail?: CommercePosDetailModel) {
    return this.formBuilder.group({
      Sku: [detail.Sku || null],
      Product: [detail.Product || null],
      Unit: [detail.Unit || 'n/a'],
      Description: [detail.Description || null],
      Quantity: [detail.Quantity || 0],
      Price: [detail.Price || 0],
      ToMoney: [detail.Quantity * detail.Price || 0],
      FeaturePicture: [],
      Image: [detail.Image || []],
      AccessNumbers: [detail.AccessNumbers || null],
      Discount: [detail.Discount || 0],
    });
  }

  getDetails(formGroup: FormGroup) {
    return formGroup.get('Details') as FormArray;
  }

  async makeNewOrder(data?: CommercePosOrderModel, returns?: string) {
    if (this.orderForm.get('State').value !== 'APPROVED') {
      this.save(this.orderForm);
    }

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
    this.calculateTotal(this.orderForm);
    this.historyOrders.push(this.orderForm);
    this.historyOrderIndex = this.historyOrders.length - 1;
    await this.save(this.orderForm);
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
      detail.get('ToMoney').setValue(detail.get('Quantity').value * detail.get('Price').value);
    }
  }

  calculateTotal(form: FormGroup) {
    let total = 0;
    for (const detail of this.getDetails(form).controls) {
      total += detail.get('Price').value * detail.get('Quantity').value;
    }

    this.orderForm.get('Total').setValue(total);
    this.onCashReceiptChanged(form);
    return total;
  }

  onSearchInputKeydown(event: any) {
    console.log(event);

    if (event.key == 'Enter') {
      const inputValue: string = event.target?.value;
      event.target.value = '';
      this.barcodeProcess(inputValue);
    }
    return true;
  }

  onObjectPhoneInput(orderForm: FormGroup, event: any) {
    this.commonService.takeUntil('commerce-pos-seach-contact-by-phone', 400).then(() => {
      const phone = this.orderForm.get('ObjectPhone').value;
      if (phone && phone.length > 9) {
        this.apiService.getPromise<ContactModel[]>('/contact/contacts', { search: phone, sort_Id: 'desc' }).then(rs => {
          if (rs.length > 0) {
            this.orderForm.get('ObjectName').setValue(rs[0].Name);
          }
        });
      }
    });
  }

  inputValue: string = '';
  async barcodeProcess(inputValue: string) {

    // if (inputValue && !/[^\d]/.test(inputValue)) {
    if (inputValue) {
      this.inputValue = inputValue;
      const detailsControls = this.getDetails(this.orderForm).controls
      const systemConfigs = await this.commonService.systemConfigs$.pipe(takeUntil(this.destroy$), filter(f => !!f), take(1)).toPromise().then(settings => settings);
      const coreId = systemConfigs.ROOT_CONFIGS.coreEmbedId;
      let productId = null;
      let accessNumber = null;
      let sku = null;
      let unitSeq = null;
      let unitId = null;
      inputValue = inputValue.replace(new RegExp('^118' + coreId), '');
      let product: ProductModel = null;

      if (/^[a-z]+\d+/i.test(inputValue)) {
        // Search by sku
        product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', { includeUnit: true, includePrice: true, eq_Sku: inputValue, includeInventory: true }).then(rs => {
          return rs[0];
        });
        productId = product.Code;
      } else {
        if (new RegExp('^127' + coreId + '\\d+').test(inputValue)) {
          accessNumber = inputValue;
        } else {
          if (inputValue.length < 5) { // Chỉ đúng khi số thứ tự id sản phẩm < 7 con số ( < 10 triệu)
            productId = '118' + coreId + inputValue;
          } else if (inputValue.length < 10 && !new RegExp('^128|129' + coreId).test(inputValue)) {

            // Truy van thong tin san pham theo cau truc moi
            const unitIdLength = parseInt(inputValue.slice(0, 1));
            unitSeq = inputValue.slice(1, unitIdLength + 1);

            productId = inputValue.slice(unitIdLength + 1);
            productId = '118' + coreId + productId;
            product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, { includeUnit: true, includePrice: true, includeInventory: true, unitSeq: unitSeq }).then(rs => {
              return rs[0];
            });

            // => Thu truy van theo cau truc cu
            if (!product) {
              productId = '118' + coreId + inputValue;
              unitSeq = null;
              product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, { includeUnit: true, includePrice: true, includeInventory: true }).then(rs => {
                return rs[0];
              });
            }
            if (product) {
              unitId = this.commonService.getObjectId(product.Unit);
            }

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
                    ],
                    onClose: () => {
                    },
                  }
                });
              }, 50);
              return true;
            }
            if (new RegExp('^129' + coreId).test(inputValue)) {
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
            }
            const productIdLength = parseInt(inputValue.substring(0, 2)) - 10;
            accessNumber = inputValue.substring(productIdLength + 2);
            if (accessNumber) {
              accessNumber = '127' + accessNumber;
            }
            productId = inputValue.substring(2, 2 + productIdLength);
            const unitIdLength = parseInt(productId.slice(0, 1));
            unitSeq = productId.slice(1, unitIdLength + 1);
            productId = productId.slice(unitIdLength + 1);
            productId = '118' + coreId + productId;

          }
        }
        // get access number inventory 
        if (new RegExp('^127' + coreId).test(accessNumber)) {
          product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products', { accessNumber: accessNumber, includeUnit: true, includePrice: true, includeInventory: true }).then(rs => {
            return rs[0];
          });
          if (product) {
            productId = product.Code;
            unitId = this.commonService.getObjectId(product.Unit);
            if (!product.Inventory || product.Inventory < 1) {
              throw Error(`${product.Name} (${product.Unit.Name}) không có trong kho`);
            }
          } else {
            product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, { includeUnit: true, includePrice: true, includeInventory: true, unitSeq: unitSeq }).then(rs => {
              return rs[0];
            });
            unitId = this.commonService.getObjectId(product.Unit);
          }
        }
      }

      if (!product) { // Nếu không lấy đươc thông tin sản phẩm theo số truy xuất
        // Case 2: Search by product id
        productId = inputValue.length < 9 ? `118${coreId}${inputValue}` : inputValue;
        accessNumber = null;
        product = await this.apiService.getPromise<ProductModel[]>('/commerce-pos/products/' + productId, { includeUnit: true, includePrice: true, includeInventory: true }).then(rs => {
          return rs[0];
        });
        if (product) {
          unitId = this.commonService.getObjectId(product.Unit);
        }
        // }
      }

      console.log(accessNumber, productId);
      const existsProductIndex = detailsControls.findIndex(f => this.commonService.getObjectId(f.get('Product').value) === productId && this.commonService.getObjectId(f.get('Unit').value) == unitId);
      let existsProduct: FormGroup = detailsControls[existsProductIndex] as FormGroup;
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
        });

        if (product?.Price) {
          // Nếu đã có giá (trường hợp quét số truy xuất)
          this.calculateToMoney(existsProduct);
          detailsControls.unshift(existsProduct);
          this.calculateTotal(this.orderForm);
          this.activeDetail(this.orderForm, existsProduct, 0);
          this.newDetailPipSound.nativeElement.play();
          this.save(this.orderForm);
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
                detailsControls.unshift(existsProduct);
                this.calculateTotal(this.orderForm);

                this.activeDetail(this.orderForm, existsProduct, 0);

                this.newDetailPipSound.nativeElement.play();
                this.save(this.orderForm);
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
        label: 'F10 - Xác nhận',
        keyShortcut: 'F10',
        status: 'danger',
        focus: true,
        action: () => {
          // this.order = new OrderModel();
          this.historyOrderIndex = this.historyOrders.findIndex(f => f === this.orderForm);
          if (this.historyOrderIndex > -1) {
            this.historyOrders.splice(this.historyOrderIndex, 1);
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
  }

  barcode = '';
  // @HostListener('document:keydown', ['$event'])
  onKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);

    if (event.key == 'Escape') {
      this.shortcutKeyContext = 'main';
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
          this.focusToQuantity(activeDetailIndex);

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
          this.focusToQuantity(activeDetailIndex);

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
          const nextActive = details[activeDetailIndex] as FormGroup;
          if (nextActive) {
            this.activeDetail(this.orderForm, nextActive, activeDetailIndex);
          }
        }
      }
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
          return true;
        }
      }
    }

    // Barcode scan
    if (this.commonService.dialogStack.length === 0) {
      this.barcode += event.key;
      this.commonService.takeUntil('barcode-scan', 100).then(() => {
        console.log(this.barcode);
        if (this.barcode && /Enter$/.test(this.barcode)) {
          try {
            this.barcodeProcess(this.barcode.replace(/Enter$/, ''));
          } catch (err) {
            this.commonService.toastService.show(err, 'Cảnh báo', { status: 'warning' });
          }
        }
        // else {
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
        // }

        this.barcode = '';
      });
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

  activeDetail(orderForm: FormGroup, activeDetail: FormGroup, index: number) {
    const details = this.getDetails(orderForm).controls;

    // const activeDetail = 
    activeDetail['isActive'] = true;

    for (const detail of details) {
      if (detail !== activeDetail) {
        detail['isActive'] = false;
      }
    }
    $(this.orderDetailTableRef.nativeElement?.children[index + 1])[0]?.scrollIntoView();
  }

  removeDetail(orderForm: FormGroup, index: number) {
    this.getDetails(orderForm).controls.splice(index, 1);
    this.calculateTotal(orderForm);
    this.save(orderForm);
  }

  onQuantityKeydown(orderForm: FormGroup, detail: FormGroup, event, numberFormat: CurrencyMaskConfig) {
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
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    return true;
  }

  onIncreaseQuantityClick(orderForm: FormGroup, detail: FormGroup) {
    if (detail.get('AccessNumbers').value) {
      return false;
    }
    const quantityControl = detail.get('Quantity');
    quantityControl.setValue(quantityControl.value + 1);
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    this.newDetailPipSound.nativeElement.play();
    this.save(orderForm);
  }
  onDecreaseQuantityClick(orderForm: FormGroup, detail: FormGroup) {
    if (detail.get('AccessNumbers').value) {
      return false;
    }
    const quantityControl = detail.get('Quantity');
    if (quantityControl.value > 1) {
      quantityControl.setValue(quantityControl.value - 1);
      this.calculateToMoney(detail);
      this.calculateTotal(orderForm);
      this.increaseDetailPipSound.nativeElement.play();
      this.save(orderForm);
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
    orderForm['isProcessing'] = true;
    setTimeout(() => {
      orderForm['isProcessing'] = false;
    }, 500);
    await this.save(orderForm);
    if (orderForm['voucherType'] == 'CPOSORDER') {
      this.commonService.openDialog(CommercePosBillPrintComponent, {
        context: {
          skipPreview: true,
          data: [orderForm.getRawValue()],
          onSaveAndClose: (newOrder, printComponent) => {
            orderForm.patchValue(newOrder);
            this.commonService.toastService.show('Đơn hàng đã hoàn tất, bạn có thể bấm F4 để xem lại', 'Máy bán hàng', { status: 'success', duration: 8000 })
            this.makeNewOrder();
            printComponent.close();
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
            orderForm.patchValue(rs[0]);
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

  async returnsPayment(returns: string) {
    const returnsObj = await this.apiService.getPromise<CommercePosReturnsModel[]>('/commerce-pos/returns/' + returns, { includeDetails: true, includeRelativeVouchers: true }).then(rs => rs[0]);
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
}
