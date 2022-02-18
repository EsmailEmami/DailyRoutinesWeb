import {CategoriesListDTO} from "./CategoriesListDTO";

export class FilterCategoriesDTO {
  constructor(
    public userId: string,
    public search: string,
    public orderBy: string,
    public items: CategoriesListDTO[],
    public pageId: number,
    public pageCount: number,
    public startPage: number,
    public endPage: number,
    public takeEntity: number,
    public skipEntity: number,
    public activePage: number,
  ) {
  }
}
