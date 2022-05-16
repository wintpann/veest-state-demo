import React, { useRef } from 'react';
import { Card } from '@ui/card/component';
import { CardSkeleton } from '@ui/card/skeleton';
import { styled } from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useAction } from 'veest';
import { container, countRenderedTimes } from '@/veest';
import { AuthProps } from '@containers/auth/container';
import { injectCardListService } from '@services/card/list/service';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';
import { arrayStub, noRemotePaginatedData } from '@/utils';
import { Button } from '@ui/button/component';
import { Ghost } from '@ui/ghost/component';
import { CardsFilterContainer } from '@containers/card/list/filter/container';
import { injectRouterService } from '@services/router/service';
import { getCardsURLFilterParams } from '@services/card/list/utils';
import { Scrollable } from '@ui/scrollable/component';

const Styled = {
    Wrapper: styled('div')`
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;

        .LoadMoreButton {
            margin-top: auto;
            width: 300px;
        }
    `,
    CardsBlock: styled('div')`
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    `,
    Card: styled('div')`
        display: flex;
        justify-content: center;
        padding: 15px;
    `,
    ButtonBlock: styled('div')`
        flex: 1 0 100%;
        display: flex;
        justify-content: center;
    `,
};

export const getCardsLoadingStub = () =>
    arrayStub(12, (key) => (
        <Styled.Card key={key}>
            <CardSkeleton />
        </Styled.Card>
    ));

export const CardsListContainer = container(
    injectCardListService(),
    injectRouterService(),
    CardsFilterContainer,
    (useCardListService, useRouterService, CardsFilterContainer) =>
        ({ user }: AuthProps) => {
            const { cardsPaginated, loadCards, loadNextCards, filter } = useCardListService();
            const { searchParams, goCards } = useRouterService();
            const loadedRef = useRef(false);
            countRenderedTimes('container');

            useExhaustiveEffect(() => {
                const newFilter = getCardsURLFilterParams(searchParams);
                goCards(newFilter, true);

                const shouldLoad = !isEqual(newFilter, filter) || cardsPaginated.items.length === 0;
                if (shouldLoad) {
                    loadedRef.current = true;
                    loadCards(user.id, newFilter);
                }
            }, []);

            const loadMore = useAction(() => loadNextCards(user.id));

            return (
                <Styled.Wrapper>
                    <Scrollable
                        header={<CardsFilterContainer user={user} />}
                        content={
                            <Styled.CardsBlock>
                                {noRemotePaginatedData(cardsPaginated) && loadedRef.current && (
                                    <Ghost text="No cards found" />
                                )}
                                {cardsPaginated.items.map(
                                    ({ cardID, cardNumber, expireDate, cardholderName }) => (
                                        <Styled.Card key={cardID}>
                                            <Card
                                                cardID={cardID}
                                                cardNumber={cardNumber}
                                                expireDate={expireDate}
                                                cardholderName={cardholderName}
                                                interactive
                                            />
                                        </Styled.Card>
                                    ),
                                )}
                                {cardsPaginated.loading && getCardsLoadingStub()}
                                <Styled.ButtonBlock>
                                    {cardsPaginated.hasNextPage && (
                                        <Button
                                            loading={cardsPaginated.loading}
                                            onClick={loadMore}
                                            className="LoadMoreButton"
                                        >
                                            Load More
                                        </Button>
                                    )}
                                </Styled.ButtonBlock>
                            </Styled.CardsBlock>
                        }
                    />
                </Styled.Wrapper>
            );
        },
);
