export class UserInformationDTO {
  constructor(public userId: string,
              public firstName: string,
              public lastName: string,
              public phoneNumber: string,
              public email: string,
              public createDate: string,
              public isBlock: boolean) {
  }
}
