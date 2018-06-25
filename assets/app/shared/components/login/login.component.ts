import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AlertService, AuthenticationService} from '../../../services';
import {RouteConstant} from "../../constants/route.contants";

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  registerLink = RouteConstant.REGISTER;
  loginSubs: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Logout user if already logged in
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy(): void {
    this.loginSubs && this.loginSubs.unsubscribe();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.loginSubs = this.authenticationService.login(this.f.username.value, this.f.password.value)
      .subscribe(
        res => {

          // If login successful, redirect to return URL
          res.success && this.router.navigate([this.returnUrl]);

          // If failed display error
          res.error && this.alertService.error(res.description, false, 3000);
          this.loading = false;
        },
        error => {
          this.alertService.error(error, false, 3000);
          this.loading = false;
        });
  }
}
