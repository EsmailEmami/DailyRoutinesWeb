import { Injectable } from '@angular/core';
import { RegisterUserDTO } from "../DTOs/Account/RegisterUserDTO";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { LoginUserDTO } from "../DTOs/Account/LoginUserDTO";
import { ILoginUserAccount } from "../DTOs/Account/ILoginUserAccount";
import { CurrentUser } from "../DTOs/Account/CurrentUser";
import { ICheckUserAuthentication } from "../DTOs/Account/ICheckUserAuthentication";
import { CookieService } from "ngx-cookie-service";
import { authenticationCookieName } from "../Utilities/CookieTools";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // @ts-ignore
  private currentUser: BehaviorSubject<CurrentUser> = new BehaviorSubject<CurrentUser>(null);

  private isLogin: boolean = false;

  constructor(private http: HttpClient,
    private cookieService: CookieService) {
  }

  setCurrentUser(user: CurrentUser): void {
    this.currentUser.next(user);

    if (user != null) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.currentUser;
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>((resolve): void => {
      resolve(this.isLogin);
    });
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

  LogOutUser():void {
    this.cookieService.delete(authenticationCookieName);
  }
}
