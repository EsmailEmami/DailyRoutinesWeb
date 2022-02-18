import { ActionsListDTO } from "./ActionsListDTO";

export class FilterActionsDTO {
    constructor(
        public categoryId: string,
        public search: string,
        public year: number,
        public month: number,
        public day: number,
        public items: ActionsListDTO[],
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
