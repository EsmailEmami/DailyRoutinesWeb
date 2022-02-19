import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {CookieService} from 'ngx-cookie-service';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './Pages/home/home.component';
import {SiteHeaderComponent} from './SharedComponents/site-header/site-header.component';
import {SiteFooterComponent} from './SharedComponents/site-footer/site-footer.component';
import {SliderComponent} from './Pages/home/slider/slider.component';
import {DailyRoutinesInterceptor} from "./Utilities/DailyRoutinesInterceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginComponent} from './Pages/Account/login/login.component';
import {RegisterComponent} from './Pages/Account/register/register.component';
import {BreadcrumbsComponent} from './SharedComponents/breadcrumbs/breadcrumbs.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "./Services/authentication.service";
import {DashboardComponent} from './Pages/Account/dashboard/dashboard.component';
import {UsersService} from "./Services/users.service";
import {NotFoundComponent} from './SharedComponents/not-found/not-found.component';
import {AccountSideBarComponent} from './SharedComponents/account-side-bar/account-side-bar.component';
import {AccountComponent} from './Pages/Account/account.component';
import {UserCategoriesComponent} from './Pages/Account/user-categories/user-categories.component';
import {ErrorComponent} from './SharedComponents/error/error.component';
import {CategoriesService} from "./Services/categories.service";
import {UserCategoryDetailComponent} from './Pages/Account/user-category-detail/user-category-detail.component';
import {
  UserFullCategoryDetailComponent
} from './Pages/Account/user-full-category-detail/user-full-category-detail.component';
import {ActionsService} from './Services/actions.service';
import {AddActionComponent} from './Pages/Action/add-action/add-action.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ModalComponent} from './SharedComponents/modal/modal.component';
import {EditActionComponent} from './Pages/Action/edit-action/edit-action.component';
import {ActionDetailComponent} from './Pages/Action/action-detail/action-detail.component';
import {EditCategoryComponent} from './Pages/Category/edit-category/edit-category.component';
import {AddCategoryComponent} from './Pages/Category/add-category/add-category.component';
import {UserLastActionsComponent} from './Pages/Account/user-last-actions/user-last-actions.component';
import {AddActionToCategoryComponent} from './Pages/Action/add-action-to-category/add-action-to-category.component';
import {UserCategoryActionsComponent} from "./Pages/Account/user-category-actions/user-category-actions.component";
import {EditDashboardComponent} from './Pages/Account/dashboard/edit-dashboard/edit-dashboard.component';
import {ChangePasswordComponent} from './Pages/Account/dashboard/change-password/change-password.component';
import {UsersPageComponent} from './Pages/Manager/UsersManager/users-page/users-page.component';
import {AddUserComponent} from './Pages/Manager/UsersManager/add-user/add-user.component';
import {EditUserComponent} from './Pages/Manager/UsersManager/edit-user/edit-user.component';
import {UserDetailComponent} from './Pages/Manager/UsersManager/user-detail/user-detail.component';
import {UserRolesComponent} from './Pages/Manager/UsersManager/user-detail/user-roles/user-roles.component';
import {UserActionsComponent} from './Pages/Manager/UsersManager/user-detail/user-actions/user-actions.component';
import {RolesPageComponent} from './Pages/Manager/AccessManager/roles-page/roles-page.component';
import {AddRoleComponent} from './Pages/Manager/AccessManager/add-role/add-role.component';
import {EditRoleComponent} from './Pages/Manager/AccessManager/edit-role/edit-role.component';
import {NewPhoneNumberComponent} from './Pages/Account/dashboard/new-phone-number/new-phone-number.component';
import {
  UserCategoriesRecycleBinComponent
} from './Pages/Account/user-categories-recycle-bin/user-categories-recycle-bin.component';
import {LoadingBarRouterModule} from "@ngx-loading-bar/router";
import {LOADING_BAR_CONFIG, LoadingBarModule} from "@ngx-loading-bar/core";
import {LoadingBarHttpClientModule} from "@ngx-loading-bar/http-client";
import { HideNumberPipe } from './Pipe/hide-number.pipe';
import { HideLengthPipe } from './Pipe/hide-length.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    SliderComponent,
    LoginComponent,
    RegisterComponent,
    BreadcrumbsComponent,
    DashboardComponent,
    NotFoundComponent,
    AccountSideBarComponent,
    AccountComponent,
    UserCategoriesComponent,
    ErrorComponent,
    UserCategoryDetailComponent,
    UserFullCategoryDetailComponent,
    AddActionComponent,
    ModalComponent,
    EditActionComponent,
    ActionDetailComponent,
    EditCategoryComponent,
    AddCategoryComponent,
    UserLastActionsComponent,
    AddActionToCategoryComponent,
    UserCategoryActionsComponent,
    EditDashboardComponent,
    ChangePasswordComponent,
    UsersPageComponent,
    AddUserComponent,
    EditUserComponent,
    UserDetailComponent,
    UserRolesComponent,
    UserActionsComponent,
    RolesPageComponent,
    AddRoleComponent,
    EditRoleComponent,
    NewPhoneNumberComponent,
    UserCategoriesRecycleBinComponent,
    HideNumberPipe,
    HideLengthPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SweetAlert2Module.forRoot(),
    NgbModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DailyRoutinesInterceptor,
      multi: true
    },
    {
      provide: LOADING_BAR_CONFIG,
      useValue: {latencyThreshold: 100}
    },
    AuthenticationService,
    UsersService,
    CategoriesService,
    ActionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
