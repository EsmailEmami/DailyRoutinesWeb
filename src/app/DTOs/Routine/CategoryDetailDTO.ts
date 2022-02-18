export class CategoryDetailDTO {
  constructor(public categoryId: string,
              public categoryTitle: string,
              public lastUpdate: string,
              public actionsCount: number) {
  }
}
