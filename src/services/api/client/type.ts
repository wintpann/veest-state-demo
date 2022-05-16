import { AxiosInstance } from 'axios';

export type ApiService = {
    client: AxiosInstance;
};

export type SuccessResponse<T> = { data: T; status: number };

export type FailedResponse = null;

export type Response<T = null> = SuccessResponse<T> | FailedResponse;

export type AnyRecord = Record<string, any>;

export type RemoteData<T, D extends AnyRecord = AnyRecord> = {
    loading: boolean;
    data: T | null;
} & D;

export type RemoteDataWith<T, D extends AnyRecord> = D extends infer I_D
    ? RemoteData<T, I_D>
    : never;

export type PaginatedRemoteData<T, D extends AnyRecord = AnyRecord> = {
    items: T[];
    hasNextPage: boolean;
    count: number;
    page: number;
    loading: boolean;
} & D;

export type PaginatedRemoteResponse<T> = Response<{
    items: T[];
    hasNextPage: boolean;
}>;

export type PaginationParams = {
    page: number;
    count: number;
};
