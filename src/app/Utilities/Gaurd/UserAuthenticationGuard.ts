import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import {catchError, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthenticationService} from "src/app/Services/authentication.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authenticationService.isAuthenticated().pipe(map((response) => {
      if (response) {
        return true;
      }
      this.router.navigate(['Login'], {
        queryParams: {
          redirect: state.url
        }
      });

      return true;

    }), catchError((error) => {

      this.router.navigate(['Login'], {
        queryParams: {
          redirect: state.url
        }
      });

      return of(false);
    }));

  }
}
