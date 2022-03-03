import { ContactModel } from './../../../../models/contact.model';
import { CommercePosDetailModel, CommercePosOrderModel } from './../../../../models/commerce-pos.model';
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

  // @ViewChild("pipSound", { static: true }) pipSound: ElementRef;

  @ViewChild('newDetailPipSound', { static: true }) newDetailPipSound: ElementRef;
  @ViewChild('increaseDetailPipSound', { static: true }) increaseDetailPipSound: ElementRef;
  @ViewChild('errorSound', { static: true }) errorSound: ElementRef;
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

    // this.orderForm = this.formBuilder.group({
    //   Object: [],
    //   ObjectName: [],
    //   ObjectPhone: [],
    //   ObjectEmail: [],
    //   ObjectAddress: [],
    //   ObjectIdenfiedNumber: [],
    //   Note: [],
    //   SubNote: [],
    //   Details: this.formBuilder.array([]),
    //   Total: [0],
    // });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    $('html').css({ fontSize: '20px' });
    screenfull.onchange(event => {
      console.log(event);
      setTimeout(() => {
        this.commonService.sidebarService.collapse('menu-sidebar');
        this.commonService.sidebarService.collapse('chat-sidebar');
        // if (this.isFullscreenMode) {
        //   $('html').css({ fontSize: '20px' });
        // } else {
        //   $('html').css({ fontSize: 'initial' });
        // }
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
    // this.actionButtonList = [{
    //   name: 'fullscreen',
    //   status: 'primary',
    //   label: this.commonService.textTransform(this.commonService.translate.instant('Fullscreen'), 'head-title'),
    //   icon: 'external-link-outline',
    //   title: this.commonService.textTransform(this.commonService.translate.instant('Fullscreen'), 'head-title'),
    //   size: 'medium',
    //   disabled: () => {
    //     return false;
    //   },
    //   click: () => {
    //     this.toggleFullscreen();
    //     return false;
    //   },
    // }];


    await this.save(this.orderForm);
    // await this.barcodeProcess('145742024962');
    // await this.barcodeProcess('146537024944');
    return result;
  }

  makeNewOrderForm(data?: CommercePosOrderModel) {
    const newForm = this.formBuilder.group({
      Code: [],
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
    newForm['isProcessing'] = null;
    return newForm;
  }

  makeNewOrderDetail(detail?: CommercePosDetailModel) {
    return this.formBuilder.group({
      Sku: [detail.Sku || null],
      Product: [detail.Product || null],
      Unit: ['n/a'],
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

  async makeNewOrder() {
    if (this.orderForm.get('State').value !== 'APPROVED') {
      this.save(this.orderForm);
    }
    this.orderForm = this.makeNewOrderForm();
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

  async barcodeProcess(inputValue: string) {

    if (inputValue && !/[^\d]/.test(inputValue)) {
      const detailsControls = this.getDetails(this.orderForm).controls
      const systemConfigs = await this.commonService.systemConfigs$.pipe(takeUntil(this.destroy$), filter(f => !!f), take(1)).toPromise().then(settings => settings);
      const coreId = systemConfigs.ROOT_CONFIGS.coreEmbedId;
      const productIdLength = parseInt(inputValue.substring(0, 2)) - 10;
      let accessNumber = inputValue.substring(productIdLength + 2);
      if (accessNumber) {
        accessNumber = '127' + accessNumber;
      }
      let productId = '118' + coreId + inputValue.substring(2, 2 + productIdLength);



      let product = null;
      try {
        // Case 1: Search by access number
        product = await this.apiService.getPromise<any[]>('/admin-product/products/' + productId, {
          select: 'id=>Code,text=>Name,Code,Name,OriginName=>Name,Sku,WarehouseUnit,FeaturePicture,Pictures',
          'includeSearchResultLabel': true,
          'includeUnits': true,
          'includeWarehouseUnit': true,
        }).then(rs => rs[0]);
        if (!product) {
          throw Error('fail');
        }
      } catch (err) {
        // Case 2: Search by product id
        productId = inputValue
        accessNumber = null;
        product = await this.apiService.getPromise<any[]>('/admin-product/products/' + productId, {
          select: 'id=>Code,text=>Name,Code,Name,OriginName=>Name,Sku,WarehouseUnit,FeaturePicture,Pictures',
          'includeSearchResultLabel': true,
          'includeUnits': true,
          'includeWarehouseUnit': true,
        }).then(rs => rs[0]);
      }


      console.log(accessNumber, productId);
      let existsProduct: FormGroup = this.getDetails(this.orderForm).controls.find(f => this.commonService.getObjectId(f.get('Product').value) === productId) as FormGroup;
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
              accessNumbersContorl.setValue([accessNumbersContorl.value, [accessNumber]]);
            }
            // existsProduct.AccessNumbers = [...existsProduct.AccessNumbers];
            this.calculateTotal(this.orderForm);

            this.increaseDetailPipSound.nativeElement.play();
          } else {
            this.errorSound.nativeElement.play();
            this.commonService.toastService.show('Trùng số truy xuất !', 'Commerce POS', { status: 'warning' });
          }
        } else {
          quantityControl.setValue(quantityControl.value + 1);
          this.increaseDetailPipSound.nativeElement.play();
        }
        return existsProduct;
      } else {
        // existsProduct = this.formBuilder.group({
        //   Sku: [productId],
        //   Product: [productId],
        //   Unit: ['CAI'],
        //   Description: [productId],
        //   Quantity: [1],
        //   Price: [0],
        //   ToMoney: [0],
        //   FeaturePicture: [],
        //   AccessNumbers: [accessNumber ? [accessNumber] : []],
        //   Discount: [0],
        // });


        existsProduct = this.makeNewOrderDetail({
          Sku: productId,
          Product: productId,
          Unit: 'n/a',
          Description: productId,
          Quantity: 1,
          Price: 0,
          ToMoney: 0,
          FeaturePicture: [],
          AccessNumbers: accessNumber ? [accessNumber] : null,
          Discount: 0,
        });

        // .then(products => products[0]).then(async product => {
        if (product) {

          if (!product.WarehouseUnit || !this.commonService.getObjectId(product.WarehouseUnit) || this.commonService.getObjectId(product.WarehouseUnit) == 'n/a') {
            this.errorSound.nativeElement.play();
            this.commonService.toastService.show('Sản phẩm chưa cài đặt đơn vị tính !', 'Commerce POS', { status: 'danger' });
            return;
          }

          existsProduct.get('Description').setValue(product.Name);
          existsProduct.get('Sku').setValue(product.Sku);
          existsProduct.get('Unit').setValue(product.WarehouseUnit);
          existsProduct.get('FeaturePicture').setValue(product.FeaturePicture?.Thumbnail);

          return await this.apiService.getPromise<any[]>('/sales/master-price-tables/getProductPriceByUnits', {
            priceTable: 'BGC201031',
            product: productId,
            includeUnit: true
          }).then(prices => prices.find(f => this.commonService.getObjectId(f.Unit) == this.commonService.getObjectId(product.WarehouseUnit))).then(price => {
            if (price) {
              existsProduct.get('Price').setValue(parseFloat(price.Price));
              existsProduct.get('ToMoney').setValue(price.Price * existsProduct.get('Quantity').value);
              this.calculateTotal(this.orderForm);

              detailsControls.unshift(existsProduct);
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
        // }).catch(err => {
        //   this.errorSound.nativeElement.play();
        //   this.commonService.toastService.show('Sản phẩm không tồn tại !', 'Commerce POS', { status: 'danger' });
        //   return false;
        // });

        // this.save(this.orderForm);
        // return detailFormGroup;
      }

    }
  }

  destroyOrder(event: any) {
    this.commonService.showDialog('POS', 'Bạn có muốn hủy phiếu này không ?', [
      {
        label: 'Trở về',
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
        label: 'Xác nhận',
        status: 'danger',
        action: () => {
          // this.order = new OrderModel();
          this.historyOrderIndex = this.historyOrders.findIndex(f => f === this.orderForm);
          if (this.historyOrderIndex > -1) {
            this.historyOrders.splice(this.historyOrderIndex, 1);
            this.makeNewOrder();
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
    } else {
      this.save(this.historyOrders[this.historyOrderIndex]);
      this.orderForm = this.makeNewOrderForm();
      this.historyOrders.push(this.orderForm);
      this.historyOrderIndex = this.historyOrders.length - 1;
      this.save(this.orderForm);
    }
  }

  barcode = '';
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // console.log(event);
    if ("activeElement" in document) {
      if ((document.activeElement as HTMLElement).id == 'posSearchInput') {
        return true;
      }
    }
    this.barcode += event.key;
    this.commonService.takeUntil('barcode-scan', 100).then(() => {
      console.log(this.barcode);
      if (this.barcode && /Enter$/.test(this.barcode)) {
        this.barcodeProcess(this.barcode.replace(/Enter$/, ''));
      }

      this.barcode = '';
    });
  }

  removeDetail(orderForm: FormGroup, index: number) {
    this.getDetails(orderForm).controls.splice(index, 1);
    this.calculateTotal(orderForm);
    this.save(orderForm);
  }

  onQuantityChanged(orderForm: FormGroup, detail: FormGroup, event, numberFormat: CurrencyMaskConfig) {
    // detail.get('Quantity').setValue(1);
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    this.save(orderForm);
    // return super.currencyMastKeydown(event, numberFormat)
  }

  onIncreaseQuantityClick(orderForm: FormGroup, detail: FormGroup) {
    const quantityControl = detail.get('Quantity');
    quantityControl.setValue(quantityControl.value + 1);
    this.calculateToMoney(detail);
    this.calculateTotal(orderForm);
    this.newDetailPipSound.nativeElement.play();
    this.save(orderForm);
  }
  onDecreaseQuantityClick(orderForm: FormGroup, detail: FormGroup) {
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
    this.commonService.openDialog(CommercePosBillPrintComponent, {
      context: {
        skipPreview: true,
        data: [orderForm.getRawValue()],
        onSaveAndClose: (newOrder, printComponent) => {
          // orderForm.get('Code').setValue(newOrder.Code);
          // orderForm['isProcessing'] = false;
          orderForm.patchValue(newOrder);
          // this.historyOrders.push(orderForm);
          this.commonService.toastService.show('Đơn hàng đã hoàn tất, bạn có thể bấm F4 để xem lại', 'Máy bán hàng', { status: 'success', duration: 8000 })
          this.makeNewOrder();
          printComponent.close();
          // setTimeout(() => {
          //   screenfull.request();
          // }, 1000);
          console.log(this.historyOrders);
        },
        onClose: () => {
          // orderForm['isProcessing'] = false;
        }
      }
    });
  }

  async save(orderForm: FormGroup): Promise<CommercePosOrderModel> {
    let order = orderForm.getRawValue();
    if (orderForm && orderForm['isProcessing'] !== true && order.State != 'APPROVED') {
      return this.commonService.takeUntil('commerce-pos-order-save', 500).then(status => {
        if (order.Code) {
          // params['id0'] = order.Code;
          return this.apiService.putPromise('/commerce-pos/orders/' + order.Code, {}, [order]).then(rs => {
            // orderForm.get('Code').setValue(rs[0].Code);
            orderForm.patchValue(rs[0]);
            return rs[0];
          });
        } else {
          orderForm['isProcessing'] = true;
          return this.apiService.postPromise('/commerce-pos/orders', {}, [order]).then(rs => {
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

            resovle(true);
          }
        }
      });
    });
  }
}
