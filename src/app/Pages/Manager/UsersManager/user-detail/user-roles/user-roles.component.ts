import {Component, Input, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {FilterRolesDTO} from "../../../../../DTOs/Access/FilterRolesDTO";
import {AccessService} from "../../../../../Services/access.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonTools} from "../../../../../Utilities/CommonTools";
import {ResponseResultStatusType} from "../../../../../Utilities/Enums/ResponseResultStatusType";

declare function setButtonSniper(selector: string): any;

declare function removeButtonSniper(selector: string): any;

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {

  @Input('roles') public roles!: FilterRolesDTO;

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

  private userId: string = '';

  public loader: boolean = true;

  public showFilter: boolean = false;

  public pages: number[] = [];

  constructor(private accessService: AccessService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['userId'];

    this.activatedRoute.queryParams.subscribe(params => {

      let pageId = 1;
      if (params['rolesPageId'] !== undefined) {
        pageId = parseInt(params['rolesPageId'], 0);
      }

      let search = '';
      if (params['rolesSearch'] !== undefined) {
        search = params['rolesSearch'];
        this.showFilter = true;
      }

      this.roles.pageId = pageId;
      this.roles.search = search;
    });

    this.loader = false;
  }

  showRolesFilterItems() {
    this.showFilter = !this.showFilter;
  }

  updateRoles(pageId?: number): void {

    if (pageId != null) {
      this.roles.pageId = pageId;
    }

    this.router.navigate([CommonTools.getCurrentUrlWithoutParams(this.router)], {
      queryParams: {
        rolesPageId: this.roles.pageId,
        rolesSearch: this.roles.search
      },
      queryParamsHandling: 'merge'
    });

    this.getRoles();
  }

  deleteRoleFromUser(roleId: string, roleTitle: string) {

    setButtonSniper(`#delete-role-${roleId}`);

    this.accessService.roleCheck(['roles-manager']).subscribe(result => {

      removeButtonSniper(`#delete-role-${roleId}`)

      if (result.status == ResponseResultStatusType.Success) {
        Swal.fire({
          text: `آیا از حذف مقام ${roleTitle} اطمینان دارید؟`,
          icon: 'warning',
          customClass: {
            confirmButton: 'site-btn success modal-btn',
            cancelButton: 'site-btn danger modal-btn'
          },
          buttonsStyling: false,
          reverseButtons: true,
          showCancelButton: true,
          cancelButtonText: 'لغو',
          confirmButtonText: 'حذف'
        }).then((result) => {
          if (result.isConfirmed) {

            this.accessService.deleteRoleFromUser(this.userId, roleId).subscribe(response => {
              if (response.status == ResponseResultStatusType.Success) {

                this.getRoles();

                this.Toast.fire({
                  icon: 'success',
                  title: 'فعالیت با موفقیت حذف شد.'
                });
              } else {
                this.Toast.fire({
                  icon: 'error',
                  title: response.message
                });
              }
            });
          }
        });
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'شما دسترسی لازم برای حذف مقام را ندارید.'
        });
      }
    });
  }

  getRoles() {
    this.loader = true;

    this.accessService.getUserRoles(this.userId, this.roles).subscribe(response => {

      this.loader = false;

      if (response.status == ResponseResultStatusType.Success) {
        this.roles = response.data;
        this.pages = [];

        for (let i = this.roles.startPage; i <= this.roles.endPage; i++) {
          this.pages.push(i);
        }
      }
    });
  }
}
