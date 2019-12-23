import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
import { CommonService } from './common.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: NbAuthService,
    private router: Router,
    private commonService: CommonService,
    private apiService: ApiService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isAuthenticatedOrRefresh()
      .pipe(
        tap(authenticated => {
          const fullPath = '/' + route.pathFromRoot.filter(v => v.routeConfig && v.routeConfig.path).map(v => v.routeConfig.path ? v.routeConfig.path : '').join('/');
          if (!authenticated) {
            this.commonService.setPreviousUrl(fullPath);
            this.router.navigate(['auth/login']);
          } else {
            // if (route && route.component && route.component['name']) {
            if (route && route.component && fullPath) {
            this.commonService.checkPermission(fullPath, 'VIEW', result => {
                if (!result) {
                  // this.commonService.showDiaplog('Permission deny !!!', 'Bạn chưa được phân quyền vào chức năng này !', [
                  //   {
                  //     label: 'Trở về',
                  //     status: 'info',
                  //     action: () => {
                  //       // this.router.navigate(['/']);
                  //       // this.commonService.goback();
                  //     },
                  //   },
                  // ]);
                  this.commonService.gotoNotification({
                    title: 'Quyền truy cập',
                    content: 'Bạn không có quyền trên chức năng vừa truy cập !',
                    actions: [
                      {
                        label: 'OK', status: 'success', action: () => {
                            this.router.navigate(['/']);
                        },
                      },
                    ],
                  });
                }
              });
            }
          }
        }),
      );
    // return this.authService.isAuthenticated();
  }

}
