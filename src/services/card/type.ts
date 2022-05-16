import { PaginatedRemoteData, RemoteData } from '@services/api/client/type';
import { Transaction } from '@services/transaction/type';

export enum CardStatus {
    ACTIVE = 'active',
    BLOCKED = 'blocked',
}

export type Card = {
    cardID: string;
    cardAccount: string;
    cardNumber: string;
    expireDate: string;
    currency: string;
    status: CardStatus;
    balance: number;
    cardholderName: string;
};

export type CardFilter = Partial<Pick<Card, 'cardID' | 'cardAccount' | 'currency' | 'status'>>;

export type CardsLookup = {
    cardIDs: string[];
    cardAccounts: string[];
    currencies: string[];
    statuses: [];
};

export type CardLookupService = {
    remoteLookup: RemoteData<CardsLookup>;
};

export type CardListService = {
    filter: CardFilter;
    setFilter: (filter: CardFilter) => void;
    cardsPaginated: PaginatedRemoteData<Card>;
    loadCards: (userId: string, filter?: CardFilter) => Promise<void>;
    loadNextCards: (userId: string) => Promise<void>;
};

export type CardDetailsService = {
    selectedCard: RemoteData<Card>;
    relatedTransactions: RemoteData<Transaction[]>;
    reset: () => void;
    loadRelatedTransactions: (userId: string, cardID: Card['cardID']) => Promise<void>;
    loadCard: (userId: string, cardID: Card['cardID']) => Promise<void>;
};
