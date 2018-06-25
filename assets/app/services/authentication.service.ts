import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first, map} from "rxjs/internal/operators";
import {Router} from "@angular/router";
import {RouteConstant} from "../shared/constants/route.contants";

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {
  }

  login(username: string, password: string) {
    return this.http.post<any>(`api/login`, {username: username, password: password})
      .pipe(map(res => {
        if (res.success) {
          // login successful
          // store user details in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(res.response));
        }

        return res;
      }));
  }

  logout() {
    this.http.post<any>(`api/logout`, {})
      .subscribe(res => {
      });

    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');

    // Navigate to login page
    this.router.navigate([RouteConstant.LOGIN])
  }
}