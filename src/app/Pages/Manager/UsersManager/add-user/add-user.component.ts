import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ItemsForSelectDTO} from "../../../../DTOs/Common/ItemsForSelectDTO";
import {UsersService} from "../../../../Services/users.service";
import {AccessService} from "../../../../Services/access.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AddUserDTO} from "../../../../DTOs/Users/AddUserDTO";

declare function inputJs(): any;

declare function multiSelectDropdown(): any;

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, AfterViewInit {

  public addUserForm: any;
  public addUserErrorText: string = '';
  public addUserFailedCounter: number = 1;
  public addUserSniper: boolean = false;

  public roles: ItemsForSelectDTO[] = [];


  constructor(private usersService: UsersService,
              private accessService: AccessService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {

    // set roles
    this.accessService.getRolesForSelect().subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        for (let i = 0; i < response.data.length; i++) {
          this.roles.push(response.data[i]);
        }
      }
    });

    // set new user form

    this.addUserForm = new FormGroup({
      firstName: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(50),
        ]
      ),
      lastName: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ),
      phoneNumber: new FormControl(
        null,
        [
          Validators.maxLength(12)
        ]
      ),
      email: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.email
        ]
      ),
      roles: new FormControl(
        null
      ),
      password: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ),
      confirmPassword: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ),
    });
  }

  ngAfterViewInit(): void {
    inputJs();
    multiSelectDropdown();
  }

  submitAddUserForm() {
    if (this.addUserForm.valid) {

      let selectedRoles: string[] = [];

      if (this.addUserForm.controls.roles.value != undefined) {
        selectedRoles = this.addUserForm.controls.roles.value;
      }

      this.addUserSniper = true;

      const userData = new AddUserDTO(
        this.addUserForm.controls.firstName.value,
        this.addUserForm.controls.lastName.value,
        this.addUserForm.controls.phoneNumber.value,
        this.addUserForm.controls.email.value,
        selectedRoles,
        this.addUserForm.controls.password.value,
        this.addUserForm.controls.confirmPassword.value
      );

      this.usersService.addUser(userData).subscribe(res => {

          this.addUserSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.addUserErrorText !== null && this.addUserErrorText == res.message) {
              this.addUserFailedCounter++;
            }
            this.addUserErrorText = res.message;

          } else {
            this.addUserForm.reset();
            this.activeModal.close('کاربر با موفقیت افزوده شد.');
          }
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
