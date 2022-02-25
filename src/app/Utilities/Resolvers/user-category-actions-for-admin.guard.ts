import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ActionsManagerService} from "../../Services/actions-manager.service";
import {FilterActionsDTO} from "../../DTOs/Routine/FilterActionsDTO";
import {GenerateDTO} from "../Generator/GenerateDTO";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";

@Injectable({
  providedIn: 'root'
})
export class UserCategoryActionsForAdminGuard implements Resolve<FilterActionsDTO | null> {

  constructor(private actionsManagerService: ActionsManagerService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FilterActionsDTO | null> {

    let categoryId = route.paramMap.get('categoryId');

    if (categoryId == null) {
      this.router.navigate(['NotFound']);

      return of(null);
    }

    const actions = GenerateDTO.generateFilterActionsDTO(categoryId, 15);

    // here we must check the route query params

    const year = route.queryParamMap.get('year');
    const month = route.queryParamMap.get('month');
    const day = route.queryParamMap.get('day');
    const pageId = route.queryParamMap.get('pageId');
    const search = route.queryParamMap.get('search');

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

    return this.actionsManagerService.getActionsOfCategory(actions).pipe(
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
