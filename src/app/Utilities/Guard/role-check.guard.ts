import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {AccessService} from "../../Services/access.service";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";

@Injectable({
  providedIn: 'root'
})
export class RoleCheckGuard implements CanActivate {

  constructor(private accessService: AccessService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const roles: string[] = route.data['roles'];

    return this.accessService.roleCheck(roles).pipe(map((response) => {
      if (response.status == ResponseResultStatusType.Success) {
        return true;
      }

      this.router.navigate(['Error']);

      return false;
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
