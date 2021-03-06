import {Component, OnInit} from '@angular/core';
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../../DTOs/breadCrumbs/breadCrumbsResponse";
import Swal from "sweetalert2";
import {FilterActionsDTO} from "../../../../DTOs/Routine/FilterActionsDTO";
import {ActivatedRoute, Data, Params, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GenerateDTO} from "../../../../Utilities/Generator/GenerateDTO";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {CommonTools} from "../../../../Utilities/CommonTools";
import {ActionsManagerService} from "../../../../Services/actions-manager.service";
import {CategoriesManagerService} from "../../../../Services/categories-manager.service";
import {CategoryDetailForAdminDTO} from "../../../../DTOs/Routine/CategoryDetailForAdminDTO";
import {
  AddActionToCategoryFromAdminComponent
} from "../../../Action/add-action-to-category-from-admin/add-action-to-category-from-admin.component";
import {
  ActionDetailFromAdminComponent
} from "../../../Action/action-detail-from-admin/action-detail-from-admin.component";
import {
  EditCategoryFromAdminComponent
} from "../../../Category/edit-category-from-admin/edit-category-from-admin.component";
import {EditActionFromAdminComponent} from "../../../Action/edit-action-from-admin/edit-action-from-admin.component";

declare function selectDropdown(): any;

declare function updateSelectDropdown(selectId: string, values: { name: string, value: string | number }[]): any;

@Component({
  selector: 'app-user-full-category-detail-for-admin',
  templateUrl: './user-full-category-detail-for-admin.component.html',
  styleUrls: ['./user-full-category-detail-for-admin.component.scss']
})
export class UserFullCategoryDetailForAdminComponent implements OnInit {

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

  private categoryId: string = '';

  public category!: CategoryDetailForAdminDTO;

  public categoryLoader: boolean = true;
  public actionsLoader: boolean = true;

  public showActionsFilter: boolean = false;
  public lastActions!: FilterActionsDTO;
  public pages: number[] = [];

  public years: { name: string, value: number }[] = [
    {
      name: '?????? ?????? ????',
      value: 0
    }
  ];
  public months: { name: string, value: string }[] = [];
  public days: { name: string, value: number }[] = [];

  constructor(private actionsManagerService: ActionsManagerService,
              private categoriesManagerService: CategoriesManagerService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {

    this.categoryId = this.activatedRoute.snapshot.params['categoryId'];

    this.activatedRoute.data.subscribe((data: Data) => {
      this.category = data['category'];
      this.lastActions = data['actions'];
    });

    this.setBreadCrumbsData(this.category.categoryTitle, this.category.fullName, this.category.categoryId, this.category.userId);


    this.categoriesManagerService.getYearsOfCategoryActions(this.categoryId).subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {

        for (let i = 0; i < response.data.length; i++) {
          this.years.push({
            name: response.data[i].toString(),
            value: response.data[i]
          })
        }
      }
    });


    this.activatedRoute.queryParams.subscribe(params => {

      let year = 0;
      if (params['year'] !== undefined) {
        year = parseInt(params['year'], 0);
      }

      let month = 0;
      if (params['month'] !== undefined) {
        month = parseInt(params['month'], 0);
      }

      let day = 0;
      if (params['day'] !== undefined) {
        day = parseInt(params['day'], 0);
      }

      let pageId = 1;
      if (params['pageId'] !== undefined) {
        pageId = parseInt(params['pageId'], 0);
      }

      let search = '';
      if (params['search'] !== undefined) {
        search = params['search'];
        this.showActionsFilter = true;
      }

      this.lastActions.year = year;
      this.lastActions.month = month;
      this.lastActions.day = day;
      this.lastActions.pageId = pageId;
      this.lastActions.search = search;

      this.months = CommonTools.GetMonths(this.lastActions.year, '?????? ?????? ????');
      this.days = CommonTools.GetMonthDays(this.lastActions.month, '?????? ?????? ????');

    });

    setTimeout(selectDropdown, 500);

    this.categoryLoader = false;
    this.actionsLoader = false;
  }

  showActionsFilterItems() {
    this.showActionsFilter = !this.showActionsFilter;
  }

  getCategory() {
    this.categoryLoader = false;


    this.categoriesManagerService.getCategory(this.categoryId).subscribe(res => {

      if (res.status == ResponseResultStatusType.Success) {
        this.category = res.data;

        this.setBreadCrumbsData(res.data.categoryTitle, res.data.fullName, res.data.categoryId, res.data.userId);
      } else {
        this.router.navigate(['NotFound']);
      }
    });

    this.categoryLoader = false;
  }

  newAction() {
    const modalRef = this.modalService.open(AddActionToCategoryFromAdminComponent);
    modalRef.componentInstance.categoryId = this.categoryId;
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
    const modalRef = this.modalService.open(EditActionFromAdminComponent);
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

  actionDetail(actionId: string) {
    const modalRef = this.modalService.open(ActionDetailFromAdminComponent);
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

  deleteAction(actionId: string, actionTitle: string) {
    Swal.fire({
      text: `?????? ???? ?????? ???????????? ${actionTitle} ?????????????? ????????????`,
      icon: 'warning',
      customClass: {
        confirmButton: 'site-btn success modal-btn',
        cancelButton: 'site-btn danger modal-btn'
      },
      buttonsStyling: false,
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonText: '??????',
      confirmButtonText: '??????'
    }).then((result) => {
      if (result.isConfirmed) {

        this.actionsManagerService.deleteAction(actionId).subscribe(response => {
          if (response.status == ResponseResultStatusType.Success) {

            this.category.actionsCount--;

            this.getLastActions();

            this.Toast.fire({
              icon: 'success',
              title: '???????????? ???? ???????????? ?????? ????.'
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

  removeCategory(): void {

    this.categoriesManagerService.removeCategory(this.category.categoryId).subscribe(response => {

      switch (response.status) {
        case ResponseResultStatusType.Success: {
          this.Toast.fire({
            icon: 'success',
            title: '???????? ???????? ???? ???????????? ?????? ????.'
          });

          this.category.isDelete = true;

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

  returnCategory() {
    Swal.fire({
      text: `?????? ???? ???????????? ???????? ???????? ${this.category.categoryTitle} ?????????????? ????????????`,
      icon: 'warning',
      customClass: {
        confirmButton: 'site-btn success modal-btn',
        cancelButton: 'site-btn danger modal-btn'
      },
      buttonsStyling: false,
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonText: '??????',
      confirmButtonText: '????????????'
    }).then((result) => {
      if (result.isConfirmed) {

        this.categoriesManagerService.returnCategory(this.category.categoryId).subscribe(response => {
          if (response.status == ResponseResultStatusType.Success) {

            this.category.isDelete = false;

            this.Toast.fire({
              icon: 'success',
              title: '???????? ???????? ???? ???????????? ?????????? ????????.'
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

  editCategory() {
    const modalRef = this.modalService.open(EditCategoryFromAdminComponent);
    modalRef.componentInstance.categoryId = this.category.categoryId;

    modalRef.result.then((result: string) => {
      if (result) {
        this.Toast.fire({
          icon: 'success',
          title: result
        });

        this.getCategory();
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

  updateLastActions(pageId?: number): void {
    if (pageId != null) {
      this.lastActions.pageId = pageId;
    }

    let params: Params = {
      pageId: this.lastActions.pageId,
      search: this.lastActions.search,
    }

    if (this.lastActions.year != 0) {
      params = {
        year: this.lastActions.year,
        pageId: this.lastActions.pageId,
        search: this.lastActions.search,
      }
    } else {
      this.lastActions.month = 0;
      this.lastActions.day = 0;
    }

    if (this.lastActions.year != 0 && this.lastActions.month != 0) {
      params = {
        year: this.lastActions.year,
        month: this.lastActions.month,
        pageId: this.lastActions.pageId,
        search: this.lastActions.search,
      }
    } else {
      this.lastActions.day = 0;
    }

    if (this.lastActions.year != 0 && this.lastActions.month != 0 && this.lastActions.day != 0) {
      params = {
        year: this.lastActions.year,
        month: this.lastActions.month,
        day: this.lastActions.day,
        pageId: this.lastActions.pageId,
        search: this.lastActions.search,
      }
    }

    this.router.navigate([CommonTools.getCurrentUrlWithoutParams(this.router)], {
      queryParams: params
    });

    this.getLastActions();
  }

  updateSelect(selectId: string) {
    switch (selectId) {
      case 'month-section': {
        updateSelectDropdown('month-section', CommonTools.GetMonths(this.lastActions.year, '?????? ?????? ????'));
        updateSelectDropdown('day-section', CommonTools.GetMonthDays(this.lastActions.month, '?????? ?????? ????'));

        break;
      }
      case 'day-section': {
        updateSelectDropdown('day-section', CommonTools.GetMonthDays(this.lastActions.month));

        break;
      }
    }

    this.updateLastActions();
  }

  getLastActions() {

    this.actionsLoader = true;

    this.actionsManagerService.getActionsOfCategory(this.lastActions).subscribe(response => {

      if (response.status == ResponseResultStatusType.Success) {
        this.lastActions = response.data;
        this.pages = [];

        for (let i = this.lastActions.startPage; i <= this.lastActions.endPage; i++) {
          this.pages.push(i);
        }
      } else {
        this.router.navigate(['NotFound'])
      }
    });

    this.actionsLoader = false;
  }

  setBreadCrumbsData(categoryTitle: string, fullName: string, categoryId: string, userId: string) {
    this.breadCrumbsData = {
      breadCrumbsTitle: '???????????? ???????? ???????? ' + categoryTitle,
      urls: [
        new UrlOfBreadCrumbs('??????????????', '/Manager/Users'),
        new UrlOfBreadCrumbs('?????????? ' + fullName, '/Manager/Users/' + userId),
        new UrlOfBreadCrumbs('???????? ???????? ' + categoryTitle, '/Manager/Category/' + categoryId, false)
      ]
    }
  }
}
