import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AlertService, UserService} from '../../../services';
import {RouteConstant} from "../../constants/route.contants";

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  loginLink = RouteConstant.LOGIN;
  registerSubs: any;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnDestroy(): void {
    this.registerSubs && this.registerSubs.unsubscribe();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.registerSubs = this.userService.register(this.registerForm.value)
      .subscribe(
        res => {

          // If login successful, redirect to home page
          res.success && this.router.navigate([RouteConstant.HOME]);

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
