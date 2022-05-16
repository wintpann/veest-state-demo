import { useImmer } from 'use-immer';
import { useAction } from 'veest';
import { service, inject, countRenderedTimes } from '@/veest';
import { injectNotificationService } from '@services/notification/service';
import { injectTransactionApiService } from '@services/api/transaction/service';
import { RemoteData } from '@services/api/client/type';
import { isSuccess, remoteData } from '@services/api/client/utils';
import { injectCrossWindowService } from '@services/cross-window-event/service';
import { CrossWindowEvent } from '@services/cross-window-event/type';
import { Transaction, TransactionDetailsService } from '@services/transaction/type';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';

export const createTransactionDetailsService = service(
    injectTransactionApiService(),
    injectNotificationService(),
    injectCrossWindowService(),
    (
        useTransactionApiService,
        useNotificationService,
        useCrossWindowEventService,
    ): TransactionDetailsService => {
        const { apiRequestError } = useNotificationService();
        const { getTransactionRequest } = useTransactionApiService();
        const { on } = useCrossWindowEventService();
        countRenderedTimes('service');

        const [selectedTransaction, setSelectedTransaction] = useImmer<RemoteData<Transaction>>(
            remoteData(),
        );

        const reset: TransactionDetailsService['reset'] = useAction(() => {
            setSelectedTransaction(remoteData());
        });

        const loadTransaction: TransactionDetailsService['loadTransaction'] = useAction(
            async (userId, transactionID) => {
                setSelectedTransaction((draft) => {
                    draft.loading = true;
                });
                const transaction = await getTransactionRequest(userId, transactionID);
                if (isSuccess(transaction)) {
                    setSelectedTransaction((draft) => {
                        draft.loading = false;
                        draft.data = transaction.data;
                    });
                } else {
                    apiRequestError();
                    setSelectedTransaction((draft) => {
                        draft.loading = false;
                    });
                }
            },
        );

        useExhaustiveEffect(
            () =>
                on(CrossWindowEvent.LOGOUT, () => {
                    setSelectedTransaction(remoteData({ loading: false }));
                }),
            [],
        );

        return {
            selectedTransaction,
            loadTransaction,
            reset,
        };
    },
);

export const injectTransactionDetailsService = () =>
    inject<TransactionDetailsService>()('transactionDetailsService');
