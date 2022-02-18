import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserDashboard} from '../DTOs/Users/UserDashboard';
import {IResponseResult} from "../DTOs/Common/IResponseResult";
import {EditDashboardDTO} from "../DTOs/Users/EditDashboardDTO";

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
}
