import {UsersListDTO} from "./UsersListDTO";

export class FilterUsersDTO {
  constructor(
    public search: string,
    public type: string, // blocked, active, all
    public items: UsersListDTO[],
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
