import {ErrorComponent} from './SharedComponents/error/error.component';
import {UserCategoriesComponent} from './Pages/Account/user-categories/user-categories.component';
import {AccountComponent} from './Pages/Account/account.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./Pages/home/home.component";
import {LoginComponent} from "./Pages/Account/login/login.component";
import {RegisterComponent} from "./Pages/Account/register/register.component";
import {DashboardComponent} from "./Pages/Account/dashboard/dashboard.component";
import {NotFoundComponent} from "./SharedComponents/not-found/not-found.component";
import {NotUserAuthenticationGuard} from './Utilities/Gaurd/NotUserAuthenticationGaurd';
import {UserCategoryDetailComponent} from "./Pages/Account/user-category-detail/user-category-detail.component";
import {
  UserFullCategoryDetailComponent
} from "./Pages/Account/user-full-category-detail/user-full-category-detail.component";
import {UserLastActionsComponent} from "./Pages/Account/user-last-actions/user-last-actions.component";
import {UserCategoryActionsComponent} from "./Pages/Account/user-category-actions/user-category-actions.component";
import {UsersPageComponent} from "./Pages/Manager/UsersManager/users-page/users-page.component";
import {UserDetailComponent} from "./Pages/Manager/UsersManager/user-detail/user-detail.component";
import {RolesPageComponent} from "./Pages/Manager/AccessManager/roles-page/roles-page.component";
import {
  UserCategoriesRecycleBinComponent
} from "./Pages/Account/user-categories-recycle-bin/user-categories-recycle-bin.component";
import {AdminUsersComponent} from "./Pages/Manager/UsersManager/admin-users/admin-users.component";
import {
  UserFullCategoryDetailForAdminComponent
} from "./Pages/Manager/UsersManager/user-full-category-detail-for-admin/user-full-category-detail-for-admin.component";
import {UserAuthenticationGuard} from "./Utilities/Gaurd/UserAuthenticationGuard";
import {CategoryDetailGuard} from "./Utilities/Resolvers/category-detail.guard";

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    data: {
      title: 'صفحه اصلی'
    }
  },
  {
    path: 'Login', component: LoginComponent,
    data: {
      title: 'ورود به سایت'
    },
    canActivate: [NotUserAuthenticationGuard]
  },
  {
    path: 'Register', component: RegisterComponent,
    data: {
      title: 'ثبت نام در سایت'
    },
    canActivate: [NotUserAuthenticationGuard]
  },
  {
    path: 'Account', component: AccountComponent,
    canActivate: [UserAuthenticationGuard],
    children: [
      {
        path: '', redirectTo: '/Account/Dashboard', pathMatch: 'full'
      },
      {
        path: 'Dashboard', component: DashboardComponent,
        data: {
          title: 'داشبورد'
        }
      },
      {
        path: 'Categories', component: UserCategoriesComponent,
        data: {
          title: 'دسته بندی ها'
        },
        children: [
          {
            path: 'Show/:categoryId', component: UserCategoryDetailComponent,
            resolve: {category: CategoryDetailGuard}
          }
        ]
      },
      {
        path: 'Categories/:categoryId', component: UserFullCategoryDetailComponent,
        data: {
          title: 'جزئیات دسته بندی'
        }
      },
      {
        path: 'CategoryActions/:categoryId/:categoryTitle', component: UserCategoryActionsComponent,
        data: {
          title: 'فعالیت های دسته بندی'
        }
      },
      {
        path: 'Actions', component: UserLastActionsComponent,
        data: {
          title: 'فعالیت ها'
        }
      },
      {
        path: 'CategoriesRecycleBin', component: UserCategoriesRecycleBinComponent,
        data: {
          title: 'بازیافت دسته بندی ها'
        }
      }
    ]
  },
  {
    path: 'Manager', component: AccountComponent,
    children: [
      {path: '', redirectTo: '/NotFound', pathMatch: 'full'},
      {
        path: 'Users', component: UsersPageComponent,
      },
      {
        path: 'Users/:userId', component: UserDetailComponent,
      },
      {
        path: 'Category/:categoryId', component: UserFullCategoryDetailForAdminComponent,
      },
      {
        path: 'Admins', component: AdminUsersComponent,
      },
      {
        path: 'Roles', component: RolesPageComponent,
      },
    ]
  },
  {
    path: '**', component: NotFoundComponent,
    data: {
      title: 'صفحه مورد نظر یافت نشد'
    }
  },
  {
    path: 'NotFound', component: NotFoundComponent,
    data: {
      title: 'صفحه مورد نظر یافت نشد'
    }
  },
  {
    path: 'Error', component: ErrorComponent,
    data: {
      title: 'ارور'
    }
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
