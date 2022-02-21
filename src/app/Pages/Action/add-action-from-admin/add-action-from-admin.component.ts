import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ItemsForSelectDTO} from "../../../DTOs/Common/ItemsForSelectDTO";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AddActionDTO} from "../../../DTOs/Routine/AddActionDTO";
import {ActionsManagerService} from "../../../Services/actions-manager.service";
import {CategoriesManagerService} from "../../../Services/categories-manager.service";

declare function inputJs(): any;

declare function selectDropdown(): any;

@Component({
  selector: 'app-add-action-from-admin',
  templateUrl: './add-action-from-admin.component.html',
  styleUrls: ['./add-action-from-admin.component.scss']
})
export class AddActionFromAdminComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @Input() private userId;


  public newActionForm: any;
  public newActionErrorText: string = '';
  public newActionFailedCounter: number = 1;
  public newActionSniper: boolean = false;

  public categories: ItemsForSelectDTO[] = [
    new ItemsForSelectDTO('', 'دسته بندی')
  ];


  constructor(private actionsManagerService: ActionsManagerService,
              public categoriesManagerService: CategoriesManagerService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.userId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }


    this.categoriesManagerService.getUserCategoriesForSelect(this.userId).subscribe(response => {
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
  }

  ngAfterViewInit(): void {
    inputJs();
    setTimeout(selectDropdown, 200);
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

      this.actionsManagerService.addAction(actionData).subscribe(res => {

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
