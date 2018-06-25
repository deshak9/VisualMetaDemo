import {Component} from '@angular/core';
import {UserService} from "./services/user.service";
import {AuthenticationService} from "./services/authentication.service";
import {RouteConstant} from "./shared/constants/route.contants";

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  homeLinke = RouteConstant.HOME;
  constructor(public us: UserService, public authService: AuthenticationService) {
  }
}