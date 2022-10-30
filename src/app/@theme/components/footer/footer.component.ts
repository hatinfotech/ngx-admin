import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { RegisterInfoModel } from '../../../models/model';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      <b><a href="https://ProBox.one" target="_blank"><span style="position: relative;margin-right: 10px;">ProBox One <div style="position: absolute;top: -4px;right: -6px;font-size: 11px;">®</div></span></a></b> 2017 version {{env.version}} core {{commonService?.loginInfo?.system?.version}} website
      <b><a href="https://ProBox.one" target="_blank"><span style="position: relative;margin-right: 10px;">https://ProBox.one<div style="position: absolute;top: -4px;right: -10px;font-size: 11px;">®</div></span></a></b>
      <ng-container *ngIf="register.domain && register.domain.length > 0">| {{register.domain[0]}}</ng-container>
      <ng-container *ngIf="register.companyName">| {{register.companyName}}</ng-container>
    </span>
    <div class="socials">
      <a href="#" target="_blank" class="ion ion-social-github"></a>
      <a href="#" target="_blank" class="ion ion-social-facebook"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a>
      <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {

  env = environment;
  register: RegisterInfoModel = {};
  constructor(
    private router: Router,
    public commonService: CommonService,
  ) {
    this.commonService.systemConfigs$.subscribe(systemcConfig => {
      if (systemcConfig) {
        this.register = systemcConfig.LICENSE_INFO.register;
      } else {
        this.register = {};
      }
    })
  }

  gotoAbout() {
    this.router.navigate(['/about']);
  }
}
