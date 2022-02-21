import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {FilterCategoriesDTO} from "../../../../../DTOs/Routine/FilterCategoriesDTO";
import {GenerateDTO} from "../../../../../Utilities/Generator/GenerateDTO";
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

declare function selectDropdown(): any;

@Component({
  selector: 'app-user-categories-for-admin',
  templateUrl: './user-categories-for-admin.component.html',
  styleUrls: ['./user-categories-for-admin.component.scss']
})
export class UserCategoriesForAdminComponent implements OnInit, AfterViewInit {

  @Input('userId') public userId!: string;

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
  categories: FilterCategoriesDTO;

  pages: number[] = [];

  showFilter = false;

  constructor(private categoriesManagerService: CategoriesManagerService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
    if (this.userId == null) {
      this.router.navigate(['NotFound']);
    }

    this.categories = GenerateDTO.generateFilterCategoriesDTO(10, this.userId);

    this.activatedRoute.queryParams.subscribe(params => {
      let pageId = 1;
      if (params['categoriesPageId'] !== undefined) {
        pageId = parseInt(params['categoriesPageId'], 0);
      }

      let search = '';
      if (params['categoriesSearch'] !== undefined) {
        search = params['categoriesSearch'];
      }

      let orderBy = 'UpdateDate';
      if (params['categoriesOrderBy'] !== undefined) {
        orderBy = params['categoriesOrderBy'];
      }


      this.categories.pageId = pageId;
      this.categories.search = search;
      this.categories.orderBy = orderBy;
      this.getCategories();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(selectDropdown, 500);
  }

  showFilterItems() {

    this.showFilter = !this.showFilter;
  }

  addCategory() {
    const modalRef = this.modalService.open(AddCategoryFromAdminComponent);
    modalRef.componentInstance.userId = this.userId;

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

  editCategory(categoryId: string) {
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
  }

  getCategories(): void {
    this.categoriesManagerService.getUserCategories(this.categories).subscribe(res => {
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
