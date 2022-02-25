import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {CategoryDetailForAdminDTO} from "../../DTOs/Routine/CategoryDetailForAdminDTO";
import {CategoriesManagerService} from "../../Services/categories-manager.service";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";

@Injectable({
  providedIn: 'root'
})
export class UserFullCategoryDetailForAdminGuard implements Resolve<CategoryDetailForAdminDTO | null> {

  constructor(private categoriesManagerService: CategoriesManagerService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CategoryDetailForAdminDTO | null> | Promise<CategoryDetailForAdminDTO | null> | CategoryDetailForAdminDTO | null {

    let categoryId = route.paramMap.get('categoryId');

    if (categoryId == null) {
      this.router.navigate(['NotFound']);

      return of(null);
    }

    return this.categoriesManagerService.getCategory(categoryId).pipe(
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
