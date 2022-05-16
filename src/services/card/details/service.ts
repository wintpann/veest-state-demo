import { useImmer } from 'use-immer';
import { useAction } from 'veest';
import { service, inject, countRenderedTimes } from '@/veest';
import { injectNotificationService } from '@services/notification/service';
import { RemoteData } from '@services/api/client/type';
import { isSuccess, remoteData } from '@services/api/client/utils';
import { injectCardApiService } from '@services/api/card/service';
import { injectCrossWindowService } from '@services/cross-window-event/service';
import { CrossWindowEvent } from '@services/cross-window-event/type';
import { Card, CardDetailsService } from '@services/card/type';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';
import { Transaction } from '@services/transaction/type';
import { injectTransactionApiService } from '@services/api/transaction/service';

export const createCardDetailsService = service(
    injectCardApiService(),
    injectTransactionApiService(),
    injectNotificationService(),
    injectCrossWindowService(),
    (
        useCardApiService,
        useTransactionApiService,
        useNotificationService,
        useCrossWindowEventService,
    ): CardDetailsService => {
        const { apiRequestError } = useNotificationService();
        const { getCardRequest } = useCardApiService();
        const { getTransactionsRequest } = useTransactionApiService();
        const { on } = useCrossWindowEventService();
        countRenderedTimes('service');

        const [selectedCard, setSelectedCard] = useImmer<RemoteData<Card>>(remoteData());
        const [relatedTransactions, setRelatedTransactions] = useImmer<RemoteData<Transaction[]>>(
            remoteData(),
        );

        const reset: CardDetailsService['reset'] = useAction(() => {
            setSelectedCard(remoteData());
            setRelatedTransactions(remoteData());
        });

        const loadCard: CardDetailsService['loadCard'] = useAction(async (userId, cardID) => {
            setSelectedCard((draft) => {
                draft.loading = true;
            });
            const response = await getCardRequest(userId, cardID);
            if (isSuccess(response)) {
                setSelectedCard((draft) => {
                    draft.data = response.data;
                    draft.loading = false;
                });
            } else {
                setSelectedCard((draft) => {
                    draft.loading = false;
                });
                apiRequestError();
            }
        });

        const loadRelatedTransactions: CardDetailsService['loadRelatedTransactions'] = useAction(
            async (userId, cardID) => {
                setRelatedTransactions((draft) => {
                    draft.loading = true;
                });
                const response = await getTransactionsRequest(
                    userId,
                    { count: 5, page: 0 },
                    { cardID },
                    true,
                );

                if (isSuccess(response)) {
                    setRelatedTransactions((draft) => {
                        draft.data = response.data.items;
                        draft.loading = false;
                    });
                } else {
                    setRelatedTransactions((draft) => {
                        draft.loading = false;
                    });
                    apiRequestError();
                }
            },
        );

        useExhaustiveEffect(
            () =>
                on(CrossWindowEvent.LOGOUT, () => {
                    setSelectedCard(remoteData({ loading: false }));
                }),
            [],
        );
        return {
            selectedCard,
            relatedTransactions,
            loadCard,
            loadRelatedTransactions,
            reset,
        };
    },
);

export const injectCardDetailsService = () => inject<CardDetailsService>()('cardDetailsService');
