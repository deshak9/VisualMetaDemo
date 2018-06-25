import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {RouteConstant} from "../constants/route.contants";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  /**
   * Every HTTP call will be intercepted
   * If user is not logged in it will redirect all routes to Login page
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('currentUser')) {
      // User is logged in, so return true, routing can continue
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate([RouteConstant.LOGIN], {queryParams: {returnUrl: state.url}});
    return false;
  }
}