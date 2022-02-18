import {Component, OnInit} from '@angular/core';
import {CurrentUser} from "../../DTOs/Account/CurrentUser";
import {AuthenticationService} from "../../Services/authentication.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {UsersService} from "../../Services/users.service";

declare function headerSection(): any;

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent implements OnInit {


  // @ts-ignore
  user: CurrentUser = null;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private userService: UsersService) {
  }

  ngOnInit(): void {
    this.authenticationService.getCurrentUser().subscribe(user => {
      this.user = user;
    });


    headerSection();
  }

  logOutUser(): void {
    this.authenticationService.LogOutUser();

    // @ts-ignore
    this.authenticationService.setCurrentUser(null);

    // @ts-ignore
    this.userService.setCurrentUserDashboard(null);

    this.router.navigate(['']);


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
      title: 'خروج شما موفقیت آمیز بود.'
    });
  }
}
