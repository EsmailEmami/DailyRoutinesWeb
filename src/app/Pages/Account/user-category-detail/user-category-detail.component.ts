import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router} from "@angular/router";
import {CommonTools} from "../../../Utilities/CommonTools";
import {CategoriesService} from "../../../Services/categories.service";
import {CategoryDetailDTO} from "../../../DTOs/Routine/CategoryDetailDTO";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import Swal from "sweetalert2";
import {UserCategoriesComponent} from "../user-categories/user-categories.component";

declare function removeButtonSniper(selector: string): any;

@Component({
  selector: 'app-user-category-detail',
  templateUrl: './user-category-detail.component.html',
  styleUrls: ['./user-category-detail.component.scss']
})
export class UserCategoryDetailComponent implements OnInit {

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

  private categoryId: string = '';

// @ts-ignore
  category: CategoryDetailDTO = null;

  constructor(private categoriesService: CategoriesService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              @Inject(UserCategoriesComponent) private parent: UserCategoriesComponent) {
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      this.categoryId = params['categoryId'];

      if (this.categoryId == null) {
        this.router.navigate(['NotFound']);
      }

      this.getCategoryDetail();
    });

    this.loader = false;
  }


  hide(): void {
    let params = CommonTools.GetUrlParams(this.activatedRoute);

    this.router.navigate(['Account/Categories'], {
      queryParams: params
    });
  }

  removeCategory(): void {

    this.categoriesService.removeCategory(this.categoryId).subscribe(response => {

      switch (response.status) {
        case ResponseResultStatusType.Success: {
          this.Toast.fire({
            icon: 'success',
            title: 'دسته بندی با موفقیت حذف شد.'
          });

          this.parent.getCategories();
          this.hide();

          break;
        }
        case ResponseResultStatusType.Error: {
          this.Toast.fire({
            icon: 'error',
            title: response.message
          });
          break;
        }
        case ResponseResultStatusType.NotFound: {
          this.Toast.fire({
            icon: 'warning',
            title: response.message
          });
          break;
        }
      }
    })
  }

  getCategoryDetail(): void {

    this.activatedRoute.data.subscribe((data: Data) => {
      this.category = data['category'];
      });
    removeButtonSniper(`#btn-detail-${this.categoryId}`);
  }

}
