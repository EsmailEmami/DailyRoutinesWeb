import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {AuthenticationService} from "../../Services/authentication.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotUserAuthenticationGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authenticationService.isAuthenticated().pipe(map((response) => {
      if (response) {
        this.router.navigate(['']).then();

        return false;
      }

      return true;

    }), catchError((error) => {
      this.router.navigate(['']).then();
      return of(false);
    }));

  }
}
