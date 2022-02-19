import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {IResponseResult} from "../DTOs/Common/IResponseResult";
import {AddRoleDTO} from "../DTOs/Access/AddRoleDTO";
import {EditRoleDTO} from "../DTOs/Access/EditRoleDTO";
import {FilterCategoriesDTO} from "../DTOs/Routine/FilterCategoriesDTO";
import {FilterRolesDTO} from "../DTOs/Access/FilterRolesDTO";
import {ItemsForSelectDTO} from "../DTOs/Common/ItemsForSelectDTO";

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private http: HttpClient) {
  }

  addRole(roleData: AddRoleDTO): Observable<IResponseResult<any>> {
    return this.http.post<IResponseResult<any>>('/AccessManager/AddRole', roleData);
  }

  getRoleDataForEdit(roleId: string): Observable<IResponseResult<EditRoleDTO>> {
    return this.http.get<IResponseResult<EditRoleDTO>>('/AccessManager/EditRole', {
      params: {
        roleId: roleId
      }
    });
  }

  editRole(roleData: EditRoleDTO): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/AccessManager/EditRole', roleData);
  }

  getRoles(filter: FilterRolesDTO): Observable<IResponseResult<FilterRolesDTO>> {

    if (filter.search == null) {
      filter.search = '';
    }

    const params = new HttpParams()
      .set('pageId', filter.pageId)
      .set('search', filter.search)
      .set('takeEntity', filter.takeEntity)


    return this.http.get<IResponseResult<FilterRolesDTO>>('/AccessManager/Roles', {
      params: params
    });
  }

  getRolesForSelect(): Observable<IResponseResult<ItemsForSelectDTO[]>> {
    return this.http.get<IResponseResult<ItemsForSelectDTO[]>>('/AccessManager/RolesForSelect');
  }
}
