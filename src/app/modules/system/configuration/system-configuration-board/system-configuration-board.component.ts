import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../lib/base-component';
import { CommonService } from '../../../../services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'ngx-system-configuration-board',
  templateUrl: './system-configuration-board.component.html',
  styleUrls: ['./system-configuration-board.component.scss'],
})
export class SystemConfigurationBoardComponent extends BaseComponent implements OnInit {
  componentName = 'SystemConfigurationBoardComponent';

  constructor(
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
  ) {
    super(cms, router, apiService);
   }

  ngOnInit() {
  }

}
