import { PaginatedRemoteResponse, PaginationParams, Response } from '@services/api/client/type';
import { Transaction, TransactionFilter, TransactionsLookup } from '@services/transaction/type';
import { User } from '@services/user/type';

export type TransactionApiService = {
    getTransactionsRequest: (
        userId: User['id'],
        pagination: PaginationParams,
        filter: TransactionFilter,
        strict: boolean,
    ) => Promise<PaginatedRemoteResponse<Transaction>>;
    getTransactionRequest: (
        userId: User['id'],
        id: Transaction['transactionID'],
    ) => Promise<Response<Transaction>>;
    getTransactionsLookupRequest: (userId: User['id']) => Promise<Response<TransactionsLookup>>;
};

export const TransactionApiPaths = {
    GET_ALL: 'transactions',
    GET: 'transactions',
    GET_LOOKUP: 'lookup/transactions',
};
