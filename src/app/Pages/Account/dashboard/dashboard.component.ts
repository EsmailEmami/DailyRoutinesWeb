import { Component, OnInit } from '@angular/core';
import { UserDashboard } from 'src/app/DTOs/Users/UserDashboard';
import { UsersService } from 'src/app/Services/users.service';
import { ResponseResultStatusType } from 'src/app/Utilities/Enums/ResponseResultStatusType';
import { BreadCrumbsResponse, UrlOfBreadCrumbs } from "../../../DTOs/breadCrumbs/breadCrumbsResponse";
import { CategoriesService } from "../../../Services/categories.service";
import { FilterCategoriesDTO } from "../../../DTOs/Routine/FilterCategoriesDTO";
import { GenerateDTO } from "../../../Utilities/Generator/GenerateDTO";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActionDetailComponent} from "../../Action/action-detail/action-detail.component";
import {EditDashboardComponent} from "./edit-dashboard/edit-dashboard.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "داشبورد",
    urls: [
      new UrlOfBreadCrumbs('داشبورد', '/Account/Dashboard')
    ]
  };

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  loader: boolean = true;

  // @ts-ignore
  user: UserDashboard = null;

  // @ts-ignore
  lastChangedCategories: FilterCategoriesDTO = null;

  constructor(
    private userService: UsersService,
    private categoriesService: CategoriesService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {

    // get user data
    this.userService.getCurrentUserDashboard().subscribe(currentUser => {

      this.user = currentUser;

      if (currentUser == null) {
        this.userService.getUserDashboard().subscribe(user => {

          if (user.status == ResponseResultStatusType.Success) {
            const newUserDashboard = new UserDashboard(
              user.data.firstName,
              user.data.lastName,
              user.data.email,
              user.data.phoneNumber
            );

            this.userService.setCurrentUserDashboard(newUserDashboard);
          }
        });
      }
    });

    // get categories data
    this.categoriesService.getCurrentUserLastCategories().subscribe(currentData => {

      this.lastChangedCategories = currentData;

      if (currentData == null) {

        let defaultData: FilterCategoriesDTO = GenerateDTO.generateFilterCategoriesDTO(10);

        this.categoriesService.getUserCategories(defaultData).subscribe(res => {
          if (res.status == ResponseResultStatusType.Success) {
            const newData = new FilterCategoriesDTO(
              res.data.userId,
              res.data.search,
              res.data.orderBy,
              res.data.items,
              res.data.pageId,
              res.data.pageCount,
              res.data.startPage,
              res.data.endPage,
              res.data.takeEntity,
              res.data.skipEntity,
              res.data.activePage,
            );

            this.categoriesService.setCurrentUserLastCategories(newData);
          }
        });
      }

    });

    this.loader = false;
  }

  editDashboard() {
    const modalRef = this.modalService.open(EditDashboardComponent);

    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });
      }
    }).catch(e => {
      if (e) {
        this.Toast.fire({
          icon: 'warning',
          title: e
        });
      }
    });
  }

}
