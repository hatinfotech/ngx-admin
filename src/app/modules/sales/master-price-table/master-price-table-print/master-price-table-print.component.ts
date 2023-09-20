import { SalesMasterPriceTableModel, SalesMasterPriceTableDetailModel } from './../../../../models/sales.model';
import { CashVoucherModel } from '../../../../models/accounting.model';
import { CashReceiptVoucherFormComponent } from '../../../accounting/cash/receipt/cash-receipt-voucher-form/cash-receipt-voucher-form.component';
// import { SalesModule } from './../../sales.module';
import { Component, Input, OnInit } from '@angular/core';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { SalesVoucherModel, SalesVoucherDetailModel } from '../../../../models/sales.model';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbDialogRef } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { ProcessMap } from '../../../../models/process-map.model';
import { AppModule } from '../../../../app.module';
import { MasterPriceTableFormComponent } from '../master-price-table-form/master-price-table-form.component';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-master-price-table-print',
  templateUrl: './master-price-table-print.component.html',
  styleUrls: ['./master-price-table-print.component.scss'],
})
export class MasterPriceTablePrintComponent extends DataManagerPrintComponent<SalesMasterPriceTableModel> implements OnInit {

  /** Component name */
  componentName = 'MasterPriceTablePrintComponent';
  title: string = '';
  env = environment;
  apiPath = '/sales/master-price-tables';
  processMapList: ProcessMap[] = [];
  idKey = ['Code'];
  formDialog = MasterPriceTableFormComponent;

  @Input('params') params: any;

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<MasterPriceTablePrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(rsv, cms, router, apiService, ref);
  }

  style = /*css*/ `
  .product-image {
    height: 30mm;
  }
  .find-order {
    font-weight: bold;
    font-size: 20mm !important;
    line-height: 20mm;
  }
  
  `;

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    // this.title = `SalesVoucher_${this.identifier}` + (this.data.DateOfSale ? ('_' + this.datePipe.transform(this.data.DateOfSale, 'short')) : '');

    if (this.data && this.data.length > 0) {
      for (const i in this.data) {
        const data = this.data[i];
        // data['Total'] = 0;
        data['Title'] = this.renderTitle(data);
        // for (const detail of data.Details) {
        //   data['Total'] += detail['ToMoney'] = this.toMoney(detail);
        // }
        this.processMapList[i] = AppModule.processMaps.masterPriceTable[data.State || ''];
      }
    }
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: SalesMasterPriceTableModel) {
    return `Bang_Gai_Ban_Ra_${this.getIdentified(data).join('-')}` + (data.DateOfSale ? ('_' + this.datePipe.transform(data.DateOfSale, 'short')) : '');
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any) {
    let html = value;
    if (value && value['text']) {
      html = value['text'];
    }
    try {
      return (html && html?.placeholder || html || '').toString().replace(/\n/g, '<br>');
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  toMoney(detail: SalesMasterPriceTableDetailModel) {
    // if (detail.Type !== 'CATEGORY') {
    //   let toMoney = detail['Quantity'] * detail['Price'];
    //   // detail.Tax = typeof detail.Tax === 'string' ? (this.cms.taxList?.find(f => f.Code === detail.Tax) as any) : detail.Tax;
    //   // if (detail.Tax) {
    //   //   if (typeof detail.Tax.Tax == 'undefined') {
    //   //     throw Error('tax not as tax model');
    //   //   }
    //   //   toMoney += toMoney * detail.Tax.Tax / 100;
    //   // }
    //   return toMoney;
    // }
    return 0;
  }

  getTotal() {
    let total = 0;
    // const details = this.data.Details;
    // for (let i = 0; i < details.length; i++) {
    //   total += this.toMoney(details[i]);
    // }
    // return total;
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

  prepareCopy(data: SalesMasterPriceTableModel) {
    // this.close();
    // this.cms.openDialog(MasterPriceTableFormComponent, {
    //   context: {
    //     inputMode: 'dialog',
    //     inputId: [data.Code],
    //     isDuplicate: true,
    //     onDialogSave: (newData: SalesMasterPriceTableModel[]) => {
    //       // if (onDialogSave) onDialogSave(row);
    //       this.onClose(newData[0]);
    //     },
    //     onDialogClose: () => {
    //       // if (onDialogClose) onDialogClose();
    //       this.refresh();

    //     },
    //   },
    // });
  }

  approvedConfirm(data: SalesMasterPriceTableModel) {
    // if (['COMPLETE'].indexOf(data.State) > -1) {
    //   this.cms.showDiaplog(this.cms.translateText('Common.approved'), this.cms.translateText('Common.completedAlert', { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
    //     {
    //       label: this.cms.translateText('Common.close'),
    //       status: 'success',
    //       action: () => {
    //         this.onClose(data);
    //       },
    //     },
    //   ]);
    //   return;
    // }
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.salesVoucher[data.State || ''];
    params['changeState'] = processMap.nextState;
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
        label: this.cms.translateText(processMap?.nextStateLabel),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<SalesMasterPriceTableModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.cms.toastService.show(this.cms.translateText(processMap?.responseText, { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.cms.translateText(processMap?.responseTitle), {
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

  approvedConfirmX(data: SalesMasterPriceTableModel) {
    if (data.State === 'COMPLETE') {
      this.cms.showDialog(this.cms.translateText('Common.notice'), this.cms.translateText('Common.completedNotice', { resource: this.cms.translateText('Sales.SalesVoucher.title', { action: '', definition: '' }) }), [
        {
          label: this.cms.translateText('Common.ok'),
          status: 'success',
        }
      ]);
      return;
    }
    this.cms.showDialog(this.cms.translateText('Common.confirm'), this.cms.translateText(!data.State ? 'Common.approvedConfirm' : (data.State === 'APPROVE' ? 'Common.completedConfirm' : ''), { object: this.cms.translateText('Sales.SalesVoucher.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.cms.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.cms.translateText(!data.State ? 'Common.approve' : (data.State === 'APPROVED' ? 'Common.complete' : '')),
        status: 'danger',
        action: () => {
          const params = { id: [data.Code] };
          if (!data.State) {
            params['approve'] = true;
          } else if (data.State === 'APPROVED') {
            params['complete'] = true;
          }
          this.apiService.putPromise<SalesMasterPriceTableModel[]>('/sales/sales-vouchers', params, [{ Code: data.Code }]).then(rs => {
            this.cms.showDialog(this.cms.translateText('Common.completed'), this.cms.translateText('Common.completedSuccess', { object: this.cms.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
              {
                label: this.cms.translateText('Common.close'),
                status: 'success',
                action: () => {
                  this.onClose(data);
                  this.close();
                },
              },
            ]);
          }).catch(err => {

          });
        },
      },
    ]);
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<SalesMasterPriceTableModel[]>(this.apiPath, { id: ids }).then(async rs => {

      const extendParams: any = {};
      if (this?.params?.selectedProducts && this.params.selectedProducts.length > 0) {
        extendParams.id = this.params.selectedProducts;
        delete this.params.selectedProducts;
      }
      const details = await this.apiService.getPromise<SalesMasterPriceTableDetailModel[]>('/sales/master-price-table-details', {
        masterPriceTable: 'default',
        includeCategories: true,
        includeGroups: true,
        includeUnit: true,
        includeFeaturePicture: true,
        group_Unit: true,
        includeContainers: true,
        linit: 'nolimit',
        ...this.params,
        ...extendParams
      }).then(details => {

        const newDetails = [];
        const findOrderIds: string[] = [];
        for (const detail of details) {

          if (detail.Containers?.length > 0) {
            for (const container of detail.Containers) {

              const newDetail = detail;
              newDetail.Container = container;
              findOrderIds.push(`${newDetail.Code}-${this.cms.getObjectId(newDetail.Unit)}-${this.cms.getObjectId(newDetail.Container)}`);
              newDetails.push(newDetail);
            }
          } else {
            newDetails.push(detail);
          }
        }

        // const id = details.map(detail => );

        return this.apiService.getPromise<any[]>('/warehouse/find-order-tems', {
          includeWarehouse: true,
          renderBarCode: true,
          masterPriceTable: 'default',
          includeGroups: true,
          includeUnit: true,
          includeFeaturePicture: true,
          group_Unit: true,
          includeContainers: true,
          id: findOrderIds,
          limit: 'nolimit',
        }).then(rs => {
          return newDetails.map(newDetail => {
            const findOrderTemData = rs.find(f => f.Code = newDetail.Code && this.cms.getObjectId(f.Container) == this.cms.getObjectId(newDetail.Container) && this.cms.getObjectId(f.Unit) == this.cms.getObjectId(newDetail.Unit))
            newDetail.FindOrderTem = {
              Code: newDetail.Code,
              Sku: newDetail.Sku,
              Name: newDetail.Name,
              Unit: newDetail.Unit,
              FindOrder: findOrderTemData?.FindOrder,
              Price: newDetail.Price,
              BarCode: findOrderTemData?.BarCode,
            };
            return newDetail;
          })
        });

      });

      // if (rs[0] && rs[0].Details) {
      if (details) {
        for (const priceReport of rs) {
          priceReport.Details = details.map(detail => {
            detail.FindOrders = detail.Containers?.map(container => {

              return container.ContainerFindOrder;
            });
            detail.Shelfs = detail.Containers?.map(container => {
              return `${container.Shelf?.Name || '--'}`;
            })
            return detail;
          });
          this.setDetailsNo(priceReport.Details, (detail: SalesMasterPriceTableDetailModel) => true);
        }
        // for (const detail of rs[0].Details) {
        //   rs[0]['Total'] += detail['ToMoney'] = this.toMoney(detail);
        // }
      }
      this.summaryCalculate(rs);
      return rs;
    });
  }

  getItemDescription(item: SalesMasterPriceTableModel) {
    return item?.Description;
  }

  summaryCalculate(data: SalesMasterPriceTableModel[]) {
    // for (const i in data) {
    //   const item = data[i];
    //   item['Total'] = 0;
    //   item['Title'] = this.renderTitle(item);
    //   for (const detail of item.Details) {
    //     item['Total'] += detail['ToMoney'] = this.toMoney(detail);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.salesVoucher[item.State || ''];
    // }
    return data;
  }

  // receipt(item: SalesVoucherModel) {
  //   this.cms.openDialog(CashReceiptVoucherFormComponent, {
  //     context: {
  //       onDialogSave: (items: CashVoucherModel[]) => {
  //         this.refresh();
  //         this.onChange && this.onChange(item, this);
  //       },
  //       onAfterInit: (formComponent: CashReceiptVoucherFormComponent) => {
  //         formComponent.addRelativeVoucher(item, 'SALES');
  //       },
  //     }
  //   })
  //   return false;
  // }

}
