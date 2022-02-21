import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FilterUserLastActionsDTO} from "../DTOs/Routine/FilterUserLastActions";
import {Observable} from "rxjs";
import {IResponseResult} from "../DTOs/Common/IResponseResult";
import {AddActionDTO} from "../DTOs/Routine/AddActionDTO";
import {ActionDetailDTO} from "../DTOs/Routine/ActionDetailDTO";
import {EditActionDTO} from "../DTOs/Routine/EditActionDTO";
import {FilterActionsDTO} from "../DTOs/Routine/FilterActionsDTO";

@Injectable({
  providedIn: 'root'
})
export class ActionsManagerService {

  constructor(private http: HttpClient) {
  }

  getLastActions(filter: FilterUserLastActionsDTO): Observable<IResponseResult<FilterUserLastActionsDTO>> {
    if (filter.search == null) {
      filter.search = '';
    }

    const params = new HttpParams()
      .set('userId', filter.userId)
      .set('pageId', filter.pageId)
      .set('search', filter.search)
      .set('year', filter.year)
      .set('month', filter.month)
      .set('day', filter.day)
      .set('takeEntity', filter.takeEntity);

    return this.http.get<IResponseResult<FilterUserLastActionsDTO>>('/ActionsManager/UserLastActions', {
      params: params
    });
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

    return this.http.get<IResponseResult<FilterActionsDTO>>('/ActionsManager/CategoryActions', {
      params: params
    });
  }

  getYearsOfActions(userId: string): Observable<IResponseResult<number[]>> {
    return this.http.get<IResponseResult<number[]>>('/ActionsManager/YearsOfActions', {
      params: {
        userId: userId
      }
    });
  }

  addAction(actionData: AddActionDTO): Observable<IResponseResult<any>> {
    return this.http.post<IResponseResult<any>>('/ActionsManager/AddAction', actionData);
  }

  getActionDetail(actionId: string): Observable<IResponseResult<ActionDetailDTO>> {
    return this.http.get<IResponseResult<ActionDetailDTO>>('/ActionsManager/ActionDetail', {
      params: {
        actionId: actionId
      }
    });
  }

  getActionForEdit(actionId: string): Observable<IResponseResult<EditActionDTO>> {
    return this.http.get<IResponseResult<EditActionDTO>>('/ActionsManager/EditAction', {
      params: {
        actionId: actionId
      }
    });
  }

  editAction(actionData: EditActionDTO): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/ActionsManager/EditAction', actionData);
  }

  deleteAction(actionId: string): Observable<IResponseResult<any>> {
    return this.http.delete<IResponseResult<any>>('/ActionsManager/DeleteAction', {
      params: {
        actionId: actionId
      }
    });
  }
}
