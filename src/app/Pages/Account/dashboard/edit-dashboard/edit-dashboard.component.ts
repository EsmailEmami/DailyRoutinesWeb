import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthenticationService} from "../../../../Services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../../Services/users.service";
import {EditDashboardDTO} from "../../../../DTOs/Users/EditDashboardDTO";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {UserDashboard} from "../../../../DTOs/Users/UserDashboard";
import {CurrentUser} from "../../../../DTOs/Account/CurrentUser";

declare function inputJs(): any;

@Component({
  selector: 'app-edit-dashboard',
  templateUrl: './edit-dashboard.component.html',
  styleUrls: ['./edit-dashboard.component.scss']
})
export class EditDashboardComponent implements OnInit, AfterViewInit {

  public editDashboardForm: any;
  public editDashboardErrorText: string = '';
  public editDashboardFailedCounter: number = 1;
  public editDashboardSniper: boolean = false;


  constructor(private authenticationService: AuthenticationService,
              private usersService: UsersService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {

    let firstName;
    let lastName;

    this.usersService.getCurrentUserDashboard().subscribe(response => {
      firstName = response.firstName;
      lastName = response.lastName;
    });

    this.editDashboardForm = new FormGroup({
      firstName: new FormControl(
        firstName,
        [
          Validators.required,
          Validators.maxLength(50),
        ]
      ),
      lastName: new FormControl(
        lastName,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ),
    });
  }

  ngAfterViewInit(): void {
    inputJs();
  }

  submitEditDashboardForm() {

    if (this.editDashboardForm.valid) {

      this.editDashboardSniper = true;

      const userData = new EditDashboardDTO(
        this.editDashboardForm.controls.firstName.value,
        this.editDashboardForm.controls.lastName.value,
      );

      this.usersService.editUserDashboard(userData).subscribe(res => {

          this.editDashboardSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.editDashboardErrorText !== null && this.editDashboardErrorText == res.message) {
              this.editDashboardFailedCounter++;
            }
            this.editDashboardErrorText = res.message;

          } else {
            this.editDashboardForm.reset();

            let currentUserDashboard!: UserDashboard;

            // change user dashboard
            this.usersService.getCurrentUserDashboard().subscribe(response => {
              currentUserDashboard = response;
            });

            if (currentUserDashboard != null) {

              currentUserDashboard.firstName = userData.firstName;
              currentUserDashboard.lastName = userData.lastName;

              this.usersService.setCurrentUserDashboard(currentUserDashboard);
            }

            let currentUser!: CurrentUser;

            // change current user data
            this.authenticationService.getCurrentUser().subscribe(response => {
              currentUser = response;
            });

            if (currentUser != null) {

              currentUser.firstName = userData.firstName;
              currentUser.lastName = userData.lastName;

              this.authenticationService.setCurrentUser(currentUser);
            }

            this.activeModal.close('مشخصات شما با موفقیت ویرایش شد.');
          }
        }
      );
    }

  }

  closeModal() {
    this.activeModal.close();
  }
}
