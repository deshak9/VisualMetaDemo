import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false, millis = null) {
    this.subject.next({type: 'success', text: message});
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.timeOut(millis);
  }

  error(message: string, keepAfterNavigationChange = false, millis = null) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'error', text: message});
    this.timeOut(millis);
  }

  timeOut(millis) {
    if (millis) {
      setTimeout(() => {
        this.subject.next();
      }, millis);
    }
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}