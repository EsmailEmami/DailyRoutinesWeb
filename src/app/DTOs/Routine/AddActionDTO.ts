export class AddActionDTO {
    constructor(
        public userCategoryId: string,
        public actionTitle: string,
        public actionDescription: string) {
    }
}