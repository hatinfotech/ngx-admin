import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../lib/base-component';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { RootServices } from '../../../services/root.services';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent extends BaseComponent implements OnInit {
  componentName: 'GoogleMapComponent';
  titleNowrap = 'Google Map';
  title = 'Google Map';

  width = '100%';
  height = '500px';
  zoom = '';
  center = '';
  options = {
    
  };

  constructor(
    public rsv: RootServices,
    public cms: CommonService,
    public router: Router,
    public apiService: ApiService,
    public ref?: NbDialogRef<BaseComponent>,
  ) { 
    super(rsv, cms, router, apiService, ref);
  }

  ngOnInit(): void {
  }


}
