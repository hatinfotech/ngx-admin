import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';


export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  // constructor(private commonService: CommonService) {}

  private handlers: { [key: string]: DetachedRouteHandle } = {};
  private takeUltilCount = 0;
  private takeUltilPastCount = 0;

  /**
   * Determines if this route (and its subtree) should be detached to be reused later
   * @param route
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {

    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return false;
    }
    /** Whether this route should be re used or not */
    let shouldReuse = false;
    // console.info('[shouldDetach] checking if this route should be re used or not: ' + this.getUrl(route));
    if (route.routeConfig.data) {
      route.routeConfig.data.reuse ? shouldReuse = true : shouldReuse = false;
    }

    return shouldReuse;
  }

  /**
   * Stores the detached route.
   */
  store(route: ActivatedRouteSnapshot, handler: DetachedRouteHandle): void {
    // console.info('[store] storing handler');
    if (handler) {
      this.handlers[this.getUrl(route)] = handler;
      // console.info('[store] Store handler : ', handler);
    }
  }

  /**
   * Determines if this route (and its subtree) should be reattached
   * @param route Stores the detached route.
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // console.info('[shouldAttach] checking if it should be re attached : ' + this.handlers[this.getUrl(route)]);
    return !!this.handlers[this.getUrl(route)];
  }

  /**
   * Retrieves the previously stored route
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return null;
    }

    // console.info('[retrieve] ' + this.getUrl(route));
    const url = this.getUrl(route);
    const handler = this.handlers[url];
    if (handler) {
      const component = handler['componentRef']['_component'];
      if (component && component['onResume']) {
        // if (!this.takeUltilCount) this.takeUltilCount = 0;
        this.takeUltilCount++;
        ((takeCount) => {
          setTimeout(() => {
            this.takeUltilPastCount = takeCount;
          }, 300);
        })(this.takeUltilCount);
        setTimeout(() => {
          if (this.takeUltilPastCount === this.takeUltilCount) {
            component['onResume']();
          }
        }, 300);
      }
    }
    return handler;
  }

  /**
   * Determines if a route should be reused
   * @param future
   * @param current
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    /** We only want to reuse the route if the data of the route config contains a reuse true boolean */
    let reUseUrl = false;

    if (future.routeConfig) {
      if (future.routeConfig.data) {
        reUseUrl = future.routeConfig.data.reuse;
        // console.info('[shouldReuseRoute] should reuse route : ' + future.routeConfig);
      }
    }

    /**
     * Default reuse strategy by angular assers based on the following condition
     * @see https://github.com/angular/angular/blob/4.4.6/packages/router/src/route_reuse_strategy.ts#L67
     */
    // const defaultReuse = (future.routeConfig === current.routeConfig);

    // If either of our reuseUrl and default Url are true, we want to reuse the route
    //
    return reUseUrl; // || defaultReuse;
  }

  /**
   * Returns a url for the current route
   * @param route
   */
  getUrl(route: ActivatedRouteSnapshot): string {
    /** The url we are going to return */
    if (route.routeConfig) {
      // const url = route.routeConfig.path;
      // console.info('[getUrl] returning url', url);

      const fullPath = '/' + route.pathFromRoot.filter(v => v.routeConfig && v.routeConfig.path).map(v => v.routeConfig.path ? v.routeConfig.path : '').join('/');
      // console.info('[getUrl] ' + fullPath);
      return fullPath;
    }
  }
}
