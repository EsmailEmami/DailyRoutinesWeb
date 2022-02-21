import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../Services/categories.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AddCategory} from "../../../../DTOs/Category/AddCategory";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {AddRoleDTO} from "../../../../DTOs/Access/AddRoleDTO";
import {AccessService} from "../../../../Services/access.service";

declare function inputJs(): any;

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  public newRoleForm: any;
  public newRoleErrorText: string = '';
  public newRoleFailedCounter: number = 1;
  public newRoleSniper: boolean = false;


  constructor(private accessService: AccessService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.newRoleForm = new FormGroup({
      roleName: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(100),
        ]
      ),
    });

    inputJs();
  }

  submitNewRoleForm() {
    if (this.newRoleForm.valid) {

      this.newRoleSniper = true;

      const roleData = new AddRoleDTO(
        this.newRoleForm.controls.roleName.value
      );

      this.accessService.addRole(roleData).subscribe(res => {

          this.newRoleSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.newRoleErrorText !== null && this.newRoleErrorText == res.message) {
              this.newRoleFailedCounter++;
            }
            this.newRoleErrorText = res.message;

          } else {
            this.newRoleForm.reset();
            this.activeModal.close('مقام با موفقیت ثبت شد.');
          }
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
