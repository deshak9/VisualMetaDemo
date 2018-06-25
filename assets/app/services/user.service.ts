import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from '../shared/models';
import {map} from "rxjs/internal/operators";

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  register(user: User) {
    return this.http.post<any>(`api/register`, user)
      .pipe(map(res => {
        // login successful if there's a jwt token in the response
        if (res.success) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(res.response));
        }

        return res;
      }));
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'))
  }

  isLoggedIn() {
    return localStorage.getItem('currentUser') && true;
  }
}