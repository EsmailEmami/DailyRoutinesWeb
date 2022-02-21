import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {UsersService} from "../../../../Services/users.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ItemsForSelectDTO} from "../../../../DTOs/Common/ItemsForSelectDTO";
import {AccessService} from "../../../../Services/access.service";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EditUserDTO} from "../../../../DTOs/Users/EditUserDTO";

declare function inputJs(): any;

declare function multiSelectDropdown(): any;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @Input() private userId;

  public editUserForm: any;
  public editUserErrorText: string = '';
  public editUserFailedCounter: number = 1;
  public editUserSniper: boolean = false;

  public roles: ItemsForSelectDTO[] = [];


  constructor(private usersService: UsersService,
              private accessService: AccessService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.userId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }

    // set roles
    this.accessService.getRolesForSelect().subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        for (let i = 0; i < response.data.length; i++) {
          this.roles.push(response.data[i]);
        }
      }
    });

    // set edit user form
    this.usersService.getUserForEdit(this.userId).subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        this.editUserForm = new FormGroup({
          firstName: new FormControl(
            response.data.firstName,
            [
              Validators.required,
              Validators.maxLength(50),
            ]
          ),
          lastName: new FormControl(
            response.data.lastName,
            [
              Validators.required,
              Validators.maxLength(50)
            ]
          ),
          phoneNumber: new FormControl(
            response.data.phoneNumber,
            [
              Validators.maxLength(12)
            ]
          ),
          email: new FormControl(
            response.data.email,
            [
              Validators.required,
              Validators.maxLength(100),
              Validators.email
            ]
          ),
          roles: new FormControl(
            response.data.roles
          ),
        });
      } else {
        this.activeModal.dismiss(response.message);
      }
    });

  }

  ngAfterViewInit(): void {
    inputJs();
    multiSelectDropdown();
  }

  submitEditUserForm() {
    if (this.editUserForm.valid) {

      let selectedRoles: string[] = [];

      if (this.editUserForm.controls.roles.value != undefined)
      {
        selectedRoles = this.editUserForm.controls.roles.value;
      }

      this.editUserSniper = true;

      const userData = new EditUserDTO(
        this.userId,
        this.editUserForm.controls.firstName.value,
        this.editUserForm.controls.lastName.value,
        this.editUserForm.controls.phoneNumber.value,
        this.editUserForm.controls.email.value,
        selectedRoles
      );

      this.usersService.editUser(userData).subscribe(res => {

          this.editUserSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.editUserErrorText !== null && this.editUserErrorText == res.message) {
              this.editUserFailedCounter++;
            }
            this.editUserErrorText = res.message;

          } else {
            this.editUserForm.reset();
            this.activeModal.close('کاربر با موفقیت ویرایش شد.');
          }
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
