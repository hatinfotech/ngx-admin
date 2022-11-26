import { SalesPriceReportModel } from './../../../../models/sales.model';
import { CollaboratorOrderModel, CollaboratorOrderDetailModel } from './../../../../models/collaborator.model';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment.prod';
import { AppModule } from '../../../../app.module';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { ProcessMap } from '../../../../models/process-map.model';
import { SalesPriceReportDetailModel } from '../../../../models/sales.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { SalesPriceReportFormComponent } from '../../../sales/price-report/sales-price-report-form/sales-price-report-form.component';
import { CollaboratorService } from '../../collaborator.service';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { CollaboratorOrderTeleCommitPrintComponent } from '../collaborator-order-tele-commit-print/collaborator-order-tele-commit-print.component';
import { CollaboratorOrderFormComponent } from '../collaborator-order-form/collaborator-order-form.component';

@Component({
  selector: 'ngx-collaborator-order-print',
  templateUrl: './collaborator-order-print.component.html',
  styleUrls: ['./collaborator-order-print.component.scss']
})
export class CollaboratorOrderPrintComponent extends DataManagerPrintComponent<CollaboratorOrderModel> implements OnInit {

  /** Component name */
  componentName = 'CollaboratorOrderPrintComponent';
  title: string = 'Xem trước đơn hàng';
  apiPath = '/collaborator/orders';
  env = environment;
  processMapList: ProcessMap[] = [];
  idKey = ['Code'];
  formDialog = CollaboratorOrderFormComponent;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CollaboratorOrderPrintComponent>,
    public collaboratorService: CollaboratorService,
    private datePipe: DatePipe,
    public adminProductService: AdminProductService,
  ) {
    super(commonService, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();
    // this.title = `PhieuBaoGia_${this.identifier}` + (this.data.Reported ? ('_' + this.datePipe.transform(this.data.Reported, 'short')) : '');
    // for (const i in this.data) {
    //   const data = this.data[i];
    //   data['Total'] = 0;
    //   data['Title'] = this.renderTitle(data);
    //   const taxMap = this.commonService.taxList.reduce(function (map, obj) {
    //     map[obj.Code] = obj;
    //     return map;
    //   }, {});
    //   const unitMap = this.commonService.unitList.reduce(function (map, obj) {
    //     map[obj.Code] = obj;
    //     return map;
    //   }, {});
    //   for (const detail of data.Details) {
    //     if (detail.Type !== 'CATEGORT') {
    //       // detail.Tax = typeof detail.Tax === 'string' ? taxMap[detail.Tax] : detail.Tax;
    //       // detail.Unit = typeof detail.Unit === 'string' ? unitMap[detail.Unit] : detail.Unit;
    //       data['Total'] += detail['ToMoney'] = this.toMoney(detail);
    //     }
    //   }
    //   this.processMapList[i] = AppModule.processMaps.collaboratoOrder[data.State || ''];
    // }
    this.summaryCalculate(this.data);
    return result;
  }

  // getIdentified(data: CollaboratorOrderModel): string[] {
  //   if (this.idKey && this.idKey.length > 0) {
  //     return this.idKey.map(key => data[key]);
  //   } else {
  //     return data['Id'];
  //   }
  // }

  renderTitle(data: CollaboratorOrderModel) {
    return `Don_Hang_${this.getIdentified(data).join('-')}` + (data.DateofOrder ? ('_' + this.datePipe.transform(data.DateofOrder, 'short')) : '');
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

  toMoney(detail: CollaboratorOrderDetailModel) {
    if (detail.Type !== 'CATEGORY') {
      let toMoney = detail['Quantity'] * detail['Price'];
      if (detail.Tax) {
        if (typeof detail.Tax?.Tax == 'undefined') {
          throw Error('tax not as tax model');
        }
        toMoney += toMoney * detail.Tax.Tax / 100;
      }
      return toMoney;
    }
    return 0;
  }

  getTotal(data: CollaboratorOrderModel) {
    let total = 0;
    const details = data.Details;
    let no = 1;
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      if (detail.Type === 'PRODUCT') {
        detail['No'] = no++;
      }
      total += this.toMoney(detail);
    }
    return total;
  }

  saveAndClose(data: CollaboratorOrderModel) {
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

  prepareCopy(data: CollaboratorOrderModel) {
    this.close();
    this.commonService.openDialog(SalesPriceReportFormComponent, {
      context: {
        showLoadinng: true,
        inputMode: 'dialog',
        inputId: [data.Code],
        isDuplicate: true,
        onDialogSave: (newData: CollaboratorOrderModel[]) => {
          // if (onDialogSave) onDialogSave(row);
          this.onClose && this.onClose(newData[0]);
          this.onSaveAndClose && this.onSaveAndClose(newData[0]);
        },
        onDialogClose: () => {
          // if (onDialogClose) onDialogClose();
          this.refresh();
        },
      },
    });
  }

  approvedConfirm(data: CollaboratorOrderModel, index: number) {
    if (['COMPLETE'].indexOf(data.State) > -1) {
      this.commonService.showDialog(this.commonService.translateText('Common.completed'), this.commonService.translateText('Common.completedAlert', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
        {
          label: this.commonService.translateText('Common.close'),
          status: 'success',
          action: () => {
            this.onClose(data);
          },
        },
      ]);
      return;
    }
    const params = { id: [this.makeId(data)], page: this.collaboratorService.currentpage$.value };
    // const processMap = SalesModule.processMaps.priceReport[data.State || ''];
    params['changeState'] = this.processMapList[index]?.nextState;
    // let confirmText = '';
    // let responseText = '';
    // switch (data.State) {
    //   case 'APPROVE':
    //     params['changeState'] = 'DEPLOYMENT';
    //     confirmText = 'Common.implementConfirm';
    //     responseText = 'Common.implementSuccess';
    //     break;
    //   case 'DEPLOYMENT':
    //     params['changeState'] = 'ACCEPTANCE';
    //     confirmText = 'Common.acceptanceConfirm';
    //     responseText = 'Common.acceptanceSuccess';
    //     break;
    //   // case 'ACCEPTANCEREQUEST':
    //   //   params['changeState'] = 'ACCEPTANCE';
    //   //   confirmText = 'Common.acceptanceConfirm';
    //   //   responseText = 'Common.acceptanceSuccess';
    //   //   break;
    //   case 'ACCEPTANCE':
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
    this.commonService.showDialog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(this.processMapList[index]?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(this.processMapList[index]?.nextStateLabel),
        status: 'danger',
        action: () => {
          this.loading = true;
          this.apiService.putPromise<CollaboratorOrderModel[]>(this.apiPath, params, [{ Page: data.Page, Code: data.Code }]).then(rs => {
            this.loading = true;
            this.onChange && this.onChange(data);
            this.close();
            this.onClose && this.onClose(data);
            this.commonService.toastService.show(this.commonService.translateText(this.processMapList[index]?.responseText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.commonService.translateText(this.processMapList[index]?.responseTitle), {
              status: 'success',
            });
            // this.commonService.showDiaplog(this.commonService.translateText('Common.approved'), this.commonService.translateText(responseText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
            //   {
            //     label: this.commonService.translateText('Common.close'),
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

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<CollaboratorOrderModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true, includeTax: true, includeUnit: true, includeRelativeVouchers: true }).then(rs => {
      if (rs[0] && rs[0].Details) {
        this.setDetailsNo(rs[0].Details, (detail: SalesPriceReportDetailModel) => detail.Type !== 'CATEGORY');
        // let total = 0;
        for (const detail of rs[0].Details) {
          // const tax = detail.Tax;
          // let toMoney = detail['Quantity'] * detail['Price'];
          // if(tax?.Tax) {
          //   toMoney += (toMoney * tax?.Tax / 100);
          // }
          if (detail.Type !== 'CATEGORY') {
            rs[0]['Total'] += (detail['ToMoney'] = this.toMoney(detail));
          }

          // detail['ToMoney'] = toMoney;
          // total += toMoney;
        }
        // rs[0]['Total'] = total;
      }
      this.summaryCalculate(rs);
      return rs;
    });
  }

  getItemDescription(item: CollaboratorOrderModel) {
    return item?.Title;
  }

  summaryCalculate(data: CollaboratorOrderModel[]) {

    for (const i in data) {
      const datanium = data[i];
      datanium['Total'] = 0;
      datanium['Title'] = this.renderTitle(datanium);
      const taxMap = this.commonService.taxList.reduce(function (map, obj) {
        map[obj.Code] = obj;
        return map;
      }, {});
      const unitMap = this.adminProductService.unitList$.value.reduce(function (map, obj) {
        map[obj.Code] = obj;
        return map;
      }, {});
      for (const detail of datanium.Details) {
        if (detail.Type !== 'CATEGORT') {
          // detail.Tax = typeof detail.Tax === 'string' ? taxMap[detail.Tax] : detail.Tax;
          // detail.Unit = typeof detail.Unit === 'string' ? unitMap[detail.Unit] : detail.Unit;
          datanium['Total'] += detail['ToMoney'] = this.toMoney(detail);
        }
      }
      this.processMapList[i] = AppModule.processMaps.collaboratoOrder[datanium.State || ''];
    }

    // for (const i in data) {
    //   const item = this.data[i];
    //   item['Total'] = 0;
    //   item['Title'] = this.renderTitle(item);
    //   for (const detail of item.Details) {
    //     item['Total'] += detail['Amount'] = parseFloat(detail['Amount'] as any);
    //   }
    //   this.processMapList[i] = AppModule.processMaps.cashVoucher[item.State || ''];
    // }
    return data;
  }

  openRelativeVoucher(relativeVocher: any) {
    if (relativeVocher) {
      if (relativeVocher.type == 'PRICEREPORT') {
        this.commonService.openDialog(CollaboratorOrderTeleCommitPrintComponent, {
          context: {
            showLoadinng: true,
            title: 'Xem trước',
            id: [this.commonService.getObjectId(relativeVocher)],
            inputMode: 'dialog',
            mode: 'print',
            // inputId: [this.commonService.getObjectId(relativeVocher)],
            // data: data,
            idKey: ['Code'],
            // approvedConfirm: true,
            sourceOfDialog: 'any',
            onClose: (data: SalesPriceReportModel) => {
              // onClose && onClose(data);
            },
          },
        });
      } else {
        this.commonService.previewVoucher(relativeVocher.type, relativeVocher);
      }
    }
    return false;
  }

}
