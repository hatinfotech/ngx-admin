import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment.prod';
import { AppModule } from '../../../../app.module';
import { SmartTableBaseComponent, SmartTableButtonComponent, SmartTableCurrencyComponent, SmartTableTagsComponent } from '../../../../lib/custom-element/smart-table/smart-table.component';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { CashVoucherDetailModel } from '../../../../models/accounting.model';
import { CollaboratorAwardVoucherDetailModel, CollaboratorAwardVoucherModel, CollaboratorCommissionVoucherDetailModel, CollaboratorCommissionVoucherDetailOrderModel, CollaboratorCommissionVoucherModel } from '../../../../models/collaborator.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { DynamicListDialogComponent } from '../../../dialog/dynamic-list-dialog/dynamic-list-dialog.component';
import { CollaboratorCommissionDetailPrintComponent } from '../collaborator-commission-detail-print/collaborator-commission-detail-print.component';

@Component({
  selector: 'ngx-collaborator-commission-print',
  templateUrl: './collaborator-commission-print.component.html',
  styleUrls: ['./collaborator-commission-print.component.scss'],
  providers: [DecimalPipe, CurrencyPipe, DatePipe]
})
export class CollaboratorCommissionPrintComponent extends DataManagerPrintComponent<CollaboratorCommissionVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'CollaboratorCommissionPrintComponent';
  title: string = 'Xem trước phiếu thưởng';
  apiPath = '/collaborator/commission-vouchers';
  env = environment;
  processMapList: ProcessMap[] = [];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CollaboratorCommissionPrintComponent>,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
  ) {
    super(commonService, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    // this.title = `PhieuThu_${this.identifier}` + (this.data.DateOfImplement ? ('_' + this.datePipe.transform(this.data.DateOfImplement, 'short')) : '');

    // for (const i in this.data) {
    //   const data = this.data[i];
    //   data['Title'] = this.renderTitle(data);
    //   for (const detail of data.Details) {
    //     data['Total'] += parseFloat(detail['Amount'] as any);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.commissionVoucher[data.State || ''];
    // }
    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: CollaboratorAwardVoucherModel) {
    return `Phieu_Hoa_Hong_${this.getIdentified(data).join('-')}` + (data.DateOfImplement ? ('_' + this.datePipe.transform(data.DateOfImplement, 'short')) : '');
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

  toMoney(detail: CashVoucherDetailModel) {
    let toMoney = parseInt(detail['Amount'] as any);
    // const tax = detail['Tax'] as any;
    // if (tax) {
    //   toMoney += toMoney * tax.Tax / 100;
    // }
    return toMoney;
  }

  getTotal(data: CollaboratorAwardVoucherModel) {
    let total = 0;
    const details = data.Details;
    for (let i = 0; i < details.length; i++) {
      total += this.toMoney(details[i]);
    }
    return total;
  }

  saveAndClose(data: CollaboratorAwardVoucherModel) {
    if (this.onSaveAndClose) {
      this.onSaveAndClose(data);
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

  approvedConfirm(data: CollaboratorAwardVoucherModel) {
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.commissionVoucher[data.State || ''];
    params['changeState'] = processMap?.nextState;

    this.commonService.showDialog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(processMap?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(data.State == 'APPROVED' ? 'Common.complete' : 'Common.approve'),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<CollaboratorAwardVoucherModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.loading = false;
            this.onChange && this.onChange(data);
            this.onClose && this.onClose(data);
            this.close();
            this.commonService.toastService.show(this.commonService.translateText(processMap?.responseText, { object: this.commonService.translateText('Purchase.PrucaseVoucher.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), this.commonService.translateText(processMap?.responseTitle), {
              status: 'success',
            });
          }).catch(err => {
            this.loading = false;
          });
        },
      },
    ]);
  }

  // stateActionConfirm(data: CollaboratorAwardVoucherModel, nextState: ProcessMap) {
  //   const params = { id: [data.Code] };
  //   const processMap = AppModule.processMaps.commissionVoucher[data.State || ''];
  //   params['changeState'] = nextState.state;

  //   this.commonService.showDiaplog(this.commonService.translateText(nextState.confirmText), this.commonService.translateText(nextState.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), [
  //     {
  //       label: this.commonService.translateText('Common.cancel'),
  //       status: 'primary',
  //       action: () => {

  //       },
  //     },
  //     {
  //       label: this.commonService.translateText(nextState.label),
  //       status: nextState.status,
  //       action: () => {
  //         this.loading = true;
  //         this.apiService.putPromise<CollaboratorAwardVoucherModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
  //           this.loading = false;
  //           this.onChange && this.onChange(data);
  //           this.onClose && this.onClose(data);
  //           this.close();
  //           this.commonService.toastService.show(this.commonService.translateText(processMap?.responseText, { object: this.commonService.translateText('Purchase.PrucaseVoucher.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), this.commonService.translateText(processMap?.responseTitle), {
  //             status: 'success',
  //           });
  //         }).catch(err => {
  //           this.loading = false;
  //         });
  //       },
  //     },
  //   ]);
  // }

  getItemDescription(item: CollaboratorCommissionVoucherModel) {
    return item?.Description;
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<CollaboratorCommissionVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true }).then(data => {
      this.summaryCalculate(data);
      return data;
    });
  }

  previewDetail(detail: CollaboratorCommissionVoucherDetailModel) {
    // this.commonService.openDialog(CollaboratorCommissionDetailPrintComponent, {
    //   context: {
    //     showLoadinng: true,
    //     title: 'Xem trước',
    //     id: typeof ids[0] === 'string' ? ids as any : null,
    //     // data: typeof ids[0] !== 'string' ? ids as any : null,
    //     idKey: ['CommissionVoucher', 'No'],
    //     // approvedConfirm: true,
    //     onClose: (data: CollaboratorCommissionVoucherDetailModel) => {
    //       // this.refresh();
    //     },
    //   },
    // });
    // id = id[0].split('-');
    this.commonService.openDialog(DynamicListDialogComponent, {
      context: {
        inputMode: 'dialog',
        title: 'Chi tiết kết chuyển chiết khấu theo sản phẩm: ' + detail.ProductName,
        apiPath: '/collaborator/commission-voucher-detail-orders',
        idKey: ['CommissionVoucher', 'DetailNo', 'No'],
        params: { eq_CommissionVoucher: detail.CommissionVoucher, eq_DetailNo: detail.No },
        // actionButtonList: [],
        listSettings: {
          // pager: {
          //   display: true,
          //   perPage: 10,
          // },
          actions: false,
          columns: {
            No: {
              title: 'No.',
              type: 'string',
              width: '5%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            Voucher: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.voucher'), 'head-title'),
              type: 'custom',
              renderComponent: SmartTableTagsComponent,
              onComponentInitFunction: (instance: SmartTableTagsComponent) => {
                instance.click.subscribe((voucher: string) => this.commonService.previewVoucher('CLBRTORDER', voucher));
              },
              width: '10%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
              valuePrepareFunction: (cell: string, row: any) => {
                return [{ id: cell, text: cell }] as any;
              },
            },
            Product: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.product'), 'head-title'),
              type: 'string',
              width: '5%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            Description: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.description'), 'head-title'),
              type: 'string',
              width: '40%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            UnitLabel: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Product.unit'), 'head-title'),
              type: 'string',
              width: '5%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            Quantity: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.quantity'), 'head-title'),
              type: 'string',
              width: '5%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            Price: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Common.price'), 'head-title'),
              type: 'custom',
              class: 'align-right',
              width: '10%',
              position: 'right',
              renderComponent: SmartTableCurrencyComponent,
              onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
                // instance.format$.next('medium');
                instance.style = 'text-align: right';
              },
            },
            ToMoney: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Doanh số'), 'head-title'),
              type: 'custom',
              class: 'align-right',
              width: '10%',
              position: 'right',
              renderComponent: SmartTableCurrencyComponent,
              onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
                // instance.format$.next('medium');
                instance.style = 'text-align: right';
              },
              valuePrepareFunction: (cell: string, row: CollaboratorCommissionVoucherDetailOrderModel) => {
                return `${row.Quantity * row.Price}`;
              },
            },
            Strategy: {
              title: this.commonService.textTransform(this.commonService.translate.instant('Chiến dịch'), 'head-title'),
              type: 'string',
              width: '5%',
              filterFunction: (value: string, query: string) => this.commonService.smartFilter(value, query),
            },
            CommissionRatio: {
              title: this.commonService.textTransform(this.commonService.translate.instant('% chiết khấu'), 'head-title'),
              type: 'custom',
              class: 'align-right',
              width: '10%',
              position: 'right',
              renderComponent: SmartTableBaseComponent,
              onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
                instance.style = 'text-align: right';
              },
              valuePrepareFunction: (cell: string, row: CollaboratorCommissionVoucherDetailOrderModel) => {
                return this.decimalPipe.transform(cell) + ' %';
              },
            },
            CommissionAmount: {
              title: this.commonService.textTransform(this.commonService.translate.instant('chiết khấu'), 'head-title'),
              type: 'custom',
              class: 'align-right',
              width: '10%',
              position: 'right',
              renderComponent: SmartTableCurrencyComponent,
              onComponentInitFunction: (instance: SmartTableCurrencyComponent) => {
                // instance.format$.next('medium');
                instance.style = 'text-align: right';
              },
            },
            Preview: {
              title: this.commonService.translateText('Common.show'),
              type: 'custom',
              width: '5%',
              class: 'align-right',
              renderComponent: SmartTableButtonComponent,
              onComponentInitFunction: (instance: SmartTableButtonComponent) => {
                instance.iconPack = 'eva';
                instance.icon = 'external-link-outline';
                instance.display = true;
                instance.status = 'primary';
                instance.style = 'text-align: right';
                instance.class = 'align-right';
                instance.title = this.commonService.translateText('Common.preview');
                instance.valueChange.subscribe(value => {
                  // instance.icon = value ? 'unlock' : 'lock';
                  // instance.status = value === 'REQUEST' ? 'warning' : 'success';
                  // instance.disabled = value !== 'REQUEST';
                });
                instance.click.pipe(takeUntil(this.destroy$)).subscribe((rowData: CollaboratorCommissionVoucherDetailOrderModel) => {
                  this.commonService.previewVoucher('CLBRTORDER', rowData.Voucher);
                });
              },
            }
          }
        }
      },
    });
    return false;
  }

  summaryCalculate(data: CollaboratorCommissionVoucherModel[]) {
    for (const i in data) {
      const item = data[i];
      item['Total'] = 0;
      item['Title'] = this.renderTitle(item);
      for (const detail of item.Details) {
        item['Total'] += detail['Amount'] = parseFloat(detail['Amount'] as any);
      }
      this.processMapList[i] = AppModule.processMaps.commissionVoucher[item.State || ''];
    }
    return data;
  }


}
