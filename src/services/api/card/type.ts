import { PaginatedRemoteResponse, PaginationParams, Response } from '@services/api/client/type';
import { User } from '@services/user/type';
import { Card, CardFilter, CardsLookup } from '@services/card/type';

export type CardApiService = {
    getCardsRequest: (
        userId: User['id'],
        pagination: PaginationParams,
        filter: CardFilter,
    ) => Promise<PaginatedRemoteResponse<Card>>;
    getCardRequest: (userId: User['id'], cardID: Card['cardID']) => Promise<Response<Card>>;
    getCardsLookupRequest: (userId: User['id']) => Promise<Response<CardsLookup>>;
};

export const CardApiPaths = {
    GET_ALL: 'cards',
    GET: 'cards',
    GET_LOOKUP: 'lookup/cards',
};
