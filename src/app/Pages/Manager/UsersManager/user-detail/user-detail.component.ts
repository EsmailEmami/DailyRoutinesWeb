import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../../../Services/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserInformationDTO} from "../../../../DTOs/Users/UserInformationDTO";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {EditUserComponent} from "../edit-user/edit-user.component";
import Swal from "sweetalert2";
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../../DTOs/breadCrumbs/breadCrumbsResponse";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  public breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "",
    urls: []
  };

  private userId: string = ''

  public user!: UserInformationDTO;

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

  constructor(private usersService: UsersService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {

    if (this.activatedRoute.snapshot.params['userId'] == undefined) {
      this.router.navigate(['NotFound']);
    } else {
      this.userId = this.activatedRoute.snapshot.params['userId'];
    }

    this.userInformation();
  }

  editUser() {
    const modalRef = this.modalService.open(EditUserComponent);
    modalRef.componentInstance.userId = this.userId;

    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });

        this.userInformation();
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


  blockUser() {
    Swal.fire({
      text: `آیا از مسدود کردن کاربر ${this.user.firstName + ' ' + this.user.lastName} اطمینان دارید؟`,
      icon: 'warning',
      customClass: {
        confirmButton: 'site-btn success modal-btn',
        cancelButton: 'site-btn danger modal-btn'
      },
      buttonsStyling: false,
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonText: 'لغو',
      confirmButtonText: 'مسدود کردن'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usersService.blockUser(this.user.userId).subscribe(response => {
          if (response.status == ResponseResultStatusType.Success) {

            this.user.isBlock = true;

            this.Toast.fire({
              icon: 'success',
              title: 'کاربر با موفقیت مسدود شد.'
            });
          } else {
            this.Toast.fire({
              icon: 'error',
              title: response.message
            });
          }
        });
      }
    })
  }

  activeUser() {
    Swal.fire({
      text: `آیا از فعال کردن کاربر ${this.user.firstName + ' ' + this.user.lastName} اطمینان دارید؟`,
      icon: 'warning',
      customClass: {
        confirmButton: 'site-btn success modal-btn',
        cancelButton: 'site-btn danger modal-btn'
      },
      buttonsStyling: false,
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonText: 'لغو',
      confirmButtonText: 'فعال کردن'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usersService.activeUser(this.user.userId).subscribe(response => {
          if (response.status == ResponseResultStatusType.Success) {

          this.user.isBlock = false;

            this.Toast.fire({
              icon: 'success',
              title: 'کاربر با موفقیت مسدود شد.'
            });
          } else {
            this.Toast.fire({
              icon: 'error',
              title: response.message
            });
          }
        });
      }
    })
  }

  userInformation() {
    this.usersService.getUserInformation(this.userId).subscribe(res => {
      if (res.status == ResponseResultStatusType.Success) {

        this.user = res.data;

        this.setBreadCrumbsData(res.data.firstName + ' ' + res.data.lastName, res.data.userId);

      } else {
        this.router.navigate(['NotFound']);
      }
    });
  }

  setBreadCrumbsData(fullName: string, userId: string) {
    this.breadCrumbsData = {
      breadCrumbsTitle: 'مشخصات کاربر',
      urls: [
        new UrlOfBreadCrumbs('کاربران', '/Manager/Users'),
        new UrlOfBreadCrumbs('مشخصات کاربر ' + fullName, '/Manager/Users/' + userId, false)
      ]
    }
  }

}
