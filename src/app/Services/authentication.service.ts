import {Injectable} from '@angular/core';
import {RegisterUserDTO} from "../DTOs/Account/RegisterUserDTO";
import {BehaviorSubject, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {LoginUserDTO} from "../DTOs/Account/LoginUserDTO";
import {ILoginUserAccount} from "../DTOs/Account/ILoginUserAccount";
import {CurrentUser} from "../DTOs/Account/CurrentUser";
import {ICheckUserAuthentication} from "../DTOs/Account/ICheckUserAuthentication";
import {CookieService} from "ngx-cookie-service";
import {authenticationCookieName} from "../Utilities/CookieTools";
import {map} from "rxjs/operators";
import {ResponseResultStatusType} from "../Utilities/Enums/ResponseResultStatusType";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // @ts-ignore
  private currentUser: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);

  private _authenticateChecked: boolean = false;
  private _isLogin: boolean = false;

  constructor(private http: HttpClient,
              private cookieService: CookieService) {
  }

  setCurrentUser(user: CurrentUser): void {
    this.currentUser.next(user);

    this._authenticateChecked = true;

    this._isLogin = user != null;
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.currentUser;
  }

  isAuthenticated(): Observable<boolean> {

    if (!this._authenticateChecked) {
      return this.CheckUserAuthentication().pipe(
        map((response) => {
          if (response.status == ResponseResultStatusType.Success) {
            const currentUser: CurrentUser = new CurrentUser(
              response.data.userId,
              response.data.firstName,
              response.data.lastName
            );
            this.setCurrentUser(currentUser);

            return true;
          } else {
            return false;
          }
        })
      );
    } else {
      return of(this._isLogin);
    }
  }

  registerUser(registerData: RegisterUserDTO): Observable<any> {
    return this.http.post('/account/register', registerData);
  }

  loginUser(loginData: LoginUserDTO): Observable<ILoginUserAccount> {
    return this.http.post<ILoginUserAccount>('/account/Login', loginData);
  }

  CheckUserAuthentication(): Observable<ICheckUserAuthentication> {
    return this.http.post<ICheckUserAuthentication>('/account/CheckUserAuthentication', null);
  }

  LogOutUser(): void {
    this.cookieService.delete(authenticationCookieName);
  }
}
