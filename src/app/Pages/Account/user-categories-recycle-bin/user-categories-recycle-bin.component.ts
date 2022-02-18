import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {FilterCategoriesDTO} from "../../../DTOs/Routine/FilterCategoriesDTO";
import {GenerateDTO} from "../../../Utilities/Generator/GenerateDTO";
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../DTOs/breadCrumbs/breadCrumbsResponse";
import {CommonTools} from "../../../Utilities/CommonTools";
import {CategoriesService} from "../../../Services/categories.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";

@Component({
  selector: 'app-user-categories-recycle-bin',
  templateUrl: './user-categories-recycle-bin.component.html',
  styleUrls: ['./user-categories-recycle-bin.component.scss']
})
export class UserCategoriesRecycleBinComponent implements OnInit {

  breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "بازیافت",
    urls: [
      new UrlOfBreadCrumbs('بازیافت دسته بندی ها', '/Account/CategoriesRecycleBin',false)
    ]
  };

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

  // @ts-ignore
  categories: FilterCategoriesDTO = GenerateDTO.generateFilterCategoriesDTO(10);

  pages: number[] = [];

  showFilter = false;


  constructor(private categoriesService: CategoriesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let pageId = 1;
      if (params['pageId'] !== undefined) {
        pageId = parseInt(params['pageId'], 0);
      }

      let search = '';
      if (params['search'] !== undefined) {
        search = params['search'];
      }


      this.categories.pageId = pageId;
      this.categories.search = search;
      this.getCategories();
    });
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
        pageId: this.categories.pageId,
        search: this.categories.search
      }
    });
  }

  deleteCategory(categoryId: string, categoryTitle: string) {
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

        this.categoriesService.deleteCategory(categoryId).subscribe(response => {
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
    })
  }


  returnCategory(categoryId: string, categoryTitle: string) {
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

        this.categoriesService.returnCategory(categoryId).subscribe(response => {
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
    })
  }

  getCategories(): void {
    this.categoriesService.getUserRecycleCategories(this.categories).subscribe(res => {
      this.loader = false;
      if (res.status == ResponseResultStatusType.Success) {
        this.categories = res.data;
        this.pages = [];
        for (let i = this.categories.startPage; i <= this.categories.endPage; i++) {
          this.pages.push(i);
        }
      }
    });
  }
}
