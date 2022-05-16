import { service, inject, countRenderedTimes } from '@/veest';
import { failedResponse, injectApiService } from '@services/api/client/service';
import { TransactionApiService, TransactionApiPaths } from '@services/api/transaction/type';

export const createTransactionApiService = service(
    injectApiService(),
    (userApiService): TransactionApiService => {
        const { client } = userApiService();
        countRenderedTimes('service');

        const getTransactionsRequest: TransactionApiService['getTransactionsRequest'] = async (
            userId,
            pagination,
            filter,
            strict,
        ) => {
            const start = pagination.page * pagination.count;
            const limit = start + pagination.count + 1;
            try {
                const commonParams = {
                    userId,
                    _limit: limit,
                    _start: start,
                    amount_gte: filter.amountFrom,
                    amount_lte: filter.amountTo,
                    currency: filter.currency,
                    transactionDate_gte: filter.dateFrom,
                    transactionDate_lte: filter.dateTo,
                };
                const params = strict
                    ? {
                          cardID: filter.cardID,
                          cardAccount: filter.cardAccount,
                          ...commonParams,
                      }
                    : {
                          cardID_like: filter.cardID,
                          cardAccount_like: filter.cardAccount,
                          ...commonParams,
                      };
                const { data, status } = await client.get(TransactionApiPaths.GET_ALL, {
                    params,
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

        const getTransactionRequest: TransactionApiService['getTransactionRequest'] = async (
            userId,
            transactionID,
        ) => {
            try {
                const { data, status } = await client.get(TransactionApiPaths.GET, {
                    params: {
                        userId,
                        transactionID,
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

        const getTransactionsLookupRequest: TransactionApiService['getTransactionsLookupRequest'] =
            async (userId) => {
                try {
                    const response = await client.get(TransactionApiPaths.GET_LOOKUP, {
                        params: { userId },
                    });
                    return response;
                } catch (e) {
                    return failedResponse();
                }
            };

        return {
            getTransactionsRequest,
            getTransactionRequest,
            getTransactionsLookupRequest,
        };
    },
);

export const injectTransactionApiService = () =>
    inject<TransactionApiService>()('transactionApiService');
