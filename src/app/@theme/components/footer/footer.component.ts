import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      <b><a href="https://namsoftware.com" target="_blank"><span style="position: relative;margin-right: 10px;">Mini-ERP <div style="position: absolute;top: -4px;right: -6px;font-size: 11px;">®</div></span></a></b> 2019 create by
      <b><a href="https://namsoftware.com" target="_blank"><span style="position: relative;margin-right: 10px;">NaM software <div style="position: absolute;top: -4px;right: -10px;font-size: 11px;">®</div></span></a></b>
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
  constructor(
    private router: Router,
  ) { }

  gotoAbout() {
    this.router.navigate(['/about']);
  }
}
