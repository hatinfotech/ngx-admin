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
  toMoneyCurencyFormat: CurrencyMaskConfig = { ...this.commonService.getCurrencyMaskConfig(), precision: 0 };

  order: OrderModel = new OrderModel;

  systemConfigs: SystemConfigModel;
  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<CommercePosGuiComponent>,
  ) {
    super(commonService, router, apiService, ref);

    this.commonService.systemConfigs$.pipe(takeUntil(this.destroy$)).subscribe(settings => {
      this.systemConfigs = settings;
    });
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
    screenfull.onchange(event => {
      console.log(event);
      setTimeout(() => {
        if (this.isFullscreenMode) {
          this.commonService.sidebarService.collapse('menu-sidebar');
          this.commonService.sidebarService.collapse('chat-sidebar');
        } else {
          this.commonService.sidebarService.expand('menu-sidebar');
        }
      }, 300);
    });
  }

  async init() {
    const result = await super.init();
    this.actionButtonList = [{
      name: 'fullscreen',
      status: 'primary',
      label: this.commonService.textTransform(this.commonService.translate.instant('Fullscreen'), 'head-title'),
      icon: 'external-link-outline',
      title: this.commonService.textTransform(this.commonService.translate.instant('Fullscreen'), 'head-title'),
      size: 'medium',
      disabled: () => {
        return false;
      },
      click: () => {
        this.toggleFullscreen();
        return false;
      },
    }];
    return result;
  }

  toggleFullscreen() {
    // const commercePosGuiEle = this.commercePosGui.nativeElement;
    if (!this.isFullscreenMode) {
      this.commonService.layout$.next('full-screen');
      screenfull.request();
    } else {
      this.commonService.layout$.next('one-column');
      screenfull.exit();
    }
  }

  ngAfterViewInit() {

  }

  calculateTotal() {
    let total = 0;
    for (const detail of this.order.Details) {
      total += detail.Price * detail.Quantity;
    }

    this.order.Total = total;

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

  barcodeProcess(inputValue: string) {

    if (inputValue && !/[^\d]/.test(inputValue)) {
      const coreId = this.systemConfigs.ROOT_CONFIGS.coreEmbedId;
      const productIdLength = parseInt(inputValue.substring(0, 2)) - 10;
      let accessNumber = inputValue.substring(productIdLength + 2);
      if (accessNumber) {
        accessNumber = '127' + accessNumber;
      }
      let productId = '118' + coreId + inputValue.substring(2, 2 + productIdLength);

      console.log(accessNumber, productId);
      let existsProduct: any = this.order.Details.find(f => f.Product === productId);
      if (existsProduct) {
        if (!existsProduct.AccessNumbers.find(f => f == accessNumber)) {
          existsProduct.Quantity++;
          existsProduct['ToMoney'] = existsProduct.Quantity * existsProduct.Price;
          existsProduct.AccessNumbers.push(accessNumber);
          existsProduct.AccessNumbers = [...existsProduct.AccessNumbers];
          this.calculateTotal();

          this.increaseDetailPipSound.nativeElement.play();
        } else {
          this.errorSound.nativeElement.play();
          this.commonService.toastService.show('Trùng số truy xuất !', 'Commerce POS', { status: 'warning' });
        }
      } else {
        existsProduct = {
          Sku: productId,
          Product: productId,
          Unit: 'CAI',
          Description: productId,
          Quantity: 1,
          Price: 0,
          ToMoney: 0,
          FeaturePicture: '',
          AccessNumbers: accessNumber ? [accessNumber] : [],
        }
        this.order.Details.unshift(existsProduct);

        this.apiService.getPromise<any[]>('/admin-product/products/' + productId, {
          select: 'id=>Code,text=>Name,Code,Name,OriginName=>Name,Sku,WarehouseUnit,FeaturePicture,Pictures',
          'includeSearchResultLabel': true,
          'includeUnits': true,
        }).then(products => products[0]).then(product => {
          if (product) {

            if(!product.WarehouseUnit || !this.commonService.getObjectId(product.WarehouseUnit) || this.commonService.getObjectId(product.WarehouseUnit) == 'n/a') {
              this.errorSound.nativeElement.play();
              this.commonService.toastService.show('Sản phẩm chưa cài đặt đơn vị tính !', 'Commerce POS', { status: 'danger' });
              return;
            }

            existsProduct.Description = product.Name;
            existsProduct.Sku = product.Name;
            existsProduct.Unit = product.WarehouseUnit;
            existsProduct.FeaturePicture = product.FeaturePicture?.Thumbnail;

            this.apiService.getPromise<any[]>('/sales/master-price-tables/getProductPriceByUnits', {
              priceTable: 'BGC201031',
              product: productId,
              includeUnit: true
            }).then(prices => prices.find(f => this.commonService.getObjectId(f.Unit) == this.commonService.getObjectId(product.WarehouseUnit))).then(price => {
              if (price) {
                existsProduct.Price = price.Price;
                existsProduct.ToMoney = price.Price * existsProduct.Quantity;
                this.calculateTotal();
                this.newDetailPipSound.nativeElement.play();
              } else {
                this.commonService.toastService.show('Sản phẩm chưa có giá bán !', 'Commerce POS', { status: 'danger' });
              }
            }).catch(err => {
              this.commonService.toastService.show('Sản phẩm chưa có giá bán !', 'Commerce POS', { status: 'danger' });
              // this.order.Details = this.order.Details.filter(f => this.commonService.getObjectId(f.Product) !== this.commonService.getObjectId(existsProduct.Product))
              this.errorSound.nativeElement.play();
            });
          } else {
            this.errorSound.nativeElement.play();
            this.commonService.toastService.show('Sản phẩm không tồn tại !', 'Commerce POS', { status: 'danger' });
          }
        }).catch(err => {
          this.errorSound.nativeElement.play();
          this.commonService.toastService.show('Sản phẩm không tồn tại !', 'Commerce POS', { status: 'danger' });
          // this.order.Details = this.order.Details.filter(f => this.commonService.getObjectId(f.Product) !== this.commonService.getObjectId(existsProduct.Product))
        });
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
          this.order = new OrderModel();
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

  removeDetail(index: number) {
    this.order.Details.splice(index, 1);
  }

}
