import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {CategoriesManagerService} from "../../../Services/categories-manager.service";
import {AddCategoryFromAdminDTO} from "../../../DTOs/Category/AddCategoryFromAdminDTO";

declare function inputJs(): any;

@Component({
  selector: 'app-add-category-from-admin',
  templateUrl: './add-category-from-admin.component.html',
  styleUrls: ['./add-category-from-admin.component.scss']
})
export class AddCategoryFromAdminComponent implements OnInit {

  // @ts-ignore
  @Input() private userId;

  public newCategoryForm: any;
  public newCategoryErrorText: string = '';
  public newCategoryFailedCounter: number = 1;
  public newCategorySniper: boolean = false;


  constructor(private categoriesManagerService: CategoriesManagerService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.userId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }

    this.newCategoryForm = new FormGroup({
      categoryTitle: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(50),
        ]
      ),
    });

    inputJs();
  }

  submitNewCategoryForm() {
    if (this.newCategoryForm.valid) {

      this.newCategorySniper = true;

      const categoryData = new AddCategoryFromAdminDTO(
        this.userId,
        this.newCategoryForm.controls.categoryTitle.value
      );

      this.categoriesManagerService.addCategory(categoryData).subscribe(res => {

          this.newCategorySniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.newCategoryErrorText !== null && this.newCategoryErrorText == res.message) {
              this.newCategoryFailedCounter++;
            }
            this.newCategoryErrorText = res.message;

          } else {
            this.newCategoryForm.reset();
            this.activeModal.close('دسته بندی با موفقیت ثبت شد.');
          }
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
