import {GenerateDTO} from '../../../Utilities/Generator/GenerateDTO';
import {FilterActionsDTO} from '../../../DTOs/Routine/FilterActionsDTO';
import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../Services/categories.service";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {CategoryDetailDTO} from "../../../DTOs/Routine/CategoryDetailDTO";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../DTOs/breadCrumbs/breadCrumbsResponse";
import {ActionsService} from 'src/app/Services/actions.service';
import Swal from 'sweetalert2';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EditActionComponent} from "../../Action/edit-action/edit-action.component";
import {ActionDetailComponent} from "../../Action/action-detail/action-detail.component";
import {EditCategoryComponent} from "../../Category/edit-category/edit-category.component";
import {AddActionToCategoryComponent} from "../../Action/add-action-to-category/add-action-to-category.component";
import {ActionsDateFilter} from "../../../DTOs/Routine/ActionsDateFilter";

@Component({
  selector: 'app-user-full-category-detail',
  templateUrl: './user-full-category-detail.component.html',
  styleUrls: ['./user-full-category-detail.component.scss'],
})
export class UserFullCategoryDetailComponent implements OnInit {

  public loader: boolean = true;

  public showActionsFilter: boolean = false;

  public breadCrumbsData: BreadCrumbsResponse = {breadCrumbsTitle: "", urls: []};

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
  public category: CategoryDetailDTO = null;

  public months: ActionsDateFilter[] = [];

  public lastActions!: FilterActionsDTO;

  public lastActionsPages: number[] = [];

  // new action


  constructor(
    private categoriesService: CategoriesService,
    private actionsService: ActionsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    let categoryId: string = this.activatedRoute.snapshot.params['categoryId'];

    this.lastActions = GenerateDTO.generateFilterActionsDTO(categoryId, 15);

    this.getCategory();

    this.getLastActions();


    // years
    this.categoriesService.getCategoryActionsMonths(categoryId).subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        this.months = response.data;
      }
    });
  }

  showActionsFilterItems() {
    this.showActionsFilter = !this.showActionsFilter;
  }

  getLastActions() {
    this.actionsService.getActionsOfCategory(this.lastActions).subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        this.lastActions = response.data;

        this.lastActionsPages = [];

        for (let i = this.lastActions.startPage; i <= this.lastActions.endPage; i++) {
          this.lastActionsPages.push(i);
        }
      }
    });
  }

  newAction() {
    const modalRef = this.modalService.open(AddActionToCategoryComponent);
    modalRef.componentInstance.categoryId = this.category.categoryId;

    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });

        this.category.actionsCount++;

        this.getLastActions();
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

  editAction(actionId: string) {
    const modalRef = this.modalService.open(EditActionComponent);
    modalRef.componentInstance.actionId = actionId;

    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });

        this.getLastActions();
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

  openActionDetailModal(actionId: string) {
    const modalRef = this.modalService.open(ActionDetailComponent);
    modalRef.componentInstance.actionId = actionId;

    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });

        this.getLastActions();
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

  editCategory() {
    const modalRef = this.modalService.open(EditCategoryComponent);
    modalRef.componentInstance.categoryId = this.category.categoryId;

    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });

        this.updateCategory();
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

  getCategory() {
    this.loader = true;

    this.activatedRoute.data.subscribe((data: Data) => {
      this.category = data['category'];

      this.setBreadCrumbsData(this.category.categoryTitle, this.category.categoryId);

      this.loader = false;
    });
  }

  updateCategory() {
    this.loader = true;

    this.categoriesService.getCategory(this.category.categoryId).subscribe(result => {
      if (result.status != ResponseResultStatusType.Success) {
        this.router.navigate(['NotFound']);
      } else {
        this.category = result.data;
      }
    });

    this.setBreadCrumbsData(this.category.categoryTitle, this.category.categoryId);

    this.loader = false;
  }

  removeCategory(): void {

    this.categoriesService.removeCategory(this.category.categoryId).subscribe(response => {

      switch (response.status) {
        case ResponseResultStatusType.Success: {
          this.Toast.fire({
            icon: 'success',
            title: 'دسته بندی با موفقیت حذف شد.'
          });

          this.router.navigate(['Account/Categories']);
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

  deleteAction(actionId: string, actionTitle: string) {
    Swal.fire({
      text: `آیا از حذف فعالیت ${actionTitle} اطمینان دارید؟`,
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

        this.actionsService.deleteAction(actionId).subscribe(response => {
          if (response.status == ResponseResultStatusType.Success) {

            this.getLastActions();

            this.category.actionsCount--;

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
    })
  }

  setBreadCrumbsData(categoryTitle: string, categoryId: string) {
    this.breadCrumbsData = {
      breadCrumbsTitle: 'مدیریت دسته بندی ' + categoryTitle,
      urls: [
        new UrlOfBreadCrumbs('دسته بندی ها', '/Account/Categories'),
        new UrlOfBreadCrumbs('دسته بندی ' + categoryTitle, '/Account/Categories/' + categoryId, false)
      ]
    }
  }
}
