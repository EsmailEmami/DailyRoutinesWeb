import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EditActionDTO} from "../../../DTOs/Routine/EditActionDTO";
import {ActionsManagerService} from "../../../Services/actions-manager.service";

declare function inputJs(): any;

@Component({
  selector: 'app-edit-action-from-admin',
  templateUrl: './edit-action-from-admin.component.html',
  styleUrls: ['./edit-action-from-admin.component.scss']
})
export class EditActionFromAdminComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @Input() private actionId;


  public editActionForm: any;
  public editActionErrorText: string = '';
  public editActionFailedCounter: number = 1;
  public editActionSniper: boolean = false;


  constructor(private actionsManagerService: ActionsManagerService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.actionId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }

    this.actionsManagerService.getActionForEdit(this.actionId).subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        this.editActionForm = new FormGroup({
          actionTitle: new FormControl(
            response.data.actionTitle,
            [
              Validators.required,
              Validators.maxLength(100),
            ]
          ),
          actionDescription: new FormControl(
            response.data.actionDescription,
            [
              Validators.required,
              Validators.maxLength(3000)
            ]
          ),
        });

      } else {
        this.activeModal.dismiss(response.message);
      }
    });
  }

  ngAfterViewInit(): void {
    inputJs();
  }

  submitEditActionForm() {
    if (this.editActionForm.valid) {

      console.log(this.editActionForm);

      this.editActionSniper = true;

      const actionData = new EditActionDTO(
        this.actionId,
        this.editActionForm.controls.actionTitle.value,
        this.editActionForm.controls.actionDescription.value,
      );

      this.actionsManagerService.editAction(actionData).subscribe(res => {

          this.editActionSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.editActionErrorText !== null && this.editActionErrorText == res.message) {
              this.editActionFailedCounter++;
            }
            this.editActionErrorText = res.message;

          } else {
            this.editActionForm.reset();
            this.activeModal.close('فعالیت با موفقیت ویرایش شد.');
          }
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
