import {Component, OnInit} from '@angular/core';
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../DTOs/breadCrumbs/breadCrumbsResponse";
import {AuthenticationService} from "../../../Services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginUserDTO} from "../../../DTOs/Account/LoginUserDTO";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {CurrentUser} from "../../../DTOs/Account/CurrentUser";
import {CookieService} from "ngx-cookie-service";
import {authenticationCookieName} from "../../../Utilities/CookieTools";

declare function inputJs(): any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "ورود",
    urls: [
      new UrlOfBreadCrumbs('ورود به سایت', '/Login')
    ]
  };

  public loginForm: any;
  public errorText: string = '';
  public failedCounter: number = 1;
  public sniper: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService) {
  }


  ngOnInit(): void {

    this.loginForm = new FormGroup({
      email: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.email
        ]
      ),
      password: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ),
    });


    inputJs();
  }

  submitLoginForm() {
    if (this.loginForm.valid) {

      this.sniper = true;

      const loginData = new LoginUserDTO(
        this.loginForm.controls.email.value,
        this.loginForm.controls.password.value,
      );

      this.authenticationService.loginUser(loginData).subscribe(res => {

          this.sniper = false;

          if (res.status === 'Error') {

            if (this.errorText !== null && this.errorText == res.data.message) {
              this.failedCounter++;
            }
            this.errorText = res.data.message;

          } else {

            this.loginForm.reset();

            this.cookieService.set(
              authenticationCookieName,
              res.data.token,
              res.data.expireTime,
              '',
              undefined,
              true
            );

            const currentUser = new CurrentUser(
              res.data.userId,
              res.data.firstName,
              res.data.lastName
            );

            this.authenticationService.setCurrentUser(currentUser);


            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            });

            Toast.fire({
              icon: 'success',
              title: 'ورود موفقیت آمیز بود.'
            });


            if (this.activatedRoute.snapshot.queryParams['redirect'] != null) {
              this.router.navigate([this.activatedRoute.snapshot.queryParams['redirect']]);
            } else {
              this.router.navigate(['']);
            }
          }
        }
      );
    }
  }

}
