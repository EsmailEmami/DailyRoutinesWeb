import {Component, OnInit} from '@angular/core';
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../DTOs/breadCrumbs/breadCrumbsResponse";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RegisterUserDTO} from "../../../DTOs/Account/RegisterUserDTO";
import {AuthenticationService} from "../../../Services/authentication.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

declare function inputJs(): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "ثبت نام",
    urls: [
      new UrlOfBreadCrumbs('ثبت نام در سایت', '/Register')
    ]
  };


  public registerForm: any;
  public errorText: string = '';
  public failedCounter: number = 1;
  public sniper: boolean = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ),
      lastName: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ),
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
      confirmPassword: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ),
    });


    inputJs();
  }

  submitRegisterForm() {
    if (this.registerForm.valid) {
      this.sniper = true;


      const registerData = new RegisterUserDTO(
        this.registerForm.controls.firstName.value,
        this.registerForm.controls.lastName.value,
        this.registerForm.controls.email.value,
        this.registerForm.controls.password.value,
        this.registerForm.controls.confirmPassword.value
      );

      this.authenticationService.registerUser(registerData).subscribe(res => {

        this.sniper = false;

          if (res.status === 'Error') {
            this.sniper = false;

            if (this.errorText !== null && this.errorText == res.data.message) {
              this.failedCounter++;
            }
            this.errorText = res.data.message;
          } else {

            this.registerForm.reset();

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
              title: 'ثبت نام موفقیت آمیز بود.'
            });

            this.router.navigate(['/Login']);
          }
        }
      );
    }
  }
}
