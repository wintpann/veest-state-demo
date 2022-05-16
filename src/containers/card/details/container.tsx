import React, { useRef } from 'react';
import { container, countRenderedTimes } from '@/veest';
import { styled } from '@mui/material';
import { AuthProps } from '@containers/auth/container';
import { injectRouterService } from '@services/router/service';
import { injectCardDetailsService } from '@services/card/details/service';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';
import { CardDetails } from '@ui/card-details/component';
import { CardDetailsSkeleton } from '@ui/card-details/skeleton';
import { Ghost } from '@ui/ghost/component';
import { noRemoteData, noRemoteListData } from '@/utils';

const Styled = {
    Wrapper: styled('div')`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    `,
};

export const CardDetailsContainer = container(
    injectCardDetailsService(),
    injectRouterService(),
    (useCardDetailsService, useRouterService) =>
        ({ user }: AuthProps) => {
            const { selectedCard, loadCard, loadRelatedTransactions, relatedTransactions, reset } =
                useCardDetailsService();
            const { cardDetailsMatch } = useRouterService();
            const loadedRef = useRef(false);
            countRenderedTimes('container');

            useExhaustiveEffect(() => {
                if (cardDetailsMatch?.params.id) {
                    loadCard(user.id, cardDetailsMatch.params.id);
                    loadRelatedTransactions(user.id, cardDetailsMatch?.params.id);
                    loadedRef.current = true;
                }

                return reset;
            }, [cardDetailsMatch?.params.id]);

            return (
                <Styled.Wrapper>
                    {noRemoteData(selectedCard) && loadedRef.current && (
                        <Ghost text="No card found" />
                    )}
                    {selectedCard.data && (
                        <CardDetails
                            {...selectedCard.data}
                            relatedTransactions={relatedTransactions.data || []}
                        />
                    )}
                    {selectedCard.loading && <CardDetailsSkeleton />}
                    {selectedCard.data && noRemoteListData(relatedTransactions) && (
                        <Ghost text="No related transactions" />
                    )}
                </Styled.Wrapper>
            );
        },
);
