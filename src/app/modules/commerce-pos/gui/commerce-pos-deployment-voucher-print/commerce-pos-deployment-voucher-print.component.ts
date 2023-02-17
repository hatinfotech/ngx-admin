import { ProcessMap } from '../../../../models/process-map.model';
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
import { AppModule } from '../../../../app.module';
import { AdminProductService } from '../../../admin-product/admin-product.service';
import { DeploymentVoucherFormComponent } from '../../../deployment/deployment-voucher/deployment-voucher-form/deployment-voucher-form.component';

@Component({
  selector: 'ngx-commerce-pos-deployment-voucher-print',
  templateUrl: './commerce-pos-deployment-voucher-print.component.html',
  styleUrls: ['./commerce-pos-deployment-voucher-print.component.scss']
})
export class CommercePosDeploymentVoucherPrintComponent extends DataManagerPrintComponent<DeploymentVoucherModel> implements OnInit {

  /** Component name */
  componentName = 'CommercePosDeploymentVoucherPrintComponent';
  title: string = 'Xem trước phiếu triển khai';
  env = environment;
  apiPath = '/deployment/vouchers';
  processMapList: ProcessMap[] = [];
  idKey: ['Code'];
  formDialog = DeploymentVoucherFormComponent;

  registerInfo: any;

  constructor(
    public commonService: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<CommercePosDeploymentVoucherPrintComponent>,
    private datePipe: DatePipe,
    public adminProductService: AdminProductService,
  ) {
    super(commonService, router, apiService, ref);

    this.commonService.systemConfigs$.subscribe(registerInfo => {
      this.registerInfo = registerInfo.LICENSE_INFO.register;
    });

  }

  style = /*css*/`
  #print-area {
    width: initial;
    width: 80mm;
  }
  .bill {
  }
  .bill .bill-title {
    font-weight: bold;
    font-size: 1.2rem !important;
    text-align: center;
  }
  .bill table thead td {
    font-weight: bold;
    border-bottom: 1px dashed #000;
  }
  .bill table tr td {
    border-bottom: 1px dashed #000;
    vertical-align: top;
  }
  .bill .bill-register-info {
    text-align: center;
    line-height: 1rem;
  }
  .bill .bill-info {
    text-align: center;
  }
  .bill .bill-register-logo img {
    width: 50mm;
  }
  .bill .bill-register-name {
  }
  .bill .bill-register-tax-code {
  }
  .bill .bill-register-tel {
  }
  .bill .bill-register-email {
  }
  .bill .bill-register-website {
  }
  .bill .bill-register-address {
  }
  
  .bill-head-info div,
  .bill-footer-info div {
    border-bottom: dashed #000 1px;
  }
  

  @media print {
    body {
      background: #fff !important;
    }
    #print-area {
      page-break-after: initial;
    }
  }

  /** Override */
  #print-area {
    width: initial;
  }
  .bill-mark {
    
  }
  `;

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();

    this.actionButtonList.find(f => f.name == 'close').label = '';
    this.actionButtonList.find(f => f.name == 'print').label = '';

    for (const i in this.data) {
      const data = this.data[i];
      this.processMapList[i] = AppModule.processMaps.deploymentVoucher[data.State || ''];
    }

    this.summaryCalculate(this.data);

    return result;
  }

  renderTitle(data: DeploymentVoucherModel) {
    return `Phieu_Trien_Khai_${this.getIdentified(data).join('-')}` + (data.DateOfPurchase ? ('_' + this.datePipe.transform(data.DateOfPurchase, 'short')) : '');
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

  toMoney(detail: DeploymentVoucherModel) {
    return 0;
  }

  getTotal() {
    let total = 0;
    return total;
  }

  saveAndClose() {
    if (this.onSaveAndClose) {
    }
    this.close();
    return false;
  }

  exportExcel(type: string) {
    this.close();
    return false;
  }

  get identifier() {
    return '';
  }

  async getFormData(ids: string[]) {
    return this.apiService.getPromise<DeploymentVoucherModel[]>(this.apiPath, { 
      id: ids,
      includeContact: true,
      includeDetails: true,
      includeRelativeVouchers: true,
      renderBarCode: true,
      renderMapUrlQrCode: true
    }).then(data => {
      for (const index in data) {
        this.processMapList[index] = AppModule.processMaps.deploymentVoucher[data[index].State || ''];
        this.setDetailsNo(data[index].Details, (detail: DeploymentVoucherDetailModel) => detail.Type !== 'CATEGORY');
      }

      return data;
    });
  }

  getItemDescription(item: DeploymentVoucherModel) {
    return item?.Title;
  }

}
