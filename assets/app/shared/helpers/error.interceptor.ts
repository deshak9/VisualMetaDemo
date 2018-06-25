import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthenticationService} from '../../services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  /**
   * All HTTP request will be intercepted by this and check if we got 401 error
   * If so, we will redirect to logout, which will then call login
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      const error = err.error.message || err.statusText;
      if (err.status === 401) {

        // auto logout if 401 response returned from api
        this.authenticationService.logout();
      } else {
        return throwError(error);
      }

      // Return normal observable as we have moved to login page to avoid error screen
      return of(error)
    }))
  }
}