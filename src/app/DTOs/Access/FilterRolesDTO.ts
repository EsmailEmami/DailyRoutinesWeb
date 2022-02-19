import {RolesListDTO} from "./RolesListDTO";

export class FilterRolesDTO {
  constructor(
    public search: string,
    public items: RolesListDTO[],
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
