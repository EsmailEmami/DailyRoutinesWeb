import {Component, Input, OnInit} from '@angular/core';
import {FilterCategoriesDTO} from "../../../../../DTOs/Routine/FilterCategoriesDTO";
import Swal from "sweetalert2";
import {CategoriesManagerService} from "../../../../../Services/categories-manager.service";
import {AccessService} from "../../../../../Services/access.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseResultStatusType} from "../../../../../Utilities/Enums/ResponseResultStatusType";
import {CommonTools} from "../../../../../Utilities/CommonTools";
import {
  AddCategoryFromAdminComponent
} from "../../../../Category/add-category-from-admin/add-category-from-admin.component";

declare function setButtonSniper(selector: string): any;
declare function removeButtonSniper(selector: string): any;

@Component({
  selector: 'app-user-recycle-bin-categories-for-admin',
  templateUrl: './user-recycle-bin-categories-for-admin.component.html',
  styleUrls: ['./user-recycle-bin-categories-for-admin.component.scss']
})
export class UserRecycleBinCategoriesForAdminComponent implements OnInit {

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
              private router: Router) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      let pageId = 1;
      if (params['recyclePageId'] !== undefined) {
        pageId = parseInt(params['categoriesPageId'], 0);
      }

      let search = '';
      if (params['recycleSearch'] !== undefined) {
        search = params['categoriesSearch'];

        this.showFilter = true;
      }

      this.categories.pageId = pageId;
      this.categories.search = search;
    });

    this.loader = false;
  }

  showFilterItems() {

    this.showFilter = !this.showFilter;
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

    setButtonSniper(`#btn-recycle-category-detail-${categoryId}`)

    this.router.navigate(['/Manager/Category', categoryId]);
  }

  deleteCategory(categoryId: string, categoryTitle: string) {

    setButtonSniper(`#delete-category-${categoryId}`);


    this.accessService.roleCheck(['categories-manager']).subscribe(result => {

      removeButtonSniper(`#delete-category-${categoryId}`);


      if (result.status == ResponseResultStatusType.Success) {
        Swal.fire({
          text: `آیا از حذف دسته بندی ${categoryTitle} اطمینان دارید؟`,
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

            this.categoriesManagerService.deleteCategory(categoryId).subscribe(response => {
              if (response.status == ResponseResultStatusType.Success) {

                this.getCategories();

                this.Toast.fire({
                  icon: 'success',
                  title: 'دسته بندی با موفقیت حذف شد.'
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
          title: 'شما دسترسی لازم برای حذف دسته بندی را ندارید.'
        });
      }
    });
  }

  returnCategory(categoryId: string, categoryTitle: string) {

    setButtonSniper(`#return-category-${categoryId}`);


    this.accessService.roleCheck(['categories-manager']).subscribe(result => {

      removeButtonSniper(`#return-category-${categoryId}`);


      if (result.status == ResponseResultStatusType.Success) {
        Swal.fire({
          text: `آیا از بازگشت دسته بندی ${categoryTitle} اطمینان دارید؟`,
          icon: 'warning',
          customClass: {
            confirmButton: 'site-btn success modal-btn',
            cancelButton: 'site-btn danger modal-btn'
          },
          buttonsStyling: false,
          reverseButtons: true,
          showCancelButton: true,
          cancelButtonText: 'لغو',
          confirmButtonText: 'بازگشت'
        }).then((result) => {
          if (result.isConfirmed) {

            this.categoriesManagerService.returnCategory(categoryId).subscribe(response => {
              if (response.status == ResponseResultStatusType.Success) {

                this.getCategories();

                this.Toast.fire({
                  icon: 'success',
                  title: 'دسته بندی با موفقیت برگشت خورد.'
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
          title: 'شما دسترسی لازم برای بازگشت دسته بندی را ندارید.'
        });
      }
    });
  }


  getCategories(): void {
    this.loader = true;

    this.categoriesManagerService.getUserRecycleCategories(this.categories).subscribe(res => {
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

