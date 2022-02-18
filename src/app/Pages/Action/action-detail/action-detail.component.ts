import {Component, Input, OnInit} from '@angular/core';
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {ActionsService} from "../../../Services/actions.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ActionDetailDTO} from "../../../DTOs/Routine/ActionDetailDTO";

@Component({
  selector: 'app-action-detail',
  templateUrl: './action-detail.component.html',
  styleUrls: ['./action-detail.component.scss']
})
export class ActionDetailComponent implements OnInit {

  // @ts-ignore
  @Input() private actionId;

  // @ts-ignore
  public actionDetail: ActionDetailDTO;

  constructor(private actionsService: ActionsService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.actionId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }

    this.actionsService.getActionDetail(this.actionId).subscribe(response => {
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
