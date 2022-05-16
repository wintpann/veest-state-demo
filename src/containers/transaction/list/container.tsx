import React, { useRef } from 'react';
import { styled } from '@mui/material';
import { useAction } from 'veest';
import { container, countRenderedTimes } from '@/veest';
import { AuthProps } from '@containers/auth/container';
import { injectTransactionListService } from '@services/transaction/list/service';
import { injectRouterService } from '@services/router/service';
import { Button } from '@ui/button/component';
import { Ghost } from '@ui/ghost/component';
import { Transaction } from '@ui/transaction/component';
import { TransactionSkeleton } from '@ui/transaction/skeleton';
import { useExhaustiveEffect } from '@/hooks/use-exhaustive-deps';
import { arrayStub, noRemotePaginatedData } from '@/utils';
import { TransactionsFilterContainer } from '@containers/transaction/list/filter/container';
import { getTransactionsURLFilterParams } from '@services/transaction/list/utils';
import isEqual from 'lodash/isEqual';
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
    TransactionsBlock: styled('div')`
        display: flex;
        flex-direction: column;
        width: 100%;
    `,
    Transaction: styled('div')`
        padding: 5px 0;
        display: flex;
        justify-content: center;
    `,
    ButtonBlock: styled('div')`
        display: flex;
        justify-content: center;
        margin-top: auto;
    `,
};

export const getTransactionsLoadingStub = () =>
    arrayStub(12, (key) => (
        <Styled.Transaction key={key}>
            <TransactionSkeleton />
        </Styled.Transaction>
    ));

export const TransactionsListContainer = container(
    injectTransactionListService(),
    injectRouterService(),
    TransactionsFilterContainer,
    (useTransactionListService, useRouterService, TransactionsFilterContainer) =>
        ({ user }: AuthProps) => {
            const { transactionsPaginated, loadTransactions, loadNextTransactions, filter } =
                useTransactionListService();
            const { searchParams, goTransactions } = useRouterService();
            const loadedRef = useRef(false);
            countRenderedTimes('container');

            useExhaustiveEffect(() => {
                const newFilter = getTransactionsURLFilterParams(searchParams);
                goTransactions(newFilter, true);

                const shouldLoad =
                    !isEqual(newFilter, filter) || transactionsPaginated.items.length === 0;

                if (shouldLoad) {
                    loadedRef.current = true;
                    loadTransactions(user.id, newFilter);
                }
            }, []);

            const loadMore = useAction(() => loadNextTransactions(user.id));

            return (
                <Styled.Wrapper>
                    <Scrollable
                        header={<TransactionsFilterContainer user={user} />}
                        content={
                            <Styled.TransactionsBlock>
                                {noRemotePaginatedData(transactionsPaginated) &&
                                    loadedRef.current && <Ghost text="No transactions found" />}
                                {transactionsPaginated.items.map(
                                    ({ transactionDate, transactionID, amount, currency }) => (
                                        <Styled.Transaction key={transactionID}>
                                            <Transaction
                                                transactionID={transactionID}
                                                amount={amount}
                                                currency={currency}
                                                transactionDate={transactionDate}
                                            />
                                        </Styled.Transaction>
                                    ),
                                )}
                                {transactionsPaginated.loading && getTransactionsLoadingStub()}
                                <Styled.ButtonBlock>
                                    {transactionsPaginated.hasNextPage && (
                                        <Button
                                            loading={transactionsPaginated.loading}
                                            onClick={loadMore}
                                            className="LoadMoreButton"
                                        >
                                            Load More
                                        </Button>
                                    )}
                                </Styled.ButtonBlock>
                            </Styled.TransactionsBlock>
                        }
                    />
                </Styled.Wrapper>
            );
        },
);
