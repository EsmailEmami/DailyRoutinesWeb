export class AddUserDTO {
  constructor(public firstName: string,
              public lastName: string,
              public phoneNumber: string,
              public email: string,
              public roles: string[],
              public password: string,
              public confirmPassword: string) {
  }
}
