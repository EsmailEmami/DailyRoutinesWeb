import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthenticationService} from "../../../../Services/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../../Services/users.service";

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


      // const actionData = new AddActionDTO(
      //   categoryId,
      //   this.newActionForm.controls.actionTitle.value,
      //   this.newActionForm.controls.actionDescription.value,
      // );
      //
      // this.actionsService.addAction(actionData).subscribe(res => {
      //
      //     this.newActionSniper = false;
      //
      //     if (res.status === ResponseResultStatusType.Error) {
      //
      //       if (this.newActionErrorText !== null && this.newActionErrorText == res.data.message) {
      //         this.newActionFailedCounter++;
      //       }
      //       this.newActionErrorText = res.data.message;
      //
      //     } else {
      //       this.newActionForm.reset();
      //       this.activeModal.close('فعالیت با موفقیت ثبت شد.');
      //     }
      //   }
      // );
    }

  }

  closeModal() {
    this.activeModal.close();
  }
}
