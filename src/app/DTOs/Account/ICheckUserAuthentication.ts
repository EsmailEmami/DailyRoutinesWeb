export interface ICheckUserAuthentication {
  status: string,
  data: {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
  }
}
