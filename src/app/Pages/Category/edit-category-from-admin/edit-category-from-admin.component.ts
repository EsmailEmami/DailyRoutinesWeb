import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EditCategory} from "../../../DTOs/Category/EditCategory";
import {CategoriesManagerService} from "../../../Services/categories-manager.service";

declare function inputJs(): any;

@Component({
  selector: 'app-edit-category-from-admin',
  templateUrl: './edit-category-from-admin.component.html',
  styleUrls: ['./edit-category-from-admin.component.scss']
})
export class EditCategoryFromAdminComponent implements OnInit, AfterViewInit {

// @ts-ignore
  @Input() private categoryId;


  public editCategoryForm: any;
  public editCategoryErrorText: string = '';
  public editCategoryFailedCounter: number = 1;
  public editCategorySniper: boolean = false;

  constructor(private categoriesManagerService: CategoriesManagerService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.categoryId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }

    this.categoriesManagerService.getCategoryForEdit(this.categoryId).subscribe(response => {

      if (response.status == ResponseResultStatusType.Success) {
        this.editCategoryForm = new FormGroup({
          categoryTitle: new FormControl(
            response.data.categoryTitle,
            [
              Validators.required,
              Validators.maxLength(50),
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

  submitEditCategoryForm() {
    if (this.editCategoryForm.valid) {

      this.editCategorySniper = true;

      const categoryData = new EditCategory(
        this.categoryId,
        this.editCategoryForm.controls.categoryTitle.value,
      );

      this.categoriesManagerService.editCategory(categoryData).subscribe(res => {

          this.editCategorySniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.editCategoryErrorText !== null && this.editCategoryErrorText == res.message) {
              this.editCategoryFailedCounter++;
            }
            this.editCategoryErrorText = res.message;

          } else {
            this.editCategoryForm.reset();
            this.activeModal.close('دسته بندی با موفقیت ویرایش شد.');
          }
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
