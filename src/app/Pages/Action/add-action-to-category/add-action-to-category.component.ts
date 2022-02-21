import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AddActionDTO} from "../../../DTOs/Routine/AddActionDTO";
import {ActionsService} from "../../../Services/actions.service";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";

declare function inputJs(): any;

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action-to-category.component.html',
  styleUrls: ['./add-action-to-category.component.scss']
})
export class AddActionToCategoryComponent implements OnInit {

  // @ts-ignore
  @Input() private categoryId;

  public newActionForm: any;
  public newActionErrorText: string = '';
  public newActionFailedCounter: number = 1;
  public newActionSniper: boolean = false;


  constructor(private actionsService: ActionsService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.categoryId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }
    this.newActionForm = new FormGroup({
      actionTitle: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(100),
        ]
      ),
      actionDescription: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(3000)
        ]
      ),
    });

    inputJs();
  }

  submitNewActionForm() {
    if (this.newActionForm.valid) {

      this.newActionSniper = true;

      const actionData = new AddActionDTO(
        this.categoryId,
        this.newActionForm.controls.actionTitle.value,
        this.newActionForm.controls.actionDescription.value,
      );

      this.actionsService.addAction(actionData).subscribe(res => {

          this.newActionSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.newActionErrorText !== null && this.newActionErrorText == res.message) {
              this.newActionFailedCounter++;
            }
            this.newActionErrorText = res.message;

          } else {
            this.newActionForm.reset();
            this.activeModal.close('فعالیت با موفقیت ثبت شد.');
          }
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
