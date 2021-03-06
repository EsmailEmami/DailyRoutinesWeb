import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {FilterUserLastActionsDTO} from "../../../../../DTOs/Routine/FilterUserLastActions";
import {GenerateDTO} from "../../../../../Utilities/Generator/GenerateDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseResultStatusType} from "../../../../../Utilities/Enums/ResponseResultStatusType";
import {CommonTools} from "../../../../../Utilities/CommonTools";
import {ActionsManagerService} from "../../../../../Services/actions-manager.service";
import {AddActionFromAdminComponent} from "../../../../Action/add-action-from-admin/add-action-from-admin.component";
import {EditActionFromAdminComponent} from "../../../../Action/edit-action-from-admin/edit-action-from-admin.component";
import {
  ActionDetailFromAdminComponent
} from "../../../../Action/action-detail-from-admin/action-detail-from-admin.component";
import {AccessService} from "../../../../../Services/access.service";

declare function selectDropdown(): any;

declare function updateSelectDropdown(selectId: string, values: { name: string, value: string | number }[]): any;

declare function setButtonSniper(selector: string): any;

declare function removeButtonSniper(selector: string): any;


@Component({
  selector: 'app-user-actions',
  templateUrl: './user-actions.component.html',
  styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent implements OnInit, AfterViewInit {

  @Input('actions') public lastActions!: FilterUserLastActionsDTO;

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
              private accessService: AccessService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {

    this.actionsManagerService.getYearsOfActions(this.lastActions.userId).subscribe(response => {
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
      if (params['actionsYear'] !== undefined) {
        year = parseInt(params['actionsYear'], 0);
      }

      let month = 0;
      if (params['actionsMonth'] !== undefined) {
        month = parseInt(params['actionsMonth'], 0);
      }

      let day = 0;
      if (params['actionsDay'] !== undefined) {
        day = parseInt(params['actionsDay'], 0);
      }

      let pageId = 1;
      if (params['actionsPageId'] !== undefined) {
        pageId = parseInt(params['actionsPageId'], 0);
      }

      let search = '';
      if (params['actionsSearch'] !== undefined) {
        search = params['actionsSearch'];
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

    this.loader = false;
  }

  ngAfterViewInit(): void {
    setTimeout(selectDropdown, 2000);
  }

  showActionsFilterItems() {
    this.showActionsFilter = !this.showActionsFilter;
  }

  newAction() {

    setButtonSniper('#new-action');

    this.accessService.roleCheck(['actions-manager']).subscribe(result => {

      removeButtonSniper('#new-action');

      if (result.status == ResponseResultStatusType.Success) {
        const modalRef = this.modalService.open(AddActionFromAdminComponent);
        modalRef.componentInstance.userId = this.lastActions.userId;

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
      } else {
        this.Toast.fire({
          icon: 'error',
          title: '?????? ???? ?????? ???????? ???????????? ????????????.'
        });
      }
    });
  }

  editAction(actionId: string) {

    setButtonSniper(`#edit-action-${actionId}`);

    this.accessService.roleCheck(['actions-manager']).subscribe(result => {

      removeButtonSniper(`#edit-action-${actionId}`);

      if (result.status == ResponseResultStatusType.Success) {
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
      } else {
        this.Toast.fire({
          icon: 'error',
          title: '?????? ???? ?????? ???????? ???????????? ????????????.'
        });
      }
    });
  }

  actionDetail(actionId: string) {

    setButtonSniper(`#action-detail-${actionId}`);

    this.accessService.roleCheck(['actions-manager']).subscribe(result => {

      removeButtonSniper(`#action-detail-${actionId}`);

      if (result.status == ResponseResultStatusType.Success) {
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
      } else {
        this.Toast.fire({
          icon: 'error',
          title: '?????? ???? ?????? ???????? ???????????? ????????????.'
        });
      }
    });
  }

  deleteAction(actionId: string, actionTitle: string) {

    setButtonSniper(`#delete-action-${actionId}`);

    this.accessService.roleCheck(['actions-manager']).subscribe(result => {

      removeButtonSniper(`#delete-action-${actionId}`);

      if (result.status == ResponseResultStatusType.Success) {
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
        });
      } else {
        this.Toast.fire({
          icon: 'error',
          title: '?????? ???????????? ???????? ???????? ?????? ???????????? ???? ????????????.'
        });
      }
    });
  }

  updateLastActions(pageId?: number): void {

    if (pageId != null) {
      this.lastActions.pageId = pageId;
    }

    this.router.navigate([CommonTools.getCurrentUrlWithoutParams(this.router)], {
      queryParams: {
        actionsYear: this.lastActions.year,
        actionsMonth: this.lastActions.month,
        actionsDay: this.lastActions.day,
        actionsPageId: this.lastActions.pageId,
        actionsSearch: this.lastActions.search,
      },
      queryParamsHandling: 'merge'
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

    this.loader = true;

    this.actionsManagerService.getLastActions(this.lastActions).subscribe(response => {

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
