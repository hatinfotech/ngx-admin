import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { environment } from '../../../../../environments/environment.prod';
import { AppModule } from '../../../../app.module';
import { DataManagerPrintComponent } from '../../../../lib/data-manager/data-manager-print.component';
import { CashVoucherDetailModel } from '../../../../models/accounting.model';
import { CollaboratorAwardVoucherDetailModel } from '../../../../models/collaborator.model';
import { ProcessMap } from '../../../../models/process-map.model';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-collaborator-award-detail-print',
  templateUrl: './collaborator-award-detail-print.component.html',
  styleUrls: ['./collaborator-award-detail-print.component.scss']
})
export class CollaboratorAwardDetailPrintComponent extends DataManagerPrintComponent<CollaboratorAwardVoucherDetailModel> implements OnInit {

  /** Component name */
  componentName = 'CollaboratorAwardDetailPrintComponent';
  title: string = 'Xem trước chi tiết phiếu thưởng';
  apiPath = '/collaborator/award-voucher-details';
  idKey = ['AwardVoucher', 'No'];
  env = environment;
  processMapList: ProcessMap[] = [];

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CollaboratorAwardDetailPrintComponent>,
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
      this.processMapList[i] = AppModule.processMaps.awardVoucher[data.State || ''];
    }

    return result;
  }

  renderTitle(data: CollaboratorAwardVoucherDetailModel) {
    return `Chi_Tiet_Thuong_${this.getIdentified(data).join('-')}` + (data.DateOfImplement ? ('_' + this.datePipe.transform(data.DateOfImplement, 'short')) : '');
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
    return toMoney;
  }

  getTotal(data: CollaboratorAwardVoucherDetailModel) {
    let total = 0;
    const details = data.Details;
    for (let i = 0; i < details.length; i++) {
      total += this.toMoney(details[i]);
    }
    return total;
  }

  saveAndClose(data: CollaboratorAwardVoucherDetailModel) {
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

  approvedConfirm(data: CollaboratorAwardVoucherDetailModel) {
    const params = { id: [data.Code] };
    const processMap = AppModule.processMaps.awardVoucher[data.State || ''];
    params['changeState'] = processMap?.nextState;

    this.commonService.showDiaplog(this.commonService.translateText('Common.confirm'), this.commonService.translateText(processMap?.confirmText, { object: this.commonService.translateText('Sales.PriceReport.title', { definition: '', action: '' }) + ': `' + data.Description + '`' }), [
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
          this.apiService.putPromise<CollaboratorAwardVoucherDetailModel[]>(this.apiPath, params, [{ Code: data.Code }]).then(rs => {
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
    return this.apiService.getPromise<CollaboratorAwardVoucherDetailModel[]>(this.apiPath, { id: ids, includeContact: true, includeDirectOrders: true, includeRefOrders: true});
  }


}
