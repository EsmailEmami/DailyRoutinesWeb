import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {FilterCategoriesDTO} from "../../../../../DTOs/Routine/FilterCategoriesDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonTools} from "../../../../../Utilities/CommonTools";
import {ResponseResultStatusType} from "../../../../../Utilities/Enums/ResponseResultStatusType";
import {CategoriesManagerService} from "../../../../../Services/categories-manager.service";
import {
  AddCategoryFromAdminComponent
} from "../../../../Category/add-category-from-admin/add-category-from-admin.component";
import {
  EditCategoryFromAdminComponent
} from "../../../../Category/edit-category-from-admin/edit-category-from-admin.component";
import {AccessService} from "../../../../../Services/access.service";

declare function selectDropdown(): any;

declare function setButtonSniper(selector: string): any;
declare function removeButtonSniper(selector: string): any;

@Component({
  selector: 'app-user-categories-for-admin',
  templateUrl: './user-categories-for-admin.component.html',
  styleUrls: ['./user-categories-for-admin.component.scss']
})
export class UserCategoriesForAdminComponent implements OnInit, AfterViewInit {

  @Input('categories') public categories!: FilterCategoriesDTO;

  loader: boolean = true;

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

  pages: number[] = [];

  showFilter = false;

  constructor(private categoriesManagerService: CategoriesManagerService,
              private accessService: AccessService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      let pageId = 1;
      if (params['categoriesPageId'] !== undefined) {
        pageId = parseInt(params['categoriesPageId'], 0);
      }

      let search = '';
      if (params['categoriesSearch'] !== undefined) {
        search = params['categoriesSearch'];

        this.showFilter = true;
      }

      let orderBy = 'UpdateDate';
      if (params['categoriesOrderBy'] !== undefined) {
        orderBy = params['categoriesOrderBy'];
      }


      this.categories.pageId = pageId;
      this.categories.search = search;
      this.categories.orderBy = orderBy;
    });

    this.loader = false;
  }

  ngAfterViewInit(): void {
    setTimeout(selectDropdown, 500);
  }

  showFilterItems() {

    this.showFilter = !this.showFilter;
  }

  addCategory() {

    setButtonSniper('#add-category');


    this.accessService.roleCheck(['categories-manager']).subscribe(result => {

      removeButtonSniper('#add-category');


      if (result.status == ResponseResultStatusType.Success) {
        const modalRef = this.modalService.open(AddCategoryFromAdminComponent);
        modalRef.componentInstance.userId = this.categories.userId;

        modalRef.result.then((result: string) => {
          if (result) {
            this.Toast.fire({
              icon: 'success',
              title: result
            });

            this.getCategories();
          }
        }).catch(e => {
          if (e) {
            this.Toast.fire({
              icon: 'warning',
              title: e
            });
          }
        });
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'شما به این صفحه دسترسی ندارید.'
        });
      }
    });
  }

  editCategory(categoryId: string) {

    setButtonSniper(`#edit-category${categoryId}`);

    this.accessService.roleCheck(['categories-manager']).subscribe(result => {

      removeButtonSniper(`#edit-category${categoryId}`);

      if (result.status == ResponseResultStatusType.Success) {
        const modalRef = this.modalService.open(EditCategoryFromAdminComponent);
        modalRef.componentInstance.categoryId = categoryId;

        modalRef.result.then((result: string) => {
          if (result) {
            this.Toast.fire({
              icon: 'success',
              title: result
            });

            this.getCategories();
          }
        }).catch(e => {
          if (e) {
            this.Toast.fire({
              icon: 'warning',
              title: e
            });
          }
        });
      } else {
        this.Toast.fire({
          icon: 'error',
          title: 'شما به این صفحه دسترسی ندارید.'
        });
      }
    });
  }

  updateCategories(pageId?: number): void {

    if (pageId != null) {
      this.categories.pageId = pageId;
    }

    this.router.navigate([CommonTools.getCurrentUrlWithoutParams(this.router)], {
      queryParams: {
        categoriesPageId: this.categories.pageId,
        categoriesSearch: this.categories.search,
        categoriesOrderBy: this.categories.orderBy
      },
      queryParamsHandling: 'merge'
    });

    this.getCategories();
  }

  ShowFullCategoryDetail(categoryId: string): void {

    setButtonSniper(`#btn-full-category-detail-${categoryId}`)

    this.router.navigate(['/Manager/Category', categoryId]);
  }

  getCategories(): void {
    this.loader = true;

    this.categoriesManagerService.getUserCategories(this.categories).subscribe(res => {
      if (res.status == ResponseResultStatusType.Success) {
        this.categories = res.data;
        this.pages = [];
        for (let i = this.categories.startPage; i <= this.categories.endPage; i++) {
          this.pages.push(i);
        }
      }
    });

    this.loader = false;
  }
}
