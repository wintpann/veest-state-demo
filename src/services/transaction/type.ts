import { PaginatedRemoteData, RemoteData } from '@services/api/client/type';

export type MerchantInfo = {
    companyName: string;
    address: [number, number];
};

export type Transaction = {
    transactionID: string;
    cardAccount: string;
    cardID: string;
    cardNumber: string;
    cardExpireDate: string;
    cardholderName: string;
    cardStatus: 'active' | 'blocked';
    amount: number;
    currency: string;
    transactionDate: string;
    merchantInfo: MerchantInfo;
};

export type TransactionFilter = Partial<
    Pick<Transaction, 'cardID' | 'cardAccount' | 'currency'> & {
        amountFrom: string;
        amountTo: string;
        dateFrom: string;
        dateTo: string;
    }
>;

export type TransactionsLookup = {
    cardIDs: string[];
    cardAccounts: string[];
    currencies: string[];
};

export type TransactionLookupService = {
    remoteLookup: RemoteData<TransactionsLookup>;
};

export type TransactionListService = {
    filter: TransactionFilter;
    setFilter: (filter: TransactionFilter) => void;
    transactionsPaginated: PaginatedRemoteData<Transaction>;
    loadTransactions: (userId: string, filter?: TransactionFilter) => Promise<void>;
    loadNextTransactions: (userId: string) => Promise<void>;
};

export type TransactionDetailsService = {
    selectedTransaction: RemoteData<Transaction>;
    loadTransaction: (userId: string, transactionID: Transaction['transactionID']) => Promise<void>;
    reset: () => void;
};
