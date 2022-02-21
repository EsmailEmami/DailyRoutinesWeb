import {Component, Input, OnInit} from '@angular/core';
import {ActionDetailDTO} from "../../../DTOs/Routine/ActionDetailDTO";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {ActionsManagerService} from "../../../Services/actions-manager.service";

@Component({
  selector: 'app-action-detail-from-admin',
  templateUrl: './action-detail-from-admin.component.html',
  styleUrls: ['./action-detail-from-admin.component.scss']
})
export class ActionDetailFromAdminComponent implements OnInit {

  // @ts-ignore
  @Input() private actionId;

  // @ts-ignore
  public actionDetail: ActionDetailDTO;

  constructor(private actionsManagerService: ActionsManagerService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.actionId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }

    this.actionsManagerService.getActionDetail(this.actionId).subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        this.actionDetail = response.data;
      } else {
        this.activeModal.dismiss(response.message);
      }
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}
