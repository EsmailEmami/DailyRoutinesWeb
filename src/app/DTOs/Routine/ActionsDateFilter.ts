import {ActionsMonthDTO} from "./ActionsMonthDTO";

export class ActionsDateFilter {
  constructor(public year: number,
              public months: ActionsMonthDTO[]) {
  }
}
