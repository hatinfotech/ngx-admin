import { ProcessMap } from './../../../../models/process-map.model';
// import { DeploymentModule } from './../../deployment.module';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { DeploymentVoucherModel, DeploymentVoucherDetailModel } from '../../../../models/deployment.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { DeploymentVoucherFormComponent } from '../deployment-voucher-form/deployment-voucher-form.component';
import { AppModule } from '../../../../app.module';

@Component({
  selector: 'ngx-deployment-voucher-print',
  templateUrl: './deployment-voucher-print.component.html',
  styleUrls: ['./deployment-voucher-print.component.scss']
})
export class DeploymentVoucherPrintComponent extends DataManagerPrintComponent<DeploymentVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'DeploymentVoucherPrintComponent';
  title: string = 'Xem trước phiếu báo giá';
  env = environment;
  apiPath = '/deployment/vouchers';
  processMapList: ProcessMap[] = [];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<DeploymentVoucherPrintComponent>,
    private datePipe: DatePipe,
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
    for (const i in this.data) {
      const data = this.data[i];
      data['Total'] = 0;
      data['Title'] = this.renderTitle(data);
      const taxMap = this.commonService.taxList.reduce(function (map, obj) {
        map[obj.Code] = obj;
        return map;
      }, {});
      const unitMap = this.commonService.unitList.reduce(function (map, obj) {
        map[obj.Code] = obj;
        return map;
      }, {});
      for (const detail of data.Details) {
        if (detail.Type === 'PRODUCT') {
          detail.Tax = typeof detail.Tax === 'string' ? taxMap[detail.Tax] : detail.Tax;
          detail.Unit = typeof detail.Unit === 'string' ? unitMap[detail.Unit] : detail.Unit;
          data['Total'] += detail['ToMoney'] = this.toMoney(detail);
        }
      }

      this.processMapList[i] = AppModule.processMaps.deploymentVoucher[data.State || ''];
    }
    return result;
  }

  // getIdentified(data: DeploymentVoucherModel): string[] {
  //   if (this.idKey && this.idKey.length > 0) {
  //     return this.idKey.map(key => data[key]);
  //   } else {
  //     return data['Id'];
  //   }
  // }

  renderTitle(data: DeploymentVoucherModel) {
    return `Phieu_Trien_Khai_${this.getIdentified(data).join('-')}` + (data.Reported ? ('_' + this.datePipe.transform(data.Reported, 'short')) : '');
  }

  close() {
    this.ref.close();
  }

  renderValue(value: any) {
    let html = value;
    if (value && value['text']) {
      html = value['text'];
    }
    return (html && html?.placeholder || html || '').replace(/\n/g, '<br>');
  }

  toMoney(detail: DeploymentVoucherDetailModel) {
    if (detail.Type === 'PRODUCT') {
      let toMoney = detail['Quantity'] * detail['Price'];
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

  getTotal(data: DeploymentVoucherModel) {
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

  saveAndClose(data: DeploymentVoucherModel) {
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

  prepareCopy(data: DeploymentVoucherModel) {
    this.close();
    this.commonService.openDialog(DeploymentVoucherFormComponent, {
      context: {
        inputMode: 'dialog',
        inputId: [data.Code],
        isDuplicate: true,
        onDialogSave: (newData: DeploymentVoucherModel[]) => {
          // if (onDialogSave) onDialogSave(row);
          this.onClose(newData[0]);
        },
        onDialogClose: () => {
          // if (onDialogClose) onDialogClose();
          this.refresh();

        },
      },
    });
  }

  approvedConfirm(data: DeploymentVoucherModel, index: number) {

    if (['COMPLETE'].indexOf(data.State) > -1) {
      this.commonService.showDiaplog(this.commonService.translateText('Common.completed'), this.commonService.translateText('Common.completedAlert', { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
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

    const params = { id: [data.Code] };
    // let confirmText = processMap.confirmText;
    // let responseTitle = processMap.responseTitle;
    // let responseText = processMap.responseTitle;

    // switch (data.State) {
    //   case 'APPROVE':
    //     params['changeState'] = 'DEPLOYMENT';
    //     confirmText = 'Common.implementConfirm';
    //     responseTitle = 'Common.implemented';
    //     responseText = 'Common.implementSuccess';
    //     break;
    //   case 'DEPLOYMENT':
    //     params['changeState'] = 'ACCEPTANCE';
    //     confirmText = 'Common.acceptanceConfirm';
    //     responseTitle = 'Common.acceptanced';
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
    //     responseTitle = 'Common.completed';
    //     responseText = 'Common.completeSuccess';
    //     break;
    //   default:
    //     params['changeState'] = 'APPROVE';
    //     confirmText = 'Common.approvedConfirm';
    //     responseTitle = 'Common.approved';
    //     responseText = 'Common.approvedSuccess';
    //     break;
    // }
    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(this.processMapList[index]?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
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
          params['changeState'] = this.processMapList[index]?.nextState;
          // const params = { id: [data.Code] };
          // switch (data.State) {
          //   case 'APPROVE':
          //     params['changeState'] = 'IMPLEMENT';
          //     break;
          //   case 'IMPLEMENT':
          //     params['changeState'] = 'ACCEPTANCEREQUEST';
          //     break;
          //   case 'ACCEPTANCEREQUEST':
          //     params['changeState'] = 'COMPLETE';
          //     break;
          //   default:
          //     params['changeState'] = 'APPROVE';
          //     break;
          // }
          this.loading = true;
          this.apiService.putPromise<DeploymentVoucherModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
            this.onChange && this.onChange(data);
            this.loading = false;
            this.onClose && this.onClose(data);
            this.close();
            this.commonService.toastService.show(this.commonService.translateText(this.processMapList[index]?.restponseText, { object: this.commonService.translateText('Deployment.Voucher.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), this.commonService.translateText(this.processMapList[index]?.responseTitle), {
              status: 'success',
            });
            // this.commonService.showDiaplog(this.commonService.translateText('Common.approved'), this.commonService.translateText(responseText, { object: this.commonService.translateText('Deployment.Voucher.title', { definition: '', action: '' }) + ': `' + data.Title + '`' }), [
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
    return this.apiService.getPromise<DeploymentVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true }).then(rs => {
      if (rs[0] && rs[0].Details) {
        this.setDetailsNo(rs[0].Details, (detail: DeploymentVoucherModel) => detail.Type === 'PRODUCT');
      }
      return rs;
    });
  }

}
