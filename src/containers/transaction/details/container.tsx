import React, { useRef } from 'react';
import { container, countRenderedTimes } from '@/veest';
import { styled } from '@mui/material';
import { injectTransactionDetailsService } from '@services/transaction/details/service';
import { injectRouterService } from '@services/router/service';
import { AuthProps } from '@containers/auth/container';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';
import { TransactionDetails } from '@ui/transaction-details/component';
import { noRemoteData } from '@/utils';
import { Ghost } from '@ui/ghost/component';
import { TransactionDetailsSkeleton } from '@ui/transaction-details/skeleton';

const Styled = {
    Wrapper: styled('div')`
        display: flex;
        height: 100%;
    `,
};

export const TransactionDetailsContainer = container(
    injectTransactionDetailsService(),
    injectRouterService(),
    (useTransactionDetailsService, useRouterService) =>
        ({ user }: AuthProps) => {
            const { selectedTransaction, loadTransaction, reset } = useTransactionDetailsService();
            const { transactionDetailsMatch } = useRouterService();
            const loadedRef = useRef(false);
            countRenderedTimes('container');

            useExhaustiveEffect(() => {
                if (transactionDetailsMatch?.params.id) {
                    loadTransaction(user.id, transactionDetailsMatch.params.id);
                    loadedRef.current = true;
                }

                return reset;
            }, [transactionDetailsMatch?.params.id]);

            return (
                <Styled.Wrapper>
                    {noRemoteData(selectedTransaction) && loadedRef.current && (
                        <Ghost text="No transaction found" />
                    )}
                    {selectedTransaction.data && (
                        <TransactionDetails {...selectedTransaction.data} />
                    )}
                    {selectedTransaction.loading && <TransactionDetailsSkeleton />}
                </Styled.Wrapper>
            );
        },
);
