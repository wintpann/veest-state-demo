import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { container, countRenderedTimes } from '@/veest';
import { ROUTES } from '@/routes';
import { AuthContainer } from '@containers/auth/container';
import { CardsListContainer } from '@containers/card/list/container';
import { TransactionsListContainer } from '@containers/transaction/list/container';
import { TransactionDetailsContainer } from '@containers/transaction/details/container';
import { CardDetailsContainer } from '@containers/card/details/container';
import { Ghost } from '@ui/ghost/component';

export const PageContainer = container(
    AuthContainer,
    CardsListContainer,
    TransactionsListContainer,
    TransactionDetailsContainer,
    CardDetailsContainer,
    (
            AuthContainer,
            CardsListContainer,
            TransactionsListContainer,
            TransactionDetailsContainer,
            CardDetailsContainer,
        ) =>
        () => {
            countRenderedTimes('container');
            return (
                <Routes>
                    <Route path={ROUTES.HOME} element={<Ghost />} />
                    <Route
                        path={ROUTES.CARDS}
                        element={<AuthContainer Component={CardsListContainer} />}
                    />
                    <Route
                        path={ROUTES.TRANSACTIONS}
                        element={<AuthContainer Component={TransactionsListContainer} />}
                    />
                    <Route
                        path={ROUTES.TRANSACTION}
                        element={<AuthContainer Component={TransactionDetailsContainer} />}
                    />
                    <Route
                        path={ROUTES.CARD}
                        element={<AuthContainer Component={CardDetailsContainer} />}
                    />
                    <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
                </Routes>
            );
        },
);
