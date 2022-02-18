import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../Services/categories.service";
import {FilterCategoriesDTO} from "../../../DTOs/Routine/FilterCategoriesDTO";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../DTOs/breadCrumbs/breadCrumbsResponse";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonTools} from "../../../Utilities/CommonTools";
import {GenerateDTO} from "../../../Utilities/Generator/GenerateDTO";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {AddCategoryComponent} from "../../Category/add-category/add-category.component";

declare function selectDropdown(): any;

@Component({
  selector: 'app-user-categories',
  templateUrl: './user-categories.component.html',
  styleUrls: ['./user-categories.component.scss']
})
export class UserCategoriesComponent implements OnInit {

  breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "دسته بندی ها",
    urls: [
      new UrlOfBreadCrumbs('دسته بندی ها', '/Account/Categories')
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
              private router: Router,
              private modalService: NgbModal) {
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

      let orderBy = 'UpdateDate';
      if (params['orderBy'] !== undefined) {
        orderBy = params['orderBy'];
      }


      this.categories.pageId = pageId;
      this.categories.search = search;
      this.categories.orderBy = orderBy;
      this.getCategories();
    });
  }

  showFilterItems() {

    setTimeout(selectDropdown, 1);

    this.showFilter = !this.showFilter;
  }

  openNewCategoryModal() {
    const modalRef = this.modalService.open(AddCategoryComponent);

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
  }

  updateCategories(pageId?: number): void {

    if (pageId != null) {
      this.categories.pageId = pageId;
    }

    this.router.navigate([CommonTools.getCurrentUrlWithoutParams(this.router)], {
      queryParams: {
        pageId: this.categories.pageId,
        search: this.categories.search,
        orderBy: this.categories.orderBy
      }
    });
  }

  ShowCategoryDetail(categoryId: string) {
    this.router.navigate(['/Account/Categories/Show', categoryId], {
      queryParams: {
        pageId: this.categories.activePage,
        search: this.categories.search,
        orderBy: this.categories.orderBy
      }
    });
  }

  getCategories(): void {
      this.categoriesService.getUserCategories(this.categories).subscribe(res => {
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
