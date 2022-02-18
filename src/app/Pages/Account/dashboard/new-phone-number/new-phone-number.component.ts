import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UsersService} from "../../../../Services/users.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {UserDashboard} from "../../../../DTOs/Users/UserDashboard";

declare function inputJs(): any;

@Component({
  selector: 'app-new-phone-number',
  templateUrl: './new-phone-number.component.html',
  styleUrls: ['./new-phone-number.component.scss']
})
export class NewPhoneNumberComponent implements OnInit, AfterViewInit {

  public newPhoneNumberForm: any;
  public newPhoneNumberErrorText: string = '';
  public newPhoneNumberFailedCounter: number = 1;
  public newPhoneNumberSniper: boolean = false;


  constructor(private usersService: UsersService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.newPhoneNumberForm = new FormGroup({
      phoneNumber: new FormControl(
        null,
        [
          Validators.required,
          Validators.maxLength(12),
        ]
      )
    });
  }

  ngAfterViewInit(): void {
    inputJs();
  }

  submitNewPhoneNumberForm() {

    if (this.newPhoneNumberForm.valid) {

      let phoneNumber: string = this.newPhoneNumberForm.controls.phoneNumber.value;

      this.newPhoneNumberSniper = true;


      this.usersService.AddUserPhoneNumber(phoneNumber).subscribe(res => {

          this.newPhoneNumberSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.newPhoneNumberErrorText !== null && this.newPhoneNumberErrorText == res.data.message) {
              this.newPhoneNumberFailedCounter++;
            }
            this.newPhoneNumberErrorText = res.data.message;

          } else {
            this.newPhoneNumberForm.reset();

            let currentUserDashboard!: UserDashboard;

            // change user dashboard
            this.usersService.getCurrentUserDashboard().subscribe(response => {
              currentUserDashboard = response;
            });

            if (currentUserDashboard != null) {

              currentUserDashboard.phoneNumber = phoneNumber;

              this.usersService.setCurrentUserDashboard(currentUserDashboard);
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
