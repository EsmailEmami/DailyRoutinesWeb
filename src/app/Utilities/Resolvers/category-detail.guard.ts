import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {delay, Observable, of, tap} from 'rxjs';
import {CategoriesService} from "../../Services/categories.service";
import {CategoryDetailDTO} from "../../DTOs/Routine/CategoryDetailDTO";
import {ResponseResultStatusType} from "../Enums/ResponseResultStatusType";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CategoryDetailGuard implements Resolve<CategoryDetailDTO | null> {

  constructor(private categoriesService: CategoriesService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CategoryDetailDTO | null> {

    let categoryId = route.paramMap.get('categoryId');

    if (categoryId == null) {
      this.router.navigate(['NotFound']);

      return of(null);
    }

    return this.categoriesService.getCategory(categoryId as string).pipe(
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
