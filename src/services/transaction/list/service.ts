import { useAction } from 'veest';
import { service, inject, countRenderedTimes } from '@/veest';
import { injectNotificationService } from '@services/notification/service';
import { injectTransactionApiService } from '@services/api/transaction/service';
import { PaginatedRemoteData } from '@services/api/client/type';
import { usePaginatedRemoteDataWith } from '@services/api/client/utils';
import { injectCrossWindowService } from '@services/cross-window-event/service';
import { CrossWindowEvent } from '@services/cross-window-event/type';
import { TransactionFilter, Transaction, TransactionListService } from '@services/transaction/type';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';

export const emptyTransactionFilter: TransactionFilter = {};

export const createTransactionListService = service(
    injectTransactionApiService(),
    injectNotificationService(),
    injectCrossWindowService(),
    (
        useTransactionApiService,
        useNotificationService,
        useCrossWindowEventService,
    ): TransactionListService => {
        const { apiRequestError } = useNotificationService();
        const { getTransactionsRequest } = useTransactionApiService();
        const { on } = useCrossWindowEventService();
        countRenderedTimes('service');

        const getTransactions = useAction(
            async (
                state: PaginatedRemoteData<
                    Transaction,
                    { filter: TransactionFilter; userId: string }
                >,
            ) =>
                await getTransactionsRequest(
                    state.userId,
                    { page: state.page, count: state.count },
                    state.filter,
                    false,
                ),
        );

        const {
            state: transactionsPaginated,
            load: loadTransactionList,
            setState: setTransactionsPaginated,
            reset: resetTransactionsPaginated,
            loadNext: loadNextTransactionList,
        } = usePaginatedRemoteDataWith<Transaction, { filter: TransactionFilter; userId: string }>({
            additional: { filter: emptyTransactionFilter, userId: '' },
            initial: { count: 10 },
            onFailure: apiRequestError,
            getData: getTransactions,
        });

        useExhaustiveEffect(
            () =>
                on(CrossWindowEvent.LOGOUT, () => {
                    resetTransactionsPaginated();
                }),
            [],
        );

        const loadTransactions: TransactionListService['loadTransactions'] = useAction(
            async (userId, filter) => {
                await loadTransactionList({ userId, filter });
            },
        );

        const loadNextTransactions: TransactionListService['loadNextTransactions'] = useAction(
            async (userId) => {
                await loadNextTransactionList({ userId });
            },
        );

        const setFilter: TransactionListService['setFilter'] = useAction((filter) => {
            setTransactionsPaginated((prev) => ({ filter: { ...prev.filter, ...filter } }));
        });

        return {
            transactionsPaginated,
            loadTransactions,
            loadNextTransactions,
            filter: transactionsPaginated.filter,
            setFilter,
        };
    },
);

export const injectTransactionListService = () =>
    inject<TransactionListService>()('transactionListService');
