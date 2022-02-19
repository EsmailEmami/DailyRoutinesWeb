export class EditUserDTO {
  constructor(public userId: string,
              public firstName: string,
              public lastName: string,
              public phoneNumber: string,
              public email: string,
              public roles: string[]) {
  }
}
