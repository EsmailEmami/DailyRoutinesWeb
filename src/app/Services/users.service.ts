import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {UserDashboard} from '../DTOs/Users/UserDashboard';
import {IResponseResult} from "../DTOs/Common/IResponseResult";
import {EditDashboardDTO} from "../DTOs/Users/EditDashboardDTO";
import {FilterCategoriesDTO} from "../DTOs/Routine/FilterCategoriesDTO";
import {FilterUsersDTO} from "../DTOs/Users/FilterUsersDTO";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // @ts-ignore
  private currentUserDashboard: BehaviorSubject<UserDashboard> = new BehaviorSubject<UserDashboard>(null);

  constructor(private http: HttpClient) {
  }

  setCurrentUserDashboard(user: UserDashboard): void {
    this.currentUserDashboard.next(user);
  }

  getCurrentUserDashboard(): Observable<UserDashboard> {
    return this.currentUserDashboard;
  }

  getUserDashboard(): Observable<IResponseResult<UserDashboard>> {
    return this.http.get<IResponseResult<UserDashboard>>('/users/DashBoard');
  }

  editUserDashboard(userData: EditDashboardDTO): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/users/EditDashboard', userData);
  }

  AddUserPhoneNumber(phoneNumber: string): Observable<IResponseResult<any>> {
    return this.http.post<IResponseResult<any>>('/users/AddPhoneNumber', null, {
      params: {
        phoneNumber: phoneNumber
      }
    });
  }

  getUsers(filter: FilterUsersDTO): Observable<IResponseResult<FilterUsersDTO>> {

    if (filter.search == null) {
      filter.search = '';
    }

    const params = new HttpParams()
      .set('pageId', filter.pageId)
      .set('search', filter.search)
      .set('type', filter.type)
      .set('takeEntity', filter.takeEntity);


    return this.http.get<IResponseResult<FilterUsersDTO>>('/UsersManager/Users', {
      params: params
    });
  }

  blockUser(userId: string): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/UsersManager/BlockUser', null, {
      params: {
        userId: userId
      }
    });
  }

  activeUser(userId: string): Observable<IResponseResult<any>> {
    return this.http.put<IResponseResult<any>>('/UsersManager/ActiveUser', null, {
      params: {
        userId: userId
      }
    });
  }
}
