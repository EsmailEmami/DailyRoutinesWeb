import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {IResponseResult} from "../DTOs/Common/IResponseResult";
import {FilterCategoriesDTO} from "../DTOs/Routine/FilterCategoriesDTO";
import {CategoryDetailDTO} from "../DTOs/Routine/CategoryDetailDTO";
import {AddCategory} from "../DTOs/Category/AddCategory";
import {EditCategory} from "../DTOs/Category/EditCategory";
import {ActionsDateFilter} from "../DTOs/Routine/ActionsDateFilter";
import {ItemsForSelectDTO} from "../DTOs/Common/ItemsForSelectDTO";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  // @ts-ignore
  private currentUserLastCategories: BehaviorSubject<FilterCategoriesDTO> = new BehaviorSubject<FilterCategoriesDTO>(null);

  // @ts-ignore
  private currentCategoriesDetail: CategoryDetailDTO[] = [];

  constructor(private http: HttpClient) {
  }

  //********************** current last categories **********************//

  setCurrentUserLastCategories(data: FilterCategoriesDTO): void {


    this.currentUserLastCategories.next(data);
  }

  getCurrentUserLastCategories(): Observable<FilterCategoriesDTO> {
    return this.currentUserLastCategories;
  }

  //********************** current last categories **********************//

  //********************** current categories detail **********************//

  setCurrentCategoryDetail(data: CategoryDetailDTO): void {
    this.currentCategoriesDetail.push(data);
  }

  getCurrentCategoryDetail(categoryId: string): Observable<CategoryDetailDTO> | null {

    let data = this.currentCategoriesDetail.find(c => c.categoryId === categoryId);

    if (data == undefined) {
      return null;
    }

    return of(data);
  }

  //********************** current categories detail **********************//


  getUserCategories(filter: FilterCategoriesDTO): Observable<IResponseResult<FilterCategoriesDTO>> {

    if (filter.search == null) {
      filter.search = '';
    }

    const params = new HttpParams()
      .set('pageId', filter.pageId)
      .set('search', filter.search)
      .set('orderBy', filter.orderBy)
      .set('takeEntity', filter.takeEntity)


    return this.http.get<IResponseResult<FilterCategoriesDTO>>('/categories/UserCategories', {
      params: params
    });
  }

  getUserRecycleCategories(filter: FilterCategoriesDTO): Observable<IResponseResult<FilterCategoriesDTO>> {

    if (filter.search == null) {
      filter.search = '';
    }

    const params = new HttpParams()
      .set('pageId', filter.pageId)
      .set('search', filter.search)
      .set('orderBy', filter.orderBy)
      .set('takeEntity', filter.takeEntity)


    return this.http.get<IResponseResult<FilterCategoriesDTO>>('/categories/UserRecycleCategories', {
      params: params
    });
  }

  getCategory(categoryId: string): Observable<IResponseResult<CategoryDetailDTO>> {
    return this.http.get<IResponseResult<CategoryDetailDTO>>('/categories/CategoryDetail', {
      params: {
        categoryId: categoryId
      }
    });
  }

  getCategoryActionsMonths(categoryId: string): Observable<IResponseResult<ActionsDateFilter[]>> {
    return this.http.get<IResponseResult<ActionsDateFilter[]>>('/categories/CategoryActionsMonths', {
      params: {
        categoryId: categoryId
      }
    });
  }

  addCategory(categoryData: AddCategory): Observable<IResponseResult<any>> {
    return this.http.post<IResponseResult<any>>('/categories/AddCategory', categoryData);
  }

  getCategoryForEdit(categoryId: string): Observable<IResponseResult<EditCategory>> {
    return this.http.get<IResponseResult<EditCategory>>('/categories/EditCategory', {
      params: {
        categoryId: categoryId
      }
    });
  }

  editCategory(categoryData: EditCategory): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/categories/EditCategory', categoryData);
  }

  removeCategory(categoryId: string): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/categories/RemoveCategory', null, {
      params: {
        categoryId: categoryId
      }
    });
  }

  deleteCategory(categoryId: string): Observable<IResponseResult<any>> {
    return this.http.delete<IResponseResult<any>>('/categories/DeleteCategory', {
      params: {
        categoryId: categoryId
      }
    });
  }

  getYearsOfCategoryActions(categoryId: string): Observable<IResponseResult<number[]>> {
    return this.http.get<IResponseResult<number[]>>('/categories/CategoryActionsYear', {
      params: {
        categoryId: categoryId
      }
    });
  }

  getUserCategoriesForSelect(): Observable<IResponseResult<ItemsForSelectDTO[]>> {
    return this.http.get<IResponseResult<ItemsForSelectDTO[]>>('/categories/UserCategoriesForSelect');
  }

  // remove from recycle bin
  returnCategory(categoryId: string): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/categories/ReturnCategory', null, {
      params: {
        categoryId: categoryId
      }
    });
  }
}
