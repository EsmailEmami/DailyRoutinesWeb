import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../../DTOs/breadCrumbs/breadCrumbsResponse";
import Swal from "sweetalert2";
import {GenerateDTO} from "../../../../Utilities/Generator/GenerateDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {CommonTools} from "../../../../Utilities/CommonTools";
import {UsersService} from "../../../../Services/users.service";
import {FilterUsersDTO} from "../../../../DTOs/Users/FilterUsersDTO";

declare function selectDropdown(): any;

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit, AfterViewInit {
  public breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "کاربران",
    urls: [
      new UrlOfBreadCrumbs('کاربران', '/Manager/Users', false)
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

  public loader: boolean = true;

  public showFilter: boolean = false;

  public users: FilterUsersDTO = GenerateDTO.generateFilterUsersDTO(15, 'all');
  public pages: number[] = [];

  constructor(private usersService: UsersService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {

      // for users
      let pageId = 1;
      if (params['pageId'] !== undefined) {
        pageId = parseInt(params['pageId'], 0);
      }

      let search = '';
      if (params['search'] !== undefined) {
        search = params['search'];
        this.showFilter = true;
      }

      let selected = 'all';
      if (params['selected'] !== undefined) {
        selected = params['selected'];
      }

      this.users.pageId = pageId;
      this.users.search = search;
      this.users.type = selected;

      this.getUsers();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(selectDropdown,1);
  }

  showUsersFilterItems() {
    this.showFilter = !this.showFilter;
  }

  updateUsers(pageId?: number): void {

    if (pageId != null) {
      this.users.pageId = pageId;
    }

    this.router.navigate([CommonTools.getCurrentUrlWithoutParams(this.router)], {
      queryParams: {
        pageId: this.users.pageId,
        selected: this.users.type,
        search: this.users.search
      }
    });
  }

  blockUser(userId: string, userTitle: string) {
    Swal.fire({
      text: `آیا از مسدود کردن کاربر ${userTitle} اطمینان دارید؟`,
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

        this.usersService.blockUser(userId).subscribe(response => {
          if (response.status == ResponseResultStatusType.Success) {

            this.updateUsers();

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

  activeUser(userId: string, userTitle: string) {
    Swal.fire({
      text: `آیا از فعال کردن کاربر ${userTitle} اطمینان دارید؟`,
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

        this.usersService.activeUser(userId).subscribe(response => {
          if (response.status == ResponseResultStatusType.Success) {

           this.updateUsers();

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

  getUsers() {

    this.loader = true;

    this.usersService.getUsers(this.users).subscribe(response => {

      this.loader = false;

      if (response.status == ResponseResultStatusType.Success) {
        this.users = response.data;
        this.pages = [];

        for (let i = this.users.startPage; i <= this.users.endPage; i++) {
          this.pages.push(i);
        }
      } else {
        this.router.navigate(['NotFound'])
      }
    });
  }
}
