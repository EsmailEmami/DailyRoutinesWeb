import {Component, OnInit} from '@angular/core';
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../../DTOs/breadCrumbs/breadCrumbsResponse";
import Swal from "sweetalert2";
import {GenerateDTO} from "../../../../Utilities/Generator/GenerateDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonTools} from "../../../../Utilities/CommonTools";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {AccessService} from "../../../../Services/access.service";
import {FilterRolesDTO} from "../../../../DTOs/Access/FilterRolesDTO";
import {AddRoleComponent} from "../add-role/add-role.component";
import {EditRoleComponent} from "../edit-role/edit-role.component";

@Component({
  selector: 'app-roles-page',
  templateUrl: './roles-page.component.html',
  styleUrls: ['./roles-page.component.scss']
})
export class RolesPageComponent implements OnInit {
  public breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "مقام ها",
    urls: [
      new UrlOfBreadCrumbs('مقام ها', '/Manager/Roles', false)
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

  public roles: FilterRolesDTO = GenerateDTO.generateFilterRolesDTO(15);
  public pages: number[] = [];

  constructor(private accessService: AccessService,
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

      this.roles.pageId = pageId;
      this.roles.search = search;

      this.getRoles();
    });
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
        pageId: this.roles.pageId,
        search: this.roles.search
      }
    });
  }

  newRole() {
    const modalRef = this.modalService.open(AddRoleComponent);
    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });

        this.getRoles();
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

  editRole(roleId: string) {
    const modalRef = this.modalService.open(EditRoleComponent);
    modalRef.componentInstance.roleId = roleId;

    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });

        this.getRoles();
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


  getRoles() {
    this.loader = true;

    this.accessService.getRoles(this.roles).subscribe(response => {

      this.loader = false;

      if (response.status == ResponseResultStatusType.Success) {
        this.roles = response.data;
        this.pages = [];

        for (let i = this.roles.startPage; i <= this.roles.endPage; i++) {
          this.pages.push(i);
        }
      } else {
        this.router.navigate(['NotFound'])
      }
    });
  }
}
