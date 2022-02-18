export class ActionDetailDTO {
    constructor(
        public actionId: string,
        public actionTitle: string,
        public actionDescription: string,
        public createDate: string,
        public lastUpdateDate: string
    ) {
    }
}