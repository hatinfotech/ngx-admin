import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { BaseComponent } from '../../../../lib/base-component';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { RootServices } from '../../../../services/root.services';

@Component({
  selector: 'ngx-relative-voucher',
  templateUrl: './relative-voucher.component.html',
  styleUrls: ['./relative-voucher.component.scss']
})
export class RelativeVoucherComponent extends BaseComponent implements OnInit {

  componentName = 'RelativeVoucherComponent';

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<RelativeVoucherComponent>,
  ) {
    super(rsv, cms, router, apiService, ref);
  }

  ngOnInit(): void {
  }

}
