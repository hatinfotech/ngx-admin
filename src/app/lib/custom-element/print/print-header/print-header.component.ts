import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'ngx-print-header',
  templateUrl: './print-header.component.html',
  styleUrls: ['./print-header.component.scss']
})
export class PrintHeaderComponent implements OnInit {

  env = environment;
  registerInfo: any = {
    voucherInfo: this.cms.translateText('Information.Voucher.register'),
    voucherLogo: environment.register.logo.voucher,
    voucherLogoHeight: 60,
  };

  constructor(
    public cms: CommonService,
  ) {
    this.cms.systemConfigs$.subscribe(settings => {
      if (settings.LICENSE_INFO && settings.LICENSE_INFO.register && settings.LICENSE_INFO.register) {
        this.registerInfo.voucherInfo = settings.LICENSE_INFO.register.voucherInfo.replace(/\\n/g, '<br>');
        this.registerInfo.voucherLogo = settings.LICENSE_INFO.register.voucherLogo;
        this.registerInfo.voucherLogoHeight = settings.LICENSE_INFO.register.voucherLogoHeight;
      }
    });
  }

  ngOnInit() {
  }

}
