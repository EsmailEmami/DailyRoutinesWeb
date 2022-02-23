import {ActivatedRoute, NavigationEnd} from '@angular/router';
import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./Services/authentication.service";
import {CurrentUser} from "./DTOs/Account/CurrentUser";
import {Title} from '@angular/platform-browser';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DailyRoutinesWeb';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private titleService: Title) {
  }

  ngOnInit(): void {
    this.authenticationService.isAuthenticated().subscribe(res => {
        if (!res) {
          this.authenticationService.CheckUserAuthentication().subscribe(res => {

            if (res.status === 'Success') {
              const currentUser: CurrentUser = new CurrentUser(
                res.data.userId,
                res.data.firstName,
                res.data.lastName
              );
              this.authenticationService.setCurrentUser(currentUser);
            }
          });
        }
      }
    )


    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(`${title}`);
        }
      });
  }

}
