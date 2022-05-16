import React from 'react';
import { container, countRenderedTimes } from '@/veest';
import { DesktopLayout } from '@ui/desktop-layout/component';
import { services } from '@/services';
import { Logo } from '@ui/logo/component';
import { UserContainer } from '@containers/user/container';
import { PageContainer } from '@containers/page/container';
import { MenuContainer } from '@containers/menu/container';
import { BreadcrumbsContainer } from '@containers/breadcrumbs/container';
import './style.css';

const Bootstrap = container(
    MenuContainer,
    UserContainer,
    PageContainer,
    BreadcrumbsContainer,
    (MenuContainer, UserContainer, PageContainer, BreadcrumbsContainer) => () => {
        countRenderedTimes('container');
        return (
            <DesktopLayout
                Menu={<MenuContainer />}
                Logo={<Logo />}
                Breadcrumbs={<BreadcrumbsContainer />}
                User={<UserContainer />}
                Main={<PageContainer />}
            />
        );
    },
);

export const App = Bootstrap({
    userService: services.userService,
    cardListService: services.cardListService,
    cardLookupService: services.cardLookupService,
    transactionListService: services.transactionListService,
    transactionLookupService: services.transactionLookupService,
    notificationService: services.notificationService,
    routerService: services.routerService,
    transactionDetailsService: services.transactionDetailsService,
    cardDetailsService: services.cardDetailsService,
});
