export class UsersListDTO {
  constructor(public userId: string,
              public fullName: string,
              public phoneNumber: string,
              public email: string,
              public isBlock: boolean) {
  }
}
