import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {AccessService} from "../../../../Services/access.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ResponseResultStatusType} from "../../../../Utilities/Enums/ResponseResultStatusType";
import {EditRoleDTO} from "../../../../DTOs/Access/EditRoleDTO";

declare function inputJs(): any;

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @Input() private roleId;

  public editRoleForm: any;
  public editRoleErrorText: string = '';
  public editRoleFailedCounter: number = 1;
  public editRoleSniper: boolean = false;


  constructor(private accessService: AccessService,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.roleId == null) {
      this.activeModal.dismiss('متاسفانه مشکلی پیش آمده است! لطفا دوباره تلاش کنید.');
    }


    this.accessService.getRoleDataForEdit(this.roleId).subscribe(response => {
      if (response.status == ResponseResultStatusType.Success) {
        this.editRoleForm = new FormGroup({
          roleName: new FormControl(
            response.data.roleName,
            [
              Validators.required,
              Validators.maxLength(100),
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

  submitEditRoleForm() {
    if (this.editRoleForm.valid) {

      this.editRoleSniper = true;

      const roleData = new EditRoleDTO(
        this.roleId,
        this.editRoleForm.controls.roleName.value
      );

      this.accessService.editRole(roleData).subscribe(res => {

          this.editRoleSniper = false;

          if (res.status === ResponseResultStatusType.Error) {

            if (this.editRoleErrorText !== null && this.editRoleErrorText == res.data.message) {
              this.editRoleFailedCounter++;
            }
            this.editRoleErrorText = res.data.message;

          } else {
            this.editRoleForm.reset();
            this.activeModal.close('مقام با موفقیت ویرایش شد.');
          }
        }
      );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
