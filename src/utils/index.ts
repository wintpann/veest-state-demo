import { v4 as guid } from 'uuid';
import {
    AnyRecord,
    PaginatedRemoteData,
    RemoteData,
    RemoteDataWith,
} from '@services/api/client/type';

export const arrayStub = <T>(count: number, map: (key: string) => T): T[] =>
    new Array(count).fill(null).map(() => map(guid()));

export const isValidDate = (date: string | Date) => !Number.isNaN(Date.parse(date as string));

export const getStatusColor = ({ status }: { status: 'positive' | 'negative' }) =>
    status === 'positive' ? '#519551' : '#8d3434';

export const noRemoteData = <T extends RemoteData<unknown> | RemoteDataWith<unknown, AnyRecord>>(
    data: T,
) => !data.data && !data.loading;

export const noRemoteListData = <
    T extends RemoteData<unknown[]> | RemoteDataWith<unknown[], AnyRecord>,
>(
    data: T,
) => !data.data?.length && !data.loading;

export const noRemotePaginatedData = <T extends PaginatedRemoteData<unknown>>(data: T) =>
    data.items.length === 0 && !data.loading;
