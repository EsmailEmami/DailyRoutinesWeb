import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AddActionDTO} from "../../../DTOs/Routine/AddActionDTO";
import {ActionsService} from "../../../Services/actions.service";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {ItemsForSelectDTO} from "../../../DTOs/Common/ItemsForSelectDTO";
import {CategoriesService} from "../../../Services/categories.service";

declare function inputJs(): any;

declare function selectDropdown(): any;

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss']
})
export class AddActionComponent implements OnInit {

  public newActionForm: any;
  public newActionErrorText: string = '';
  public newActionFailedCounter: number = 1;
  public newActionSniper: boolean = false;

  public categories: ItemsForSelectDTO[] = [
    new ItemsForSelectDTO('', 'دسته بندی')
  ];


  constructor(private actionsService: ActionsService,
              public categoriesService: CategoriesService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.categoriesService.getUserCategoriesForSelect().subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        for (let i = 0; i < response.data.length; i++) {
          this.categories.push(response.data[i]);
        }
      }
    })

    this.newActionForm = new FormGroup({
      category: new FormControl(
        this.categories[0],
        [
          Validators.required,
        ]
      ),
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
    setTimeout(selectDropdown, 1);
  }

  submitNewActionForm() {

    let categoryId: string = this.newActionForm.controls.category.value.value;

    if (categoryId == null || categoryId == '' || categoryId == undefined) {
      this.newActionForm.controls.category.setErrors({
        'required': true
      })
    } else if (this.newActionForm.valid) {

      this.newActionSniper = true;


      const actionData = new AddActionDTO(
        categoryId,
        this.newActionForm.controls.actionTitle.value,
        this.newActionForm.controls.actionDescription.value,
      );

      this.actionsService.addAction(actionData).subscribe(res => {

          this.newActionSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.newActionErrorText !== null && this.newActionErrorText == res.data.message) {
              this.newActionFailedCounter++;
            }
            this.newActionErrorText = res.data.message;

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
