import { useAction } from 'veest';
import { service, inject, countRenderedTimes } from '@/veest';
import { injectNotificationService } from '@services/notification/service';
import { PaginatedRemoteData } from '@services/api/client/type';
import { usePaginatedRemoteDataWith } from '@services/api/client/utils';
import { injectCardApiService } from '@services/api/card/service';
import { injectCrossWindowService } from '@services/cross-window-event/service';
import { CrossWindowEvent } from '@services/cross-window-event/type';
import { CardFilter, Card, CardListService } from '@services/card/type';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';

export const emptyCardFilter: CardFilter = {};

export const createCardListService = service(
    injectCardApiService(),
    injectNotificationService(),
    injectCrossWindowService(),
    (useCardApiService, useNotificationService, useCrossWindowEventService): CardListService => {
        const { apiRequestError } = useNotificationService();
        const { getCardsRequest } = useCardApiService();
        const { on } = useCrossWindowEventService();
        countRenderedTimes('service');

        const getCards = useAction(
            async (state: PaginatedRemoteData<Card, { filter: CardFilter; userId: string }>) =>
                await getCardsRequest(
                    state.userId,
                    { page: state.page, count: state.count },
                    state.filter,
                ),
        );

        const {
            state: cardsPaginated,
            load: loadCardList,
            reset: resetCardsPaginated,
            setState: setCardsPaginated,
            loadNext: loadNextCardList,
        } = usePaginatedRemoteDataWith<Card, { filter: CardFilter; userId: string }>({
            additional: { filter: emptyCardFilter, userId: '' },
            initial: { count: 10 },
            onFailure: apiRequestError,
            getData: getCards,
        });

        useExhaustiveEffect(
            () =>
                on(CrossWindowEvent.LOGOUT, () => {
                    resetCardsPaginated();
                }),
            [],
        );

        const loadCards: CardListService['loadCards'] = useAction(async (userId, filter) => {
            await loadCardList({ filter, userId });
        });

        const loadNextCards: CardListService['loadNextCards'] = useAction(async (userId) => {
            await loadNextCardList({ userId });
        });

        const setFilter: CardListService['setFilter'] = useAction((filter) => {
            setCardsPaginated((prev) => ({ filter: { ...prev.filter, ...filter } }));
        });

        return {
            cardsPaginated,
            loadCards,
            loadNextCards,
            filter: cardsPaginated.filter,
            setFilter,
        };
    },
);

export const injectCardListService = () => inject<CardListService>()('cardListService');
