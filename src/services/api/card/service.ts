import { service, inject, countRenderedTimes } from '@/veest';
import { failedResponse, injectApiService } from '@services/api/client/service';
import { CardApiPaths, CardApiService } from '@services/api/card/type';

export const createCardApiService = service(
    injectApiService(),
    (userApiService): CardApiService => {
        const { client } = userApiService();
        countRenderedTimes('service');

        const getCardsRequest: CardApiService['getCardsRequest'] = async (
            userId,
            pagination,
            filter,
        ) => {
            const start = pagination.page * pagination.count;
            const limit = start + pagination.count + 1;
            try {
                const { data, status } = await client.get(CardApiPaths.GET_ALL, {
                    params: {
                        userId,
                        _limit: limit,
                        _start: start,
                        cardID_like: filter.cardID,
                        cardAccount_like: filter.cardAccount,
                        currency: filter.currency,
                        status: filter.status,
                    },
                });
                return {
                    data: {
                        items: data.slice(0, limit - 1),
                        hasNextPage: data.length === limit,
                    },
                    status,
                };
            } catch (e) {
                return failedResponse();
            }
        };

        const getCardRequest: CardApiService['getCardRequest'] = async (userId, cardID) => {
            try {
                const { data, status } = await client.get(CardApiPaths.GET, {
                    params: {
                        userId,
                        cardID,
                    },
                });
                return {
                    data: data[0],
                    status,
                };
            } catch (e) {
                return failedResponse();
            }
        };

        const getCardsLookupRequest: CardApiService['getCardsLookupRequest'] = async (userId) => {
            try {
                const response = await client.get(CardApiPaths.GET_LOOKUP, { params: { userId } });
                return response;
            } catch (e) {
                return failedResponse();
            }
        };

        return {
            getCardsRequest,
            getCardsLookupRequest,
            getCardRequest,
        };
    },
);

export const injectCardApiService = () => inject<CardApiService>()('cardApiService');
