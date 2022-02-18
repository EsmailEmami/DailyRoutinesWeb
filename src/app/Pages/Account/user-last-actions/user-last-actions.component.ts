import {Component, OnInit} from '@angular/core';
import {FilterUserLastActionsDTO} from "../../../DTOs/Routine/FilterUserLastActions";
import {GenerateDTO} from "../../../Utilities/Generator/GenerateDTO";
import {ActionsService} from "../../../Services/actions.service";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BreadCrumbsResponse, UrlOfBreadCrumbs} from "../../../DTOs/breadCrumbs/breadCrumbsResponse";
import Swal from "sweetalert2";
import {AddActionComponent} from "../../Action/add-action/add-action.component";
import {EditActionComponent} from "../../Action/edit-action/edit-action.component";
import {ActionDetailComponent} from "../../Action/action-detail/action-detail.component";
import {CommonTools} from "../../../Utilities/CommonTools";

declare function selectDropdown(): any;

declare function updateSelectDropdown(selectId: string, values: { name: string, value: string | number }[]): any;


@Component({
  selector: 'app-user-last-actions',
  templateUrl: './user-last-actions.component.html',
  styleUrls: ['./user-last-actions.component.scss']
})
export class UserLastActionsComponent implements OnInit {

  public breadCrumbsData: BreadCrumbsResponse = {
    breadCrumbsTitle: "فعالیت ها",
    urls: [
      new UrlOfBreadCrumbs('فعالیت ها', '/Account/Actions',false)
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

  public showActionsFilter: boolean = false;
  public lastActions: FilterUserLastActionsDTO = GenerateDTO.generateFilterUserLastActionsDTO(15);
  public pages: number[] = [];

  public years: { name: string, value: number }[] = [
    {
      name: 'همه سال ها',
      value: 0
    }
  ];
  public months: { name: string, value: string }[] = [];
  public days: { name: string, value: number }[] = [];


  constructor(private actionsService: ActionsService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {

    this.actionsService.getYearsOfActions().subscribe(response => {
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

      this.months = CommonTools.GetMonths(this.lastActions.year, 'همه ماه ها');
      this.days = CommonTools.GetMonthDays(this.lastActions.month, 'همه روز ها');

      this.getLastActions();
    });

    setTimeout(selectDropdown, 500);
  }

  showActionsFilterItems() {
    this.showActionsFilter = !this.showActionsFilter;
  }

  newAction() {
    const modalRef = this.modalService.open(AddActionComponent);
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

  actionDetail(actionId: string) {
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
  }

  updateSelect(selectId: string) {
    switch (selectId) {
      case 'month-section': {
        updateSelectDropdown('month-section', CommonTools.GetMonths(this.lastActions.year, 'همه ماه ها'));
        updateSelectDropdown('day-section', CommonTools.GetMonthDays(this.lastActions.month, 'همه روز ها'));

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

    this.loader = true;

    this.actionsService.getLastActions(this.lastActions).subscribe(response => {

      this.loader = false;

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
  }
}
