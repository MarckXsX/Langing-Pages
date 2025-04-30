export interface GenericResponseDto<T> {
    data: T;
    message: string;
    status: number;
}