import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment.prod';
import { AppModule } from '../../../../app.module';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { CashVoucherDetailModel } from '../../../../models/accounting.model';
import { CollaboratorAwardVoucherDetailModel, CollaboratorAwardVoucherModel, CollaboratorCommissionVoucherDetailModel, CollaboratorCommissionVoucherModel } from '../../../../models/collaborator.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { CollaboratorCommissionDetailPrintComponent } from '../collaborator-commission-detail-print/collaborator-commission-detail-print.component';

@Component({
  selector: 'ngx-collaborator-commission-print',
  templateUrl: './collaborator-commission-print.component.html',
  styleUrls: ['./collaborator-commission-print.component.scss']
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

    for (const i in this.data) {
      const data = this.data[i];
      data['Title'] = this.renderTitle(data);
      for (const detail of data.Details) {
        data['Total'] += parseFloat(detail['Amount'] as any);
      }
      this.processMapList[i] = AppModule.processMaps.commissionVoucher[data.State || ''];
    }

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

    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(processMap?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(data.State == 'APPROVE' ? 'Common.complete' : 'Common.approve'),
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

  stateActionConfirm(data: CollaboratorAwardVoucherModel, nextState: ProcessMap) {
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.commissionVoucher[data.State || ''];
    params['changeState'] = nextState.state;

    this.commonService.showDiaplog(this.commonService.translateText(nextState.confirmText), this.commonService.translateText(nextState.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), [
      {
        label: this.commonService.translateText('Common.cancel'),
        status: 'primary',
        action: () => {

        },
      },
      {
        label: this.commonService.translateText(nextState.label),
        status: nextState.status,
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

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<CollaboratorCommissionVoucherModel[]>(this.apiPath, { id: ids, includeContact: true, includeDetails: true });
  }

  previewDetail(ids: any[]) {
    this.commonService.openDialog(CollaboratorCommissionDetailPrintComponent, {
      context: {
        showLoadinng: true,
        title: 'Xem trước',
        id: typeof ids[0] === 'string' ? ids as any : null,
        // data: typeof ids[0] !== 'string' ? ids as any : null,
        idKey: ['AwardVoucher', 'No'],
        // approvedConfirm: true,
        onClose: (data: CollaboratorCommissionVoucherDetailModel) => {
          // this.refresh();
        },
      },
    });
    return false;
  }


}
