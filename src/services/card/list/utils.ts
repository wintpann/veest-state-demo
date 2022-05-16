import { CardFilter } from '@services/card/type';
import { clean } from '@services/api/client/utils';
import { ROUTES } from '@/routes';

export enum CardListSearchParams {
    cardID = 'cardID',
    cardAccount = 'cardAccount',
    currency = 'currency',
    status = 'status',
}

export const cardListURLParamValidator = {
    [CardListSearchParams.cardID]: (value: string | null) => value && value.match(/^[0-9a-zA-Z]+$/),
    [CardListSearchParams.cardAccount]: (value: string | null) =>
        value && value.match(/^[0-9a-zA-Z]+$/),
    [CardListSearchParams.currency]: (value: string | null) => value && value.match(/^.+$/),
    [CardListSearchParams.status]: (value: string | null) =>
        value && value.match(/^(active|blocked)$/),
};

export const getCardsRoute = (filter: CardFilter) =>
    `${ROUTES.CARDS}?${new URLSearchParams(clean(filter))}`;

export const getCardsURLFilterParams = (params: URLSearchParams): CardFilter => {
    const filter: CardFilter = {};

    const cardID = params.get(CardListSearchParams.cardID);
    const cardAccount = params.get(CardListSearchParams.cardAccount);
    const status = params.get(CardListSearchParams.status);
    const currency = params.get(CardListSearchParams.currency);

    const isValidCardID = cardListURLParamValidator[CardListSearchParams.cardID](cardID);
    const isValidAccountID =
        cardListURLParamValidator[CardListSearchParams.cardAccount](cardAccount);
    const isValidStatus = cardListURLParamValidator[CardListSearchParams.status](status);
    const isValidCurrency = cardListURLParamValidator[CardListSearchParams.currency](currency);

    if (isValidCardID) filter.cardID = cardID as string;
    if (isValidAccountID) filter.cardAccount = cardAccount as string;
    if (isValidStatus) filter.status = status as CardFilter['status'];
    if (isValidCurrency) filter.currency = currency as string;

    return filter;
};
