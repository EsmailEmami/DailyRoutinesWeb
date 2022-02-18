export interface ILoginUserAccount {
  status: string,
  data: {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    expireTime: number,
    token: string,

    // when status is 'Error'
    message: string
  }
}
