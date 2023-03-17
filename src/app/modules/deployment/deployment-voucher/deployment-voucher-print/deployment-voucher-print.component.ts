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
import { AdminProductService } from '../../../admin-product/admin-product.service';

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
  idKey: ['Code'];
  formDialog = DeploymentVoucherFormComponent;

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref: NbDialogRef<DeploymentVoucherPrintComponent>,
    public datePipe: DatePipe,
  ) {
    super(cms, router, apiService, ref);
  }

  ngOnInit() {
    this.restrict();
    super.ngOnInit();
  }

  async init() {
    const result = await super.init();

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
