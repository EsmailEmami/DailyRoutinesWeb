import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserInformationDTO} from "../../DTOs/Users/UserInformationDTO";
import {UsersService} from "../../Services/users.service";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class UserInformationGuard implements Resolve<UserInformationDTO | null> {

  constructor(private usersService: UsersService,
              private router: Router) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserInformationDTO | null> {

    let userId = route.paramMap.get('userId');

    if (userId == null) {
      this.router.navigate(['NotFound']);

      return of(null);
    }

    return this.usersService.getUserInformation(userId as string).pipe(
      map(result => {
        if (result.status != ResponseResultStatusType.Success) {

          this.router.navigate(['NotFound']);

          return null;
        } else {
          return result.data;
        }
      })
    );

  }
}
