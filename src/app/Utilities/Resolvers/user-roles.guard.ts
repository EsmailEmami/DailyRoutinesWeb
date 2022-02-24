import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {FilterRolesDTO} from "../../DTOs/Access/FilterRolesDTO";
import {AccessService} from "../../Services/access.service";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";
import {GenerateDTO} from "../Generator/GenerateDTO";

@Injectable({
  providedIn: 'root'
})
export class UserRolesGuard implements Resolve<FilterRolesDTO | null> {

  constructor(private accessService: AccessService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FilterRolesDTO | null> | Promise<FilterRolesDTO | null> | FilterRolesDTO | null {

    let userId = route.paramMap.get('userId');

    if (userId == null) {
      this.router.navigate(['NotFound']);

      return of(null);
    }

    const roles = GenerateDTO.generateFilterRolesDTO(15);

    // here we must check the route query params

    const pageId = route.queryParamMap.get('rolesPageId');
    const search = route.queryParamMap.get('rolesSearch');

    if (pageId != null) {
      roles.pageId = parseInt(pageId, 0);
    }

    if (search != null) {
      roles.search = search;
    }

    return this.accessService.getUserRoles(userId as string, roles).pipe(
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
