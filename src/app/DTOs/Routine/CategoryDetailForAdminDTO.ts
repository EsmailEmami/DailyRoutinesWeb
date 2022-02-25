export class CategoryDetailForAdminDTO {
  constructor(public userId: string,
              public fullName: string,
              public categoryId: string,
              public categoryTitle: string,
              public lastUpdate: string,
              public isDelete: boolean,
              public actionsCount: number) {
  }
}
