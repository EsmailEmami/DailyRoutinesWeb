import {FilterActionsDTO} from '../DTOs/Routine/FilterActionsDTO';
import {IResponseResult} from '../DTOs/Common/IResponseResult';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AddActionDTO} from '../DTOs/Routine/AddActionDTO';
import {ActionDetailDTO} from '../DTOs/Routine/ActionDetailDTO';
import {EditActionDTO} from "../DTOs/Routine/EditActionDTO";
import {FilterUserLastActionsDTO} from "../DTOs/Routine/FilterUserLastActions";

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient) {
  }


  getActionsOfCategory(filter: FilterActionsDTO): Observable<IResponseResult<FilterActionsDTO>> {
    if (filter.search == null) {
      filter.search = '';
    }

    const params = new HttpParams()
      .set('categoryId', filter.categoryId)
      .set('pageId', filter.pageId)
      .set('search', filter.search)
      .set('year', filter.year)
      .set('month', filter.month)
      .set('day', filter.day)
      .set('takeEntity', filter.takeEntity);

    return this.http.get<IResponseResult<FilterActionsDTO>>('/actions/CategoryActions', {
      params: params
    });
  }

  addAction(actionData: AddActionDTO): Observable<IResponseResult<any>> {
    return this.http.post<IResponseResult<any>>('/actions/AddAction', actionData);
  }

  getActionDetail(actionId: string): Observable<IResponseResult<ActionDetailDTO>> {
    return this.http.get<IResponseResult<ActionDetailDTO>>('/actions/ActionDetail', {
      params: {
        actionId: actionId
      }
    });
  }

  getActionForEdit(actionId: string): Observable<IResponseResult<EditActionDTO>> {
    return this.http.get<IResponseResult<EditActionDTO>>('/actions/EditAction', {
      params: {
        actionId: actionId
      }
    });
  }

  editAction(actionData: EditActionDTO): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/actions/EditAction', actionData);
  }

  deleteAction(actionId: string): Observable<IResponseResult<any>> {
    return this.http.delete<IResponseResult<any>>('/actions/DeleteAction', {
      params: {
        actionId: actionId
      }
    });
  }

  getLastActions(filter: FilterUserLastActionsDTO): Observable<IResponseResult<FilterUserLastActionsDTO>> {
    if (filter.search == null) {
      filter.search = '';
    }

    const params = new HttpParams()
      .set('pageId', filter.pageId)
      .set('search', filter.search)
      .set('year', filter.year)
      .set('month', filter.month)
      .set('day', filter.day)
      .set('takeEntity', filter.takeEntity);

    return this.http.get<IResponseResult<FilterUserLastActionsDTO>>('/actions/LastActions', {
      params: params
    });
  }

  getYearsOfActions(): Observable<IResponseResult<number[]>> {
    return this.http.get<IResponseResult<number[]>>('/actions/YearsOfActions');
  }

}
