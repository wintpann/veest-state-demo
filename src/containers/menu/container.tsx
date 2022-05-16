import React, { useMemo } from 'react';
import throttle from 'lodash/throttle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaidIcon from '@mui/icons-material/Paid';
import { MenuList } from '@ui/menu-list/component';
import { container, countRenderedTimes } from '@/veest';
import { injectUserService } from '@services/user/service';
import { injectNotificationService } from '@services/notification/service';
import { injectCardListService } from '@services/card/list/service';
import { ROUTES } from '@/routes';
import { injectTransactionListService } from '@services/transaction/list/service';

const MenuItems = {
    Cards: { icon: <CreditCardIcon />, path: ROUTES.CARDS, title: 'Cards' },
    Transactions: { icon: <PaidIcon />, path: ROUTES.TRANSACTIONS, title: 'Transactions' },
};

export const MenuContainer = container(
    injectNotificationService(),
    injectUserService(),
    injectTransactionListService(),
    injectCardListService(),
    (useNotificationService, useUserService, useTransactionListService, useCardListService) =>
        () => {
            const { warn } = useNotificationService();
            const { remoteUser } = useUserService();
            countRenderedTimes('container');

            const { cardsPaginated } = useCardListService();
            const { transactionsPaginated } = useTransactionListService();

            const onMenuClick = useMemo(
                () =>
                    throttle(() => !remoteUser.loggedIn && warn('You are logged out'), 5000, {
                        trailing: false,
                    }),
                [warn, remoteUser.loggedIn],
            );

            const menuItems = useMemo(
                () => [
                    {
                        ...MenuItems.Cards,
                        loading: cardsPaginated.loading,
                    },
                    {
                        ...MenuItems.Transactions,
                        loading: transactionsPaginated.loading,
                    },
                ],
                [cardsPaginated.loading, transactionsPaginated.loading],
            );

            return (
                <MenuList items={menuItems} disabled={!remoteUser.loggedIn} onClick={onMenuClick} />
            );
        },
);
