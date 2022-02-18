import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DomainName} from "./PathTools";
import {authenticationCookieName} from "./CookieTools";
import {CookieService} from "ngx-cookie-service";
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class DailyRoutinesInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.cookieService.get(authenticationCookieName);

    const myRequest = req.clone({
      url: DomainName + req.url,
      headers: req.headers.append('Authorization', 'Bearer ' + token)
    });

    return next.handle(myRequest);
  }
}
