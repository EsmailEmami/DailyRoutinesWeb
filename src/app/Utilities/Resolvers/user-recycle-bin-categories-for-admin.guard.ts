import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {FilterCategoriesDTO} from "../../DTOs/Routine/FilterCategoriesDTO";
import {CategoriesManagerService} from "../../Services/categories-manager.service";
import {GenerateDTO} from "../Generator/GenerateDTO";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";

@Injectable({
  providedIn: 'root'
})
export class UserRecycleBinCategoriesForAdminGuard implements Resolve<FilterCategoriesDTO | null> {

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

    const pageId = route.queryParamMap.get('recyclePageId');
    const search = route.queryParamMap.get('recycleSearch');

    if (pageId != null) {
      categories.pageId = parseInt(pageId, 0);
    }

    if (search != null) {
      categories.search = search;
    }

    return this.categoriesManagerService.getUserRecycleCategories(categories).pipe(
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

