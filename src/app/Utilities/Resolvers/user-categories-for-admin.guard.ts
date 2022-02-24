import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {FilterCategoriesDTO} from "../../DTOs/Routine/FilterCategoriesDTO";
import {GenerateDTO} from "../Generator/GenerateDTO";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";
import {CategoriesManagerService} from "../../Services/categories-manager.service";

@Injectable({
  providedIn: 'root'
})
export class UserCategoriesForAdminGuard implements Resolve<FilterCategoriesDTO | null> {

  constructor(private categoriesManagerService: CategoriesManagerService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FilterCategoriesDTO | null> {

    let userId = route.paramMap.get('userId');

    if (userId == null) {
      this.router.navigate(['NotFound']);

      return of(null);
    }

    const categories = GenerateDTO.generateFilterCategoriesDTO(15, userId);

    // here we must check the route query params

    const pageId = route.queryParamMap.get('categoriesPageId');
    const search = route.queryParamMap.get('categoriesSearch');
    const orderBy = route.queryParamMap.get('categoriesOrderBy');

    if (pageId != null) {
      categories.pageId = parseInt(pageId, 0);
    }

    if (search != null) {
      categories.search = search;
    }

    if (orderBy != null) {
      categories.orderBy = orderBy;
    }

    return this.categoriesManagerService.getUserCategories(categories).pipe(
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
