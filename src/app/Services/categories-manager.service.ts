import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterCategoriesDTO} from "../DTOs/Routine/FilterCategoriesDTO";
import {Observable} from "rxjs";
import {IResponseResult} from "../DTOs/Common/IResponseResult";
import {ItemsForSelectDTO} from "../DTOs/Common/ItemsForSelectDTO";
import {EditCategory} from "../DTOs/Category/EditCategory";
import {AddCategoryFromAdminDTO} from "../DTOs/Category/AddCategoryFromAdminDTO";
import {CategoryDetailForAdminDTO} from "../DTOs/Routine/CategoryDetailForAdminDTO";

@Injectable({
  providedIn: 'root'
})
export class CategoriesManagerService {

  constructor(private http: HttpClient) {
  }

  getUserCategories(filter: FilterCategoriesDTO): Observable<IResponseResult<FilterCategoriesDTO>> {

    if (filter.search == null) {
      filter.search = '';
    }

    const params = new HttpParams()
      .set('userId', filter.userId)
      .set('pageId', filter.pageId)
      .set('search', filter.search)
      .set('orderBy', filter.orderBy)
      .set('takeEntity', filter.takeEntity)


    return this.http.get<IResponseResult<FilterCategoriesDTO>>('/CategoriesManager/UserCategories', {
      params: params
    });
  }

  getUserCategoriesForSelect(userId: string): Observable<IResponseResult<ItemsForSelectDTO[]>> {
    return this.http.get<IResponseResult<ItemsForSelectDTO[]>>('/CategoriesManager/UserCategoriesForSelect', {
      params: {
        userId: userId
      }
    });
  }

  addCategory(categoryData: AddCategoryFromAdminDTO): Observable<IResponseResult<any>> {
    return this.http.post<IResponseResult<any>>('/CategoriesManager/AddCategory', categoryData);
  }

  getCategoryForEdit(categoryId: string): Observable<IResponseResult<EditCategory>> {
    return this.http.get<IResponseResult<EditCategory>>('/CategoriesManager/EditCategory', {
      params: {
        categoryId: categoryId
      }
    });
  }

  editCategory(categoryData: EditCategory): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/CategoriesManager/EditCategory', categoryData);
  }

  removeCategory(categoryId: string): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/CategoriesManager/RemoveCategory', null, {
      params: {
        categoryId: categoryId
      }
    });
  }

  deleteCategory(categoryId: string): Observable<IResponseResult<any>> {
    return this.http.delete<IResponseResult<any>>('/CategoriesManager/DeleteCategory', {
      params: {
        categoryId: categoryId
      }
    });
  }

  getCategory(categoryId: string): Observable<IResponseResult<CategoryDetailForAdminDTO>> {
    return this.http.get<IResponseResult<CategoryDetailForAdminDTO>>('/CategoriesManager/CategoryDetail', {
      params: {
        categoryId: categoryId
      }
    });
  }

  getYearsOfCategoryActions(categoryId: string): Observable<IResponseResult<number[]>> {
    return this.http.get<IResponseResult<number[]>>('/CategoriesManager/CategoryActionsYear', {
      params: {
        categoryId: categoryId
      }
    });
  }

}
