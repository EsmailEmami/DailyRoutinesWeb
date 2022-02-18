export interface IResponseResult<T> {
    status: string;
    data: T;
    message: string;
}