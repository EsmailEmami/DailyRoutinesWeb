import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResponseResultStatusType} from "../../../Utilities/Enums/ResponseResultStatusType";
import {CategoriesService} from "../../../Services/categories.service";
import {AddCategory} from "../../../DTOs/Category/AddCategory";

declare function inputJs(): any;

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  public newCategoryForm: any;
  public newCategoryErrorText: string = '';
  public newCategoryFailedCounter: number = 1;
  public newCategorySniper: boolean = false;


  constructor(private categoriesService: CategoriesService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
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

      const categoryData = new AddCategory(
        this.newCategoryForm.controls.categoryTitle.value
      );

      this.categoriesService.addCategory(categoryData).subscribe(res => {

          this.newCategorySniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.newCategoryErrorText !== null && this.newCategoryErrorText == res.data.message) {
              this.newCategoryFailedCounter++;
            }
            this.newCategoryErrorText = res.data.message;

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
