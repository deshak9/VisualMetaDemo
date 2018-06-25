import {NgModule} from '@angular/core';

import {AlertComponent} from './directives/alert/alert.component';
import {LoginComponent} from './components/login';
import {RegisterComponent} from './components/register/register.component';
import {TimeagoPipe} from "./pipes/timeago.pipe";
import {JwtInterceptor} from "./helpers/jwt.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor} from "./helpers/error.interceptor";
import {AuthGuard} from "./guards/auth.guard";
import {AlertService} from "./services/alert.service";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {routing} from "../app.routing";
import {RouterModule} from "@angular/router";
import {fakeBackendProvider} from "./helpers/fake-backend";

const components = [AlertComponent,
  LoginComponent,
  RegisterComponent,
  TimeagoPipe
];

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    routing,
    HttpClientModule,
    RouterModule,
  ],
  declarations: components,
  exports: components,

  providers: [
    AuthGuard,
    AlertService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    // provider used to create fake backend
    // Comment below like to make api call to backend
    fakeBackendProvider
  ]
})

export class SharedModule {
}