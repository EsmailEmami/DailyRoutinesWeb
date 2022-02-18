import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "src/app/Services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authenticationService.isAuthenticated().then(res => {




      if (res == true) {
        return true;
      } else {
        this.router.navigate(['Login'], {
          queryParams: {
            redirect: state.url
          }
        });
      }

      return false;
    });
  }
}
