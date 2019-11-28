import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: NbAuthService,
    private router: Router,
    private commonService: CommonService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            const fullPath = '/' + route.pathFromRoot.filter(v => v.routeConfig && v.routeConfig.path).map(v => v.routeConfig.path ? v.routeConfig.path : '').join('/');
            this.commonService.setPreviousUrl(fullPath);
            this.router.navigate(['auth/login']);
          } else {
            if (route && route.component && route.component['name']) {
              this.commonService.checkPermission(route.component['name'], 'VIEW', result => {
                if (!result) {
                  this.commonService.showDiaplog('Permission deny !!!', 'Bạn chưa được phân quyền vào chức năng này !', [
                    {
                      label: 'Trở về',
                      status: 'info',
                      action: () => { },
                    },
                  ]);
                  this.router.navigate(['/']);
                }
              });
            }
          }
        }),
      );
    // return this.authService.isAuthenticated();
  }

}
