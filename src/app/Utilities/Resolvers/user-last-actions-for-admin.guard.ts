import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {GenerateDTO} from "../Generator/GenerateDTO";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";
import {FilterUserLastActionsDTO} from "../../DTOs/Routine/FilterUserLastActions";
import {ActionsManagerService} from "../../Services/actions-manager.service";

@Injectable({
  providedIn: 'root'
})
export class UserLastActionsForAdminGuard implements Resolve<FilterUserLastActionsDTO | null> {

  constructor(private actionsManagerService: ActionsManagerService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FilterUserLastActionsDTO | null> {

    let userId = route.paramMap.get('userId');

    if (userId == null) {
      this.router.navigate(['NotFound']);

      return of(null);
    }

    const actions = GenerateDTO.generateFilterUserLastActionsDTO(15, userId);

    // here we must check the route query params

    const year = route.queryParamMap.get('actionsYear');
    const month = route.queryParamMap.get('actionsMonth');
    const day = route.queryParamMap.get('actionsDay');
    const pageId = route.queryParamMap.get('actionsPageId');
    const search = route.queryParamMap.get('actionsSearch');

    if (year != null) {
      actions.year = parseInt(year, 0);
    }

    if (month != null) {
      actions.month = parseInt(month, 0);
    }

    if (day != null) {
      actions.day = parseInt(day, 0);
    }

    if (pageId != null) {
      actions.pageId = parseInt(pageId, 0);
    }

    if (search != null) {
      actions.search = search;
    }

    return this.actionsManagerService.getLastActions(actions).pipe(
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
