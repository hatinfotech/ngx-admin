import { SalesMasterPriceTableDetailModel } from './../../../../models/sales.model';
import { ProductUnitConversoinModel, ProductModel } from './../../../../models/product.model';
import { PurchaseOrderVoucherFormComponent } from './../purchase-order-voucher-form/purchase-order-voucher-form.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { AppModule } from '../../../../app.module';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { PurchaseOrderVoucherDetailModel, PurchaseOrderVoucherModel, } from '../../../../models/purchase.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { DialogFormComponent } from '../../../dialog/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { base64 } from '@firebase/util';
import * as XLSX from 'xlsx';
import { runInThisContext } from 'vm';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-purchase-order-voucher-print',
  templateUrl: './purchase-order-voucher-print.component.html',
  styleUrls: ['./purchase-order-voucher-print.component.scss'],
  providers: [CurrencyPipe]
})
export class PurchaseOrderVoucherPrintComponent extends DataManagerPrintComponent<PurchaseOrderVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'PurchaseOrderVoucherPrintComponent';
  title: string = '';
  env = environment;
  apiPath = '/purchase/order-vouchers';
  processMapList: ProcessMap[] = [];
  formDialog = PurchaseOrderVoucherFormComponent;

  showPicture = true;

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<PurchaseOrderVoucherPrintComponent>,
    public datePipe: DatePipe,
    public currencyPipe: CurrencyPipe,
  ) {
    super(cms, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init().then(rs => {
      this.actionButtonList.unshift({
        name: 'showPicture',
        label: 'Hình ảnh',
        title: 'H.Thị hình',
        status: 'info',
        size: 'medium',
        icon: 'eye-outline',
        click: () => {
          this.showPicture = !this.showPicture;
          return true;
        }
      });
      this.actionButtonList.unshift({
        name: 'downloadPdf',
        label: 'PDF',
        title: 'Download PDF',
        status: 'danger',
        size: 'medium',
        icon: 'download-outline',
        click: () => {
          this.downloadPdf(this.id);
          return true;
        }
      });
      this.actionButtonList.unshift({
        name: 'downaloExcel',
        label: 'Excel',
        title: 'Download Excel',
        status: 'primary',
        size: 'medium',
        icon: 'download-outline',
        click: (event, option) => {
          this.downloadExcel(option?.index);
          return true;
        }
      });
      return rs;
    });
    // this.title = `PurchaseVoucher_${this.identifier}` + (this.data.DateOfPurchase ? ('_' + this.datePipe.transform(this.data.DateOfPurchase, 'short')) : '');

    // for (const i in this.data) {
    //   const data = this.data[i];
    //   data['Total'] = 0;
    //   data['Title'] = this.renderTitle(data);
    //   for (const detail of data.Details) {
    //     data['Total'] += detail['ToMoney'] = this.toMoney(detail);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.purchaseOrder[data.State || ''];
    // }
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: PurchaseOrderVoucherModel) {
    return `PhieuDatHangNCC_${this.getIdentified(data).join('-')}` + (data.DateOfPurchase ? ('_' + this.datePipe.transform(data.DateOfPurchase, 'short')) : '');
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any) {
    if (value && value['text']) {
      return value['text'];
    }
    return value;
  }

  toMoney(detail: PurchaseOrderVoucherDetailModel) {
    if (detail.Type === 'PRODUCT') {
      let toMoney = detail['Quantity'] * detail['Price'];
      detail.Tax = typeof detail.Tax === 'string' ? (this.cms.taxList?.find(f => f.Code === detail.Tax) as any) : detail.Tax;
      if (detail.Tax) {
        if (typeof detail.Tax.Tax == 'undefined') {
          throw Error('tax not as tax model');
        }
        toMoney += toMoney * detail.Tax.Tax / 100;
      }
      return toMoney;
    }
    return 0;
  }

  getTotal() {
    let total = 0;
    // const details = this.data.Details;
    // for (let i = 0; i < details.length; i++) {
    //   total += this.toMoney(details[i]);
    // }
    return total;
  }

  saveAndClose() {
    if (this.onSaveAndClose) {
      // this.onSaveAndClose(this.data.Code);
    }
    this.close();
    return false;
  }

  exportExcel(type: string) {
    this.close();
    return false;
  }

  get identifier() {
    // return this.data.Code;
    return '';
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<PurchaseOrderVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true, includeUnit: true, includeRelativeVouchers: true }).then(data => {
      this.summaryCalculate(data);

      for (const item of data) {
        this.setDetailsNo(item.Details, (detail: PurchaseOrderVoucherDetailModel) => detail.Type !== 'CATEGORY');
      }

      return data;
    });
  }



  approvedConfirm(data: PurchaseOrderVoucherModel, index: number) {
    if (['COMPLETE'].indexOf(data.State) > -1) {
      this.cms.showDialog(this.cms.translateText('Common.approved'), this.cms.translateText('Common.completedAlert', { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.cms.translateText('Common.close'),
          status: 'success',
          action: () => {
            this.onClose(data);
          },
        },
      ]);
      return;
    }
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.purchaseVoucher[data.State || ''];
    params['changeState'] = this.processMapList[index]?.nextState;
    // let confirmText = '';
    // let responseText = '';
    // switch (data.State) {
    //   case 'APPROVE':
    //     params['changeState'] = 'COMPLETE';
    //     confirmText = 'Common.completeConfirm';
    //     responseText = 'Common.completeSuccess';
    //     break;
    //   default:
    //     params['changeState'] = 'APPROVE';
    //     confirmText = 'Common.approvedConfirm';
    //     responseText = 'Common.approvedSuccess';
    //     break;
    // }

    this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(processMap?.confirmText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.cms.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.cms.translateText(data.State == 'APPROVED' ? 'Common.complete' : 'Common.approve'),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<PurchaseOrderVoucherModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.cms.toastService.show(this.cms.translateText(processMap?.responseText, { object: this.cms.translateText('Purchase.PrucaseVoucher.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.cms.translateText(processMap?.responseTitle), {
              status: 'success',
            });
            // this.cms.showDiaplog(this.cms.translateText('Common.approved'), this.cms.translateText(responseText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
            //   {
            //     label: this.cms.translateText('Common.close'),
            //     status: 'success',
            //     action: () => {
            //     },
            //   },
            // ]);
          }).catch(err => {
            this.loading = false;
          });
        },
      },
    ]);
  }

  getItemDescription(item: PurchaseOrderVoucherModel) {
    return item?.Title;
  }

  summaryCalculate(data: PurchaseOrderVoucherModel[]) {
    for (const i in data) {
      const item = data[i];
      item['Total'] = 0;
      item['Title'] = this.renderTitle(item);
      for (const detail of item.Details) {

        // Generate barcode
        // detail['SkuBarcode'] = JsBarcode(detail.Product?.Sku, 'text');

        item['Total'] += detail['ToMoney'] = this.toMoney(detail);
      }
      this.processMapList[i] = AppModule.processMaps.purchaseOrder[item.State || ''];
    }
    return data;
  }

  async updateSalePrice(detail: PurchaseOrderVoucherDetailModel) {
    const unitPriceControls: { name: string, label: string, placeholder: string, type: string, initValue: number, focus?: boolean, masterPriceTable?: string, [key: string]: any }[] = await this.apiService.getPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-table-details', {
      masterPriceTable: 'default',
      eq_Code: this.cms.getObjectId(detail?.Product),
      // eq_Unit: this.cms.getObjectId(detail?.Unit) 
      group_Unit: true,
    }).then(rs => {
      // const baseUnit = rs.find(f => f.BaseUnit);
      const detailUnitPrice = rs.find(f => this.cms.getObjectId(f.Unit) == this.cms.getObjectId(detail.Unit));
      const baseCost = detail.Price / detailUnitPrice.ConversionRatio;
      return rs.map(unitPrice => {
        const cost = baseCost * unitPrice.ConversionRatio;
        const sugguestPrice = cost + cost * 0.3;
        return {
          name: this.cms.getObjectId(unitPrice.Unit),
          label: 'Giá thay đổi cho ĐVT: ' + this.cms.getObjectText(unitPrice.Unit) + '............(GV: ' + this.currencyPipe.transform(cost, 'VND') + ' + 30% = ' + this.currencyPipe.transform(sugguestPrice, 'VND') + ')',
          placeholder: 'Giá thay đổi cho ĐVT: ' + this.cms.getObjectText(unitPrice.Unit),
          type: 'currency',
          initValue: unitPrice.Price,
          focus: this.cms.getObjectId(detail.Unit) == this.cms.getObjectId(unitPrice.Unit),
          masterPriceTable: (unitPrice.MasterPriceTable || 'default') as string,
          // cost: cost
          unitPrice,
          cost,
        };
      });
    });

    unitPriceControls.unshift({
      name: 'RegularPriceRatio',
      label: 'Tính giá bán theo % giá vốn',
      placeholder: 'Giá bán = Giá vốn + x%',
      type: 'number',
      initValue: 30,
      focus: false,
      // masterPriceTable: 'default',
      // cost: 0
    });

    this.cms.openDialog(DialogFormComponent, {
      context: {
        width: '500px',
        title: 'Cập nhật giá bán',
        onInit: async (form, dialog) => {
          const regularPriceRatio = form.get('RegularPriceRatio');
          const priceControlMap = {};

          for (const unitPriceControl of unitPriceControls) {
            if (unitPriceControl.name != 'RegularPriceRatio') {
              priceControlMap[unitPriceControl.name] = form.get(unitPriceControl.name);
            }
          }

          regularPriceRatio.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(ratio => {
            for (const unitPriceControl of unitPriceControls) {
              if (unitPriceControl.name != 'RegularPriceRatio') {
                const sugguestPrice = unitPriceControl.cost + unitPriceControl.cost * ratio / 100;
                unitPriceControl.label = 'Giá thay đổi cho ĐVT: ' + this.cms.getObjectText(unitPriceControl.unitPrice.Unit) + '............(GV: ' + this.currencyPipe.transform(unitPriceControl.cost, 'VND') + ' + ' + ratio + '% = ' + this.currencyPipe.transform(sugguestPrice, 'VND') + ')';
              }
            }
          });

          // await this.apiService.getPromise('/sales/master-price-table-details', {
          //   masterPriceTable: 'default',
          //   eq_Code: this.cms.getObjectId(detail?.Product),
          //   // eq_Unit: this.cms.getObjectId(detail?.Unit) 
          // }).then(rs => {
          //   console.log(rs);
          //   price.setValue(rs[0]?.Price);
          //   dialog['CurrentPrice'] = rs[0]?.Price;
          //   dialog['MasterPriceTable'] = rs[0].MasterPriceTable;
          // });
          return true;
        },
        controls: [
          {
            name: 'Description',
            label: 'Mô tả',
            placeholder: 'Mô tả thêm cho việc thay đổi giá bán',
            type: 'text',
            disabled: true,
            initValue: detail.Description,
          },
          // {
          //   name: 'Price',
          //   label: 'Giá thay đổi',
          //   placeholder: 'Giá thay đổi',
          //   type: 'currency',
          //   initValue: 0,
          //   focus: true,
          // },
          ...unitPriceControls,
        ],
        actions: [
          {
            label: 'Esc - Trở về',
            icon: 'back',
            status: 'basic',
            // keyShortcut: 'Escape',
            action: async () => { return true; },
          },
          {
            label: 'Enter - Xác nhận',
            icon: 'generate',
            status: 'success',
            keyShortcut: 'Enter',
            action: async (form, dialog) => {
              const updatePrice = [];
              for (const unitPriceControl of unitPriceControls) {
                if (unitPriceControl.name != 'RegularPriceRatio') {
                  const newPrice = form.get(unitPriceControl.name).value;
                  if (unitPriceControl.initValue != newPrice) {
                    updatePrice.push({
                      MasterPriceTable: unitPriceControl.masterPriceTable,
                      Product: this.cms.getObjectId(detail.Product),
                      Unit: unitPriceControl.name,
                      Price: newPrice
                    });
                  }
                }
              }
              if (updatePrice.length > 0) {
                await this.apiService.putPromise('/sales/master-price-table-details', {}, updatePrice);
              }
              // formDialogConpoent.dismiss();
              return true;
            },
          },
        ],
      },
    });
  }

  downloadPdf(ids: string[]) {
    window.open(this.apiService.buildApiUrl(this.apiPath, { id: ids, includeContact: true, includeDetails: true, includeUnit: true, renderPdf: 'download' }), '__blank');
    // this.apiService.putPromise(this.apiPath, { id: ids, includeContact: true, includeDetails: true, includeUnit: true, renderPdf: 'download' }, [
    //   {
    //     Code: '12200345034',
    //     Html: '<h1>Hoàng Anh Phú Lộc</h1>',
    //   }
    // ]).then(rs => {
    //   console.log(rs);
    //   // window.open(rs[0]['Pdf'], '__blank');

    //   this.saveBlobAsFile('output.pdf', rs[0]['Pdf']);
    // });
  }

  downloadExcel(index: number) {
    // for (const index in ids) {
    const data = this.data[index];
    const details = [];
    let no = 0;
    for (const detail of data.Details) {
      no++;
      details.push({
        STT: no,
        'STT DATA': no,
        'Sku': detail['Product']['Sku'],
        'ProductID': this.cms.getObjectId(detail['Product']),
        'ProductName/Tên Sản Phẩm': detail['Product']['Name'],
        'SupplierSku/Mã SP nội bộ NCC': detail['SupplierSku'],
        'SupplierProductName/Tên SP nội bộ NCC': detail['SupplierProductName'],
        'SupplierProductTaxName/Tên SP theo thuế': detail['ProductTaxName'],
        'SupplierTax/thuế suất %': detail['Tax'],
        'Unit/Mã ĐVT': this.cms.getObjectId(detail['Unit']),
        'UnitName/Tên ĐVT': this.cms.getObjectText(detail['Unit']),
        'Price/Đơn Giá': detail['Price'],
        'Quantity/Số lượng': detail['Quantity'],
        'ToMoney/Thành tiền': detail['ToMoney'],
      });
    }
    const sheet = XLSX.utils.json_to_sheet(details);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Chi tiết đơn đặt mua hàng');
    XLSX.writeFile(workbook, 'DDMH-' + data.Code + ' - ' + data.Title + ' - NCC: ' + this.cms.getObjectId(data.Object) + ' - ' + data.ObjectName + '.xlsx');
  }
  // }

  /**
 * Save a text as file using HTML <a> temporary element and Blob
 * @see https://stackoverflow.com/questions/49988202/macos-webview-download-a-html5-blob-file
 * @param fileName String
 * @param fileContents String JSON String
 * @author Loreto Parisi
*/
  saveBlobAsFile(fileName: string, fileContents: string) {
    if (typeof (Blob) != 'undefined') { // using Blob
      var textFileAsBlob = new Blob([fileContents], { type: 'application/pdf' });
      var downloadLink: any = document.createElement("a");
      downloadLink.download = fileName;
      if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
      }
      else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = document.body.removeChild(event.target as any);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
      }
      downloadLink.click();
    } else {
      var pp = document.createElement('a');
      pp.setAttribute('href', 'data:application/pdf;charset=utf-8,' + encodeURIComponent(fileContents));
      pp.setAttribute('download', fileName);
      pp.onclick = document.body.removeChild(event.target as any);
      pp.click();
    }
  }//saveBlobAsFile

}
